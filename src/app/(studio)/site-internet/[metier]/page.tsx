import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DEMOS } from '@/site-engine/demos';
import { Icon } from '@/site-engine/icons';
import { TRADES, TRADE_IDS, isTradeId } from '@/site-engine/trades';
import type { TradeId } from '@/site-engine/types';
import { HOSTING_RENEWAL_PRICE, SITE_PRICE, formatEuro } from '@/lib/offer';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return TRADE_IDS.map((metier) => ({ metier }));
}

const lower = (id: TradeId) => TRADES[id].label.toLowerCase();

export async function generateMetadata({ params }: { params: Promise<{ metier: string }> }): Promise<Metadata> {
  const { metier } = await params;
  if (!isTradeId(metier)) return {};
  const t = TRADES[metier];
  return pageMetadata({
    title: `Site internet pour ${lower(metier)} — création en 10 minutes`,
    description: `Création de site internet pour ${lower(metier)} : ${t.services.map((s) => s.title.toLowerCase()).slice(0, 3).join(', ')}… Site pro, pas cher, prêt en 10 minutes. Aperçu gratuit, ${formatEuro(SITE_PRICE)} la première année hébergement compris.`,
    path: `/site-internet/${metier}`,
  });
}

export default async function TradePage({ params }: { params: Promise<{ metier: string }> }) {
  const { metier } = await params;
  if (!isTradeId(metier)) notFound();
  const t = TRADES[metier];
  const name = lower(metier);
  const demo = DEMOS.find((d) => d.trade === metier);
  const faq = [
    {
      q: `Pourquoi un ${name} a-t-il besoin d’un site internet ?`,
      a: `Quand un particulier cherche « ${name} » et sa ville sur Google, il appelle les entreprises qu’il trouve, et celles qui inspirent confiance. Un site clair avec vos services, vos photos de chantier, votre zone d’intervention et un bouton pour appeler fait la différence, surtout sur téléphone.`,
    },
    {
      q: `Combien coûte un site internet de ${name} ?`,
      a: `${formatEuro(SITE_PRICE)} à la publication, hébergement compris la première année, puis ${formatEuro(HOSTING_RENEWAL_PRICE)} par an sans engagement. La création et l’aperçu sont gratuits : vous ne payez que si le site vous plaît.`,
    },
    {
      q: 'Combien de temps faut-il ?',
      a: `Une dizaine de minutes : vos services de ${t.activity.toLowerCase()} sont déjà pré-remplis, vous ajoutez vos infos et vos photos, et le site est en ligne dès le paiement.`,
    },
    {
      q: 'Mon site apparaîtra-t-il sur Google ?',
      a: `Il est construit pour : votre métier, votre ville et les communes où vous intervenez sont indiqués à Google. Ajoutez ensuite son adresse à votre fiche Google Business pour être visible sur Google Maps.`,
    },
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }} />
      <section className="hero-spacing">
        <div className="section-container grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-xs font-semibold text-accent-light">
              <Icon name={t.icon} className="h-4 w-4" /> {t.activity}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Site internet pour {name}, <span className="gradient-text">prêt en 10 minutes</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted">
              Créez le site de votre entreprise de {t.activity.toLowerCase()} sans rendez-vous ni compétence technique : vos services sont déjà rédigés, vous
              ajoutez vos photos de chantier, vous voyez le résultat tout de suite. Un site professionnel et pas cher, pensé pour être trouvé sur Google et
              pour que vos clients vous appellent.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href={`/creer?metier=${metier}`} className="rounded-full bg-accent-dark px-8 py-4 text-sm font-bold text-white shadow-lg shadow-accent/20">
                Créer mon site de {name}
              </Link>
              <Link href="/modeles" className="rounded-full border border-border/70 px-8 py-4 text-sm font-semibold text-foreground">
                Voir des exemples
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted">
              Aperçu gratuit · {formatEuro(SITE_PRICE)} la 1re année, hébergement compris · puis {formatEuro(HOSTING_RENEWAL_PRICE)}/an sans engagement
            </p>
          </div>
          {demo && (
            <Link href={`/demo/${demo.slug}`} target="_blank" className="group mx-auto block w-full max-w-sm">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-border/40">
                <Image src={`/modeles/${demo.slug}.webp`} alt={`Exemple de site internet de ${name} : ${demo.businessName}`} fill sizes="(min-width: 1024px) 384px, 90vw" className="object-cover object-top" />
              </div>
              <p className="mt-3 text-center text-xs text-muted group-hover:text-foreground">Exemple : {demo.businessName} (entreprise fictive) →</p>
            </Link>
          )}
        </div>
      </section>

      <section className="section-spacing">
        <div className="section-container">
          <h2 className="text-center text-2xl font-extrabold text-foreground sm:text-3xl">Ce que contient votre site de {name}</h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {t.services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border/40 bg-surface-light p-6">
                <p className="font-bold text-foreground">{s.title}</p>
                {s.description && <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>}
              </div>
            ))}
          </div>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3 text-sm text-muted sm:grid-cols-2">
            {[
              'Vos services pré-remplis, modifiables à volonté',
              'Vos photos de chantier en galerie',
              'Bouton « Appeler » toujours visible sur téléphone',
              'Formulaire de demande de devis reçu par email',
              'Votre zone d’intervention et vos certifications',
              'Mentions légales, SIRET et assurance intégrés',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 text-accent-light">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-spacing">
        <div className="section-container max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold text-foreground sm:text-3xl">Questions fréquentes</h2>
          <div className="mt-10 space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="rounded-2xl border border-border/40 bg-surface-light p-5">
                <summary className="cursor-pointer py-1 font-semibold text-foreground">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={`/creer?metier=${metier}`} className="inline-block rounded-full bg-accent-dark px-8 py-4 text-sm font-bold text-white">
              Créer mon site de {name} maintenant
            </Link>
          </div>
          <p className="mt-12 text-center text-xs leading-loose text-muted">
            Aussi pour :{' '}
            {TRADE_IDS.filter((id) => id !== metier).map((id, i, all) => (
              <span key={id}>
                <Link href={`/site-internet/${id}`} className="underline-offset-2 hover:text-foreground hover:underline">
                  {lower(id)}
                </Link>
                {i < all.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </div>
      </section>
    </>
  );
}
