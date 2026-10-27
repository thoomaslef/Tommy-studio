import { getSupabase } from '@/lib/supabase-server';
import { modifiedLiveSites, runCleanup, runRenewals, sendDailyReport } from '@/lib/daily-jobs';
import { esc, notifyOwner } from '@/lib/emails';

export const maxDuration = 60;

/**
 * Tâche quotidienne (planifiée par Vercel, voir vercel.json) : renouvellements, nettoyage RGPD,
 * contrôle des sites modifiés, puis rapport et sauvegarde envoyés à Thomas.
 */
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Non autorisé', { status: 401 });
  }
  if (!getSupabase()) return new Response('Supabase non configuré', { status: 503 });

  const events: string[] = [];
  const failures: string[] = [];
  for (const [name, job] of [
    ['renouvellements', runRenewals],
    ['nettoyage', runCleanup],
    ['sites modifiés', modifiedLiveSites],
  ] as const) {
    try {
      events.push(...(await job()));
    } catch (error) {
      console.error('cron', name, error);
      failures.push(`${name} : ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (failures.length) events.push(...failures.map((f) => `⚠ Échec ${esc(f)}`));

  try {
    const result = await sendDailyReport(events, new URL(request.url).searchParams.has('force'));
    if ('sent' in result && !result.sent) return new Response('Envoi du rapport impossible', { status: 502 });
    return Response.json({ ...result, events: events.length, failures: failures.length });
  } catch (error) {
    console.error('cron rapport', error);
    await notifyOwner('⚠ Sauvegarde Tommy Studio en échec', `<p>${esc(error instanceof Error ? error.message : String(error))}</p>`);
    return new Response('Erreur', { status: 500 });
  }
}
