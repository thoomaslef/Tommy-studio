import 'server-only';
import { revalidatePath } from 'next/cache';
import type { ProjectRow } from './supabase-server';

/**
 * Les sites publiés sont mis en cache (voir revalidate dans s/[slug]/page.tsx) : à chaque changement
 * (texte, photo, domaine, hors ligne…), on invalide la page pour que la modification soit visible aussitôt.
 */
export function revalidateSite(project: Pick<ProjectRow, 'slug' | 'status'>) {
  if (!project.slug || (project.status !== 'live' && project.status !== 'offline')) return;
  try {
    revalidatePath(`/s/${project.slug}`);
  } catch (error) {
    // hors contexte de requête (tests) : sans importance, le cache expire de toute façon
    console.warn('revalidate', error);
  }
}
