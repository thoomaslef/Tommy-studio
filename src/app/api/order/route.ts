import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { briefErrors, sanitizeBrief, type Brief } from '@/lib/brief';
import { EXTRA_REVISION_PRICE, HOSTING_RENEWAL_PRICE, PLANS, formatEuro } from '@/lib/plans';

const OWNER_EMAIL = 'thomaslefevre1197@gmail.com';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const multiline = (value: string) => escapeHtml(value).replace(/\n/g, '<br/>');

function row(label: string, value: string) {
  if (!value) return '';
  return `<tr style="border-bottom:1px solid #2a2a3e;"><td style="padding:10px 12px 10px 0;color:#9090b0;width:170px;vertical-align:top;">${label}</td><td style="padding:10px 0;">${multiline(value)}</td></tr>`;
}

function briefEmail(ref: string, b: Brief, paymentMode: 'stripe' | 'manual') {
  const plan = PLANS[b.plan as keyof typeof PLANS];
  const status =
    paymentMode === 'stripe'
      ? 'Le client est redirigé vers le paiement Stripe. Tu recevras un second email quand il aura payé.'
      : 'Paiement automatique non activé : envoie au client un lien de paiement (réponse sous 24 h promise).';
  return `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:32px;background:#0f0f17;color:#e2e2f0;border-radius:12px;">
      <h2 style="color:#6366f1;margin-top:0;">Nouvelle commande ${ref}</h2>
      <p style="background:#1a1a2e;padding:14px 16px;border-radius:8px;line-height:1.6;">
        <strong>${plan.name} — ${formatEuro(plan.price)}</strong><br/><span style="color:#9090b0;">${status}</span>
      </p>
      <h3 style="color:#a5b4fc;">Contact</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Nom', b.name)}${row('Email', b.email)}${row('Téléphone', b.contactPhone)}
      </table>
      <h3 style="color:#a5b4fc;">Activité</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Entreprise', b.businessName)}${row('Métier / secteur', b.sector)}${row('Ville / zone', b.city)}
        ${row('Description', b.activity)}${row('Services proposés', b.services)}${row('Clients visés', b.audience)}
      </table>
      <h3 style="color:#a5b4fc;">Site souhaité</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Pages', b.pages.join(', '))}${row('Style', b.style)}${row('Couleurs', b.colors)}
        ${row('Sites inspirants', b.inspirations)}${row('Logo', b.logo)}${row('Textes', b.texts)}
        ${row('Nom de domaine', [b.domain, b.domainName].filter(Boolean).join(' — '))}
      </table>
      <h3 style="color:#a5b4fc;">Infos affichées sur le site</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Téléphone', b.phone)}${row('Email', b.publicEmail)}${row('Adresse', b.address)}
        ${row('Horaires', b.hours)}${row('Réseaux sociaux', b.socials)}${row('Précisions', b.extra)}
      </table>
      <p style="margin-top:24px;color:#9090b0;font-size:12px;">CGV acceptées. Hébergement 1re année inclus, puis ${formatEuro(HOSTING_RENEWAL_PRICE)}/an. Retouches supplémentaires : ${formatEuro(EXTRA_REVISION_PRICE)}.</p>
      <div style="margin-top:20px;text-align:center;">
        <a href="mailto:${escapeHtml(b.email)}" style="display:inline-block;background:#6366f1;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Répondre à ${escapeHtml(b.name)}</a>
      </div>
    </div>`;
}

async function createCheckoutSession(origin: string, ref: string, b: Brief): Promise<string | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !b.plan) return null;
  const plan = PLANS[b.plan];

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('locale', 'fr');
  params.set('customer_email', b.email);
  params.set('client_reference_id', ref);
  params.set('success_url', `${origin}/commande/merci?ref=${ref}`);
  params.set('cancel_url', `${origin}/start-project?annule=1&formule=${plan.id}`);
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', 'eur');
  params.set('line_items[0][price_data][unit_amount]', String(plan.price * 100));
  params.set('line_items[0][price_data][product_data][name]', `Site web ${plan.name} — Tommy Studio`);
  params.set('line_items[0][price_data][product_data][description]', plan.summary);
  params.set('metadata[ref]', ref);
  params.set('metadata[plan]', plan.id);
  params.set('metadata[business]', b.businessName.slice(0, 100));
  params.set('payment_intent_data[metadata][ref]', ref);

  const res = await fetch(`${process.env.STRIPE_API_BASE || 'https://api.stripe.com'}/v1/checkout/sessions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  if (!res.ok) {
    console.error('Stripe checkout error:', res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { url?: string };
  return data.url ?? null;
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const brief = sanitizeBrief(raw);

  // Champ piège rempli uniquement par les robots : on répond OK sans rien faire
  if (brief.website) return Response.json({ mode: 'manual', ref: 'CMD-IGNORED' });

  const errors = briefErrors(brief);
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: 'Certains champs sont incomplets.', fields: errors }, { status: 400 });
  }

  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const ref = `CMD-${date}-${randomBytes(2).toString('hex').toUpperCase()}`;
  const origin = new URL(request.url).origin;

  let checkoutUrl: string | null = null;
  try {
    checkoutUrl = await createCheckoutSession(origin, ref, brief);
  } catch (error) {
    console.error('Stripe error:', error);
  }
  const mode = checkoutUrl ? 'stripe' : 'manual';

  // Le brief est la donnée essentielle : si l'email échoue, on ne laisse pas le client payer dans le vide
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const plan = PLANS[brief.plan as keyof typeof PLANS];
    const { error } = await resend.emails.send({
      from: 'Tommy Studio <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      replyTo: brief.email,
      subject: `Nouvelle commande ${ref} — ${plan.name} (${formatEuro(plan.price)}) · ${brief.businessName}`,
      html: briefEmail(ref, brief, mode),
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('Order email error:', error);
    return Response.json({ error: 'Impossible d\'enregistrer votre commande pour le moment. Réessayez dans un instant.' }, { status: 502 });
  }

  return Response.json({ mode, ref, url: checkoutUrl });
}
