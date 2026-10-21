import type { Metadata } from 'next';
import { resolveDesign } from './design';
import { TRADES } from './trades';
import type { SiteData, SiteMode } from './types';

export function siteMetadata(data: SiteData, mode: SiteMode): Metadata {
  const trade = TRADES[data.trade];
  const design = resolveDesign(data);
  return {
    title: { absolute: `${data.businessName} — ${trade.label} à ${data.city}` },
    description: `${design.tagline}. ${trade.activity} à ${data.city} et alentours. Contact : ${data.phone}.`.slice(0, 160),
    robots: mode === 'live' ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: `${data.businessName} — ${trade.label} à ${data.city}`,
      description: design.tagline,
      locale: 'fr_FR',
      type: 'website',
      ...(data.photos[0]?.url ? { images: [data.photos[0].url] } : {}),
    },
  };
}

export function siteJsonLd(data: SiteData) {
  const trade = TRADES[data.trade];
  return {
    '@context': 'https://schema.org',
    '@type': trade.schemaType,
    name: data.businessName,
    description: resolveDesign(data).about,
    telephone: data.phone,
    ...(data.email ? { email: data.email } : {}),
    ...(data.address ? { address: { '@type': 'PostalAddress', streetAddress: data.address, addressLocality: data.city, addressCountry: 'FR' } } : { address: { '@type': 'PostalAddress', addressLocality: data.city, addressCountry: 'FR' } }),
    areaServed: (data.zone.length ? data.zone : [data.city]).map((name) => ({ '@type': 'City', name })),
    ...(data.logoUrl ? { logo: data.logoUrl } : {}),
    ...(data.photos.length ? { image: data.photos.slice(0, 5).map((p) => p.url) } : {}),
    makesOffer: data.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.description } })),
  };
}
