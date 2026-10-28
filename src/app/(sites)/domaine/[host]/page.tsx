import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, permanentRedirect } from 'next/navigation';
import SiteRenderer from '@/site-engine/SiteRenderer';
import { siteMetadata } from '@/site-engine/seo';
import { parseDomain, customDomainUrl } from '@/lib/domain';
import { getLiveProjectByDomain } from '@/lib/supabase-server';
import { siteFromProject } from '@/lib/site-from-project';

/**
 * Site servi sur le nom de domaine du client (le proxy y réécrit les requêtes de ce domaine).
 * La page n'est accessible que si l'adresse demandée est bien celle du domaine : pas de doublon sur tommy-studio.pro/domaine/….
 */
async function load(hostParam: string) {
  const requested = ((await headers()).get('host') ?? '').split(':')[0].toLowerCase();
  const host = decodeURIComponent(hostParam).toLowerCase();
  if (requested !== host) return null;
  const parsed = parseDomain(host);
  if (!parsed.ok) return null;
  // www.domaine → domaine (redirection permanente)
  if (host !== parsed.domain) permanentRedirect(customDomainUrl(parsed.domain));
  const project = await getLiveProjectByDomain(parsed.domain);
  return project ? { project, domain: parsed.domain } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ host: string }> }): Promise<Metadata> {
  const found = await load((await params).host);
  if (!found) return {};
  const data = await siteFromProject(found.project);
  return { ...siteMetadata(data, 'live'), alternates: { canonical: customDomainUrl(found.domain) }, other: { 'ts-site': found.project.slug ?? '' } };
}

export default async function CustomDomainPage({ params }: { params: Promise<{ host: string }> }) {
  const found = await load((await params).host);
  if (!found) notFound();
  return <SiteRenderer data={await siteFromProject(found.project)} mode="live" />;
}
