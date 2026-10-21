import { Resend } from 'resend';
import { TRADES } from '@/site-engine/trades';
import { HOSTING_RENEWAL_PRICE, SITE_PRICE, formatEuro } from '@/lib/offer';
import { listAssets, requestPublication } from '@/lib/supabase-server';
import { json, loadProject, readJson } from '@/lib/projects-api';

const OWNER_EMAIL = 'thomaslefevre1197@gmail.com';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Demande de publication, en attendant le paiement automatique :
 * Thomas reçoit le lien du site et envoie le lien de paiement au client.
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

  if (project.publish_requested_at && Date.now() - new Date(project.publish_requested_at).getTime() < 10 * 60 * 1000) {
    return json({ ok: true, alreadySent: true });
  }

  try {
    await requestPublication(project.id, name, email);
    const photos = (await listAssets(project.id)).filter((a) => a.kind === 'photo').length;
    const origin = new URL(request.url).origin;
    const trade = d.trade ? TRADES[d.trade].label : 'Artisan';
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'Tommy Studio <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Publication demandée — ${d.businessName} (${trade}, ${d.city})`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0f0f17;color:#e2e2f0;border-radius:12px;">
          <h2 style="color:#6366f1;margin-top:0;">Un client veut publier son site</h2>
          <p><strong>${esc(d.businessName ?? '')}</strong> — ${esc(trade)} à ${esc(d.city ?? '')}<br/>
          ${photos} photo(s) · Téléphone affiché : ${esc(d.phone ?? '')}</p>
          <p>Client : <strong>${esc(name)}</strong> — <a href="mailto:${esc(email)}" style="color:#6366f1;">${esc(email)}</a></p>
          <p style="background:#1a1a2e;padding:14px 16px;border-radius:8px;line-height:1.6;">
            À faire : envoyer au client un lien de paiement de <strong>${formatEuro(SITE_PRICE)}</strong>
            (hébergement inclus la 1re année, puis ${formatEuro(HOSTING_RENEWAL_PRICE)}/an), puis mettre le site en ligne.
          </p>
          <p><a href="${origin}/apercu/${token}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Voir le site</a></p>
          <p style="color:#9090b0;font-size:12px;">Lien d’édition (privé, ne pas transférer) : ${origin}/creer/${token}</p>
        </div>`,
    });
    if (error) throw new Error(error.message);
    return json({ ok: true });
  } catch (err) {
    console.error('publier', err);
    return json({ error: 'Envoi impossible pour le moment, réessayez dans un instant.' }, 502);
  }
}
