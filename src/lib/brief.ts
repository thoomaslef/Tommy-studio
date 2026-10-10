import { isPlanId, PLANS, type PlanId } from './plans';

export type Brief = {
  plan: PlanId | '';
  // Activité
  businessName: string;
  sector: string;
  city: string;
  activity: string;
  services: string;
  audience: string;
  // Site
  pages: string[];
  style: string;
  colors: string;
  inspirations: string;
  logo: string;
  texts: string;
  domain: string;
  domainName: string;
  // Infos affichées sur le site
  phone: string;
  publicEmail: string;
  address: string;
  hours: string;
  socials: string;
  extra: string;
  // Contact client
  name: string;
  email: string;
  contactPhone: string;
  acceptCgv: boolean;
  website: string; // champ piège anti-robots
};

export const EMPTY_BRIEF: Brief = {
  plan: '',
  businessName: '',
  sector: '',
  city: '',
  activity: '',
  services: '',
  audience: '',
  pages: [],
  style: '',
  colors: '',
  inspirations: '',
  logo: '',
  texts: '',
  domain: '',
  domainName: '',
  phone: '',
  publicEmail: '',
  address: '',
  hours: '',
  socials: '',
  extra: '',
  name: '',
  email: '',
  contactPhone: '',
  acceptCgv: false,
  website: '',
};

export const PAGE_OPTIONS = [
  'Accueil',
  'Services / Prestations',
  'À propos',
  'Réalisations / Galerie',
  'Avis clients',
  'Tarifs',
  'Contact',
  'Blog / Actualités',
  'Prise de rendez-vous',
  'Menu / Catalogue',
];

export const STYLE_OPTIONS = [
  'Sobre et professionnel',
  'Moderne et dynamique',
  'Chaleureux et convivial',
  'Élégant et haut de gamme',
  'Naturel et authentique',
  'Je vous laisse choisir',
];

export const LOGO_OPTIONS = ['J\'ai un logo, je vous l\'enverrai', 'Je n\'ai pas de logo (le nom en texte suffit)'];

export const TEXTS_OPTIONS = [
  'J\'ai déjà mes textes',
  'Rédigez les textes pour moi à partir de mon brief',
  'Un mélange des deux',
];

export const DOMAIN_OPTIONS = [
  'Pas de nom de domaine : j\'utilise l\'adresse nom.tommy-studio.pro',
  'J\'ai déjà un nom de domaine',
  'Je voudrais acheter un nom de domaine (guidez-moi)',
];

export const STEP_TITLES = ['Formule', 'Votre activité', 'Votre site', 'Infos pratiques', 'Récapitulatif'];

const SHORT = 200;
const LONG = 3000;

const str = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export function sanitizeBrief(raw: unknown): Brief {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const plan = isPlanId(r.plan) ? r.plan : '';
  const pages = Array.isArray(r.pages)
    ? (r.pages as unknown[]).filter((p): p is string => typeof p === 'string' && PAGE_OPTIONS.includes(p))
    : [];
  return {
    plan,
    businessName: str(r.businessName, SHORT),
    sector: str(r.sector, SHORT),
    city: str(r.city, SHORT),
    activity: str(r.activity, LONG),
    services: str(r.services, LONG),
    audience: str(r.audience, SHORT),
    pages: Array.from(new Set(pages)),
    style: str(r.style, SHORT),
    colors: str(r.colors, SHORT),
    inspirations: str(r.inspirations, 600),
    logo: str(r.logo, SHORT),
    texts: str(r.texts, SHORT),
    domain: str(r.domain, SHORT),
    domainName: str(r.domainName, SHORT),
    phone: str(r.phone, 40),
    publicEmail: str(r.publicEmail, SHORT),
    address: str(r.address, SHORT),
    hours: str(r.hours, 400),
    socials: str(r.socials, 600),
    extra: str(r.extra, LONG),
    name: str(r.name, 100),
    email: str(r.email, SHORT),
    contactPhone: str(r.contactPhone, 40),
    acceptCgv: r.acceptCgv === true,
    website: str(r.website, 200),
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Erreurs de l'étape donnée (0 à 4). Les clés correspondent aux champs du brief. */
export function stepErrors(step: number, b: Brief): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!b.plan) e.plan = 'Choisissez une formule.';
  }
  if (step === 1) {
    if (!b.businessName) e.businessName = 'Indiquez le nom de votre activité.';
    if (!b.sector) e.sector = 'Indiquez votre métier ou secteur.';
    if (!b.city) e.city = 'Indiquez votre ville ou zone d\'intervention.';
    if (b.activity.length < 20) e.activity = 'Décrivez votre activité en quelques phrases (20 caractères minimum).';
  }
  if (step === 2) {
    const max = b.plan ? PLANS[b.plan].maxPages : 10;
    if (b.plan && b.plan !== 'essentiel' && b.pages.length > max) e.pages = `Votre formule inclut ${max} pages maximum.`;
    if (!b.style) e.style = 'Choisissez un style.';
    if (!b.logo) e.logo = 'Précisez pour le logo.';
    if (!b.texts) e.texts = 'Précisez pour les textes.';
    if (!b.domain) e.domain = 'Précisez pour le nom de domaine.';
    if (b.domain === DOMAIN_OPTIONS[1] && !b.domainName) e.domainName = 'Indiquez votre nom de domaine.';
  }
  if (step === 3) {
    if (!b.phone && !b.publicEmail) e.phone = 'Indiquez au moins un téléphone ou un email à afficher.';
    if (b.publicEmail && !EMAIL.test(b.publicEmail)) e.publicEmail = 'Email invalide.';
  }
  if (step === 4) {
    if (!b.name) e.name = 'Indiquez votre nom.';
    if (!b.email) e.email = 'Indiquez votre email.';
    else if (!EMAIL.test(b.email)) e.email = 'Email invalide.';
    if (!b.acceptCgv) e.acceptCgv = 'Vous devez accepter les conditions générales de vente.';
  }
  return e;
}

export function briefErrors(b: Brief): Record<string, string> {
  return [0, 1, 2, 3, 4].reduce((acc, step) => ({ ...acc, ...stepErrors(step, b) }), {} as Record<string, string>);
}
