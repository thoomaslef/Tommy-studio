import Link from 'next/link';
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/contact';

export const metadata = { title: 'Page introuvable — Tommy Studio', robots: { index: false } };

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <p className="text-6xl font-black gradient-text">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">Cette page n’existe pas</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          L’adresse est peut-être mal recopiée, ou ce site n’est plus en ligne. Si vous cherchez votre site en cours de création, reprenez-le depuis le lien
          reçu par email ou depuis l’appareil qui a servi à le créer.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="https://www.tommy-studio.pro/" className="rounded-xl bg-accent-dark px-6 py-3.5 text-sm font-bold text-white">
            Accueil Tommy Studio
          </Link>
          <Link href="https://www.tommy-studio.pro/creer" className="rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-foreground">
            Créer mon site
          </Link>
        </div>
        <p className="mt-8 text-xs text-muted">
          Besoin d’aide ? <a href={CONTACT_PHONE_HREF} className="font-semibold text-accent-light underline">{CONTACT_PHONE}</a>
        </p>
      </div>
    </main>
  );
}
