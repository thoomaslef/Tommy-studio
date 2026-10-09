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
    title: 'SEO local Normandie inclus',
    description: 'Votre site est structuré pour remonter sur Google dans votre ville normande. Caen, Rouen, Le Havre, Cherbourg — chaque site est optimisé pour les recherches locales de votre secteur.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3M6.75 21h10.5" />
      </svg>
    ),
    title: 'Pensé mobile-first',
    description: 'Vos clients normands cherchent depuis leur téléphone. Votre site est parfait sur mobile — bouton d\'appel visible, page rapide, formulaire simple. Ils appellent dans les 3 minutes.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: 'Conçu pour convertir',
    description: 'Preuves sociales, garanties, numéro visible, appel à l\'action évident. Un visiteur qui arrive sur votre site doit savoir en 5 secondes pourquoi vous appeler plutôt qu\'un concurrent.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Livré en 7 jours',
    description: 'Vous me dites ce que vous faites. Je conçois, je développe, je mets en ligne. En moins d\'une semaine, vous avez un site qui travaille pour vous 24h/24.',
  },
];

const faq = [
  {
    q: 'Vous intervenez dans toute la Normandie ?',
    a: 'Oui — Tommy Studio est basé à Caen mais j\'interviens dans tout le Calvados et la Normandie : Rouen, Le Havre, Cherbourg, Alençon, Évreux, Lisieux, Bayeux, Saint-Lô, Falaise... Tout se fait à distance sans perte de qualité.',
  },
  {
    q: 'Quel est le prix d\'un site web en Normandie ?',
    a: 'Tommy Studio fonctionne en abonnement à 49€/mois, sans frais de création. Ça inclut la création du site, l\'hébergement, le nom de domaine, la maintenance et les modifications illimitées. Sans engagement, résiliable à tout moment.',
  },
  {
    q: 'Combien de temps pour créer un site en Normandie ?',
    a: 'Moins de 7 jours ouvrés. Je m\'engage sur un délai précis dès le début du projet.',
  },
  {
    q: 'Mon site remontera-t-il sur Google dans ma ville normande ?',
    a: 'C\'est l\'objectif. Structure optimisée, balises correctes, mots-clés de votre métier et de votre ville normande, vitesse de chargement soignée. Le SEO local est inclus dans chaque site.',
  },
  {
    q: 'Est-ce que ça marche pour mon métier en Normandie ?',
    a: 'Oui — électricien à Rouen, coiffeur au Havre, ostéo à Caen, maçon dans le Calvados... Peu importe le métier et la ville, le site est adapté à votre activité et à vos clients locaux.',
  },
];

export default function NormandieContent() {
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
            Caen · Rouen · Le Havre · Normandie
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Création de site web en Normandie
            <br />
            <span className="gradient-text glow-text">Tommy Studio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Tommy Studio est un créateur de site web basé à Caen qui intervient dans toute la Normandie.
            Calvados, Manche, Orne, Seine-Maritime, Eure — des sites vitrines professionnels livrés en
            7 jours, à prix fixe, pour les artisans et indépendants de la région.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button href="/start-project" size="lg" className="cta-pulse">
              Obtenir mon devis gratuit
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
            Sans engagement · Résiliable à tout moment · Réponse sous 24h
          </motion.p>
        </div>
      </section>

      {/* Couverture Normandie */}
      <section className="relative section-spacing overflow-hidden bg-surface">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative section-container">
          <div className="grid gap-16 lg:gap-24 lg:grid-cols-2 items-center">
            <AnimatedSection direction="left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Toute la région</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Basé à Caen,
                <span className="gradient-text"> actif dans toute la Normandie</span>
              </h2>
              <div className="mt-8 space-y-5 text-base leading-loose text-muted">
                <p>
                  Tommy Studio est basé à <strong className="text-foreground">Caen</strong> mais travaille avec des artisans et indépendants dans toute la Normandie — <strong className="text-foreground">Rouen, Le Havre, Cherbourg, Alençon, Évreux, Lisieux, Bayeux, Saint-Lô, Falaise</strong> et partout en France. Tout se fait à distance, sans déplacement, sans perte de qualité.
                </p>
                <p>
                  Que vous soyez électricien dans la Manche, coiffeur en Seine-Maritime, ostéo dans l&apos;Orne ou plombier dans le Calvados — le principe est le même : un site bien placé sur Google dans votre ville attire des appels réguliers sans dépenser en publicité.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <div className="gradient-border rounded-2xl bg-background p-10 sm:p-12">
                <h3 className="text-sm font-bold text-foreground mb-6">Zones couvertes en Normandie</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Caen', 'Rouen', 'Le Havre', 'Cherbourg', 'Alençon', 'Évreux', 'Lisieux', 'Bayeux', 'Saint-Lô', 'Falaise', 'Honfleur', 'Granville'].map((ville) => (
                    <div key={ville} className="flex items-center gap-2 text-sm text-muted">
                      <svg className="h-3 w-3 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {ville}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-muted/60">Et partout en France — tout se fait en ligne.</p>
              </div>
            </AnimatedSection>
          </div>
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
                <span className="gradient-text"> site web en Normandie</span>
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
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Tarif création de site web Normandie</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                49€/mois —
                <span className="gradient-text"> création offerte</span>
              </h2>
              <p className="mt-6 text-base leading-loose text-muted">
                Création du site, hébergement, nom de domaine, maintenance et modifications illimitées — tout inclus dans l&apos;abonnement mensuel.
              </p>
              <p className="mt-3 text-sm text-muted/60 italic">
                Sans engagement — résiliable à tout moment.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button href="/start-project" size="lg">Démarrer pour 49€/mois</Button>
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
                Création site web Normandie —
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
                Dites-moi ce que vous faites et où vous êtes en Normandie. Je vous livre un site optimisé pour Google dans votre ville — en moins de 7 jours, à prix fixe.
              </p>
              <div className="mt-12">
                <Button href="/start-project" size="lg">Obtenir mon devis gratuit</Button>
              </div>
              <p className="mt-5 text-xs text-muted/60">Sans engagement · Résiliable à tout moment · Réponse sous 24h</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
