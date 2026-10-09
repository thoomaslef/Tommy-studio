import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tommy-studio.pro'),
  title: {
    default: 'Création de site web à Caen | Tommy Studio — À partir de 49€/mois',
    template: '%s | Tommy Studio — Caen',
  },
  description:
    'Tommy Studio crée des sites web professionnels pour artisans et indépendants à Caen et en Normandie. Livraison en 7 jours, à partir de 49€/mois, création offerte, SEO local inclus.',
  keywords: [
    'créateur site web Caen',
    'création site web Caen',
    'web designer Caen',
    'site internet artisan Caen',
    'agence web Caen',
    'Tommy Studio',
    'création site web',
    'site web professionnel',
    'site web artisan',
    'création site web Normandie',
    'agence web Normandie',
    'site web indépendant',
    'site vitrine Caen',
    'design web Caen',
  ],
  authors: [{ name: 'Tommy Studio', url: 'https://www.tommy-studio.pro' }],
  creator: 'Tommy Studio',
  publisher: 'Tommy Studio',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.tommy-studio.pro',
    siteName: 'Tommy Studio',
    title: 'Créateur de site web à Caen pour artisans — Tommy Studio',
    description:
      'Tommy Studio crée votre site web professionnel à Caen en moins de 7 jours. Tarif fixe dès 49€/mois, optimisé Google, parfait sur mobile. Devis gratuit sous 24h.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tommy Studio — Créateur de site web à Caen, Normandie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Créateur de site web à Caen — Tommy Studio',
    description:
      'Site web professionnel livré en 7 jours dès 49€/mois. Basé à Caen, pour artisans et indépendants. Devis gratuit sous 24h.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.tommy-studio.pro',
    languages: {
      'fr': 'https://www.tommy-studio.pro/',
      'x-default': 'https://www.tommy-studio.pro/',
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Tommy Studio',
  description:
    'Créateur de site web professionnel à Caen pour artisans et indépendants. Livraison en 7 jours, tarif fixe dès 49€/mois.',
  url: 'https://www.tommy-studio.pro',
  telephone: '+33612941125',
  email: 'thomas@tommy-studio.pro',
  taxID: '10108233700011',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '7 boulevard Leroy',
    addressLocality: 'Caen',
    postalCode: '14000',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.1829,
    longitude: -0.3707,
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 49.1829,
      longitude: -0.3707,
    },
    geoRadius: '100000',
  },
  openingHours: 'Mo-Fr 09:00-18:00',
  sameAs: [],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services Tommy Studio',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Création de site web sur-mesure',
          description: 'Site web professionnel pour artisans et indépendants à Caen, livré en 7 jours, optimisé Google et parfait sur mobile.',
        },
        price: '49',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '49',
          priceCurrency: 'EUR',
          unitCode: 'MON',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '50',
    bestRating: '5',
    worstRating: '1',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full w-full bg-background text-foreground">
        <Navbar />
        <main className="w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
