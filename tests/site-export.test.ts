import { unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { buildZip, fontUrlMap, keepUsedFonts, rewriteFontUrls, transformExportHtml, usedFontFamilies, usedFontNames } from '@/lib/site-export';

const IMG = 'https://abc.supabase.co/storage/v1/object/public/site-media/proj/photo1.jpg';

const html = `<html><head>
<meta charSet="utf-8"/><link rel="preload" as="image" href="${IMG}"/>
<link rel="stylesheet" href="/_next/static/chunks/a.css" data-precedence="next"/>
<link rel="stylesheet" href="/_next/static/chunks/b.css" data-precedence="next"/>
<script src="/_next/static/chunks/x.js" async=""></script>
<meta name="next-size-adjust" content=""/>
<meta property="og:image" content="${IMG}"/><meta property="og:title" content="Durand"/>
<link rel="icon" href="/favicon.ico"/>
<script type="application/ld+json">{"@type":"Plumber","name":"Durand","image":["${IMG}"],"logo":"${IMG}"}</script>
</head><body><div class="site-root" style="--s-font-heading:var(--sf-oswald);--s-font-body:var(--sf-dm-sans)">
<img src="${IMG}" alt=""/><script>self.__next_f.push([1,"x"])</script></div></body></html>`;

const css = `.a_variable{--sf-oswald:"Oswald", "Oswald Fallback"}.b_variable{--sf-dm-sans:"DM Sans", "DM Sans Fallback"}.c_variable{--sf-rubik:"Rubik", "Rubik Fallback"}
@font-face{font-family:Oswald;src:url(../media/o.woff2)format("woff2")}
@font-face{font-family:"DM Sans";src:url(../media/d.woff2)format("woff2")}
@font-face{font-family:Rubik;src:url(../media/r.woff2)format("woff2")}
@font-face{font-family:Rubik Fallback;src:local("Arial")}
@font-face{font-family:Oswald Fallback;src:local("Arial")}`;

describe('export du site', () => {
  it('retrouve les polices réellement utilisées', () => {
    expect([...usedFontFamilies(html, css)].sort()).toEqual(['dm sans', 'oswald']);
  });
  it('ne garde que les @font-face des polices utilisées', () => {
    const kept = keepUsedFonts(css, usedFontFamilies(html, css));
    expect(kept).toContain('o.woff2');
    expect(kept).toContain('d.woff2');
    expect(kept).not.toContain('r.woff2');
    expect(kept).not.toContain('@font-face{font-family:Rubik Fallback');
    expect(kept).toContain('@font-face{font-family:Oswald Fallback');
  });
  it('rend la page autonome : plus de scripts Next, une feuille de style, images locales', () => {
    const out = transformExportHtml(html);
    expect(out.html).not.toContain('/_next/static/chunks/x.js');
    expect(out.html).not.toContain('self.__next_f');
    expect(out.html).not.toContain('rel="preload"');
    expect(out.html).not.toContain('og:image');
    expect(out.html).not.toContain('favicon');
    expect(out.html.match(/rel="stylesheet"/g)).toHaveLength(1);
    expect(out.html).toContain('href="style.css"');
    expect(out.html).toContain('src="images/01-photo1.jpg"');
    expect(out.html).not.toContain('supabase.co');
    expect(out.images).toEqual([IMG]);
  });
  it('garde les données structurées, sans les images de notre stockage', () => {
    const out = transformExportHtml(html).html;
    expect(out).toContain('"@type":"Plumber"');
    expect(out).not.toContain('"logo"');
    expect(out).toContain('og:title');
  });
  it('assemble un ZIP lisible avec le LISEZ-MOI', () => {
    const zip = buildZip({
      html: '<html></html>',
      css: 'body{}',
      fonts: [{ name: 'o.woff2', data: new Uint8Array([1, 2, 3]) }],
      images: [{ name: 'images/01-photo1.jpg', data: new Uint8Array([4, 5]) }],
      businessName: 'Durand Plomberie',
      contactEmail: 'thomas@tommy-studio.pro',
      contactPhone: '06 12 94 11 25',
      now: new Date('2026-10-28'),
    });
    const files = unzipSync(zip);
    expect(Object.keys(files).sort()).toEqual(['LISEZ-MOI.txt', 'fonts/o.woff2', 'images/01-photo1.jpg', 'index.html', 'style.css']);
    expect(new TextDecoder().decode(files['LISEZ-MOI.txt'])).toContain('Durand Plomberie');
    expect(Array.from(files['fonts/o.woff2'])).toEqual([1, 2, 3]);
  });
  it('trouve les polices quel que soit l’emplacement des fichiers (Next local ou Vercel)', () => {
    const local = { url: 'https://x.fr/_next/static/chunks/a.css', text: '@font-face{src:url(../media/o.woff2)format("woff2")}' };
    const vercel = { url: 'https://x.fr/_next/static/immutable/chunks/b.css', text: '@font-face{src:url(../media/d.woff2?dpl=1)format("woff2")}' };
    const urls = fontUrlMap([local, vercel]);
    expect(urls.get('o.woff2')).toBe('https://x.fr/_next/static/media/o.woff2');
    expect(urls.get('d.woff2')).toBe('https://x.fr/_next/static/immutable/media/d.woff2');
    expect(usedFontNames(local.text + vercel.text)).toEqual(['o.woff2', 'd.woff2']);
    expect(rewriteFontUrls(vercel.text)).toBe('@font-face{src:url(fonts/d.woff2)format("woff2")}');
  });
});
