import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomBytes } from 'crypto';
import { getR2 } from '@/lib/r2';
import {
  EMAIL_PATTERN,
  FOLDER_PATTERN,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  isAllowedType,
  safeFileName,
  slugify,
} from '@/lib/upload-config';

type IncomingFile = { name?: unknown; type?: unknown; size?: unknown };

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
  const website = typeof body.website === 'string' ? body.website : '';
  const files = Array.isArray(body.files) ? (body.files as IncomingFile[]) : [];
  const existingFolder = typeof body.folder === 'string' ? body.folder : '';

  // Champ piège rempli uniquement par les robots : on répond OK sans rien faire
  if (website) return Response.json({ folder: 'ignored', uploads: [] });

  if (!name || name.length > 100) return Response.json({ error: 'Nom invalide.' }, { status: 400 });
  if (!EMAIL_PATTERN.test(email) || email.length > 200) return Response.json({ error: 'Email invalide.' }, { status: 400 });
  if (files.length < 1 || files.length > MAX_FILES) {
    return Response.json({ error: `Choisissez entre 1 et ${MAX_FILES} fichiers.` }, { status: 400 });
  }
  if (existingFolder && !FOLDER_PATTERN.test(existingFolder)) {
    return Response.json({ error: 'Dossier invalide.' }, { status: 400 });
  }

  let total = 0;
  const checked: { name: string; type: string; size: number }[] = [];
  for (const f of files) {
    const fileName = typeof f.name === 'string' ? f.name : '';
    const type = typeof f.type === 'string' ? f.type : '';
    const size = typeof f.size === 'number' ? f.size : 0;
    if (!fileName || size <= 0 || size > MAX_FILE_SIZE) {
      return Response.json({ error: `« ${fileName || 'Fichier'} » dépasse la taille maximale ou est vide.` }, { status: 400 });
    }
    if (!isAllowedType(type)) {
      return Response.json({ error: `Le type de « ${fileName} » n'est pas accepté.` }, { status: 400 });
    }
    total += size;
    checked.push({ name: fileName, type, size });
  }
  if (total > MAX_TOTAL_SIZE) {
    return Response.json({ error: 'Le total des fichiers dépasse 1 Go.' }, { status: 400 });
  }

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const folder = existingFolder || `${date}-${slugify(name)}-${randomBytes(3).toString('hex')}`;

  try {
    const uploads = await Promise.all(
      checked.map(async (f) => {
        const key = `${folder}/${randomBytes(4).toString('hex')}-${safeFileName(f.name)}`;
        const url = await getSignedUrl(
          r2.client,
          new PutObjectCommand({ Bucket: r2.bucket, Key: key, ContentType: f.type }),
          { expiresIn: 3600 },
        );
        return { key, url, contentType: f.type };
      }),
    );
    return Response.json({ folder, uploads });
  } catch (error) {
    console.error('Upload sign error:', error);
    return Response.json({ error: 'Impossible de préparer l\'envoi.' }, { status: 500 });
  }
}
