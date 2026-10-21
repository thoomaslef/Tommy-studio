import { MAX_PHOTOS } from '@/site-engine/sanitize';
import { createPhotoUpload, listAssets } from '@/lib/supabase-server';
import { json, loadProject, readJson } from '@/lib/projects-api';

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as const;

/** Demande d'envoi : renvoie une adresse signée pour envoyer la photo directement au stockage */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  if (project.status !== 'draft' && project.status !== 'live') return json({ error: 'Projet non modifiable.' }, 409);

  const body = await readJson(request);
  const kind = body?.kind === 'logo' ? 'logo' : 'photo';
  const type = body?.type as keyof typeof EXT;
  if (!(type in EXT)) return json({ error: 'Format non accepté (JPEG, PNG ou WebP).' }, 400);

  const photos = (await listAssets(project.id)).filter((a) => a.kind === 'photo');
  if (kind === 'photo' && photos.length >= MAX_PHOTOS) return json({ error: `${MAX_PHOTOS} photos maximum.` }, 400);

  try {
    const upload = await createPhotoUpload(project.id, EXT[type]);
    return json({ path: upload.path, uploadUrl: upload.signedUrl });
  } catch (error) {
    console.error('createPhotoUpload', error);
    return json({ error: 'Envoi impossible pour le moment.' }, 500);
  }
}
