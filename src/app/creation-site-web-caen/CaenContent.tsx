'use client';

import { motion } from 'framer-motion';
import Button from '@/components/Button';
import AnimatedSection from '@/components/AnimatedSection';

const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'SEO local Caen inclus',
    description: 'Votre site est structuré pour remonter sur Google quand un client cherche votre métier à Caen, Mondeville ou Hérouville-Saint-Clair. Balises, mots-clés locaux, vitesse de chargement — tout est optimisé.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3M6.75 21h10.5" />
      </svg>
    ),
    title: 'Pensé mobile-first',
    description: 'Les Caennais cherchent depuis leur téléphone. Votre site est parfait sur mobile — bouton d\'appel visible, page rapide, formulaire simple. Ils appellent dans les 3 minutes.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: 'Conçu pour convaincre',
    description: 'Preuves sociales, garanties, numéro visible, appel à l\'action évident. Un visiteur qui arrive sur votre site doit savoir en 5 secondes pourquoi vous appeler plutôt qu\'un concurrent.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Livré en 7 jours',
    description: 'Vous remplissez un formulaire. Je conçois, je développe, je mets en ligne. En moins d\'une semaine, vous avez un site qui travaille pour vous 24h/24.',
  },
];

const faq = [
  {
    q: 'Vous êtes bien basé à Caen ?',
    a: 'Oui — Tommy Studio est basé à Caen, en Normandie. Je travaille principalement avec des artisans et indépendants dans le Calvados, mais aussi avec des clients partout en France.',
  },
  {
    q: 'Quel est le prix d\'un site web à Caen ?',
    a: 'Trois formules à prix fixe, payables une seule fois : Essentiel 99€, Standard 149€ et Complet 199€. L\'hébergement est inclus la première année, puis 39€/an. Une retouche est incluse après livraison, les suivantes sont à 15€.',
  },
  {
    q: 'Vous travaillez dans toute la Normandie ?',
    a: 'Oui — je suis basé à Caen mais j\'interviens dans tout le Calvados et la Normandie : Rouen, Le Havre, Cherbourg, Lisieux, Bayeux... Tout se fait à distance sans perte de qualité.',
  },
  {
    q: 'Combien de temps pour créer un site vitrine à Caen ?',
    a: 'Moins de 7 jours ouvrés. Je m\'engage sur un délai précis dès le début du projet — pas de "on verra".',
  },
  {
    q: 'Est-ce que mon site remontera sur Google à Caen ?',
    a: 'C\'est construit pour ça. Structure optimisée, balises correctes, mots-clés de votre métier et de votre ville, vitesse de chargement soignée. Le SEO local est inclus dans chaque site.',
  },
];

export default function CaenContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative hero-spacing overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/6 rounded-full blur-[140px] pointer-events-none aurora-1" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative section-container flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-xs font-semibold tracking-wide text-accent badge-glow"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Caen · Calvados · Normandie
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Création de site web à Caen
            <br />
            <span className="gradient-text glow-text">Tommy Studio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Vous cherchez un créateur de site web à Caen ? Tommy Studio conçoit des sites vitrines
            professionnels pour artisans, commerçants et indépendants dans le Calvados — livrés en
            7 jours, à partir de 99€ en paiement unique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button href="/start-project" size="lg" className="cta-pulse">
              Démarrer mon site
            </Button>
            <Button href="/portfolio" variant="secondary" size="lg">
              Voir les réalisations
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-muted/60"
          >
            Paiement unique · Prix fixe · Réponse sous 24h
          </motion.p>
        </div>
      </section>

      {/* Pourquoi un site local à Caen */}
      <section className="relative section-spacing overflow-hidden bg-surface">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative section-container">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Le marché local</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Pourquoi un site web local fait
                <span className="gradient-text"> la différence à Caen</span>
              </h2>
              <div className="mt-8 space-y-5 text-base leading-loose text-muted">
                <p>
                  Caen, c&apos;est une ville de plus de 110 000 habitants avec une forte concurrence locale dans les métiers du bâtiment, de la restauration, du bien-être et des services. À Caen centre, Mondeville, Hérouville-Saint-Clair ou dans le reste du Calvados, chaque artisan se bat pour les mêmes clients.
                </p>
                <p>
                  Un artisan bien positionné sur Google dans sa ville capte des appels réguliers sans dépenser en publicité. Quand un habitant de Caen tape "électricien Caen" ou "plombier Calvados", il appelle le premier résultat. Pas le deuxième. Pas le troisième.
                </p>
                <p>
                  Tommy Studio construit des sites optimisés pour ces recherches locales — structure pensée pour Google, mots-clés de votre métier et de votre ville, design mobile-first. <strong className="text-foreground">Votre prochain client cherche en ce moment. Soyez le premier résultat.</strong>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="relative section-spacing">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Ce que comprend votre site</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ce que comprend votre
                <span className="gradient-text"> site web à Caen</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-7 sm:gap-8 sm:grid-cols-2">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl border border-border/30 bg-surface-light p-10 sm:p-12 transition-all duration-500 hover:border-accent/20 h-full"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/8 text-accent ring-1 ring-accent/10 transition-all duration-300 group-hover:bg-accent/15 group-hover:ring-accent/20">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-sm font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-loose text-muted">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tarif */}
      <section className="relative section-spacing overflow-hidden bg-surface">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative section-container">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Tarif création de site web à Caen</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Dès 99€ —
                <span className="gradient-text"> paiement unique</span>
              </h2>
              <p className="mt-6 text-base leading-loose text-muted">
                Trois formules à prix fixe : 99€, 149€ ou 199€, payables une seule fois. Hébergement la première année inclus, puis 39€/an.
              </p>
              <p className="mt-3 text-sm text-muted/60 italic">
                Sans abonnement obligatoire — une retouche incluse après livraison.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button href="/start-project" size="lg">Démarrer mon site</Button>
                <Button href="/services" variant="secondary" size="lg">Voir le détail</Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative section-spacing overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="section-container">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Questions fréquentes</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Création site web à Caen —
                <span className="gradient-text"> vos questions</span>
              </h2>
              <div className="mt-10 space-y-8">
                {faq.map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.08}>
                    <div className="border-b border-border/30 pb-8 last:border-0 last:pb-0">
                      <h3 className="text-sm font-bold text-foreground">{item.q}</h3>
                      <p className="mt-3 text-sm leading-loose text-muted">{item.a}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-spacing overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative section-container !max-w-3xl text-center">
          <AnimatedSection scale>
            <div className="gradient-border rounded-[2rem] bg-surface p-12 sm:p-20">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Votre prochain client est
                <span className="gradient-text"> sur Google en ce moment.</span>
              </h2>
              <p className="mt-8 text-base leading-relaxed text-muted sm:text-lg">
                Dites-moi ce que vous faites. Je vous livre un site optimisé pour Google à Caen, pensé pour convertir — en moins de 7 jours, à prix fixe.
              </p>
              <div className="mt-12">
                <Button href="/start-project" size="lg">Démarrer mon site</Button>
              </div>
              <p className="mt-5 text-xs text-muted/60">Paiement unique · Prix fixe · Réponse sous 24h</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
