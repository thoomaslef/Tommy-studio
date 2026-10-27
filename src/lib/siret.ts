/** SIRET : 14 chiffres, clé de Luhn (sauf La Poste, SIREN 356000000, où la somme des chiffres est un multiple de 5) */
export const siretDigits = (value: string) => value.replace(/\D/g, '');

export function isValidSiret(value: string | undefined) {
  const digits = siretDigits(value ?? '');
  if (!/^\d{14}$/.test(digits)) return false;
  if (digits.startsWith('356000000')) return [...digits].reduce((sum, d) => sum + Number(d), 0) % 5 === 0;
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let n = Number(digits[13 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}
