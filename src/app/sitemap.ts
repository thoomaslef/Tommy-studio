import type { MetadataRoute } from 'next';
import { TRADE_IDS } from '@/site-engine/trades';

const SITE = 'https://www.tommy-studio.pro';
const UPDATED = new Date('2026-10-27');

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, MetadataRoute.Sitemap[number]['changeFrequency'], number][] = [
    ['/', 'weekly', 1.0],
    ['/creer', 'monthly', 0.9],
    ['/modeles', 'monthly', 0.8],
    ['/liens', 'monthly', 0.4],
    ['/cgv', 'yearly', 0.3],
    ['/mentions-legales', 'yearly', 0.3],
    ['/politique-de-confidentialite', 'yearly', 0.3],
  ];
  for (const id of TRADE_IDS) pages.push([`/site-internet/${id}`, 'monthly', 0.7]);
  return pages.map(([path, changeFrequency, priority]) => ({ url: `${SITE}${path}`, lastModified: UPDATED, changeFrequency, priority }));
}
