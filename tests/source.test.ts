import { describe, expect, it } from 'vitest';
import { describeSource, sanitizeSource, sourceFromSearch, summarizeSources } from '@/lib/source';

describe('sanitizeSource', () => {
  it('garde des mots simples en minuscules', () => {
    expect(sanitizeSource({ source: ' Prospector ', medium: 'Email', campaign: 'plombiers-caen' })).toEqual({ source: 'prospector', medium: 'email', campaign: 'plombiers-caen' });
  });
  it('ignore ce qui est inconnu, trop long ou mal formé', () => {
    expect(sanitizeSource(null)).toBeNull();
    expect(sanitizeSource({})).toBeNull();
    expect(sanitizeSource({ source: '<script>' })).toBeNull();
    expect(sanitizeSource({ source: 'a'.repeat(41) })).toBeNull();
    expect(sanitizeSource({ source: 'prospector', medium: 'a b', campaign: 42 })).toEqual({ source: 'prospector' });
  });
});

describe('sourceFromSearch', () => {
  it('lit les paramètres utm', () => {
    expect(sourceFromSearch('?utm_source=prospector&utm_medium=email&x=1')).toEqual({ source: 'prospector', medium: 'email' });
    expect(sourceFromSearch('?foo=bar')).toBeNull();
    expect(sourceFromSearch('')).toBeNull();
  });
  it('décrit une origine', () => {
    expect(describeSource({ source: 'prospector', medium: 'email' })).toBe('prospector / email');
  });
});

describe('summarizeSources', () => {
  const now = Date.parse('2026-11-01T00:00:00Z');
  it('compte par origine, ignore les projets trop anciens et regroupe les accès directs', () => {
    const rows = summarizeSources(
      [
        { source: { source: 'prospector' }, created_at: '2026-10-30T10:00:00Z', paid_at: '2026-10-31T10:00:00Z' },
        { source: { source: 'prospector' }, created_at: '2026-10-30T11:00:00Z', paid_at: null },
        { source: null, created_at: '2026-10-29T11:00:00Z', paid_at: null },
        { source: { source: 'prospector' }, created_at: '2026-01-01T00:00:00Z', paid_at: '2026-01-02T00:00:00Z' },
      ],
      now,
    );
    expect(rows).toEqual([
      { label: 'prospector', created: 2, paid: 1 },
      { label: 'direct / inconnu', created: 1, paid: 0 },
    ]);
  });
});
