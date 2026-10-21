import type { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = {
  title: 'Réalisations sur mesure',
  description:
    'Sites réalisés sur mesure par Tommy Studio pour des artisans et indépendants.',
  alternates: {
    canonical: 'https://www.tommy-studio.pro/portfolio',
  },
  openGraph: {
    title: 'Réalisations sur mesure — Tommy Studio',
    description:
      'Sites réalisés sur mesure par Tommy Studio pour des artisans et indépendants.',
    url: 'https://www.tommy-studio.pro/portfolio',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function PortfolioPage() {
  return <PortfolioContent />;
}
