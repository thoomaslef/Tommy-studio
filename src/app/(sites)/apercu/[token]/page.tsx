import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/site-engine/SiteRenderer';
import { getProjectByToken } from '@/lib/supabase-server';
import { siteFromProject } from '@/lib/site-from-project';

export const metadata: Metadata = {
  title: 'Aperçu de votre site',
  robots: { index: false, follow: false },
};

export default async function ApercuPage({ params }: { params: Promise<{ token: string }> }) {
  const project = await getProjectByToken((await params).token);
  if (!project) notFound();
  const data = await siteFromProject(project);
  return <SiteRenderer data={data} mode="preview" />;
}
