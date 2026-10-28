import Link from 'next/link';
import type { ReactNode } from 'react';

/** Cadre commun des guides (domaine, Google) */
export function GuideShell({ token, title, intro, children }: { token: string; title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <section className="pb-24 pt-6 sm:pt-10">
      <div className="section-container max-w-3xl">
        <Link href={`/creer/${token}`} className="text-sm font-semibold text-accent-light underline">
          ← Retour à mon site
        </Link>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <div className="mt-4 text-base leading-relaxed text-muted">{intro}</div>
        <div className="mt-10 space-y-10">{children}</div>
      </div>
    </section>
  );
}

export function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-xl font-extrabold text-foreground">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-dark text-sm font-bold text-white">{n}</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export const Card = ({ children }: { children: ReactNode }) => <div className="space-y-4 rounded-2xl border border-border/40 bg-surface-light p-5 sm:p-6">{children}</div>;

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <div className={`rounded-2xl border p-4 text-sm leading-relaxed ${tone === 'warn' ? 'border-amber-500/30 bg-amber-500/5 text-amber-200' : 'border-accent/25 bg-accent/5 text-muted'}`}>
      {children}
    </div>
  );
}

export function NotPublished({ token }: { token: string }) {
  return (
    <GuideShell token={token} title="Disponible après la publication" intro="Ce guide s’utilise une fois votre site en ligne. Publiez-le d’abord, il vous suffit de quelques clics.">
      <Link href={`/creer/${token}`} className="inline-block rounded-xl bg-accent-dark px-6 py-3.5 text-sm font-bold text-white">
        Retour à mon site
      </Link>
    </GuideShell>
  );
}
