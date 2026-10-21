import { sanitizeDraft } from '@/site-engine/sanitize';
import { listAssets, saveDraft } from '@/lib/supabase-server';
import { assetView, json, loadProject, readJson } from '@/lib/projects-api';

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  const assets = await listAssets(project.id);
  return json({ status: project.status, slug: project.slug, draft: project.data, assets: assets.map(assetView) });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  const body = await readJson(request);
  if (!body || typeof body.draft !== 'object') return json({ error: 'Requête invalide.' }, 400);

  try {
    await saveDraft(project.id, sanitizeDraft(body.draft));
    return json({ ok: true });
  } catch (error) {
    console.error('saveDraft', error);
    return json({ error: 'Enregistrement impossible.' }, 409);
  }
}
