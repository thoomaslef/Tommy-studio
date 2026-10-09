import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.tommy-studio.pro/',
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: 'https://www.tommy-studio.pro/services',
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.tommy-studio.pro/portfolio',
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.tommy-studio.pro/creation-site-web-caen',
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.tommy-studio.pro/creation-site-web-normandie',
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.tommy-studio.pro/mentions-legales',
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://www.tommy-studio.pro/politique-de-confidentialite',
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
