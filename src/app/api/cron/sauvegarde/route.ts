import { getSupabase } from '@/lib/supabase-server';
import { esc, notifyOwner } from '@/lib/emails';

const PAGE = 1000;

async function exportTable(table: 'site_projects' | 'site_assets') {
  const db = getSupabase()!;
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db.from(table).select('*').order('created_at').range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

/**
 * Sauvegarde quotidienne (tâche planifiée Vercel, voir vercel.json) : export complet des tables site_*
 * envoyé par email à Thomas, seulement si quelque chose a changé depuis la veille.
 */
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Non autorisé', { status: 401 });
  }
  const db = getSupabase();
  if (!db) return new Response('Supabase non configuré', { status: 503 });

  try {
    const since = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
    const [changedProjects, newAssets] = await Promise.all([
      db.from('site_projects').select('id', { count: 'exact', head: true }).gte('updated_at', since),
      db.from('site_assets').select('id', { count: 'exact', head: true }).gte('created_at', since),
    ]);
    const force = new URL(request.url).searchParams.has('force');
    if (!force && !changedProjects.count && !newAssets.count) return Response.json({ skipped: true });

    const [projects, assets] = await Promise.all([exportTable('site_projects'), exportTable('site_assets')]);
    const live = projects.filter((p) => p.status === 'live').length;
    const date = new Date().toISOString().slice(0, 10);
    const backup = JSON.stringify({ exported_at: new Date().toISOString(), site_projects: projects, site_assets: assets });
    const sent = await notifyOwner(
      `Sauvegarde Tommy Studio — ${date} (${live} site${live > 1 ? 's' : ''} en ligne)`,
      `<p>Sauvegarde automatique des sites Tommy Studio : ${projects.length} projet(s) dont ${live} en ligne, ${assets.length} photo(s) référencée(s).</p>
       <p>Le fichier joint permet de tout restaurer en cas de problème sur la base (les photos restent dans le stockage Supabase). Gardez ces emails, par exemple dans un libellé Gmail « Sauvegardes ».</p>
       <p style="color:#6b6b8a;font-size:12px;">Envoyé seulement les jours où quelque chose a changé. ${esc(date)}</p>`,
      [{ filename: `tommy-studio-sauvegarde-${date}.json`, content: Buffer.from(backup).toString('base64') }],
    );
    if (!sent) return new Response('Envoi de la sauvegarde impossible', { status: 502 });
    return Response.json({ sent, projects: projects.length, assets: assets.length });
  } catch (error) {
    console.error('sauvegarde', error);
    await notifyOwner('⚠ Sauvegarde Tommy Studio en échec', `<p>${esc(error instanceof Error ? error.message : String(error))}</p>`);
    return new Response('Erreur', { status: 500 });
  }
}
