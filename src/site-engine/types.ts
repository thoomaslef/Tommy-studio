export type TradeId =
  | 'plombier'
  | 'electricien'
  | 'chauffagiste'
  | 'macon'
  | 'couvreur'
  | 'menuisier'
  | 'peintre'
  | 'carreleur'
  | 'plaquiste'
  | 'paysagiste'
  | 'multiservice';

export type TemplateId = 'classique' | 'moderne' | 'robuste';

export type SiteService = { title: string; description?: string; price?: string };

export type SitePhoto = { url: string; alt?: string };

export type SiteReview = { author: string; text: string; rating?: number; city?: string };

export type SiteData = {
  slug: string;
  trade: TradeId;
  businessName: string;
  ownerName?: string;
  /** Accroche courte ; générée à partir du métier si absente */
  tagline?: string;
  /** Présentation ; générée à partir du métier si absente */
  about?: string;
  city: string;
  zone: string[];
  radiusKm?: number;
  phone: string;
  email?: string;
  address?: string;
  hours?: string;
  siret?: string;
  foundedYear?: number;
  certifications: string[];
  insurance?: string;
  services: SiteService[];
  photos: SitePhoto[];
  logoUrl?: string;
  reviews: SiteReview[];
  emergency?: boolean;
  freeQuote?: boolean;
  style: {
    template: TemplateId;
    /** Identifiant de palette choisi par le client ; sinon choisi automatiquement */
    palette?: string;
    /** Identifiant d'association de polices ; sinon choisi automatiquement */
    fonts?: string;
  };
};

/** export : copie statique du site téléchargée par le client (pas de formulaire en ligne, pas de bandeau) */
export type SiteMode = 'live' | 'preview' | 'demo' | 'export';
