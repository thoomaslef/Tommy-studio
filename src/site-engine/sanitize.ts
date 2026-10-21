import { FONT_PAIRS, PALETTES } from './design';
import { isTradeId, TRADES } from './trades';
import type { SiteData, SitePhoto, SiteReview, SiteService, TemplateId } from './types';

export const CERTIFICATIONS = ['RGE', 'Qualibat', 'Qualifelec', 'QualiPAC', 'Qualigaz', 'Handibat', 'Artisan', 'Maître artisan'];

export const MAX_PHOTOS = 12;
export const MAX_SERVICES = 8;
export const MAX_REVIEWS = 6;

/** Brouillon tel que stocké : tout est facultatif, les photos sont à part (table site_assets) */
export type SiteDraft = Partial<Omit<SiteData, 'slug' | 'photos' | 'logoUrl'>>;

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : undefined);
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined);
const TEMPLATES: TemplateId[] = ['classique', 'moderne', 'robuste'];

/** Ne garde que les champs connus, aux bons types et aux bonnes longueurs */
export function sanitizeDraft(raw: unknown): SiteDraft {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const out: SiteDraft = {};

  if (isTradeId(r.trade)) out.trade = r.trade;
  const strings: [keyof SiteDraft, number][] = [
    ['businessName', 80],
    ['ownerName', 80],
    ['tagline', 120],
    ['city', 60],
    ['phone', 30],
    ['email', 120],
    ['address', 160],
    ['hours', 120],
    ['siret', 20],
    ['insurance', 120],
  ];
  for (const [k, max] of strings) {
    const v = str(r[k], max);
    if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  const about = text(r.about, 900);
  if (about !== undefined) out.about = about;

  if (Array.isArray(r.zone)) out.zone = (r.zone as unknown[]).map((z) => str(z, 50)).filter((z): z is string => !!z).slice(0, 15);
  if (typeof r.radiusKm === 'number' && r.radiusKm > 0 && r.radiusKm <= 200) out.radiusKm = Math.round(r.radiusKm);
  else if (r.radiusKm === null) out.radiusKm = undefined;
  const year = Number(r.foundedYear);
  if (Number.isInteger(year) && year >= 1900 && year <= new Date().getFullYear()) out.foundedYear = year;
  else if (r.foundedYear === null || r.foundedYear === '') out.foundedYear = undefined;

  if (Array.isArray(r.certifications))
    out.certifications = (r.certifications as unknown[]).map((c) => str(c, 40)).filter((c): c is string => !!c).slice(0, 6);
  if (typeof r.emergency === 'boolean') out.emergency = r.emergency;
  if (typeof r.freeQuote === 'boolean') out.freeQuote = r.freeQuote;

  if (Array.isArray(r.services))
    out.services = (r.services as unknown[])
      .map((s) => {
        const o = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>;
        const title = str(o.title, 70);
        if (!title) return null;
        const service: SiteService = { title };
        const description = str(o.description, 220);
        const price = str(o.price, 40);
        if (description) service.description = description;
        if (price) service.price = price;
        return service;
      })
      .filter((s): s is SiteService => !!s)
      .slice(0, MAX_SERVICES);

  if (Array.isArray(r.reviews))
    out.reviews = (r.reviews as unknown[])
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
        const author = str(o.author, 50);
        const reviewText = str(o.text, 400);
        if (!author || !reviewText) return null;
        const review: SiteReview = { author, text: reviewText };
        const city = str(o.city, 50);
        const rating = Number(o.rating);
        if (city) review.city = city;
        if (Number.isInteger(rating) && rating >= 1 && rating <= 5) review.rating = rating;
        return review;
      })
      .filter((x): x is SiteReview => !!x)
      .slice(0, MAX_REVIEWS);

  if (r.style && typeof r.style === 'object') {
    const s = r.style as Record<string, unknown>;
    out.style = {
      template: TEMPLATES.includes(s.template as TemplateId) ? (s.template as TemplateId) : 'classique',
      ...(PALETTES.some((p) => p.id === s.palette) ? { palette: s.palette as string } : {}),
      ...(FONT_PAIRS.some((f) => f.id === s.fonts) ? { fonts: s.fonts as string } : {}),
    };
  }
  return out;
}

/** Transforme un brouillon en site complet, avec des valeurs par défaut lisibles pour l'aperçu */
export function draftToSiteData(seed: string, draft: SiteDraft, photos: SitePhoto[], logoUrl?: string): SiteData {
  const trade = isTradeId(draft.trade) ? draft.trade : 'multiservice';
  return {
    slug: seed,
    trade,
    businessName: draft.businessName || 'Votre entreprise',
    ownerName: draft.ownerName,
    tagline: draft.tagline,
    about: draft.about,
    city: draft.city || 'votre ville',
    zone: draft.zone ?? [],
    radiusKm: draft.radiusKm,
    phone: draft.phone || '06 •• •• •• ••',
    email: draft.email,
    address: draft.address,
    hours: draft.hours,
    siret: draft.siret,
    foundedYear: draft.foundedYear,
    certifications: draft.certifications ?? [],
    insurance: draft.insurance,
    services: draft.services?.length ? draft.services : TRADES[trade].services,
    photos,
    logoUrl,
    reviews: draft.reviews ?? [],
    emergency: draft.emergency,
    freeQuote: draft.freeQuote ?? true,
    style: draft.style ?? { template: 'classique' },
  };
}
