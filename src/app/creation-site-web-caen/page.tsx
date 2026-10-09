import type { Metadata } from 'next';
import { motion } from 'framer-motion';
import CaenContent from './CaenContent';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Tommy Studio',
  description: 'Création de sites web professionnels pour artisans et indépendants à Caen et en Normandie.',
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
  areaServed: [
    { '@type': 'City', name: 'Caen' },
    { '@type': 'State', name: 'Normandie' },
    { '@type': 'Country', name: 'France' },
  ],
  priceRange: '€€',
  openingHours: 'Mo-Fr 09:00-18:00',
};

export const metadata: Metadata = {
  title: 'Création de site web à Caen | Tommy Studio — dès 99€, paiement unique',
  description:
    'Créateur de site web à Caen. Tommy Studio réalise votre site vitrine professionnel en 7 jours, dès 99€ en paiement unique, avec SEO local inclus.',
  alternates: {
    canonical: 'https://www.tommy-studio.pro/creation-site-web-caen',
  },
  openGraph: {
    title: 'Création de site web à Caen | Tommy Studio — dès 99€',
    description:
      'Créateur de site web à Caen. Tommy Studio réalise votre site vitrine professionnel en 7 jours, dès 99€ en paiement unique, avec SEO local inclus.',
    url: 'https://www.tommy-studio.pro/creation-site-web-caen',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function CreationSiteWebCaen() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaenContent />
    </>
  );
}
