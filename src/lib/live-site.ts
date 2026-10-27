/**
 * Adresse publique des sites clients : <slug>.tommy-studio.pro (DNS chez Vercel, sous-domaine générique).
 * Avec SUBDOMAINS_ENABLED à false, les sites restent servis sur www.tommy-studio.pro/s/<slug>.
 */
export const SITES_DOMAIN = 'tommy-studio.pro';
export const SUBDOMAINS_ENABLED = true;

export const liveSiteUrl = (slug: string) =>
  SUBDOMAINS_ENABLED ? `https://${slug}.${SITES_DOMAIN}` : `https://www.${SITES_DOMAIN}/s/${slug}`;

/** Sous-domaines réservés au studio, jamais attribués à un client */
export const RESERVED_SLUGS = new Set(['www', 'api', 'admin', 'app', 'mail', 'smtp', 'webmail', 'ftp', 'blog', 'shop', 'boutique', 'studio', 'demo', 'apercu', 'creer', 'support', 'aide', 'contact']);

export const SLUG_FORMAT = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' et ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '');
}
