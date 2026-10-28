import { parseDomain } from '@/lib/domain';
import { setCustomDomain } from '@/lib/supabase-server';
import { json, loadProject, readJson } from '@/lib/projects-api';

/** Domaine personnalisé du client : état actuel */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  return json({ domain: project.custom_domain, status: project.custom_domain_status });
}

/** Enregistre (ou remplace) le domaine du client : réservé aux sites en ligne */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  if (project.status !== 'live') return json({ error: 'Votre site doit d’abord être publié.' }, 409);
  const body = await readJson(request);
  const parsed = parseDomain(body?.domain);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  try {
    if (!(await setCustomDomain(project.id, parsed.domain))) return json({ error: 'Ce nom de domaine est déjà utilisé par un autre site. Écrivez-moi si c’est le vôtre.' }, 409);
    return json({ domain: parsed.domain, status: 'pending' });
  } catch (error) {
    console.error('domaine', error);
    return json({ error: 'Enregistrement impossible.' }, 500);
  }
}

/** Retire le domaine personnalisé : le site reste en ligne sur son adresse en tommy-studio.pro */
export async function DELETE(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  try {
    await setCustomDomain(project.id, null);
    return json({ domain: null, status: null });
  } catch (error) {
    console.error('domaine', error);
    return json({ error: 'Suppression impossible.' }, 500);
  }
}
