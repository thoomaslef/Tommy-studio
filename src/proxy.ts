import { NextResponse, type NextRequest } from 'next/server';

const SITES_DOMAIN = 'tommy-studio.pro';
const STUDIO_HOSTS = new Set([SITES_DOMAIN, `www.${SITES_DOMAIN}`]);

/** <slug>.tommy-studio.pro affiche le site du client (actif une fois le sous-domaine générique branché chez Vercel) */
export function proxy(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase();
  if (STUDIO_HOSTS.has(host) || !host.endsWith(`.${SITES_DOMAIN}`)) return NextResponse.next();
  const slug = host.slice(0, -SITES_DOMAIN.length - 1);
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.next();
  const { pathname } = request.nextUrl;
  if (pathname === '/') return NextResponse.rewrite(new URL(`/s/${slug}`, request.url));
  // Le site client n'a qu'une page : le reste renvoie vers le studio
  return NextResponse.redirect(new URL(pathname, `https://www.${SITES_DOMAIN}`));
}

export const config = {
  matcher: ['/((?!_next/|api/|favicon|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml|woff2?)$).*)'],
};
