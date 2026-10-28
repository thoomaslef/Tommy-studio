import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/site-engine/SiteRenderer';
import { siteMetadata } from '@/site-engine/seo';
import { getProjectById } from '@/lib/supabase-server';
import { siteFromProject } from '@/lib/site-from-project';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Version « téléchargeable » du site : sert de source à l'export ZIP. Jamais indexée (en-tête X-Robots-Tag). */
async function load(id: string) {
  if (!UUID.test(id)) return null;
  const project = await getProjectById(id);
  return project && project.status === 'live' ? project : null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const project = await load((await params).id);
  return project ? siteMetadata(await siteFromProject(project), 'live') : {};
}

export default async function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const project = await load((await params).id);
  if (!project) notFound();
  return <SiteRenderer data={await siteFromProject(project)} mode="export" />;
}
