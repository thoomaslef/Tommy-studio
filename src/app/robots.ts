import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // /apercu et /creer/<lien> restent explorables pour que Google y lise leur « noindex »
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: 'https://www.tommy-studio.pro/sitemap.xml',
  };
}
