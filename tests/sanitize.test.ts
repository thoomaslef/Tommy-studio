import { describe, expect, it } from 'vitest';
import { MAX_SERVICES, draftToSiteData, sanitizeDraft } from '@/site-engine/sanitize';
import { isTradeId } from '@/site-engine/trades';

describe('sanitizeDraft', () => {
  it('ignore les champs inconnus et les types inattendus', () => {
    const d = sanitizeDraft({ businessName: 'Durand', hacker: 'x', phone: 42, trade: 'plombier' });
    expect(d.businessName).toBe('Durand');
    expect('hacker' in d).toBe(false);
    expect(d.phone).toBeUndefined();
  });
  it('refuse un métier inexistant, même un nom de propriété JavaScript', () => {
    expect(sanitizeDraft({ trade: 'constructor' }).trade).toBeUndefined();
    expect(isTradeId('toString')).toBe(false);
    expect(isTradeId('plombier')).toBe(true);
  });
  it('limite le nombre de services et la longueur des textes', () => {
    const services = Array.from({ length: 20 }, (_, i) => ({ title: `Service ${i}`, description: 'x'.repeat(5000) }));
    const d = sanitizeDraft({ services, businessName: 'a'.repeat(1000) });
    expect(d.services!.length).toBeLessThanOrEqual(MAX_SERVICES);
    expect(d.businessName!.length).toBeLessThan(200);
    expect(d.services![0].description!.length).toBeLessThan(1000);
  });
});

describe('draftToSiteData', () => {
  it('remplit les valeurs par défaut d’un brouillon vide', () => {
    const site = draftToSiteData('seed', {}, []);
    expect(site.businessName).toBe('Votre entreprise');
    expect(site.trade).toBe('multiservice');
    expect(site.slug).toBe('seed');
  });
});
