import 'server-only';
import { createHmac } from 'crypto';

/** Empreinte de l'adresse IP du visiteur (jamais stockée en clair), pour limiter les abus */
export function clientIpHash(request: Request): string | null {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
  const salt = process.env.TOKEN_ENCRYPTION_KEY;
  if (!ip || !salt) return null;
  return createHmac('sha256', salt).update(ip).digest('hex').slice(0, 32);
}

export const PROJECTS_PER_HOUR = 5;
export const PROJECTS_PER_DAY = 20;
/** Fichiers au plus dans le dossier d'un projet (photos + logo + envois non confirmés) */
export const MAX_FILES_PER_PROJECT = 20;
