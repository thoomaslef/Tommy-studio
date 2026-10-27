import { describe, expect, it } from 'vitest';
import { SLUG_FORMAT, liveSiteUrl, slugify } from '@/lib/live-site';

describe('slugify', () => {
  it('produit une adresse lisible sans accents', () => {
    expect(slugify('Plomberie Écluse & Fils')).toBe('plomberie-ecluse-et-fils');
    expect(slugify('  --Maçonnerie  Petit-- ')).toBe('maconnerie-petit');
  });
  it('limite la longueur et reste un sous-domaine valide', () => {
    const slug = slugify('Entreprise générale de rénovation et de construction de maisons individuelles');
    expect(slug.length).toBeLessThanOrEqual(40);
    expect(SLUG_FORMAT.test(slug)).toBe(true);
  });
  it('construit l’adresse du site', () => {
    expect(liveSiteUrl('durand-plomberie')).toBe('https://durand-plomberie.tommy-studio.pro');
  });
});
