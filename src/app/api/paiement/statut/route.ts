import { getProjectByStripeSession, getSupabase } from '@/lib/supabase-server';
import { liveSiteUrl } from '@/lib/live-site';
import { json } from '@/lib/projects-api';

const SESSION = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

/** Page de remerciement : le site payé par cette session Stripe est-il en ligne ? */
export async function GET(request: Request) {
  const session = new URL(request.url).searchParams.get('session') ?? '';
  if (!SESSION.test(session)) return json({ error: 'Session invalide.' }, 400);
  if (!getSupabase()) return json({ error: 'Le service est momentanément indisponible.' }, 503);
  try {
    const project = await getProjectByStripeSession(session);
    if (!project?.slug || project.status !== 'live') return json({ status: 'pending' });
    return json({ status: 'live', url: liveSiteUrl(project.slug) });
  } catch (error) {
    console.error('paiement/statut', error);
    return json({ error: 'Erreur serveur.' }, 500);
  }
}
