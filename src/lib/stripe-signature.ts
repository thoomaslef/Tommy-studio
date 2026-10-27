import { createHmac, timingSafeEqual } from 'crypto';

const TOLERANCE_SECONDS = 300;

/** Vérifie l'en-tête Stripe-Signature (t=…,v1=…) : HMAC SHA-256 de « t.corps » */
export function verifySignature(payload: string, header: string | null, secret: string, nowSeconds = Date.now() / 1000) {
  if (!header) return false;
  let timestamp = '';
  const signatures: string[] = [];
  for (const part of header.split(',')) {
    const [key, value] = part.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1' && value) signatures.push(value);
  }
  const t = Number(timestamp);
  if (!t || Math.abs(nowSeconds - t) > TOLERANCE_SECONDS) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex'));
  return signatures.some((s) => {
    const given = Buffer.from(s);
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
