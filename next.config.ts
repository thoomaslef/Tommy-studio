import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // L'aperçu du configurateur est affiché en iframe sur le même domaine : seules nos propres pages peuvent nous encadrer
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Pages portant le lien privé dans l'adresse : jamais transmis aux sites externes (Stripe, Google…)
      { source: '/creer/:token', headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }] },
      { source: '/apercu/:id', headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }] },
      // Source de l'export ZIP : jamais indexée (la copie du client l'est, pas cette page)
      { source: '/export/:id', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  // Anciennes pages de l'offre précédente : on renvoie vers leur équivalent actuel
  async redirects() {
    return [
      { source: '/start-project', destination: '/creer', permanent: true },
      { source: '/commande/:path*', destination: '/creer', permanent: true },
      { source: '/envoi-fichiers', destination: '/creer', permanent: true },
      { source: '/portfolio', destination: '/', permanent: true },
      { source: '/services', destination: '/#tarif', permanent: true },
      { source: '/creation-site-web-caen', destination: '/', permanent: true },
      { source: '/creation-site-web-normandie', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
