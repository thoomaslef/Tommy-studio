import 'server-only';
import { draftToSiteData } from '@/site-engine/sanitize';
import { TRADES } from '@/site-engine/trades';
import type { SiteData } from '@/site-engine/types';
import { listAssets, publicMediaUrl, type ProjectRow } from './supabase-server';

/** Construit le site complet d'un projet : brouillon + photos stockées */
export async function siteFromProject(project: ProjectRow): Promise<SiteData> {
  const assets = await listAssets(project.id);
  const logo = assets.find((a) => a.kind === 'logo');
  const activity = project.data.trade ? TRADES[project.data.trade].activity : 'Réalisation';
  const photos = assets
    .filter((a) => a.kind === 'photo')
    .map((a, i) => ({ url: publicMediaUrl(a.path), alt: `${activity} — photo ${i + 1}` }));
  return draftToSiteData(project.id, project.data, photos, logo ? publicMediaUrl(logo.path) : undefined);
}
