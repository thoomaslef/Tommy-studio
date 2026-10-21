import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectByToken, listAssets, publicMediaUrl } from '@/lib/supabase-server';
import Configurator from './Configurator';

export const metadata: Metadata = {
  title: 'Mon site en création',
  robots: { index: false, follow: false },
};

export default async function ConfiguratorPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const project = await getProjectByToken(token);
  if (!project) notFound();
  const assets = (await listAssets(project.id)).map((a) => ({ id: a.id, kind: a.kind, position: a.position, url: publicMediaUrl(a.path) }));
  return <Configurator token={token} initialDraft={project.data} initialAssets={assets} status={project.status} slug={project.slug} />;
}
