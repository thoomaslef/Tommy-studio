import { TRADES } from '@/site-engine/trades';
import { verifySignature } from '@/lib/stripe-signature';
import { GUARANTEE_DAYS, STRIPE_PAYMENT_LINK_ID, STRIPE_RENEWAL_LINK_ID } from '@/lib/offer';
import { liveSiteUrl } from '@/lib/live-site';
import { revalidateSite } from '@/lib/revalidate';
import { getEditTokenEnc, publishPaidProject, renewHosting, type ProjectRow } from '@/lib/supabase-server';
import { decryptToken } from '@/lib/token-crypto';
import { esc, notifyOwner, notifyOwnerOnce, sendEmail } from '@/lib/emails';
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/contact';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


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
  // Le compte Stripe sert aussi à d'autres applications : on ne traite que nos liens de paiement
  const renewal = session.payment_link === STRIPE_RENEWAL_LINK_ID;
  if (session.payment_link !== STRIPE_PAYMENT_LINK_ID && !renewal) return Response.json({ ignored: true });
  if (session.payment_status !== 'paid') return Response.json({ pending: true });

  const projectId = session.client_reference_id;
  if (!projectId || !UUID.test(projectId)) {
    console.error('stripe webhook: paiement sans projet', session.id);
    await notifyOwner(`⚠ Paiement reçu sans site associé`, `<p>Session Stripe ${esc(session.id)} — client ${esc(session.customer_details?.email ?? '?')}. À traiter à la main.</p>`);
    return Response.json({ received: true });
  }

  if (renewal) return handleRenewal(projectId, session);

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
    if (!alreadyDone) revalidateSite(project);
    if (!alreadyDone && project.slug) {
      const d = project.data;
      const url = liveSiteUrl(project.slug);
      const trade = d.trade ? TRADES[d.trade].label : 'Artisan';
      const amount = session.amount_total != null ? `${(session.amount_total / 100).toFixed(2).replace('.', ',')} €` : '?';
      const clientNotified = await emailClient(project, url, new URL(request.url).origin);
      await notifyOwner(
        `💶 Site vendu — ${d.businessName ?? 'Sans nom'} (${trade}, ${d.city ?? '?'})`,
        `<p><strong>${esc(d.businessName ?? '')}</strong> vient de payer ${amount}. Le site est en ligne :</p>
         <p><a href="${url}" style="color:#4f46e5;font-weight:bold;">${url}</a></p>
         <p>Client : ${esc(project.contact_name ?? '')} — <a href="mailto:${esc(project.contact_email ?? '')}">${esc(project.contact_email ?? '')}</a> — SIRET ${esc(d.siret ?? '?')}</p>
         <p>Registre des entreprises : ${siretLine(project)}</p>
         <p style="color:#6b6b8a;font-size:13px;">Garantie satisfait ou remboursé jusqu’au ${new Date(Date.now() + GUARANTEE_DAYS * 86400e3).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} : en cas de demande, remboursez depuis Stripe (Paiements → le paiement → Rembourser) puis demandez-moi de mettre le site hors ligne.</p>
         <p>${clientNotified ? '✅ Le client a reçu l’adresse de son site et son lien de modification.' : '⚠ <strong>L’email au client n’a pas pu partir</strong> : envoyez-lui l’adresse de son site à la main.'}</p>`,
      );
    } else if (alreadyDone && project.stripe_session_id !== session.id) {
      // Deuxième paiement pour un site déjà en ligne : à rembourser
      await notifyOwner(`⚠ Double paiement — ${project.data.businessName ?? projectId}`, `<p>Session ${esc(session.id)} alors que le site est déjà payé (${esc(project.stripe_session_id ?? '?')}). Remboursez depuis Stripe.</p>`);
    }
    return Response.json({ received: true });
  } catch (error) {
    console.error('stripe webhook', error);
    if (error instanceof Error && error.message === 'Aucune adresse disponible') {
      // Erreur définitive : inutile que Stripe réessaie, Thomas doit intervenir
      await notifyOwner('⚠ Site payé mais non publié', `<p>Projet ${esc(projectId)}, session ${esc(session.id)} : aucune adresse disponible. À publier à la main.</p>`);
      return Response.json({ received: true });
    }
    // Erreur temporaire : Stripe réessaiera automatiquement ; Thomas est prévenu (une fois par heure) pour ne pas laisser un paiement sans site
    await notifyOwnerOnce(
      'webhook-error',
      '⚠ Un paiement n’a pas pu être traité',
      `<p>Le webhook Stripe a échoué pour le projet ${esc(projectId)} (session ${esc(session.id)}) : ${esc(error instanceof Error ? error.message : String(error))}.</p>
       <p>Stripe réessaie automatiquement pendant plusieurs jours. Si le site n’est pas en ligne d’ici peu, demandez à Claude de regarder.</p>`,
    );
    return new Response('Erreur serveur', { status: 500 });
  }
}

/** Email au client : adresse du site, lien privé de modification, prochaines étapes */
async function emailClient(project: ProjectRow, url: string, origin: string) {
  if (!project.contact_email) return false;
  const token = decryptToken(await getEditTokenEnc(project.id).catch(() => null));
  const editUrl = token ? `${origin}/creer/${token}` : null;
  const d = project.data;
  return sendEmail({
    to: project.contact_email,
    subject: `Votre site est en ligne — ${d.businessName ?? 'Tommy Studio'}`,
    html: `
      <p>Bonjour${project.contact_name ? ` ${esc(project.contact_name)}` : ''},</p>
      <p>Merci pour votre confiance : le site de <strong>${esc(d.businessName ?? 'votre entreprise')}</strong> est en ligne.</p>
      <p style="margin:24px 0;"><a href="${url}" style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Voir mon site</a></p>
      <p>Son adresse : <a href="${url}" style="color:#4f46e5;">${url.replace('https://', '')}</a><br/>Partagez-la à vos clients, sur vos devis, votre camion, vos cartes de visite…</p>
      ${
        editUrl
          ? `<p><strong>Pour modifier votre site</strong> (textes, services, photos), utilisez votre lien privé : <a href="${editUrl}" style="color:#4f46e5;">modifier mon site</a>. Gardez cet email : ce lien est personnel, ne le partagez pas. Les changements sont en ligne aussitôt.</p>`
          : `<p>Pour modifier votre site, reprenez-le depuis l’appareil qui a servi à le créer, ou répondez à cet email.</p>`
      }
      <p><strong>Prochaine étape conseillée : votre fiche Google.</strong> C’est elle qui vous rend visible sur Google Maps quand quelqu’un cherche un artisan près de chez lui.
      ${editUrl ? `J’ai préparé tous les textes à copier-coller : <a href="${editUrl}/google" style="color:#4f46e5;">mon guide pour créer ma fiche Google</a> (15 minutes).` : 'Ajoutez l’adresse de votre site à votre fiche Google Business Profile.'}</p>
      ${editUrl ? `<p>Si vous le souhaitez, vous pouvez aussi <a href="${editUrl}/domaine" style="color:#4f46e5;">brancher votre propre nom de domaine</a> (par exemple votre-entreprise.fr, environ 10 € par an chez le fournisseur de votre choix).</p>` : ''}
      <p>Votre facture vous est envoyée séparément par notre prestataire de paiement, Stripe.</p>
      <p><strong>Garantie satisfait ou remboursé :</strong> si le site ne vous convient pas, répondez à cet email dans les ${GUARANTEE_DAYS} jours qui suivent, vous êtes remboursé sans justification.</p>
      <p>Une question ? Répondez simplement à cet email, ou appelez-moi au ${CONTACT_PHONE}.</p>
      <p>Thomas — Tommy Studio<br/><span style="color:#6b6b8a;font-size:12px;">${CONTACT_EMAIL}</span></p>`,
  });
}

function siretLine(project: ProjectRow) {
  const c = project.siret_check;
  if (!c || c.status === 'unverified') return '⚠ SIRET non vérifié (registre indisponible au moment de la commande) : à contrôler.';
  const label = { active: '✅ établissement actif', closed: '⚠ établissement fermé', unknown: '⚠ SIRET introuvable' }[c.status];
  return `${label} — ${esc(c.name ?? '?')}${c.city ? `, ${esc(c.city)}` : ''}`;
}

/** Renouvellement annuel payé : hébergement prolongé d'un an, confirmation au client et à Thomas */
async function handleRenewal(projectId: string, session: CheckoutSession) {
  try {
    const result = await renewHosting(projectId, {
      sessionId: session.id,
      amountCents: session.amount_total,
      email: session.customer_details?.email ?? null,
      name: session.customer_details?.name ?? null,
    });
    if (!result) {
      await notifyOwner('⚠ Renouvellement reçu pour un site introuvable', `<p>Projet ${esc(projectId)}, session ${esc(session.id)}. À rembourser ou traiter à la main.</p>`);
      return Response.json({ received: true });
    }
    const { project, alreadyDone } = result;
    if (alreadyDone) return Response.json({ received: true });
    revalidateSite(project);
    const url = liveSiteUrl(project.slug!);
    const until = new Date(project.hosting_until!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const to = project.contact_email ?? session.customer_details?.email;
    if (to) {
      await sendEmail({
        to,
        subject: `Hébergement renouvelé — ${project.data.businessName ?? 'votre site'}`,
        html: `<p>Bonjour,</p>
          <p>Merci ! L’hébergement de votre site <a href="${url}" style="color:#4f46e5;">${url.replace('https://', '')}</a> est renouvelé jusqu’au <strong>${until}</strong>.</p>
          <p>Votre facture vous est envoyée séparément par Stripe.</p>
          <p>Thomas — Tommy Studio<br/><span style="color:#6b6b8a;font-size:12px;">${CONTACT_EMAIL} · ${CONTACT_PHONE}</span></p>`,
      });
    }
    await notifyOwner(`🔁 Renouvellement — ${project.data.businessName ?? projectId}`, `<p>${esc(project.data.businessName ?? '')} a renouvelé son hébergement jusqu’au ${until}.</p><p><a href="${url}">${url}</a></p>`);
    return Response.json({ received: true });
  } catch (error) {
    console.error('stripe webhook renouvellement', error);
    return new Response('Erreur serveur', { status: 500 });
  }
}
