import { createHmac } from 'crypto';
import { describe, expect, it } from 'vitest';
import { verifySignature } from '@/lib/stripe-signature';

const SECRET = 'whsec_test';
const payload = JSON.stringify({ type: 'checkout.session.completed' });
const sign = (t: number, secret = SECRET) => createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex');
const now = 1_800_000_000;

describe('verifySignature', () => {
  it('accepte une signature Stripe valide', () => {
    expect(verifySignature(payload, `t=${now},v1=${sign(now)}`, SECRET, now)).toBe(true);
  });
  it('accepte si une des signatures v1 est bonne (rotation de secret)', () => {
    expect(verifySignature(payload, `t=${now},v1=${sign(now, 'ancien')},v1=${sign(now)}`, SECRET, now)).toBe(true);
  });
  it('refuse un mauvais secret, un corps modifié ou un en-tête absent', () => {
    expect(verifySignature(payload, `t=${now},v1=${sign(now, 'autre')}`, SECRET, now)).toBe(false);
    expect(verifySignature(payload + ' ', `t=${now},v1=${sign(now)}`, SECRET, now)).toBe(false);
    expect(verifySignature(payload, null, SECRET, now)).toBe(false);
  });
  it('refuse un événement trop ancien (rejeu)', () => {
    expect(verifySignature(payload, `t=${now - 600},v1=${sign(now - 600)}`, SECRET, now)).toBe(false);
  });
});
