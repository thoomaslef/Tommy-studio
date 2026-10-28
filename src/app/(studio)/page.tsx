/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';
import AnimatedSection from '@/components/AnimatedSection';
import { HOSTING_RENEWAL_PRICE, SITE_PRICE, formatEuro } from '@/lib/offer';
import { pageMetadata } from '@/lib/seo';
import { whatsappUrl } from '@/lib/contact';

export const metadata = pageMetadata({
  description: `Création de site internet pour artisans du bâtiment : plombier, électricien, maçon, couvreur… Votre site pro en 10 minutes, aperçu gratuit, ${formatEuro(SITE_PRICE)} la première année hébergement compris.`,
  path: '/',
  shareTitle: 'Le site de votre entreprise du bâtiment, prêt en 10 minutes',
});

const steps = [
  { title: 'Choisissez votre métier', text: 'Plombier, électricien, maçon, couvreur, peintre, paysagiste… Vos services sont déjà pré-remplis.' },
  { title: 'Ajoutez vos infos et vos photos', text: 'Nom, ville, zone d’intervention, téléphone, photos de chantiers depuis votre téléphone.' },
  { title: 'Regardez l’aperçu et ajustez', text: 'Votre site se construit sous vos yeux. Changez le modèle, les couleurs, les textes, autant que vous voulez.' },
  { title: 'Publiez quand il vous plaît', text: `${formatEuro(SITE_PRICE)} la première année, hébergement compris. Votre site est en ligne aussitôt, à l’adresse votre-entreprise.tommy-studio.pro.` },
];

const included = [
  'Un site complet sur une page : présentation, services, réalisations, avis, zone d’intervention, contact',
  'Parfait sur téléphone, avec bouton « Appeler » toujours visible',
  'Optimisé pour Google : métier, ville et communes desservies',
  'Mentions légales intégrées (SIRET, assurance)',
  'Hébergement compris la première année, adresse votre-entreprise.tommy-studio.pro',
  'Modifiable à tout moment depuis votre lien privé',
];

const demos = [
  { slug: 'plomberie-durand', name: 'Durand Plomberie', label: 'Plombier · Classique', img: '/home/demo-plombier.webp' },
  { slug: 'toitures-leroy', name: 'Toitures Leroy', label: 'Couvreur · Robuste', img: '/home/demo-couvreur.webp' },
  { slug: 'jardins-morel', name: 'Les Jardins de Morel', label: 'Paysagiste · Moderne', img: '/home/demo-paysagiste.webp' },
];

const faq = [
  { q: 'Combien ça coûte ?', a: `${formatEuro(SITE_PRICE)} à la publication, hébergement compris la première année. Ensuite, ${formatEuro(HOSTING_RENEWAL_PRICE)} par an pour garder votre site en ligne, sans engagement : vous êtes prévenu avant chaque échéance et vous arrêtez quand vous voulez.` },
  { q: 'C’est pour qui ?', a: 'Pour les professionnels : artisans, entrepreneurs et sociétés du bâtiment. Votre numéro SIRET vous sera demandé avant la publication.' },
  { q: 'Je dois payer pour essayer ?', a: 'Non. Vous créez votre site et vous voyez l’aperçu gratuitement. Vous ne payez que si vous décidez de le publier.' },
  { q: 'Combien de temps ça prend ?', a: 'Une dizaine de minutes pour remplir vos infos et ajouter vos photos. Dès le paiement confirmé, votre site est en ligne automatiquement.' },
  { q: 'Je n’ai pas encore de photos ou de logo.', a: 'Ce n’est pas bloquant : le site affiche des visuels aux couleurs de votre entreprise et le nom de votre société à la place du logo. Vous pourrez ajouter vos photos plus tard.' },
  { q: 'Puis-je utiliser mon propre nom de domaine ?', a: 'Oui. Votre site est d’abord en ligne sur votre-entreprise.tommy-studio.pro. Si vous avez ou achetez un nom de domaine (environ 10 € par an), on vous explique comment le brancher.' },
  { q: 'Mon site sera-t-il visible sur Google ?', a: 'Il est construit pour : votre métier, votre ville et vos communes sont bien indiqués à Google. Personne ne peut garantir une première place, mais c’est la base indispensable.' },
  { q: 'Et si je veux changer quelque chose ?', a: 'Vous gardez un lien privé pour modifier vos textes, services et photos quand vous voulez.' },
];

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="relative section-container grid items-center gap-14 pt-32 pb-20 sm:pt-40 lg:grid-cols-2 lg:gap-10">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-xs font-semibold tracking-wide text-accent">
              Création de site internet pour artisans du bâtiment
            </span>
            <h1 className="mt-8 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
              Le site de votre entreprise,
              <br />
              <span className="gradient-text">prêt en 10 minutes.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
              Un site internet professionnel et pas cher pour votre entreprise : entrez vos infos, ajoutez vos photos, votre site se construit sous vos
              yeux. Aucun rendez-vous, aucun engagement. Vous ne payez que s’il vous plaît.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button href="/creer" size="lg" className="cta-pulse">
                Créer mon site
              </Button>
              <Button href="/modeles" variant="secondary" size="lg">
                Voir des exemples
              </Button>
            </div>
            <p className="mt-5 text-xs tracking-wide text-muted">
              Aperçu gratuit · {formatEuro(SITE_PRICE)} la 1re année, hébergement compris · puis {formatEuro(HOSTING_RENEWAL_PRICE)}/an
            </p>
          </div>

          <div className="relative mx-auto flex w-full max-w-md justify-center gap-4 lg:max-w-none">
            {demos.map((d, i) => (
              <div
                key={d.slug}
                className={`w-1/3 overflow-hidden rounded-[1.6rem] border border-white/10 bg-surface shadow-2xl shadow-black/50 ${i === 1 ? '-translate-y-6' : 'translate-y-6'}`}
              >
                <img src={`/home/mobile-${d.slug}.webp`} alt={`Exemple de site : ${d.name}`} className="block w-full" width={390} height={844} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section id="comment" className="relative section-spacing scroll-mt-24">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="section-container">
          <SectionHeading label="Comment ça marche" title="Votre site en" titleAccent="4 étapes" description="Tout se fait en ligne, depuis votre téléphone ou votre ordinateur." />
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <AnimatedSection delay={i * 0.08} className="h-full">
                  <div className="h-full rounded-2xl border border-border/30 bg-surface-light p-7">
                    <span className="text-5xl font-black gradient-text opacity-40 leading-none">{i + 1}</span>
                    <h3 className="mt-5 text-base font-bold text-foreground">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </AnimatedSection>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex justify-center">
            <Button href="/creer">Commencer maintenant</Button>
          </div>
        </div>
      </section>

      {/* ===== EXEMPLES ===== */}
      <section className="relative section-spacing overflow-hidden bg-surface">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative section-container">
          <SectionHeading
            label="Exemples"
            title="Des sites qui ne se"
            titleAccent="ressemblent pas"
            description="Trois modèles, douze palettes de couleurs, plusieurs typographies et mises en page : chaque entreprise a son propre site."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {demos.map((d, i) => (
              <AnimatedSection key={d.slug} delay={i * 0.1}>
                <Link href={`/demo/${d.slug}`} target="_blank" className="group block">
                  <div className="overflow-hidden rounded-2xl border border-border/40 bg-background">
                    <img src={d.img} alt={`Exemple : ${d.name}`} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <p className="mt-4 font-bold text-foreground group-hover:text-accent">{d.name}</p>
                  <p className="text-xs text-muted">{d.label}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button href="/modeles" variant="secondary">
              Voir tous les exemples
            </Button>
          </div>
        </div>
      </section>

      {/* ===== TARIF ===== */}
      <section id="tarif" className="relative section-spacing scroll-mt-24">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection direction="left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Tarif</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Un prix simple, <span className="gradient-text">sans surprise</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Pas d’abonnement mensuel, pas de frais cachés, sans engagement. Vous créez et vous essayez gratuitement, vous payez uniquement pour publier.
              </p>
              <ul className="mt-8 space-y-4">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.1}>
              <div className="gradient-border rounded-[2rem] bg-surface-light p-10 text-center glow sm:p-14">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Votre site</p>
                <p className="mt-6 text-7xl font-black gradient-text">{formatEuro(SITE_PRICE)}</p>
                <p className="mt-2 text-sm text-muted">la première année, à la publication</p>
                <div className="mx-auto mt-8 max-w-xs space-y-2 border-t border-border/40 pt-6 text-sm text-muted">
                  <p>Hébergement compris la 1re année</p>
                  <p>Puis {formatEuro(HOSTING_RENEWAL_PRICE)} par an, sans engagement</p>
                  <p>Création et aperçu gratuits</p>
                  <p className="text-xs text-muted">Réservé aux professionnels (SIRET demandé)</p>
                </div>
                <div className="mt-10">
                  <Button href="/creer" size="lg" className="w-full justify-center">
                    Créer mon site
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== À PROPOS ===== */}
      <section className="relative section-spacing bg-surface">
        <div className="section-container">
          <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[auto_1fr]">
            <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-3xl border border-accent/20">
              <Image src="/Images/Thomas_profil.png" alt="Thomas Lefevre, fondateur de Tommy Studio" fill className="object-cover object-top" sizes="176px" />
            </div>
            <AnimatedSection>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Derrière Tommy Studio</span>
              <h2 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">Une vraie personne, à Caen</h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                Je m’appelle Thomas. J’ai d’abord créé des sites sur mesure pour des artisans, puis j’ai construit Tommy Studio pour que chacun puisse avoir un
                site professionnel sans rendez-vous et à petit prix. Une question ? C’est moi qui vous réponds.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <a href={whatsappUrl()} target="_blank" rel="noopener" className="rounded-full bg-[#1f8f4e] px-5 py-2.5 font-semibold text-white hover:bg-[#187a42]">
                  Écrire sur WhatsApp
                </a>
                <a href="tel:+33612941125" className="rounded-full border border-border/50 px-5 py-2.5 text-muted hover:text-foreground">
                  06 12 94 11 25
                </a>
                <a href="mailto:thomas@tommy-studio.pro" className="rounded-full border border-border/50 px-5 py-2.5 text-muted hover:text-foreground">
                  thomas@tommy-studio.pro
                </a>
                <Link href="/portfolio" className="rounded-full border border-border/50 px-5 py-2.5 text-muted hover:text-foreground">
                  Mes réalisations sur mesure
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative section-spacing">
        <div className="section-container !max-w-3xl">
          <SectionHeading label="Questions fréquentes" title="Tout ce que vous voulez" titleAccent="savoir" />
          <div className="mt-12 divide-y divide-border/30 rounded-2xl border border-border/30 bg-surface-light">
            {faq.map((item) => (
              <details key={item.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                  {item.q}
                  <span className="text-accent transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative section-spacing pt-0">
        <div className="section-container">
          <div className="gradient-border relative overflow-hidden rounded-[2rem] bg-surface p-10 text-center sm:p-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Lancez votre site
              <br />
              <span className="gradient-text">dès aujourd’hui.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted">Créez-le maintenant, regardez l’aperçu, et ne payez que s’il vous plaît.</p>
            <div className="mt-10 flex justify-center">
              <Button href="/creer" size="lg">
                Créer mon site
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
