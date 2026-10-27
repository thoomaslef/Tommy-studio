import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = pageMetadata({
  title: 'Réalisations sur mesure',
  description: 'Sites réalisés sur mesure par Tommy Studio pour des artisans et indépendants.',
  path: '/portfolio',
});

export default function PortfolioPage() {
  return <PortfolioContent />;
}
