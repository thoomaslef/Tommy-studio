import { STRIPE_PAYMENT_LINK } from '@/lib/offer';
import { requestPublication } from '@/lib/supabase-server';
import { json, loadProject, readJson } from '@/lib/projects-api';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Le client valide son site : on garde ses coordonnées et on renvoie le lien de paiement Stripe.
 * Le site passe en ligne automatiquement à réception du paiement (webhook /api/stripe/webhook).
 */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const project = await loadProject(token);
  if (project instanceof Response) return project;
  if (project.status !== 'draft') return json({ error: 'Ce site est déjà en cours de publication.' }, 409);

  const body = await readJson(request);
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : '';
  const email = typeof body?.email === 'string' ? body.email.trim().slice(0, 120) : '';
  if (!name) return json({ error: 'Indiquez votre nom.' }, 400);
  if (!EMAIL.test(email)) return json({ error: 'Indiquez un email valide.' }, 400);
  if (body?.acceptCgv !== true) return json({ error: 'Vous devez accepter les conditions générales de vente.' }, 400);

  const d = project.data;
  const missing = [!d.businessName && 'nom', !d.city && 'ville', !d.phone && 'téléphone'].filter(Boolean);
  if (missing.length) return json({ error: `Complétez d’abord : ${missing.join(', ')}.` }, 400);

  try {
    await requestPublication(project.id, name, email);
    const url = new URL(STRIPE_PAYMENT_LINK);
    url.searchParams.set('client_reference_id', project.id);
    url.searchParams.set('prefilled_email', email);
    url.searchParams.set('locale', 'fr');
    return json({ ok: true, paymentUrl: url.toString() });
  } catch (err) {
    console.error('publier', err);
    return json({ error: 'Paiement indisponible pour le moment, réessayez dans un instant.' }, 502);
  }
}
