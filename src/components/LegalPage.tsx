import type { ReactNode } from 'react';

/** Mise en page commune des pages légales (CGV, confidentialité) */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: ReactNode;
  updated: string;
  sections: { title: string; body: ReactNode }[];
}) {
  return (
    <section className="relative hero-spacing">
      <div className="section-container !max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-muted">Dernière mise à jour : {updated}</p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-4 border-b border-border/30 pb-3 text-xl font-extrabold text-foreground">{s.title}</h2>
              <div className="space-y-3 text-sm leading-loose text-muted [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
