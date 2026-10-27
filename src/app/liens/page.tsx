import type { Metadata } from 'next';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMetadata({
    description: 'Tous les projets de Thomas Lefevre : Tommy Studio, Tommy Prospector et KUBB: Kings.',
    path: '/liens',
    shareTitle: 'Thomas Lefevre — mes projets',
  }),
  title: 'Thomas Lefevre — mes projets',
};

type Project = { name: string; text: string; href: string; icon: ReactNode };

const PROJECTS: Project[] = [
  {
    name: 'Tommy Studio',
    text: 'Le site de votre entreprise du bâtiment, prêt en 10 minutes.',
    href: '/',
    icon: (
      <span className="flex h-full w-full items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-xl font-black">
        <span className="gradient-text">T</span>
      </span>
    ),
  },
  {
    name: 'Tommy Prospector',
    text: 'Prospection email B2B automatique, depuis Google Maps et les nouvelles entreprises.',
    href: 'https://tommy-prospector-production.up.railway.app/',
    icon: <Image src="/liens/tommy-prospector.svg" alt="" unoptimized width={56} height={56} className="h-full w-full rounded-2xl" />,
  },
  {
    name: 'KUBB: Kings',
    text: 'Le jeu de Kubb sur mobile : solo contre l’IA, à plusieurs ou en ligne.',
    href: 'https://thoomaslef.github.io/kubb-kings/',
    icon: <Image src="/liens/kubb-kings.png" alt="" width={56} height={56} className="h-full w-full rounded-2xl" />,
  },
];

export default function LiensPage() {
  return (
    <main className="relative flex min-h-screen items-start justify-center overflow-hidden px-4 py-16 sm:items-center">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/Images/Thomas_profil.png"
            alt="Thomas Lefevre"
            width={96}
            height={96}
            priority
            className="h-24 w-24 rounded-full border-2 border-accent/30 object-cover"
          />
          <h1 className="mt-4 text-2xl font-extrabold text-foreground">Thomas Lefevre</h1>
          <p className="mt-1 text-sm text-muted-light">Développeur indépendant à Caen</p>
        </div>

        <ul className="mt-10 space-y-3">
          {PROJECTS.map((p) => {
            const external = p.href.startsWith('http');
            return (
              <li key={p.name}>
                <a
                  href={p.href}
                  {...(external ? { target: '_blank', rel: 'noopener' } : {})}
                  className="group flex items-center gap-4 rounded-3xl border border-border-light/60 bg-surface-light p-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span className="h-14 w-14 flex-shrink-0">{p.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-foreground">{p.name}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-light">{p.text}</span>
                  </span>
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-5 w-5 flex-shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-light">
                    <path fillRule="evenodd" d="M7.2 4.2a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06L8.26 15.8a.75.75 0 1 1-1.06-1.06L11.93 10 7.2 5.27a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-xs text-muted">
          <a href="mailto:thomas@tommy-studio.pro" className="hover:text-foreground">
            thomas@tommy-studio.pro
          </a>
        </p>
      </div>
    </main>
  );
}
