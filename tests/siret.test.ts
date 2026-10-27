import { describe, expect, it } from 'vitest';
import { isValidSiret, siretDigits } from '@/lib/siret';

describe('isValidSiret', () => {
  it('accepte un SIRET valide, avec ou sans espaces', () => {
    expect(isValidSiret('101 082 337 00011')).toBe(true);
    expect(isValidSiret('73282932000074')).toBe(true);
  });
  it('refuse une faute de frappe, une longueur fausse ou un champ vide', () => {
    expect(isValidSiret('101 082 337 00012')).toBe(false);
    expect(isValidSiret('1010823370001')).toBe(false);
    expect(isValidSiret('')).toBe(false);
    expect(isValidSiret(undefined)).toBe(false);
  });
  it('applique la règle particulière de La Poste', () => {
    expect(isValidSiret('35600000000048')).toBe(false);
    expect(isValidSiret('35600000049837')).toBe(true);
  });
  it('ne garde que les chiffres', () => {
    expect(siretDigits('101-082 337.00011')).toBe('10108233700011');
  });
});
