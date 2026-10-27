import type { Metadata } from 'next';

const SITE = 'https://www.tommy-studio.pro';
const OG_IMAGE = { url: '/og-image.jpg', width: 1200, height: 630, alt: 'Exemple de site créé avec Tommy Studio' };

/** Métadonnées d'une page du studio : canonical, partage (WhatsApp, Facebook…) et titre propres à la page */
export function pageMetadata({ title, description, path, shareTitle }: { title?: string; description: string; path: string; shareTitle?: string }): Metadata {
  const ogTitle = shareTitle ?? (title ? `${title} — Tommy Studio` : 'Tommy Studio');
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'fr_FR', siteName: 'Tommy Studio', url: `${SITE}${path}`, title: ogTitle, description, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title: ogTitle, description, images: [OG_IMAGE.url] },
  };
}
