import { deleteAsset } from '@/lib/supabase-server';
import { revalidateSite } from '@/lib/revalidate';
import { json, loadProject } from '@/lib/projects-api';

export async function DELETE(_request: Request, { params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params;
  const project = await loadProject(token);
  if (project instanceof Response) return project;
  if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'Requête invalide.' }, 400);
  try {
    await deleteAsset(project.id, id);
    revalidateSite(project);
    return json({ ok: true });
  } catch (error) {
    console.error('deleteAsset', error);
    return json({ error: 'Suppression impossible.' }, 500);
  }
}
