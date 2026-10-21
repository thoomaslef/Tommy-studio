import type { Metadata } from 'next';
import Link from 'next/link';
import { DEMOS } from '@/site-engine/demos';
import { resolveDesign } from '@/site-engine/design';
import { TRADES } from '@/site-engine/trades';

export const metadata: Metadata = {
  title: 'Exemples de sites pour artisans du bâtiment',
  description: 'Découvrez des exemples de sites créés par Tommy Studio pour plombiers, électriciens, couvreurs, maçons et paysagistes.',
  alternates: { canonical: 'https://www.tommy-studio.pro/modeles' },
};

const TEMPLATE_NAMES = { classique: 'Classique', moderne: 'Moderne', robuste: 'Robuste' };

export default function ModelesPage() {
  return (
    <section className="hero-spacing">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Exemples</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Des sites qui ne se <span className="gradient-text">ressemblent pas</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Chaque site a son modèle, ses couleurs, ses typographies et sa mise en page. Voici quelques exemples, pour des entreprises fictives.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((demo) => {
            const design = resolveDesign(demo);
            return (
              <Link key={demo.slug} href={`/demo/${demo.slug}`} target="_blank" className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/40 bg-surface-light">
                  <iframe
                    src={`/demo/${demo.slug}`}
                    title={demo.businessName}
                    loading="lazy"
                    tabIndex={-1}
                    className="pointer-events-none absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-25 border-0"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground group-hover:text-accent">{demo.businessName}</p>
                    <p className="text-xs text-muted">
                      {TRADES[demo.trade].label} · Modèle {TEMPLATE_NAMES[design.template]} · {design.palette.name}
                    </p>
                  </div>
                  <span className="h-6 w-6 flex-shrink-0 rounded-full border border-white/20" style={{ background: design.palette.primary }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
