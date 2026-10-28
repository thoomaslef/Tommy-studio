/** Adresses IP et noms vers lesquels le client pointe son domaine (valeurs recommandées par Vercel) */
export const DNS_A_VALUE = '216.198.79.1';
export const DNS_CNAME_VALUE = 'cname.vercel-dns.com';
/** Toutes les adresses de Vercel acceptées lors de la vérification (anciennes et nouvelles) */
export const VERCEL_IPS = new Set(['216.198.79.1', '64.29.17.1', '76.76.21.21', '216.198.79.65', '64.29.17.65']);

const DOMAIN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.[a-z]{2,24}$/;
const FORBIDDEN_SUFFIXES = ['tommy-studio.pro', 'vercel.app', 'vercel.com', 'localhost'];

export type DomainParse = { ok: true; domain: string } | { ok: false; error: string };

/**
 * Normalise ce que saisit le client : « https://www.Durand-Plomberie.fr/ » devient « durand-plomberie.fr ».
 * On accepte le domaine principal (deux parties : nom + extension), avec ou sans « www. ».
 */
export function parseDomain(input: unknown): DomainParse {
  if (typeof input !== 'string') return { ok: false, error: 'Indiquez votre nom de domaine.' };
  let d = input.trim().toLowerCase();
  d = d.replace(/^[a-z]+:\/\//, '').replace(/[/?#].*$/, '').replace(/:\d+$/, '').replace(/^www\./, '').replace(/\.$/, '');
  if (!d) return { ok: false, error: 'Indiquez votre nom de domaine.' };
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return { ok: false, error: 'Indiquez un nom de domaine, pas une adresse IP.' };
  if (d.includes('@')) return { ok: false, error: 'Indiquez le nom de domaine, pas une adresse email (ex. durand-plomberie.fr).' };
  if (FORBIDDEN_SUFFIXES.some((s) => d === s || d.endsWith(`.${s}`))) return { ok: false, error: 'Ce nom de domaine ne peut pas être utilisé.' };
  if (!DOMAIN.test(d)) {
    return d.split('.').length > 2
      ? { ok: false, error: 'Indiquez le nom de domaine principal, par exemple durand-plomberie.fr (sans sous-domaine).' }
      : { ok: false, error: 'Ce nom de domaine ne semble pas valide (ex. durand-plomberie.fr).' };
  }
  return { ok: true, domain: d };
}

/** Adresse publique du site : le domaine du client s'il est actif, sinon l'adresse en tommy-studio.pro */
export const customDomainUrl = (domain: string) => `https://${domain}`;
