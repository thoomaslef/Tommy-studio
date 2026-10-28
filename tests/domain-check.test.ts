import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkDns, checkServing } from '@/lib/domain-check';

const dns = (records: Record<string, { type: number; data: string }[]>) =>
  vi.stubGlobal('fetch', async (url: string) => {
    const name = new URL(url).searchParams.get('name')!;
    const type = new URL(url).searchParams.get('type')!;
    const answers = (records[`${name}|${type}`] ?? []);
    return { ok: true, json: async () => ({ Answer: answers }) };
  });

afterEach(() => vi.unstubAllGlobals());

describe('checkDns', () => {
  it('reconnaît un domaine pointé vers Vercel (A et CNAME)', async () => {
    dns({ 'durand.fr|A': [{ type: 1, data: '216.198.79.1' }], 'www.durand.fr|CNAME': [{ type: 5, data: 'cname.vercel-dns.com.' }] });
    expect(await checkDns('durand.fr')).toMatchObject({ apex: 'ok', www: 'ok' });
  });
  it('accepte l’ancienne adresse de Vercel et les CNAME propres à un projet', async () => {
    dns({ 'durand.fr|A': [{ type: 1, data: '76.76.21.21' }], 'www.durand.fr|CNAME': [{ type: 5, data: '22b4616c5b78cd7b.vercel-dns-017.com.' }] });
    expect(await checkDns('durand.fr')).toMatchObject({ apex: 'ok', www: 'ok' });
  });
  it('distingue « rien » de « pointe ailleurs »', async () => {
    dns({ 'durand.fr|A': [{ type: 1, data: '51.38.10.10' }] });
    expect(await checkDns('durand.fr')).toMatchObject({ apex: 'other', www: 'missing' });
  });
  it('ne plante pas si la résolution échoue', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new Error('réseau');
    });
    expect(await checkDns('durand.fr')).toMatchObject({ apex: 'missing', www: 'missing' });
  });
});

describe('checkServing', () => {
  it('vérifie que la page porte la balise du bon site', async () => {
    vi.stubGlobal('fetch', async () => ({ ok: true, text: async () => '<meta name="ts-site" content="durand-plomberie"/>' }));
    expect(await checkServing('durand.fr', 'durand-plomberie')).toBe(true);
    expect(await checkServing('durand.fr', 'autre-site')).toBe(false);
  });
  it('refuse une erreur HTTP ou une panne', async () => {
    vi.stubGlobal('fetch', async () => ({ ok: false, text: async () => '' }));
    expect(await checkServing('durand.fr', 'x')).toBe(false);
    vi.stubGlobal('fetch', async () => {
      throw new Error('timeout');
    });
    expect(await checkServing('durand.fr', 'x')).toBe(false);
  });
});
