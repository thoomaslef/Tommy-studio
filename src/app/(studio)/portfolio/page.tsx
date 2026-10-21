import type { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = {
  title: 'Portfolio — Sites web réalisés à Caen & Normandie | Tommy Studio',
  description:
    'Découvrez les réalisations de Tommy Studio : sites vitrines pour restaurants, coachs et commerçants à Caen et en Normandie. Design sur-mesure, livraison en 7 jours.',
  alternates: {
    canonical: 'https://www.tommy-studio.pro/portfolio',
  },
  openGraph: {
    title: 'Portfolio création de sites web — Tommy Studio Caen',
    description:
      'Découvrez les réalisations de Tommy Studio, créateur de sites web à Caen. Sites pour artisans, commerçants et indépendants en Normandie.',
    url: 'https://www.tommy-studio.pro/portfolio',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function PortfolioPage() {
  return <PortfolioContent />;
}
