import type { Metadata } from 'next';
import ServicesContent from './ServicesContent';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Création de site web',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Tommy Studio',
    url: 'https://www.tommy-studio.pro',
  },
  areaServed: { '@type': 'City', name: 'Caen' },
  description:
    'Création de sites web professionnels pour artisans et indépendants à Caen, livrés en 7 jours à partir de 49€/mois. Création offerte, sans engagement.',
  offers: {
    '@type': 'Offer',
    price: '49',
    priceCurrency: 'EUR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '49',
      priceCurrency: 'EUR',
      unitCode: 'MON',
    },
  },
};

export const metadata: Metadata = {
  title: 'Création de site web à Caen | 49€/mois — Tommy Studio',
  description:
    'Site vitrine professionnel à 49€/mois, création offerte, livré en 7 jours avec SEO local inclus. Sans engagement — Tommy Studio, Caen.',
  alternates: {
    canonical: 'https://www.tommy-studio.pro/services',
  },
  openGraph: {
    title: 'Création de site web à Caen — 49€/mois | Tommy Studio',
    description:
      'Site web professionnel livré en 7 jours à 49€/mois, création offerte. Tommy Studio, créateur de sites web à Caen pour artisans et indépendants. Sans engagement.',
    url: 'https://www.tommy-studio.pro/services',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesContent />
    </>
  );
}
