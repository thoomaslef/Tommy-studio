import { describe, expect, it } from 'vitest';
import { DESCRIPTION_MAX, SERVICE_DESCRIPTION_MAX, googleDescription, googleServices, reviewRequestMessage, serviceArea } from '@/lib/google-kit';
import { draftToSiteData } from '@/site-engine/sanitize';
import { TRADE_IDS } from '@/site-engine/trades';

const site = (extra = {}) =>
  draftToSiteData('seed', { trade: 'plombier', businessName: 'Durand Plomberie', city: 'Caen', phone: '06 12 34 56 78', zone: ['Hérouville-Saint-Clair', 'Bayeux'], certifications: ['RGE'], foundedYear: 2012, freeQuote: true, ...extra }, []);

describe('kit Google Business', () => {
  it('rédige une description qui respecte la limite de Google', () => {
    const d = googleDescription(site());
    expect(d.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(d).toContain('Caen');
    expect(d).toContain('Devis gratuit.');
  });
  it('reste sous la limite même avec beaucoup de contenu', () => {
    const many = Array.from({ length: 8 }, (_, i) => ({ title: `Service ${i}`, description: 'x'.repeat(200) }));
    const d = googleDescription(site({ about: 'Une très longue présentation. '.repeat(60), services: many, zone: Array.from({ length: 30 }, (_, i) => `Ville${i}`) }));
    expect(d.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(d.endsWith('.') || d.endsWith('…')).toBe(true);
  });
  it('fonctionne pour tous les métiers', () => {
    for (const trade of TRADE_IDS) expect(googleDescription(site({ trade })).length).toBeGreaterThan(50);
  });
  it('limite les descriptions de services', () => {
    const s = googleServices(site({ services: [{ title: 'Fuites', description: 'y'.repeat(900) }] }));
    expect(s[0].description.length).toBeLessThanOrEqual(SERVICE_DESCRIPTION_MAX);
  });
  it('liste la ville puis la zone, sans doublon ni plus de 20 villes', () => {
    expect(serviceArea(site({ zone: ['caen', 'Bayeux'] }))).toEqual(['Caen', 'caen', 'Bayeux'].filter((v) => v !== 'caen'));
    expect(serviceArea(site({ zone: Array.from({ length: 40 }, (_, i) => `V${i}`) })).length).toBe(20);
  });
  it('prépare le message de demande d’avis avec un emplacement pour le lien', () => {
    expect(reviewRequestMessage(site())).toContain('[collez ici votre lien d’avis]');
  });
});
