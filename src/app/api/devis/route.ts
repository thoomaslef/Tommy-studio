import { getProjectById, getSupabase } from '@/lib/supabase-server';
import { json, readJson } from '@/lib/projects-api';
import { clientIpHash } from '@/lib/rate-limit';
import { esc, sendEmail } from '@/lib/emails';
import { liveSiteUrl } from '@/lib/live-site';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Demande de devis envoyée depuis un site client : transmise par email à l'artisan, jamais stockée */
export async function POST(request: Request) {
  const db = getSupabase();
  if (!db) return json({ error: 'Service momentanément indisponible.' }, 503);
  const body = await readJson(request);
  if (!body || typeof body.site !== 'string' || !UUID.test(body.site)) return json({ error: 'Requête invalide.' }, 400);
  // Robots : champ piège rempli ou formulaire envoyé en moins de 3 secondes
  if (text(body.website, 200) || (typeof body.elapsed === 'number' && body.elapsed < 3000)) return json({ ok: true });

  const name = text(body.name, 80);
  const phone = text(body.phone, 30);
  const email = text(body.email, 120);
  const city = text(body.city, 80);
  const message = text(body.message, 2000);
  if (!name || !message) return json({ error: 'Indiquez votre nom et votre besoin.' }, 400);
  if (phone.replace(/\D/g, '').length < 9) return json({ error: 'Indiquez un numéro de téléphone valide.' }, 400);
  if (email && !EMAIL.test(email)) return json({ error: 'Email invalide.' }, 400);

  const project = await getProjectById(body.site).catch(() => null);
  if (!project || project.status !== 'live' || !project.slug || !project.data.email) return json({ error: 'Ce site ne reçoit pas de demandes en ligne. Appelez directement.' }, 404);

  const ipHash = clientIpHash(request);
  const since = new Date(Date.now() - 3600e3).toISOString();
  if (ipHash) {
    const { count } = await db.from('site_quote_requests').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since);
    if ((count ?? 0) >= 5) return json({ error: 'Trop de demandes envoyées. Appelez directement.' }, 429);
  }

  const site = liveSiteUrl(project.slug);
  const tel = phone.replace(/[^\d+]/g, '');
  const delivered = await sendEmail({
    to: project.data.email,
    replyTo: email || undefined,
    subject: `Nouvelle demande de devis — ${name}${city ? ` (${city})` : ''}`,
    html: `<p><strong>Nouvelle demande reçue sur votre site</strong> <a href="${site}" style="color:#4f46e5;">${site.replace('https://', '')}</a></p>
      <table style="border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:4px 12px 4px 0;color:#6b6b8a;">Nom</td><td><strong>${esc(name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6b6b8a;">Téléphone</td><td><a href="tel:${esc(tel)}" style="color:#4f46e5;font-weight:bold;">${esc(phone)}</a></td></tr>
        ${email ? `<tr><td style="padding:4px 12px 4px 0;color:#6b6b8a;">Email</td><td><a href="mailto:${esc(email)}" style="color:#4f46e5;">${esc(email)}</a></td></tr>` : ''}
        ${city ? `<tr><td style="padding:4px 12px 4px 0;color:#6b6b8a;">Commune</td><td>${esc(city)}</td></tr>` : ''}
      </table>
      <p style="white-space:pre-wrap;background:#f4f4f8;padding:16px;border-radius:8px;">${esc(message)}</p>
      <p>${email ? 'Répondez directement à cet email pour lui écrire, ou appelez-le.' : 'Rappelez-le au numéro ci-dessus.'}</p>
      <p style="color:#6b6b8a;font-size:12px;">Demande envoyée depuis votre site créé avec Tommy Studio. Ces informations ne sont pas conservées par Tommy Studio.</p>`,
  });
  await db.from('site_quote_requests').insert({ project_id: project.id, ip_hash: ipHash, delivered });
  if (!delivered) return json({ error: 'Envoi impossible pour le moment. Appelez directement.' }, 502);
  return json({ ok: true });
}
