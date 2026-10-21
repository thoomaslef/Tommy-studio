import { createHmac, timingSafeEqual } from 'crypto';
import { Resend } from 'resend';
import { TRADES } from '@/site-engine/trades';
import { STRIPE_PAYMENT_LINK_ID } from '@/lib/offer';
import { liveSiteUrl } from '@/lib/live-site';
import { publishPaidProject } from '@/lib/supabase-server';

const OWNER_EMAIL = 'thomaslefevre1197@gmail.com';
const TOLERANCE_SECONDS = 300;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Vérifie l'en-tête Stripe-Signature (t=…,v1=…) : HMAC SHA-256 de « t.corps » */
function verifySignature(payload: string, header: string | null, secret: string) {
  if (!header) return false;
  let timestamp = '';
  const signatures: string[] = [];
  for (const part of header.split(',')) {
    const [key, value] = part.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1' && value) signatures.push(value);
  }
  const t = Number(timestamp);
  if (!t || Math.abs(Date.now() / 1000 - t) > TOLERANCE_SECONDS) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex'));
  return signatures.some((s) => {
    const given = Buffer.from(s);
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

type CheckoutSession = {
  id: string;
  payment_link: string | null;
  payment_status: string;
  client_reference_id: string | null;
  amount_total: number | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
};

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response('Webhook non configuré', { status: 500 });

  const payload = await request.text();
  if (!verifySignature(payload, request.headers.get('stripe-signature'), secret)) {
    return new Response('Signature invalide', { status: 400 });
  }

  const event = JSON.parse(payload) as { type: string; data: { object: CheckoutSession } };
  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return Response.json({ ignored: true });
  }
  const session = event.data.object;
  // Le compte Stripe sert aussi à d'autres applications : on ne traite que notre lien de paiement
  if (session.payment_link !== STRIPE_PAYMENT_LINK_ID) return Response.json({ ignored: true });
  if (session.payment_status !== 'paid') return Response.json({ pending: true });

  const projectId = session.client_reference_id;
  if (!projectId || !UUID.test(projectId)) {
    console.error('stripe webhook: paiement sans projet', session.id);
    await notifyOwner(`⚠ Paiement reçu sans site associé`, `<p>Session Stripe ${esc(session.id)} — client ${esc(session.customer_details?.email ?? '?')}. À traiter à la main.</p>`);
    return Response.json({ received: true });
  }

  try {
    const result = await publishPaidProject(projectId, {
      sessionId: session.id,
      amountCents: session.amount_total,
      email: session.customer_details?.email ?? null,
      name: session.customer_details?.name ?? null,
    });
    if (!result) {
      await notifyOwner(`⚠ Paiement reçu pour un site introuvable`, `<p>Projet ${esc(projectId)}, session ${esc(session.id)}.</p>`);
      return Response.json({ received: true });
    }
    const { project, alreadyDone } = result;
    if (!alreadyDone && project.slug) {
      const d = project.data;
      const url = liveSiteUrl(project.slug);
      const trade = d.trade ? TRADES[d.trade].label : 'Artisan';
      const amount = session.amount_total != null ? `${(session.amount_total / 100).toFixed(2).replace('.', ',')} €` : '?';
      await notifyOwner(
        `💶 Site vendu — ${d.businessName ?? 'Sans nom'} (${trade}, ${d.city ?? '?'})`,
        `<p><strong>${esc(d.businessName ?? '')}</strong> vient de payer ${amount}. Le site est en ligne :</p>
         <p><a href="${url}" style="color:#6366f1;font-weight:bold;">${url}</a></p>
         <p>Client : ${esc(project.contact_name ?? '')} — <a href="mailto:${esc(project.contact_email ?? '')}">${esc(project.contact_email ?? '')}</a></p>
         <p style="color:#9090b0;font-size:12px;">Pensez à lui envoyer l’adresse de son site (les emails automatiques aux clients arriveront avec la vérification du domaine).</p>`,
      );
    } else if (alreadyDone && project.stripe_session_id !== session.id) {
      // Deuxième paiement pour un site déjà en ligne : à rembourser
      await notifyOwner(`⚠ Double paiement — ${project.data.businessName ?? projectId}`, `<p>Session ${esc(session.id)} alors que le site est déjà payé (${esc(project.stripe_session_id ?? '?')}). Remboursez depuis Stripe.</p>`);
    }
    return Response.json({ received: true });
  } catch (error) {
    // Erreur temporaire : Stripe réessaiera automatiquement
    console.error('stripe webhook', error);
    return new Response('Erreur serveur', { status: 500 });
  }
}

async function notifyOwner(subject: string, body: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Tommy Studio <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0f0f17;color:#e2e2f0;border-radius:12px;">${body}</div>`,
    });
  } catch (error) {
    console.error('notifyOwner', error);
  }
}
