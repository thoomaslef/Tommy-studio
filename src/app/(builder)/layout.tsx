import Link from 'next/link';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, whatsappUrl } from '@/lib/contact';

/** Mise en page du configurateur : en-tête et pied de page réduits, rien qui détourne de la création du site */
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-border/30 bg-background/80 backdrop-blur">
        <div className="section-container flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Tommy Studio, accueil">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-base font-black">
              <span className="gradient-text">T</span>
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">
              Tommy <span className="gradient-text">Studio</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <a href={whatsappUrl('Bonjour Thomas, j’ai une question sur la création de mon site.')} target="_blank" rel="noopener" className="rounded-full bg-[#1f8f4e] px-3.5 py-2 text-white">
              WhatsApp
            </a>
            <a href={CONTACT_PHONE_HREF} className="hidden rounded-full border border-border/60 px-3.5 py-2 text-foreground sm:inline-block">
              {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </header>
      <main className="w-full">{children}</main>
      <footer className="border-t border-border/30 py-6 text-center text-xs text-muted">
        <div className="section-container flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span>© {new Date().getFullYear()} Tommy Studio</span>
          <Link href="/cgv" className="hover:text-foreground">
            Conditions de vente
          </Link>
          <Link href="/politique-de-confidentialite" className="hover:text-foreground">
            Confidentialité
          </Link>
          <Link href="/mentions-legales" className="hover:text-foreground">
            Mentions légales
          </Link>
        </div>
      </footer>
    </>
  );
}
