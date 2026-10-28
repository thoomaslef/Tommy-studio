import { resolveDesign } from '@/site-engine/design';
import type { SiteData, TradeId } from '@/site-engine/types';

/**
 * Textes prêts à coller dans la fiche Google Business Profile, rédigés à partir du site du client.
 * Google propose la liste exacte des catégories quand on tape : on indique donc des mots à taper, pas des libellés figés.
 */
export const CATEGORY_HINTS: Record<TradeId, { search: string; alternatives: string[] }> = {
  plombier: { search: 'plombier', alternatives: [] },
  electricien: { search: 'électricien', alternatives: [] },
  chauffagiste: { search: 'chauffagiste', alternatives: ['installateur de chauffage'] },
  macon: { search: 'maçon', alternatives: ['entreprise de maçonnerie'] },
  couvreur: { search: 'couvreur', alternatives: ['entreprise de toiture', 'couverture'] },
  menuisier: { search: 'menuisier', alternatives: [] },
  peintre: { search: 'peintre en bâtiment', alternatives: ['entrepreneur en peinture'] },
  carreleur: { search: 'carreleur', alternatives: ['entreprise de carrelage'] },
  plaquiste: { search: 'plaquiste', alternatives: ['entrepreneur de plâtrerie', 'plâtrier'] },
  paysagiste: { search: 'paysagiste', alternatives: ['entrepreneur paysagiste'] },
  multiservice: { search: 'entreprise de rénovation', alternatives: ['entrepreneur général', 'artisan du bâtiment'] },
};

export const DESCRIPTION_MAX = 750;
export const SERVICE_DESCRIPTION_MAX = 300;

const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}` : (items[0] ?? ''));

/** Coupe proprement : jamais au milieu d'une phrase si on peut l'éviter */
function fit(sentences: string[], max: number) {
  let out = '';
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
  }
  return out || sentences[0].slice(0, max - 1) + '…';
}

export function googleDescription(data: SiteData): string {
  const design = resolveDesign(data);
  const zone = data.zone.length ? list(data.zone.slice(0, 6)) : '';
  const sentences = [
    design.about.replace(/\s+/g, ' ').trim(),
    zone ? `Nous intervenons à ${data.city}, ${zone} et dans les environs.` : data.radiusKm ? `Nous intervenons à ${data.city} et dans un rayon de ${data.radiusKm} km.` : `Nous intervenons à ${data.city} et dans les environs.`,
    data.services.length ? `Nos prestations : ${list(data.services.slice(0, 6).map((s) => s.title.toLowerCase()))}.` : '',
    data.freeQuote !== false ? 'Devis gratuit.' : '',
    data.emergency ? 'Intervention en urgence possible.' : '',
    data.certifications.length ? `Qualifications : ${list(data.certifications)}.` : '',
    data.insurance ? `${data.insurance.replace(/\.$/, '')}.` : '',
    data.foundedYear ? `Entreprise créée en ${data.foundedYear}.` : '',
  ].filter(Boolean);
  return fit(sentences, DESCRIPTION_MAX);
}

export function googleServices(data: SiteData) {
  return data.services.map((s) => ({
    name: s.title,
    description: (s.description ?? '').slice(0, SERVICE_DESCRIPTION_MAX),
    price: s.price,
  }));
}

export function serviceArea(data: SiteData): string[] {
  if (data.zone.length) return [data.city, ...data.zone.filter((z) => z.toLowerCase() !== data.city.toLowerCase())].slice(0, 20);
  return [data.city];
}

export const reviewRequestMessage = (data: SiteData) =>
  `Bonjour, merci de m’avoir fait confiance pour vos travaux. Si vous êtes satisfait, un petit avis sur Google m’aiderait beaucoup, ça prend 1 minute : [collez ici votre lien d’avis] Merci ! ${data.ownerName ? `${data.ownerName} — ` : ''}${data.businessName}`;
