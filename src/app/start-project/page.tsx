import type { Metadata } from 'next';
import StartProjectContent from './StartProjectContent';

export const metadata: Metadata = {
  title: 'Démarrer pour 49€/mois — Création de site web | Tommy Studio',
  description:
    'Démarrez votre site web professionnel à 49€/mois, création offerte. Décrivez votre activité en 2 minutes — réponse personnalisée sous 24h. Sans engagement, résiliable à tout moment.',
  alternates: {
    canonical: 'https://tommy-studio.pro/start-project',
  },
  openGraph: {
    title: 'Devis Gratuit — Lancez votre Projet avec Tommy Studio',
    description:
      'Démarrez votre site web à 49€/mois, création offerte. Décrivez votre activité en 2 minutes. Réponse sous 24h. Sans engagement.',
    url: 'https://tommy-studio.pro/start-project',
  },
};

export default function StartProjectPage() {
  return <StartProjectContent />;
}
