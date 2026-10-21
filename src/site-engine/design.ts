import { TRADES } from './trades';
import type { SiteData, TemplateId } from './types';

export type Palette = {
  id: string;
  name: string;
  dark: boolean;
  primary: string;
  primaryInk: string;
  accent: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
};

export const PALETTES: Palette[] = [
  { id: 'bleu-chantier', name: 'Bleu chantier', dark: false, primary: '#1d4ed8', primaryInk: '#ffffff', accent: '#f59e0b', bg: '#ffffff', surface: '#f1f5f9', text: '#0f172a', muted: '#475569', border: '#e2e8f0' },
  { id: 'orange-securite', name: 'Orange sécurité', dark: false, primary: '#c2410c', primaryInk: '#ffffff', accent: '#1f2937', bg: '#fffaf5', surface: '#ffefe2', text: '#1c1917', muted: '#57534e', border: '#fbd5b5' },
  { id: 'vert-ardoise', name: 'Vert ardoise', dark: false, primary: '#166534', primaryInk: '#ffffff', accent: '#ca8a04', bg: '#f7faf7', surface: '#e9f2ea', text: '#14231a', muted: '#4b5a50', border: '#d2e2d4' },
  { id: 'brique', name: 'Brique', dark: false, primary: '#9a3412', primaryInk: '#ffffff', accent: '#d97706', bg: '#fdf8f3', surface: '#f5e9dd', text: '#2b1b12', muted: '#6b5446', border: '#e8d3bf' },
  { id: 'anthracite-jaune', name: 'Anthracite et jaune', dark: true, primary: '#facc15', primaryInk: '#111111', accent: '#facc15', bg: '#111214', surface: '#1b1d21', text: '#f5f5f4', muted: '#a8a29e', border: '#2c2f35' },
  { id: 'nuit-cuivre', name: 'Nuit et cuivre', dark: true, primary: '#e09a3e', primaryInk: '#0b1120', accent: '#fbbf24', bg: '#0b1120', surface: '#131c31', text: '#e2e8f0', muted: '#94a3b8', border: '#1e293b' },
  { id: 'bleu-eau', name: 'Bleu eau', dark: false, primary: '#0369a1', primaryInk: '#ffffff', accent: '#0891b2', bg: '#f8fcff', surface: '#e6f2fa', text: '#0c2233', muted: '#47657a', border: '#cde3f1' },
  { id: 'rouge-tuile', name: 'Rouge tuile', dark: false, primary: '#b91c1c', primaryInk: '#ffffff', accent: '#92400e', bg: '#ffffff', surface: '#fbf0ec', text: '#1f1513', muted: '#6b5752', border: '#efd9d2' },
  { id: 'sable-olive', name: 'Sable et olive', dark: false, primary: '#556b2f', primaryInk: '#ffffff', accent: '#b7791f', bg: '#fbf8f1', surface: '#f1eadb', text: '#232619', muted: '#5e604f', border: '#e2d9c3' },
  { id: 'beton-corail', name: 'Béton et corail', dark: false, primary: '#d9482b', primaryInk: '#ffffff', accent: '#334155', bg: '#f5f5f4', surface: '#e7e5e4', text: '#1c1917', muted: '#57534e', border: '#d6d3d1' },
  { id: 'electrique', name: 'Indigo électrique', dark: false, primary: '#4338ca', primaryInk: '#ffffff', accent: '#eab308', bg: '#ffffff', surface: '#f3f3ff', text: '#111133', muted: '#55557a', border: '#dedef5' },
  { id: 'foret-sombre', name: 'Forêt sombre', dark: true, primary: '#a3e635', primaryInk: '#0a0f0a', accent: '#a3e635', bg: '#0d1410', surface: '#152019', text: '#ecf5ee', muted: '#9fb3a6', border: '#22322a' },
];

export type FontPair = { id: string; name: string; heading: string; body: string; upper: boolean; headingWeight: number };

export const FONT_PAIRS: FontPair[] = [
  { id: 'solide', name: 'Solide', heading: 'var(--sf-oswald)', body: 'var(--sf-barlow)', upper: true, headingWeight: 600 },
  { id: 'atelier', name: 'Atelier', heading: 'var(--sf-barlow-condensed)', body: 'var(--sf-manrope)', upper: true, headingWeight: 700 },
  { id: 'moderne', name: 'Moderne', heading: 'var(--sf-space-grotesk)', body: 'var(--sf-dm-sans)', upper: false, headingWeight: 700 },
  { id: 'artisan', name: 'Artisan', heading: 'var(--sf-fraunces)', body: 'var(--sf-manrope)', upper: false, headingWeight: 650 },
  { id: 'net', name: 'Net', heading: 'var(--sf-archivo)', body: 'var(--sf-archivo)', upper: false, headingWeight: 800 },
  { id: 'franc', name: 'Franc', heading: 'var(--sf-bricolage)', body: 'var(--sf-rubik)', upper: false, headingWeight: 750 },
];

/** Polices adaptées à chaque modèle, pour garder une cohérence de style */
const TEMPLATE_FONTS: Record<TemplateId, string[]> = {
  classique: ['artisan', 'net', 'moderne', 'franc'],
  moderne: ['moderne', 'franc', 'net', 'atelier'],
  robuste: ['solide', 'atelier', 'net'],
};

export type Design = {
  template: TemplateId;
  palette: Palette;
  fonts: FontPair;
  radius: string;
  heroVariant: 0 | 1 | 2;
  servicesVariant: 0 | 1;
  galleryVariant: 0 | 1;
  buttonStyle: 'solid' | 'pill';
  /** Ordre des sections intermédiaires, propre à chaque site */
  middleOrder: ('services' | 'gallery' | 'reviews' | 'why')[];
  tagline: string;
  about: string;
};

/** Hachage FNV-1a : même entreprise, même tirage, à chaque affichage */
export function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const pick = <T,>(items: T[], seed: string, salt: string): T => items[hash(`${seed}:${salt}`) % items.length];

const fill = (text: string, d: SiteData) =>
  text.replace(/\{city\}/g, d.city).replace(/\{name\}/g, d.businessName);

export function resolveDesign(data: SiteData): Design {
  const seed = data.slug || data.businessName;
  const trade = TRADES[data.trade];
  const template = data.style.template;

  const palette =
    PALETTES.find((p) => p.id === data.style.palette) ??
    PALETTES.find((p) => p.id === pick(trade.palettes, seed, 'palette')) ??
    PALETTES[0];

  const fonts =
    FONT_PAIRS.find((f) => f.id === data.style.fonts) ??
    FONT_PAIRS.find((f) => f.id === pick(TEMPLATE_FONTS[template], seed, 'fonts')) ??
    FONT_PAIRS[0];

  const radius =
    template === 'robuste' ? pick(['0px', '2px', '6px'], seed, 'radius') : pick(['6px', '12px', '20px'], seed, 'radius');

  const middle: Design['middleOrder'] = ['services', 'why', 'gallery', 'reviews'];
  const orders: Design['middleOrder'][] = [
    middle,
    ['services', 'gallery', 'why', 'reviews'],
    ['services', 'reviews', 'gallery', 'why'],
    ['why', 'services', 'gallery', 'reviews'],
  ];

  return {
    template,
    palette,
    fonts,
    radius,
    heroVariant: (hash(`${seed}:hero`) % 3) as 0 | 1 | 2,
    servicesVariant: (hash(`${seed}:services`) % 2) as 0 | 1,
    galleryVariant: (hash(`${seed}:gallery`) % 2) as 0 | 1,
    buttonStyle: pick(['solid', 'pill'] as const, seed, 'button'),
    middleOrder: pick(orders, seed, 'order'),
    tagline: data.tagline?.trim() || fill(pick(trade.taglines, seed, 'tagline'), data),
    about: data.about?.trim() || fill(pick(trade.abouts, seed, 'about'), data),
  };
}

/** Variables CSS appliquées à la racine du site */
export function designVars(d: Design): Record<string, string> {
  const p = d.palette;
  return {
    '--s-primary': p.primary,
    '--s-primary-ink': p.primaryInk,
    '--s-accent': p.accent,
    '--s-bg': p.bg,
    '--s-surface': p.surface,
    '--s-text': p.text,
    '--s-muted': p.muted,
    '--s-border': p.border,
    '--s-radius': d.radius,
    '--s-btn-radius': d.buttonStyle === 'pill' ? '999px' : d.radius,
    '--s-font-heading': d.fonts.heading,
    '--s-font-body': d.fonts.body,
    '--s-heading-weight': String(d.fonts.headingWeight),
    '--s-heading-transform': d.fonts.upper ? 'uppercase' : 'none',
    '--s-heading-tracking': d.fonts.upper ? '0.01em' : '-0.02em',
  };
}
