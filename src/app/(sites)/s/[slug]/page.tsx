import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/site-engine/SiteRenderer';
import { siteMetadata } from '@/site-engine/seo';
import { getLiveProjectBySlug } from '@/lib/supabase-server';
import { siteFromProject } from '@/lib/site-from-project';
import { SLUG_FORMAT, liveSiteUrl } from '@/lib/live-site';
import { customDomainUrl } from '@/lib/domain';

// Site client publié : servi sur <slug>.tommy-studio.pro (ou www.tommy-studio.pro/s/<slug>).
// Mis en cache : la page ne lit la base qu'une fois toutes les 5 minutes au plus, et elle est invalidée à chaque
// modification du site (voir lib/revalidate.ts). Si la base est indisponible, la version en cache reste servie.
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

const loadSite = cache(async (slug: string) => {
  if (!SLUG_FORMAT.test(slug)) return null;
  const project = await getLiveProjectBySlug(slug);
  return project ? { project, data: await siteFromProject(project) } : null;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = await loadSite(slug);
  if (!found) return {};
  // Une fois le domaine du client actif, c'est lui l'adresse de référence pour Google
  const canonical = found.project.custom_domain && found.project.custom_domain_status === 'active' ? customDomainUrl(found.project.custom_domain) : liveSiteUrl(slug);
  return { ...siteMetadata(found.data, 'live'), alternates: { canonical }, other: { 'ts-site': slug } };
}

export default async function LiveSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const found = await loadSite((await params).slug);
  if (!found) notFound();
  return <SiteRenderer data={found.data} mode="live" />;
}
