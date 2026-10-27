import 'server-only';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Le lien privé n'est stocké qu'en empreinte (sha256) pour l'authentification ;
 * une copie chiffrée permet de le renvoyer au client par email (après paiement, ou s'il l'a perdu).
 */
function key() {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) return null;
  const buf = Buffer.from(raw, 'base64');
  return buf.length === 32 ? buf : null;
}

export function encryptToken(token: string): string | null {
  const k = key();
  if (!k) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', k, iv);
  const data = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString('base64url')).join('.');
}

export function decryptToken(value: string | null | undefined): string | null {
  const k = key();
  if (!k || !value) return null;
  try {
    const [iv, tag, data] = value.split('.').map((p) => Buffer.from(p, 'base64url'));
    const decipher = createDecipheriv('aes-256-gcm', k, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
