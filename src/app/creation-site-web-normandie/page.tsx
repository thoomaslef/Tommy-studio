import type { Metadata } from 'next';
import NormandieContent from './NormandieContent';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Tommy Studio',
  description: 'Création de sites web professionnels pour artisans et indépendants en Normandie.',
  url: 'https://www.tommy-studio.pro',
  telephone: '+33612941125',
  email: 'thomas@tommy-studio.pro',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Caen',
    addressRegion: 'Normandie',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.1829,
    longitude: -0.3707,
  },
  areaServed: { '@type': 'State', name: 'Normandie' },
  priceRange: '€€',
  openingHours: 'Mo-Fr 09:00-18:00',
};

export const metadata: Metadata = {
  title: 'Création de site web en Normandie | Tommy Studio — Caen, Rouen, Le Havre',
  description:
    'Créateur de site web en Normandie basé à Caen. Sites professionnels pour artisans et indépendants dans tout le Calvados et la Normandie. Dès 49€/mois, création offerte, sans engagement.',
  alternates: {
    canonical: 'https://www.tommy-studio.pro/creation-site-web-normandie',
  },
  openGraph: {
    title: 'Création de site web en Normandie | Tommy Studio',
    description:
      'Créateur de site web en Normandie basé à Caen. Sites professionnels pour artisans. Dès 49€/mois, création offerte, sans engagement.',
    url: 'https://www.tommy-studio.pro/creation-site-web-normandie',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function CreationSiteWebNormandie() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NormandieContent />
    </>
  );
}
