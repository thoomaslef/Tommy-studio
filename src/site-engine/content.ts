import type { AnyIcon } from './icons';
import { yearsOfExperience } from './parts';
import type { SiteData } from './types';

export type Point = { icon: AnyIcon; title: string; text: string };

/** Points forts, construits uniquement à partir des informations réelles du client */
export function whyPoints(d: SiteData): Point[] {
  const years = yearsOfExperience(d);
  const points: Point[] = [];
  if (d.freeQuote !== false) points.push({ icon: 'check', title: 'Devis gratuit', text: 'Un devis clair et détaillé, sans engagement.' });
  if (d.insurance) points.push({ icon: 'shield', title: 'Travaux assurés', text: `${d.insurance} : vos travaux sont couverts.` });
  if (d.emergency) points.push({ icon: 'clock', title: 'Intervention rapide', text: `Disponible pour les urgences à ${d.city} et alentour.` });
  if (years) points.push({ icon: 'award', title: `${years} an${years > 1 ? 's' : ''} d’expérience`, text: 'Un savoir-faire éprouvé, chantier après chantier.' });
  points.push({ icon: 'pin', title: 'Artisan local', text: `Basé à ${d.city}, proche de vous et facile à joindre.` });
  points.push({ icon: 'star', title: 'Travail soigné', text: 'Chantier protégé, nettoyé, finitions vérifiées avec vous.' });
  return points.slice(0, 4);
}

export type Stat = { value: string; label: string };

/** Chiffres clés : uniquement ceux qu'on peut calculer, jamais inventés */
export function stats(d: SiteData): Stat[] {
  const out: Stat[] = [];
  const years = yearsOfExperience(d);
  if (years) out.push({ value: `${years}`, label: years > 1 ? 'ans d’expérience' : 'an d’expérience' });
  if (d.radiusKm) out.push({ value: `${d.radiusKm} km`, label: 'de rayon d’intervention' });
  else if (d.zone.length > 1) out.push({ value: `${d.zone.length}`, label: 'communes desservies' });
  const rated = d.reviews.filter((r) => r.rating);
  // Une note affichée sur un ou deux avis dessert plus qu'elle ne sert : à partir de 3 avis
  if (rated.length >= 3) {
    const avg = rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length;
    out.push({ value: avg.toFixed(1).replace('.', ','), label: `note moyenne (${rated.length} avis)` });
  }
  if (d.certifications.length) out.push({ value: d.certifications[0], label: 'certification' });
  return out.slice(0, 4);
}

export const navItems = (d: SiteData) =>
  [
    { href: '#services', label: 'Services' },
    d.photos.length >= 3 ? { href: '#realisations', label: 'Réalisations' } : null,
    d.reviews.length ? { href: '#avis', label: 'Avis' } : null,
    { href: '#contact', label: 'Contact' },
  ].filter(Boolean) as { href: string; label: string }[];
