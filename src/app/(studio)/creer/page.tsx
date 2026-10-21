import type { Metadata } from 'next';
import CreerStart from './CreerStart';

export const metadata: Metadata = {
  title: 'Créer mon site d’artisan en 10 minutes',
  description: 'Plombier, électricien, maçon, couvreur… Créez le site de votre entreprise du bâtiment en quelques minutes, voyez l’aperçu, et payez seulement s’il vous plaît.',
  alternates: { canonical: 'https://www.tommy-studio.pro/creer' },
};

export default function CreerPage() {
  return <CreerStart />;
}
