import { createHmac, timingSafeEqual } from 'crypto';
import { Resend } from 'resend';
import { isPlanId, PLANS } from '@/lib/plans';

const OWNER_EMAIL = 'thomaslefevre1197@gmail.com';
const TOLERANCE_SECONDS = 5 * 60;

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function verifySignature(payload: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const [k, ...v] = p.split('=');
      return [k.trim(), v.join('=')];
    }),
  ) as Record<string, string>;
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false;

  const expected = createHmac('sha256', secret).update(`${parts.t}.${payload}`).digest('hex');
  const received = header
    .split(',')
    .filter((p) => p.trim().startsWith('v1='))
    .map((p) => p.trim().slice(3));

  return received.some((sig) => {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

type CheckoutSession = {
  payment_status?: string;
  amount_total?: number;
  customer_details?: { email?: string; name?: string };
  customer_email?: string;
  metadata?: { ref?: string; plan?: string; business?: string };
};

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: 'Webhook non configuré.' }, { status: 503 });

  const signature = request.headers.get('stripe-signature');
  const payload = await request.text();
  if (!signature || !verifySignature(payload, signature, secret)) {
    return Response.json({ error: 'Signature invalide.' }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: CheckoutSession } };
  try {
    event = JSON.parse(payload);
  } catch {
    return Response.json({ error: 'Corps invalide.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' && event.data?.object?.payment_status === 'paid') {
    const s = event.data.object;
    const ref = s.metadata?.ref ?? '—';
    const plan = isPlanId(s.metadata?.plan) ? PLANS[s.metadata.plan] : null;
    const email = s.customer_details?.email ?? s.customer_email ?? '';
    const amount = typeof s.amount_total === 'number' ? `${(s.amount_total / 100).toFixed(2)} €` : '';

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Tommy Studio <onboarding@resend.dev>',
        to: OWNER_EMAIL,
        replyTo: email || undefined,
        subject: `Paiement reçu ${amount} — ${ref}${s.metadata?.business ? ` · ${s.metadata.business}` : ''}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0f0f17;color:#e2e2f0;border-radius:12px;">
            <h2 style="color:#22c55e;margin-top:0;">Paiement reçu ✓</h2>
            <p><strong>${escapeHtml(ref)}</strong> — ${plan ? escapeHtml(plan.name) : 'formule inconnue'} — ${escapeHtml(amount)}</p>
            <p>Client : ${escapeHtml(s.customer_details?.name ?? '')} ${email ? `(<a href="mailto:${escapeHtml(email)}" style="color:#6366f1;">${escapeHtml(email)}</a>)` : ''}</p>
            <p style="color:#9090b0;">Le brief détaillé t'a été envoyé dans l'email « Nouvelle commande ${escapeHtml(ref)} ». Tu peux démarrer la création du site dès réception des contenus.</p>
          </div>`,
      });
    } catch (error) {
      console.error('Webhook email error:', error);
      // On répond 500 pour que Stripe réessaie l'envoi de la notification
      return Response.json({ error: 'Email non envoyé.' }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}
