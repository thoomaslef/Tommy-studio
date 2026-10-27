import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import { DEMOS } from '@/site-engine/demos';
import { resolveDesign } from '@/site-engine/design';
import { TRADES } from '@/site-engine/trades';

export const metadata: Metadata = pageMetadata({
  title: 'Exemples de sites pour artisans du bâtiment',
  description: 'Exemples de sites internet créés avec Tommy Studio pour plombiers, électriciens, couvreurs, maçons et paysagistes : 3 modèles, des couleurs et une mise en page propres à chaque entreprise.',
  path: '/modeles',
});

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
              <div key={demo.slug}>
                <Link href={`/demo/${demo.slug}`} target="_blank" className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/40 bg-surface-light">
                    <Image
                      src={`/modeles/${demo.slug}.webp`}
                      alt={`Exemple de site pour ${demo.businessName}, ${TRADES[demo.trade].label.toLowerCase()}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-foreground group-hover:text-accent-light">{demo.businessName}</p>
                      <p className="text-xs text-muted">
                        {TRADES[demo.trade].label} · Modèle {TEMPLATE_NAMES[design.template]} · {design.palette.name}
                      </p>
                    </div>
                    <span className="h-6 w-6 flex-shrink-0 rounded-full border border-white/20" style={{ background: design.palette.primary }} />
                  </div>
                </Link>
                <Link
                  href={`/creer?metier=${demo.trade}`}
                  className="mt-3 flex items-center justify-center rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent/60"
                >
                  Créer mon site de {TRADES[demo.trade].label.toLowerCase()} →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
