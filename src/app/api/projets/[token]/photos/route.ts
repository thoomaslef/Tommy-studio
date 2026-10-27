import { MAX_PHOTOS } from '@/site-engine/sanitize';
import { countProjectFiles, createPhotoUpload, listAssets } from '@/lib/supabase-server';
import { MAX_FILES_PER_PROJECT } from '@/lib/rate-limit';
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
    // Les envois jamais confirmés comptent aussi : un robot ne peut pas remplir le stockage
    if ((await countProjectFiles(project.id)) >= MAX_FILES_PER_PROJECT) {
      return json({ error: 'Trop d’envois pour ce site. Supprimez des photos avant d’en ajouter.' }, 429);
    }
    const upload = await createPhotoUpload(project.id, EXT[type]);
    return json({ path: upload.path, uploadUrl: upload.signedUrl });
  } catch (error) {
    console.error('createPhotoUpload', error);
    return json({ error: 'Envoi impossible pour le moment.' }, 500);
  }
}
