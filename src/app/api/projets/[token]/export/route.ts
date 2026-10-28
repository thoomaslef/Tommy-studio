import { buildZip, fontUrlMap, keepUsedFonts, rewriteFontUrls, transformExportHtml, usedFontFamilies, usedFontNames } from '@/lib/site-export';
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/contact';
import { json, loadProject } from '@/lib/projects-api';

export const maxDuration = 30;

async function get(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res;
}

/** Télécharge une copie autonome du site (ZIP) : le client peut l'héberger où il veut */
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  if (project.status !== 'live' || !project.slug) return json({ error: 'Votre site doit d’abord être publié.' }, 409);

  const origin = new URL(request.url).origin;
  try {
    const page = await (await get(`${origin}/export/${project.id}`)).text();

    // Feuilles de style → un seul fichier, polices inutilisées retirées. Les chemins des polices sont relatifs à
    // chaque feuille (ils changent d'une version de Next à l'autre : /_next/static/media ou /_next/static/immutable/media).
    const hrefs = [...page.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
    const sheets = await Promise.all(
      hrefs.map(async (h) => {
        const url = new URL(h, origin).toString();
        return { url, text: await (await get(url)).text() };
      }),
    );
    const rawCss = sheets.map((sheet) => sheet.text).join('\n');
    const css = keepUsedFonts(rawCss, usedFontFamilies(page, rawCss));

    const fontUrls = fontUrlMap(sheets);
    const fonts = await Promise.all(usedFontNames(css).map(async (name) => ({ name, data: new Uint8Array(await (await get(fontUrls.get(name)!)).arrayBuffer()) })));

    const { html, images: urls } = transformExportHtml(page);
    const images = await Promise.all(
      urls.map(async (url, i) => ({ name: `images/${String(i + 1).padStart(2, '0')}-${url.split('/').pop()}`, data: new Uint8Array(await (await get(url)).arrayBuffer()) })),
    );

    const zip = buildZip({
      html,
      css: rewriteFontUrls(css),
      fonts,
      images,
      businessName: project.data.businessName ?? 'votre entreprise',
      contactEmail: CONTACT_EMAIL,
      contactPhone: CONTACT_PHONE,
    });
    return new Response(Buffer.from(zip), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="site-${project.slug}.zip"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('export', error);
    return json({ error: 'Export impossible pour le moment, réessayez dans un instant.' }, 502);
  }
}
