import { zipSync } from 'fflate';

/**
 * Export du site : on part de la page /export/<id> rendue par le serveur, puis on la rend autonome
 * (HTML + CSS + polices + images dans un seul dossier, sans JavaScript ni serveur).
 */

const MEDIA = /https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/site-media\/[A-Za-z0-9\-_/.]+\.(?:jpg|jpeg|png|webp)/g;

/** Familles de polices réellement utilisées par le site (variables --s-font-heading / --s-font-body) */
export function usedFontFamilies(html: string, css: string): Set<string> {
  const used = new Set<string>();
  const vars = [...html.matchAll(/--s-font-(?:heading|body):var\((--[\w-]+)\)/g)].map((m) => m[1]);
  for (const v of vars) {
    const def = css.match(new RegExp(`${v.replace(/[-]/g, '\\-')}:\\s*"([^"]+)"`));
    if (def) used.add(def[1].toLowerCase());
  }
  return used;
}

/** Ne garde que les @font-face des polices utilisées (et leur variante de secours) */
export function keepUsedFonts(css: string, used: Set<string>): string {
  return css.replace(/@font-face\s*\{[^}]*\}/g, (face) => {
    const family = face.match(/font-family:\s*"?([^;"}]+)"?/)?.[1]?.trim().toLowerCase() ?? '';
    const base = family.replace(/ fallback$/, '');
    return used.has(base) ? face : '';
  });
}

const FONT_URL = /url\((\.\.\/media\/([^)?]+\.woff2)[^)]*)\)/g;

/**
 * Adresse complète de chaque police, calculée depuis la feuille de style qui la déclare : l'emplacement
 * des fichiers change d'une version de Next à l'autre (/_next/static/media ou /_next/static/immutable/media).
 */
export function fontUrlMap(sheets: { url: string; text: string }[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const sheet of sheets) for (const m of sheet.text.matchAll(FONT_URL)) map.set(m[2], new URL(m[1].replace(/\?.*$/, ''), sheet.url).toString());
  return map;
}

export const usedFontNames = (css: string) => [...new Set([...css.matchAll(FONT_URL)].map((m) => m[2]))];

/** Les polices sont jointes dans le dossier fonts/ */
export const rewriteFontUrls = (css: string) => css.replace(FONT_URL, 'url(fonts/$2)');

/** Réécrit le HTML pour qu'il fonctionne hors ligne ; renvoie aussi la liste des fichiers à joindre */
export function transformExportHtml(html: string): { html: string; images: string[] } {
  let out = html;
  // Scripts de Next (hors données structurées), préchargements, métadonnées liées à notre serveur
  out = out.replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, '');
  out = out.replace(/<link\b[^>]*rel="(?:preload|modulepreload|icon)"[^>]*\/?>/g, '');
  out = out.replace(/<meta\b[^>]*name="next-size-adjust"[^>]*\/?>/g, '');
  out = out.replace(/<meta\b[^>]*(?:property="og:(?:image|url)"|name="twitter:image")[^>]*\/?>/g, '');
  // Feuilles de style : une seule, style.css
  let first = true;
  out = out.replace(/<link\b[^>]*rel="stylesheet"[^>]*\/?>/g, () => {
    if (!first) return '';
    first = false;
    return '<link rel="stylesheet" href="style.css"/>';
  });
  // Données structurées : sans images (elles pointeraient vers notre stockage)
  out = out.replace(/(<script[^>]*application\/ld\+json[^>]*>)([\s\S]*?)(<\/script>)/g, (_m, open, json, close) => {
    try {
      const data = JSON.parse(json);
      delete data.image;
      delete data.logo;
      return `${open}${JSON.stringify(data).replace(/</g, '\\u003c')}${close}`;
    } catch {
      return '';
    }
  });
  // Images : copiées dans images/
  const found = [...new Set(out.match(MEDIA) ?? [])];
  const names = new Map(found.map((url, i) => [url, `images/${String(i + 1).padStart(2, '0')}-${url.split('/').pop()}`]));
  out = out.replace(MEDIA, (url) => names.get(url)!);
  return { html: out, images: found };
}

const LISEZ_MOI = (name: string, date: string, email: string, phone: string) => `VOTRE SITE — ${name}
Copie de votre site réalisée le ${date} avec Tommy Studio.

CE QUE CONTIENT CE DOSSIER
- index.html : votre site (une seule page)
- style.css, dossiers fonts et images : ce qui permet de l'afficher

POUR L'ESSAYER SUR VOTRE ORDINATEUR
Double-cliquez sur index.html : il s'ouvre dans votre navigateur.

COMMENT LE METTRE EN LIGNE
1. Avec un hébergeur classique (OVH, o2switch, IONOS…) : envoyez tous les fichiers et dossiers à la racine de
   votre hébergement (dossier « www » ou « public_html »), avec le gestionnaire de fichiers de l'hébergeur ou un
   logiciel FTP. Le fichier index.html doit se trouver à la racine, pas dans un sous-dossier.
2. Gratuitement : glissez-déposez ce dossier sur Netlify Drop (app.netlify.com/drop) ou sur Cloudflare Pages.
3. Branchez ensuite votre nom de domaine en suivant les instructions de l'hébergeur choisi.

CE QUI CHANGE PAR RAPPORT À VOTRE SITE TOMMY STUDIO
- Le formulaire de devis est remplacé par un bouton « Envoyer un email » et un bouton d'appel.
- Vous ne pouvez plus modifier votre site avec l'outil Tommy Studio. Pour changer un texte, ouvrez index.html
  avec un éditeur de texte, ou demandez-moi.
- Le certificat HTTPS, le renouvellement du nom de domaine et les sauvegardes sont à votre charge chez votre hébergeur.
- Votre site en ligne chez Tommy Studio reste actif tant que son hébergement est renouvelé.

VOS DROITS
Vos textes, vos photos et votre logo vous appartiennent. La mise en page est la propriété de Tommy Studio : vous
pouvez l'utiliser pour ce site, sans limite de durée, mais pas la revendre ni la réutiliser pour d'autres sites.

Une question ? ${email} — ${phone}
`;

export type ZipInput = {
  html: string;
  css: string;
  fonts: { name: string; data: Uint8Array }[];
  images: { name: string; data: Uint8Array }[];
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  now?: Date;
};

export function buildZip({ html, css, fonts, images, businessName, contactEmail, contactPhone, now = new Date() }: ZipInput): Uint8Array {
  const text = (s: string) => new TextEncoder().encode(s);
  const files: Record<string, Uint8Array | [Uint8Array, { level: 0 }]> = {
    'index.html': text(html),
    'style.css': text(css),
    'LISEZ-MOI.txt': text(LISEZ_MOI(businessName, now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), contactEmail, contactPhone)),
  };
  // Polices et photos sont déjà compressées : on les stocke telles quelles
  for (const f of fonts) files[`fonts/${f.name}`] = [f.data, { level: 0 }];
  for (const i of images) files[i.name] = [i.data, { level: 0 }];
  return zipSync(files, { level: 6 });
}
