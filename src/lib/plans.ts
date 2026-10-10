export type PlanId = 'essentiel' | 'standard' | 'complet';

export type Plan = {
  id: PlanId;
  name: string;
  price: number; // en euros, TTC
  tagline: string;
  summary: string;
  maxPages: number;
  features: string[];
};

export const PLANS: Record<PlanId, Plan> = {
  essentiel: {
    id: 'essentiel',
    name: 'Essentiel',
    price: 99,
    tagline: 'Pour exister en ligne',
    summary: 'Site d\'une page avec formulaire de contact',
    maxPages: 1,
    features: [
      'Site d\'une page',
      'Formulaire de contact',
      'Optimisé mobile et Google',
      'Adresse nom.tommy-studio.pro',
      'Hébergement la 1re année inclus',
      '1 retouche incluse',
    ],
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    price: 149,
    tagline: 'Recommandé',
    summary: 'Site de 3 à 5 pages avec galerie, carte et avis',
    maxPages: 5,
    features: [
      '3 à 5 pages',
      'Galerie photos & réalisations',
      'Carte Google Maps intégrée',
      'Avis clients & témoignages',
      'Formulaire de contact',
      'Hébergement la 1re année inclus',
      '1 retouche incluse',
    ],
  },
  complet: {
    id: 'complet',
    name: 'Complet',
    price: 199,
    tagline: 'Pour aller plus loin',
    summary: 'Site Standard avec prise de rendez-vous en ligne et blog',
    maxPages: 10,
    features: [
      'Tout le pack Standard',
      'Prise de rendez-vous en ligne',
      'Blog & actualités',
      'Page menu / catalogue',
      'Hébergement la 1re année inclus',
      '1 retouche incluse',
    ],
  },
};

export const PLAN_IDS = Object.keys(PLANS) as PlanId[];

export const isPlanId = (value: unknown): value is PlanId =>
  typeof value === 'string' && value in PLANS;

export const HOSTING_RENEWAL_PRICE = 39; // €/an, à partir de la 2e année
export const EXTRA_REVISION_PRICE = 15; // € par retouche supplémentaire

export const formatEuro = (amount: number) => `${amount}€`;
