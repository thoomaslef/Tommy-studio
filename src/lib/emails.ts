import 'server-only';
import { Resend } from 'resend';
import { CONTACT_EMAIL, OWNER_EMAIL } from './contact';

export const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const wrap = (body: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#ffffff;color:#1a1a2e;line-height:1.6;">${body}</div>`;

/** Envoie un email ; renvoie false (et journalise) en cas d'échec, sans lever d'exception */
export async function sendEmail(opts: { to: string; subject: string; html: string; replyTo?: string; attachments?: { filename: string; content: string }[] }) {
  if (!process.env.RESEND_API_KEY) {
    console.error('sendEmail: RESEND_API_KEY manquante');
    return false;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const message = { to: opts.to, replyTo: opts.replyTo ?? CONTACT_EMAIL, subject: opts.subject, html: wrap(opts.html), attachments: opts.attachments };
    // Resend renvoie l'erreur au lieu de la lever
    let { error } = await resend.emails.send({ from: `Tommy Studio <${CONTACT_EMAIL}>`, ...message });
    // Domaine pas (encore) vérifié : l'adresse de test de Resend ne peut écrire qu'au propriétaire du compte
    if (error && opts.to === OWNER_EMAIL) ({ error } = await resend.emails.send({ from: 'Tommy Studio <onboarding@resend.dev>', ...message }));
    if (error) {
      console.error('sendEmail', opts.subject, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('sendEmail', opts.subject, error);
    return false;
  }
}

export const notifyOwner = (subject: string, html: string) => sendEmail({ to: OWNER_EMAIL, subject, html });
