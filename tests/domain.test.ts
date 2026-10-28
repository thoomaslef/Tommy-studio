import { describe, expect, it } from 'vitest';
import { parseDomain } from '@/lib/domain';

describe('parseDomain', () => {
  it('normalise ce que saisit le client', () => {
    expect(parseDomain('Durand-Plomberie.FR')).toEqual({ ok: true, domain: 'durand-plomberie.fr' });
    expect(parseDomain(' https://www.durand-plomberie.fr/contact?x=1 ')).toEqual({ ok: true, domain: 'durand-plomberie.fr' });
    expect(parseDomain('www.martin.com.')).toEqual({ ok: true, domain: 'martin.com' });
  });
  it('refuse ce qui n’est pas un nom de domaine principal', () => {
    for (const bad of ['', '   ', 'durand', '192.168.0.1', 'jean@durand.fr', 'shop.durand.fr', 'durand..fr', '-durand.fr', 'durand.f']) {
      expect(parseDomain(bad).ok).toBe(false);
    }
    expect(parseDomain(42).ok).toBe(false);
    expect(parseDomain(undefined).ok).toBe(false);
  });
  it('refuse nos propres domaines et ceux de Vercel', () => {
    expect(parseDomain('tommy-studio.pro').ok).toBe(false);
    expect(parseDomain('autre.tommy-studio.pro').ok).toBe(false);
    expect(parseDomain('mon-site.vercel.app').ok).toBe(false);
  });
});
