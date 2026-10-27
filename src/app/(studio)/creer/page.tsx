import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { isTradeId } from '@/site-engine/trades';
import CreerStart from './CreerStart';

export const metadata: Metadata = pageMetadata({
  title: 'Créer mon site d’artisan en 10 minutes',
  description: 'Plombier, électricien, maçon, couvreur… Créez le site internet de votre entreprise du bâtiment en quelques minutes, voyez l’aperçu, et payez seulement s’il vous plaît.',
  path: '/creer',
});

export default async function CreerPage({ searchParams }: { searchParams: Promise<{ metier?: string }> }) {
  // ?metier=plombier : arrivée depuis une démo, le métier est proposé directement
  const { metier } = await searchParams;
  return <CreerStart suggested={metier && isTradeId(metier) ? metier : undefined} />;
}
