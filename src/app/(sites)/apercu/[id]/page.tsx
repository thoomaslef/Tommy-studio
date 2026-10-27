import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/site-engine/SiteRenderer';
import { getProjectById, getProjectByToken } from '@/lib/supabase-server';
import { siteFromProject } from '@/lib/site-from-project';

export const metadata: Metadata = {
  title: 'Aperçu de votre site',
  robots: { index: false, follow: false },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Aperçu en lecture seule, par l'identifiant du projet : on peut le partager sans donner accès à la modification.
 * Les anciens liens /apercu/<lien privé> restent valides.
 */
export default async function ApercuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = UUID.test(id) ? await getProjectById(id) : await getProjectByToken(id);
  if (!project) notFound();
  const data = await siteFromProject(project);
  return <SiteRenderer data={data} mode="preview" />;
}
