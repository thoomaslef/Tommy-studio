import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/site-engine/SiteRenderer';
import { DEMOS, getDemo } from '@/site-engine/demos';
import { siteMetadata } from '@/site-engine/seo';

export function generateStaticParams() {
  return DEMOS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const demo = getDemo((await params).slug);
  return demo ? siteMetadata(demo, 'demo') : {};
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const demo = getDemo((await params).slug);
  if (!demo) notFound();
  return <SiteRenderer data={demo} mode="demo" />;
}
