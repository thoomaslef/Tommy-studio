import 'server-only';
import { getSupabase, renewalUrl, SITE_MEDIA_BUCKET, type ProjectRow } from './supabase-server';
import { esc, notifyOwner, sendEmail } from './emails';
import { liveSiteUrl } from './live-site';
import { HOSTING_RENEWAL_PRICE, STRIPE_RENEWAL_LINK, formatEuro } from './offer';
import { CONTACT_EMAIL, CONTACT_PHONE } from './contact';
import { checkServing } from './domain-check';

const DAY = 86400e3;
const COLUMNS = 'id, slug, status, data, contact_name, contact_email, hosting_until, offline_at, last_reminder_at, published_at, updated_at';
type Row = Pick<ProjectRow, 'id' | 'slug' | 'status' | 'data' | 'contact_name' | 'contact_email' | 'hosting_until' | 'published_at' | 'updated_at'> & {
  offline_at: string | null;
  last_reminder_at: string | null;
};

const db = () => getSupabase()!;
const frDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const siteName = (r: Row) => esc(r.data.businessName ?? 'votre site');

/** Supprime un projet, ses photos et son dossier de stockage */
async function deleteProject(id: string) {
  const { data: files } = await db().storage.from(SITE_MEDIA_BUCKET).list(id, { limit: 1000 });
  if (files?.length) await db().storage.from(SITE_MEDIA_BUCKET).remove(files.map((f) => `${id}/${f.name}`));
  const { error } = await db().from('site_projects').delete().eq('id', id);
  if (error) throw error;
}

/** Rappels J-30 et J-7, mise hors ligne à l'échéance, suppression 3 mois après (CGV art. 8) */
export async function runRenewals(now = Date.now()) {
  const report: string[] = [];
  const { data, error } = await db().from('site_projects').select(COLUMNS).in('status', ['live', 'offline']).not('hosting_until', 'is', null);
  if (error) throw error;

  for (const r of (data ?? []) as Row[]) {
    const until = new Date(r.hosting_until!).getTime();
    const url = r.slug ? liveSiteUrl(r.slug) : '';
    const pay = renewalUrl(r, STRIPE_RENEWAL_LINK);

    if (r.status === 'live' && until <= now) {
      await db().from('site_projects').update({ status: 'offline', offline_at: new Date(now).toISOString() }).eq('id', r.id);
      if (r.contact_email) {
        await sendEmail({
          to: r.contact_email,
          subject: `Votre site est hors ligne — ${r.data.businessName ?? ''}`,
          html: `<p>Bonjour,</p>
            <p>L’hébergement du site de <strong>${siteName(r)}</strong> est arrivé à échéance : le site n’est plus visible.</p>
            <p>Vous pouvez le remettre en ligne à tout moment pendant 3 mois, à l’identique, pour ${formatEuro(HOSTING_RENEWAL_PRICE)} par an :</p>
            <p style="margin:24px 0;"><a href="${pay}" style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Remettre mon site en ligne</a></p>
            <p>Passé ce délai, son contenu sera supprimé.</p>
            <p>Thomas — Tommy Studio<br/><span style="color:#6b6b8a;font-size:12px;">${CONTACT_EMAIL} · ${CONTACT_PHONE}</span></p>`,
        });
      }
      report.push(`Hors ligne (non renouvelé) : ${siteName(r)} — ${esc(url)}`);
      continue;
    }

    if (r.status === 'offline' && r.offline_at && new Date(r.offline_at).getTime() < now - 92 * DAY) {
      await deleteProject(r.id);
      report.push(`Supprimé (hors ligne depuis plus de 3 mois) : ${siteName(r)}`);
      continue;
    }

    if (r.status !== 'live' || !r.contact_email) continue;
    const last = r.last_reminder_at ? new Date(r.last_reminder_at).getTime() : 0;
    const stage = until - now <= 7 * DAY ? 7 : until - now <= 30 * DAY ? 30 : null;
    // Un rappel par palier : on n'envoie que si le dernier rappel date d'avant le début du palier
    if (!stage || last >= until - stage * DAY) continue;
    const sent = await sendEmail({
      to: r.contact_email,
      subject: `Votre site arrive à échéance le ${frDate(r.hosting_until!)}`,
      html: `<p>Bonjour,</p>
        <p>L’hébergement du site de <strong>${siteName(r)}</strong> (<a href="${url}" style="color:#4f46e5;">${url.replace('https://', '')}</a>) se termine le <strong>${frDate(r.hosting_until!)}</strong>.</p>
        <p>Pour le garder en ligne un an de plus : ${formatEuro(HOSTING_RENEWAL_PRICE)}, sans engagement.</p>
        <p style="margin:24px 0;"><a href="${pay}" style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Renouveler pour ${formatEuro(HOSTING_RENEWAL_PRICE)}</a></p>
        <p>Si vous ne souhaitez pas renouveler, vous n’avez rien à faire : le site sera mis hors ligne à l’échéance.</p>
        <p>Thomas — Tommy Studio<br/><span style="color:#6b6b8a;font-size:12px;">${CONTACT_EMAIL} · ${CONTACT_PHONE}</span></p>`,
    });
    if (sent) {
      await db().from('site_projects').update({ last_reminder_at: new Date(now).toISOString() }).eq('id', r.id);
      report.push(`Rappel J-${stage} envoyé : ${siteName(r)}`);
    }
  }
  return report;
}

/** Politique de confidentialité : brouillons supprimés 12 mois après leur dernière modification ; envois de photos jamais confirmés */
export async function runCleanup(now = Date.now()) {
  const report: string[] = [];
  const { data: old, error } = await db().from('site_projects').select('id').eq('status', 'draft').lt('updated_at', new Date(now - 365 * DAY).toISOString());
  if (error) throw error;
  for (const { id } of old ?? []) await deleteProject(id);
  if (old?.length) report.push(`${old.length} brouillon(s) de plus de 12 mois supprimé(s)`);

  // Fichiers du stockage sans photo associée, envoyés il y a plus de 24 h
  const { data: folders } = await db().storage.from(SITE_MEDIA_BUCKET).list('', { limit: 1000 });
  const { data: projects } = await db().from('site_projects').select('id');
  const { data: assets } = await db().from('site_assets').select('path');
  const ids = new Set((projects ?? []).map((p) => p.id as string));
  const paths = new Set((assets ?? []).map((a) => a.path as string));
  let removed = 0;
  for (const folder of folders ?? []) {
    const { data: files } = await db().storage.from(SITE_MEDIA_BUCKET).list(folder.name, { limit: 1000 });
    const orphans = (files ?? [])
      .filter((f) => !paths.has(`${folder.name}/${f.name}`) || !ids.has(folder.name))
      .filter((f) => !f.created_at || new Date(f.created_at).getTime() < now - DAY)
      .map((f) => `${folder.name}/${f.name}`);
    if (orphans.length) {
      await db().storage.from(SITE_MEDIA_BUCKET).remove(orphans);
      removed += orphans.length;
    }
  }
  if (removed) report.push(`${removed} fichier(s) orphelin(s) supprimé(s) du stockage`);
  return report;
}

/** Sites en ligne modifiés par leur propriétaire depuis la veille (contrôle du contenu publié) */
export async function modifiedLiveSites(now = Date.now()) {
  const since = new Date(now - 25 * 3600e3).toISOString();
  const { data, error } = await db().from('site_projects').select(COLUMNS).eq('status', 'live').gte('updated_at', since);
  if (error) throw error;
  return ((data ?? []) as Row[])
    .filter((r) => r.published_at && new Date(r.updated_at).getTime() - new Date(r.published_at).getTime() > 60e3)
    // Les rappels envoyés par cette tâche modifient aussi la ligne : ce n'est pas une modification du site
    .filter((r) => !r.last_reminder_at || new Date(r.updated_at).getTime() - new Date(r.last_reminder_at).getTime() > 60e3)
    .map((r) => `Modifié : ${siteName(r)} — <a href="${liveSiteUrl(r.slug!)}">${liveSiteUrl(r.slug!)}</a> (tél. affiché : ${esc(r.data.phone ?? '?')})`);
}

/** Domaines personnalisés : à brancher (DNS prêts), en attente des DNS du client, et contrôle de ceux déjà actifs */
export async function customDomainsReport() {
  const { data, error } = await db()
    .from('site_projects')
    .select('id, slug, data, custom_domain, custom_domain_status, custom_domain_requested_at, custom_domain_notified_at')
    .eq('status', 'live')
    .not('custom_domain', 'is', null);
  if (error) throw error;
  const report: string[] = [];
  for (const r of data ?? []) {
    const name = esc(r.data?.businessName ?? r.slug);
    if (r.custom_domain_status === 'pending') {
      report.push(
        r.custom_domain_notified_at
          ? `🌐 Domaine à brancher dans Vercel : <strong>${esc(r.custom_domain)}</strong> (${name}) — DNS prêts, à demander à Claude : « branche les domaines en attente »`
          : `Domaine en attente des DNS du client : ${esc(r.custom_domain)} (${name}), demandé le ${frDate(r.custom_domain_requested_at)}`,
      );
    } else if (r.custom_domain_status === 'active' && !(await checkServing(r.custom_domain, r.slug))) {
      report.push(`⚠ Le site ne répond plus sur son domaine : ${esc(r.custom_domain)} (${name}) — DNS modifiés ou domaine expiré ?`);
    }
  }
  return report;
}

const PAGE = 1000;
async function exportTable(table: 'site_projects' | 'site_assets' | 'site_payments') {
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db().from(table).select('*').order('created_at').range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

/** Rapport du jour envoyé à Thomas avec la sauvegarde complète, seulement si quelque chose a changé */
export async function sendDailyReport(events: string[], force: boolean, now = Date.now()) {
  const since = new Date(now - 25 * 3600e3).toISOString();
  const [changed, newAssets] = await Promise.all([
    db().from('site_projects').select('id', { count: 'exact', head: true }).gte('updated_at', since),
    db().from('site_assets').select('id', { count: 'exact', head: true }).gte('created_at', since),
  ]);
  if (!force && !events.length && !changed.count && !newAssets.count) return { skipped: true };

  const [projects, assets, payments] = await Promise.all([exportTable('site_projects'), exportTable('site_assets'), exportTable('site_payments')]);
  const live = projects.filter((p) => p.status === 'live').length;
  const date = new Date(now).toISOString().slice(0, 10);
  const backup = JSON.stringify({ exported_at: new Date(now).toISOString(), site_projects: projects, site_assets: assets, site_payments: payments });
  const sent = await notifyOwner(
    `Tommy Studio — rapport du ${date} (${live} site${live > 1 ? 's' : ''} en ligne)`,
    `${events.length ? `<p><strong>Aujourd’hui :</strong></p><ul>${events.map((e) => `<li>${e}</li>`).join('')}</ul>` : '<p>Rien de particulier aujourd’hui.</p>'}
     <p>${projects.length} projet(s) dont ${live} en ligne, ${assets.length} photo(s), ${payments.length} paiement(s).</p>
     <p style="color:#6b6b8a;font-size:12px;">Le fichier joint est la sauvegarde complète de la base (les photos restent dans le stockage Supabase). Gardez ces emails, par exemple dans un libellé Gmail « Sauvegardes ».
     Pour mettre un site hors ligne en urgence (contenu illicite, arnaque), demandez-le à Claude : passer son statut à « offline » suffit.</p>`,
    [{ filename: `tommy-studio-sauvegarde-${date}.json`, content: Buffer.from(backup).toString('base64') }],
  );
  return { sent, projects: projects.length, assets: assets.length };
}
