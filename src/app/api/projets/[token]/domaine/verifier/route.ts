import { checkDns, checkServing } from '@/lib/domain-check';
import { liveSiteUrl } from '@/lib/live-site';
import { markCustomDomain } from '@/lib/supabase-server';
import { esc, notifyOwner } from '@/lib/emails';
import { json, loadProject } from '@/lib/projects-api';

/**
 * Vérifie le domaine du client : DNS pointant vers Vercel, puis site réellement servi.
 * Quand les DNS sont bons mais que le domaine n'est pas encore branché côté Vercel, Thomas est prévenu (une seule fois).
 */
export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  if (!project.custom_domain || !project.slug) return json({ error: 'Aucun domaine enregistré.' }, 400);
  const domain = project.custom_domain;

  try {
    if (project.custom_domain_status === 'active' && (await checkServing(domain, project.slug))) {
      return json({ domain, status: 'active', dns: { apex: 'ok', www: 'ok' }, serving: true });
    }
    const [dns, serving] = await Promise.all([checkDns(domain), checkServing(domain, project.slug)]);
    if (serving) {
      await markCustomDomain(project.id, { status: 'active' });
      await notifyOwner(`🌐 Domaine actif — ${domain}`, `<p><strong>${esc(project.data.businessName ?? '')}</strong> est maintenant servi sur <a href="https://${esc(domain)}">${esc(domain)}</a>.</p>`);
      return json({ domain, status: 'active', dns, serving: true });
    }
    if (project.custom_domain_status !== 'pending') await markCustomDomain(project.id, { status: 'pending' });
    // DNS bons, pas encore servi : il reste à ajouter le domaine au projet Vercel
    if (dns.apex === 'ok' && !project.custom_domain_notified_at) {
      await markCustomDomain(project.id, { notified: true });
      await notifyOwner(
        `🌐 Domaine à brancher — ${domain}`,
        `<p><strong>${esc(project.data.businessName ?? '')}</strong> a pointé <strong>${esc(domain)}</strong> vers Vercel.</p>
         <p>À faire : ajouter <code>${esc(domain)}</code> (et <code>www.${esc(domain)}</code> avec redirection) au projet Vercel « tommy-studio ». Demandez-le à Claude : « branche les domaines en attente ».</p>
         <p>Site : <a href="${liveSiteUrl(project.slug)}">${liveSiteUrl(project.slug)}</a> · Client : ${esc(project.contact_name ?? '')} ${esc(project.contact_email ?? '')}</p>`,
      );
    }
    return json({ domain, status: 'pending', dns, serving: false });
  } catch (error) {
    console.error('domaine/verifier', error);
    return json({ error: 'Vérification impossible pour le moment.' }, 500);
  }
}
