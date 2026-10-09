import type { Metadata } from 'next';
import EnvoiFichiersContent from './EnvoiFichiersContent';

export const metadata: Metadata = {
  title: 'Envoyer mes photos et fichiers | Tommy Studio',
  description: 'Envoyez vos photos, vidéos et documents pour la création de votre site web.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://www.tommy-studio.pro/envoi-fichiers',
  },
};

export default function EnvoiFichiersPage() {
  return <EnvoiFichiersContent />;
}
