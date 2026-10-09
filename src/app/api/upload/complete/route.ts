import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resend } from 'resend';
import { getR2 } from '@/lib/r2';
import { EMAIL_PATTERN, FOLDER_PATTERN, MAX_FILES, MAX_FILE_SIZE, formatSize } from '@/lib/upload-config';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(request: Request) {
  const r2 = getR2();
  if (!r2) {
    return Response.json({ error: 'L\'envoi de fichiers est indisponible pour le moment.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : '';
  const folder = typeof body.folder === 'string' ? body.folder : '';
  const keys = Array.isArray(body.keys) ? (body.keys as unknown[]) : [];

  if (!name || name.length > 100 || !EMAIL_PATTERN.test(email) || !FOLDER_PATTERN.test(folder)) {
    return Response.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  if (keys.length < 1 || keys.length > MAX_FILES) {
    return Response.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const received: { key: string; label: string; size: number; url: string }[] = [];

  for (const key of keys) {
    if (typeof key !== 'string' || !key.startsWith(`${folder}/`) || key.length > 200) continue;
    try {
      const head = await r2.client.send(new HeadObjectCommand({ Bucket: r2.bucket, Key: key }));
      const size = head.ContentLength ?? 0;
      if (size <= 0 || size > MAX_FILE_SIZE) {
        await r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: key }));
        continue;
      }
      const url = await getSignedUrl(r2.client, new GetObjectCommand({ Bucket: r2.bucket, Key: key }), {
        expiresIn: 7 * 24 * 3600,
      });
      received.push({ key, label: key.slice(folder.length + 1).replace(/^[a-f0-9]{8}-/, ''), size, url });
    } catch {
      // fichier absent ou illisible : ignoré
    }
  }

  if (received.length === 0) {
    return Response.json({ error: 'Aucun fichier reçu.' }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const rows = received
      .map(
        (f) =>
          `<li style="margin-bottom:8px;"><a href="${f.url}" style="color:#6366f1;">${escapeHtml(f.label)}</a> <span style="color:#9090b0;">(${formatSize(f.size)})</span></li>`,
      )
      .join('');

    await resend.emails.send({
      from: 'Tommy Studio <onboarding@resend.dev>',
      to: 'thomaslefevre1197@gmail.com',
      replyTo: email,
      subject: `Fichiers reçus — ${name} (${received.length})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f0f17; color: #e2e2f0; border-radius: 12px;">
          <h2 style="color: #6366f1; margin-top: 0;">${received.length} fichier(s) reçu(s)</h2>
          <p><strong>${escapeHtml(name)}</strong> — <a href="mailto:${escapeHtml(email)}" style="color:#6366f1;">${escapeHtml(email)}</a></p>
          ${message ? `<p style="background:#1a1a2e;padding:16px;border-radius:8px;line-height:1.6;">${escapeHtml(message).replace(/\n/g, '<br/>')}</p>` : ''}
          <ul style="padding-left:20px;">${rows}</ul>
          <p style="color:#9090b0;font-size:12px;">Les liens expirent dans 7 jours. Dossier de stockage : <code>${folder}</code> (Cloudflare R2).</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Upload email error:', error);
    // Les fichiers sont bien stockés ; on ne fait pas échouer l'envoi côté client
  }

  return Response.json({ success: true, received: received.length });
}
