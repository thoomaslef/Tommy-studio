import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/site-engine/SiteRenderer';
import { siteMetadata } from '@/site-engine/seo';
import { getLiveProjectBySlug } from '@/lib/supabase-server';
import { siteFromProject } from '@/lib/site-from-project';
import { SLUG_FORMAT, liveSiteUrl } from '@/lib/live-site';

// Site client publié : servi sur www.tommy-studio.pro/s/<slug> ou <slug>.tommy-studio.pro
const loadSite = cache(async (slug: string) => {
  if (!SLUG_FORMAT.test(slug)) return null;
  const project = await getLiveProjectBySlug(slug);
  return project ? siteFromProject(project) : null;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadSite(slug);
  if (!data) return {};
  return { ...siteMetadata(data, 'live'), alternates: { canonical: liveSiteUrl(slug) } };
}

export default async function LiveSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await loadSite((await params).slug);
  if (!data) notFound();
  return <SiteRenderer data={data} mode="live" />;
}
