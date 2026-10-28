import { reorderPhotos } from '@/lib/supabase-server';
import { revalidateSite } from '@/lib/revalidate';
import { json, loadProject, readJson } from '@/lib/projects-api';

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  const body = await readJson(request);
  const ids = Array.isArray(body?.ids) ? (body.ids as unknown[]).filter((i): i is string => typeof i === 'string' && /^[0-9a-f-]{36}$/.test(i)).slice(0, 20) : null;
  if (!ids) return json({ error: 'Requête invalide.' }, 400);
  try {
    await reorderPhotos(project.id, ids);
    revalidateSite(project);
    return json({ ok: true });
  } catch (error) {
    console.error('reorderPhotos', error);
    return json({ error: 'Réorganisation impossible.' }, 500);
  }
}
