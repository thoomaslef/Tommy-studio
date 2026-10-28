import { describe, expect, it } from 'vitest';
import { stats } from '@/site-engine/content';
import { draftToSiteData } from '@/site-engine/sanitize';

const site = (reviews: { author: string; text: string; rating?: number }[]) =>
  draftToSiteData('seed', { trade: 'plombier', businessName: 'Durand', city: 'Caen', phone: '06 12 34 56 78', reviews }, []);

describe('chiffres affichés sur les sites', () => {
  it('n’affiche pas de note moyenne pour un ou deux avis', () => {
    expect(stats(site([{ author: 'A', text: 'Bien', rating: 5 }])).some((s) => s.label.includes('note moyenne'))).toBe(false);
  });
  it('affiche la note moyenne à partir de trois avis', () => {
    const out = stats(site([5, 5, 4].map((rating, i) => ({ author: `A${i}`, text: 'Bien', rating }))));
    const note = out.find((s) => s.label.includes('note moyenne'));
    expect(note?.value).toBe('4,7');
    expect(note?.label).toContain('3 avis');
  });
});
