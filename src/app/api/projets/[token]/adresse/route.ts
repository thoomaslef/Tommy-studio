import { availableSlug } from '@/lib/supabase-server';
import { liveSiteUrl } from '@/lib/live-site';
import { json, loadProject } from '@/lib/projects-api';

/** Adresse prévue du site, affichée avant le paiement */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  if (project.slug) return json({ url: liveSiteUrl(project.slug), final: true });
  try {
    const slug = await availableSlug(project.data);
    return json({ url: slug ? liveSiteUrl(slug) : null, final: false });
  } catch (error) {
    console.error('adresse', error);
    return json({ error: 'Erreur serveur.' }, 500);
  }
}
