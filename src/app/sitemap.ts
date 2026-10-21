import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.tommy-studio.pro/', lastModified: new Date('2026-10-21'), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://www.tommy-studio.pro/creer', lastModified: new Date('2026-10-21'), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.tommy-studio.pro/modeles', lastModified: new Date('2026-10-21'), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.tommy-studio.pro/portfolio', lastModified: new Date('2026-10-21'), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.tommy-studio.pro/cgv', lastModified: new Date('2026-10-21'), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://www.tommy-studio.pro/mentions-legales', lastModified: new Date('2026-10-21'), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://www.tommy-studio.pro/politique-de-confidentialite', lastModified: new Date('2026-10-21'), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
