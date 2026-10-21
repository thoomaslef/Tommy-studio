import type { Metadata } from 'next';
import ServicesContent from './ServicesContent';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Création de site web',
  provider: {
    '@type': 'ProfessionalService',
    name: 'Tommy Studio',
    url: 'https://www.tommy-studio.pro',
  },
  areaServed: { '@type': 'Country', name: 'France' },
  description:
    'Création de sites web professionnels pour artisans et indépendants, à prix fixe dès 99€. Paiement unique, hébergement la première année inclus, livraison en moins de 7 jours.',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '99',
    highPrice: '199',
    priceCurrency: 'EUR',
    offerCount: 3,
  },
};

export const metadata: Metadata = {
  title: 'Création de site web dès 99€ | Tarifs et formules — Tommy Studio',
  description:
    'Trois formules de site web à prix fixe : 99€, 149€ ou 199€. Paiement unique, hébergement la première année inclus, livraison en moins de 7 jours.',
  alternates: {
    canonical: 'https://www.tommy-studio.pro/services',
  },
  openGraph: {
    title: 'Création de site web dès 99€ — Tommy Studio',
    description:
      'Site web professionnel à prix fixe : Essentiel 99€, Standard 149€, Complet 199€. Paiement unique, partout en France.',
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
