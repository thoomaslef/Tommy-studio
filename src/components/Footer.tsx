'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = {
  services: [
    { href: '/services', label: 'Création de site web' },
    { href: '/portfolio', label: 'Réalisations' },
    { href: '/start-project', label: 'Démarrer mon site' },
  ],
  company: [
    { href: '/', label: 'Accueil' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/start-project', label: 'Commander un site' },
    { href: '/envoi-fichiers', label: 'Envoyer mes fichiers' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-surface overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative section-container pt-12 pb-8">
        <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand — 4 cols */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
                <span className="text-base font-black gradient-text">T</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-foreground">
                  Tommy <span className="gradient-text">Studio</span>
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-muted">
                  Créateur de site web
                </span>
              </div>
            </Link>
            <p className="mt-8 max-w-md text-sm leading-loose text-muted">
              Tommy Studio crée des sites web professionnels pour les artisans et indépendants
              partout en France — livrés en moins de 7 jours, au prix fixe annoncé.
            </p>

            {/* Engagements mini */}
            <div className="mt-8 flex flex-wrap gap-3">
              {['Dès 99€', 'Paiement unique', 'Livraison < 7j'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-surface-elevated px-3 py-1 text-[11px] text-muted">
                  <svg className="h-2.5 w-2.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Services — 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
              Services
            </h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation — 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
              Navigation
            </h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal — 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
              Légal
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link href="/mentions-legales" className="hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground">
                  Conditions de vente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact — 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
              Contact
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <a href="mailto:thomas@tommy-studio.pro" className="text-sm text-muted transition-colors hover:text-foreground hover-underline">
                  thomas@tommy-studio.pro
                </a>
              </li>
              <li>
                <a href="tel:+33612941125" className="text-sm text-muted transition-colors hover:text-foreground hover-underline">
                  +33 6 12 94 11 25
                </a>
              </li>
              <li className="text-sm text-muted">Caen, Normandie</li>
              <li>
                <Link
                  href="/start-project"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-light"
                >
                  Démarrer mon site
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-border/50" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p className="text-xs text-muted/60">
              &copy; {new Date().getFullYear()} Tommy Studio. Tous droits réservés.
            </p>
            <p className="text-[10px] text-muted/40">
              SIRET : 10108233700011 &middot; Caen, Normandie
            </p>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-[10px] tracking-wider uppercase text-muted/40">
              Créateur de site web &middot; Artisans &amp; indépendants &middot; Partout en France
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
