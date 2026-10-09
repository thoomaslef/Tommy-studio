import type { Metadata } from 'next';
import StartProjectContent from './StartProjectContent';

export const metadata: Metadata = {
  title: 'Démarrer mon site web dès 99€ | Tommy Studio',
  description:
    'Choisissez votre formule (99€, 149€ ou 199€) et décrivez votre activité en 2 minutes. Paiement unique, réponse personnelle sous 24h.',
  alternates: {
    canonical: 'https://www.tommy-studio.pro/start-project',
  },
  openGraph: {
    title: 'Démarrer mon site web — Tommy Studio',
    description:
      'Site web professionnel à prix fixe dès 99€. Choisissez votre formule et décrivez votre activité en 2 minutes.',
    url: 'https://www.tommy-studio.pro/start-project',
  },
};

export default function StartProjectPage() {
  return <StartProjectContent />;
}
