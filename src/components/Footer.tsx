import Link from 'next/link';
import { TRADES, TRADE_IDS } from '@/site-engine/trades';
import { whatsappUrl } from '@/lib/contact';

const footerLinks = {
  services: [
    { href: '/creer', label: 'Créer mon site' },
    { href: '/modeles', label: 'Exemples de sites' },
    { href: '/#tarif', label: 'Tarif' },
  ],
  company: [
    { href: '/', label: 'Accueil' },
    { href: '/#comment', label: 'Comment ça marche' },
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
              Tommy Studio permet aux artisans du bâtiment de créer leur site professionnel en quelques minutes, avec aperçu gratuit et un prix unique.
            </p>

            {/* Engagements mini */}
            <div className="mt-8 flex flex-wrap gap-3">
              {['99 € la 1re année', 'Aperçu gratuit', 'Satisfait ou remboursé 14 jours'].map((item) => (
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
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
              Services
            </h2>
            <ul className="mt-6 space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1.5 hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation — 2 cols */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
              Navigation
            </h2>
            <ul className="mt-6 space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1.5 hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal — 2 cols */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
              Légal
            </h2>
            <ul className="mt-6 space-y-4">
              <li>
                <Link href="/mentions-legales" className="inline-block py-1.5 hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="inline-block py-1.5 hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="inline-block py-1.5 hover-underline text-sm text-muted transition-colors duration-300 hover:text-foreground">
                  Conditions de vente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact — 2 cols */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
              Contact
            </h2>
            <ul className="mt-6 space-y-4">
              <li>
                <a href="mailto:thomas@tommy-studio.pro" className="inline-block py-1.5 text-sm text-muted transition-colors hover:text-foreground hover-underline">
                  thomas@tommy-studio.pro
                </a>
              </li>
              <li>
                <a href="tel:+33612941125" className="inline-block py-1.5 text-sm text-muted transition-colors hover:text-foreground hover-underline">
                  +33 6 12 94 11 25
                </a>
              </li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener" className="inline-block py-1.5 text-sm text-muted transition-colors hover:text-foreground hover-underline">
                  WhatsApp
                </a>
              </li>
              <li className="text-sm text-muted">Caen, Normandie</li>
              <li>
                <Link
                  href="/creer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-light"
                >
                  Créer mon site
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Pages par métier */}
        <nav aria-label="Sites internet par métier" className="mt-10 text-xs leading-loose text-muted">
          <span className="font-semibold text-foreground/70">Site internet pour : </span>
          {TRADE_IDS.map((id, i) => (
            <span key={id}>
              <Link href={`/site-internet/${id}`} className="hover:text-foreground">
                {TRADES[id].label.toLowerCase()}
              </Link>
              {i < TRADE_IDS.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </nav>

        {/* Divider */}
        <div className="mt-6 border-t border-border/50" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p className="text-xs text-muted">
              &copy; {new Date().getFullYear()} Tommy Studio. Tous droits réservés.
            </p>
            <p className="text-[10px] text-muted">
              SIRET : 10108233700011 &middot; Caen, Normandie
            </p>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-[10px] tracking-wider uppercase text-muted">
              Sites pour artisans du bâtiment &middot; Partout en France
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
