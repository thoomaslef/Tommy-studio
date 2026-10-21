import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Anciennes pages de l'offre précédente : on renvoie vers leur équivalent actuel
  async redirects() {
    return [
      { source: '/start-project', destination: '/creer', permanent: true },
      { source: '/commande/:path*', destination: '/creer', permanent: true },
      { source: '/envoi-fichiers', destination: '/creer', permanent: true },
      { source: '/services', destination: '/#tarif', permanent: true },
      { source: '/creation-site-web-caen', destination: '/', permanent: true },
      { source: '/creation-site-web-normandie', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
