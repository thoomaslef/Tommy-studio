import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_PRICE, formatEuro } from '@/lib/offer';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tommy-studio.pro'),
  title: {
    default: 'Tommy Studio — Le site de votre entreprise du bâtiment en 10 minutes',
    template: '%s | Tommy Studio',
  },
  description: `Plombier, électricien, maçon, couvreur… Créez le site de votre entreprise en 10 minutes : aperçu gratuit, ${formatEuro(SITE_PRICE)} à la publication, hébergement compris la première année.`,
  keywords: [
    'site internet artisan',
    'site web artisan du bâtiment',
    'créer site plombier',
    'site internet électricien',
    'site web couvreur',
    'site vitrine maçon',
    'site internet pas cher artisan',
    'Tommy Studio',
  ],
  authors: [{ name: 'Tommy Studio', url: 'https://www.tommy-studio.pro' }],
  creator: 'Tommy Studio',
  publisher: 'Tommy Studio',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Tommy Studio',
  description: 'Création de sites internet en libre-service pour les artisans du bâtiment : aperçu gratuit, prix unique à la publication.',
  url: 'https://www.tommy-studio.pro',
  telephone: '+33612941125',
  email: 'thomas@tommy-studio.pro',
  taxID: '10108233700011',
  priceRange: '€',
  address: { '@type': 'PostalAddress', streetAddress: '7 boulevard Leroy', addressLocality: 'Caen', postalCode: '14000', addressCountry: 'FR' },
  areaServed: { '@type': 'Country', name: 'France' },
  makesOffer: {
    '@type': 'Offer',
    price: String(SITE_PRICE),
    priceCurrency: 'EUR',
    itemOffered: { '@type': 'Service', name: 'Site internet pour artisan du bâtiment', description: 'Site d’une page, optimisé mobile et Google, hébergement compris la première année.' },
  },
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="w-full">{children}</main>
      <Footer />
    </>
  );
}
