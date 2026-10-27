import { randomBytes } from 'crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { decryptToken, encryptToken } from '@/lib/token-crypto';

describe('chiffrement du lien privé', () => {
  afterEach(() => {
    delete process.env.TOKEN_ENCRYPTION_KEY;
  });
  it('retrouve le lien après chiffrement', () => {
    process.env.TOKEN_ENCRYPTION_KEY = randomBytes(32).toString('base64');
    const enc = encryptToken('mon-lien-prive-123')!;
    expect(enc).not.toContain('mon-lien');
    expect(decryptToken(enc)).toBe('mon-lien-prive-123');
  });
  it('refuse un chiffré modifié ou une autre clé', () => {
    process.env.TOKEN_ENCRYPTION_KEY = randomBytes(32).toString('base64');
    const enc = encryptToken('abc')!;
    const [iv, tag, data] = enc.split('.');
    expect(decryptToken(`${iv}.${tag}.${data.slice(0, -2)}AA`)).toBeNull();
    process.env.TOKEN_ENCRYPTION_KEY = randomBytes(32).toString('base64');
    expect(decryptToken(enc)).toBeNull();
  });
  it('ne fait rien sans clé configurée', () => {
    expect(encryptToken('abc')).toBeNull();
    expect(decryptToken('a.b.c')).toBeNull();
  });
});
