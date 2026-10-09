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
    default: 'Création de site web pour artisans et indépendants | Tommy Studio — Dès 99€',
    template: '%s | Tommy Studio',
  },
  description:
    'Tommy Studio crée votre site web professionnel à prix fixe dès 99€, partout en France. Paiement unique, hébergement la première année inclus, optimisé pour Google et pour mobile.',
  keywords: [
    'création site web artisan',
    'site web pas cher',
    'site vitrine professionnel',
    'site internet indépendant',
    'créateur de site web',
    'site web prix fixe',
    'Tommy Studio',
    'création site web Caen',
    'création site web Normandie',
  ],
  authors: [{ name: 'Tommy Studio', url: 'https://www.tommy-studio.pro' }],
  creator: 'Tommy Studio',
  publisher: 'Tommy Studio',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.tommy-studio.pro',
    siteName: 'Tommy Studio',
    title: 'Votre site web professionnel dès 99€ — Tommy Studio',
    description:
      'Site web professionnel à prix fixe dès 99€, livré en moins de 7 jours, partout en France. Paiement unique, optimisé Google, parfait sur mobile.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tommy Studio — Création de site web pour artisans et indépendants',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Votre site web professionnel dès 99€ — Tommy Studio',
    description:
      'Site web professionnel à prix fixe dès 99€, livré en moins de 7 jours. Pour artisans et indépendants, partout en France.',
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
  '@type': 'ProfessionalService',
  name: 'Tommy Studio',
  description:
    'Création de sites web professionnels pour artisans et indépendants, partout en France. Prix fixe dès 99€, paiement unique, livraison en moins de 7 jours.',
  url: 'https://www.tommy-studio.pro',
  telephone: '+33612941125',
  email: 'thomas@tommy-studio.pro',
  taxID: '10108233700011',
  priceRange: '€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '7 boulevard Leroy',
    addressLocality: 'Caen',
    postalCode: '14000',
    addressCountry: 'FR',
  },
  areaServed: { '@type': 'Country', name: 'France' },
  sameAs: [],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Formules de création de site web',
    itemListElement: [
      { name: 'Essentiel', price: '99', description: 'Site d\'une page avec formulaire de contact, hébergement la première année inclus.' },
      { name: 'Standard', price: '149', description: 'Site de 3 à 5 pages avec galerie, carte et avis, hébergement la première année inclus.' },
      { name: 'Complet', price: '199', description: 'Site Standard avec prise de rendez-vous en ligne et blog, hébergement la première année inclus.' },
    ].map((plan) => ({
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: 'EUR',
      itemOffered: { '@type': 'Service', name: `Site web ${plan.name}`, description: plan.description },
    })),
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
