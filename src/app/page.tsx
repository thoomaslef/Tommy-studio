'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';
import AnimatedSection from '@/components/AnimatedSection';

/* =========== DATA =========== */

const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'SEO local inclus',
    description: 'Votre site est structuré pour remonter sur Google quand un client cherche votre métier à Caen ou en Normandie. Balises, mots-clés locaux, vitesse de chargement — tout est optimisé.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3M6.75 21h10.5" />
      </svg>
    ),
    title: 'Pensé mobile-first',
    description: 'Vos clients cherchent depuis leur téléphone. Votre site est parfait sur mobile — bouton d\'appel visible, page rapide, formulaire simple. Ils appellent dans les 3 minutes.',
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
    description: 'Vous me dites ce que vous faites. Je conçois, je développe, je mets en ligne. En moins d\'une semaine, vous avez un site qui travaille pour vous 24h/24.',
  },
];

const reasons = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Pas le temps de gérer ça ?',
    description: 'Vous avez un métier à exercer — pas un site à gérer. Je m\'occupe de tout de A à Z. Une fois en ligne, votre site cherche des clients pour vous sans que vous y touchiez.',
    stat: '< 7j',
    statLabel: 'délai garanti',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: 'Les agences, trop cher, trop long ?',
    description: 'Pas de contrat confus, pas de jargon. Un prix fixe annoncé, un site concret livré en 7 jours. Moins cher qu\'une agence classique — et 10 fois plus rapide.',
    stat: 'A+',
    statLabel: 'qualité',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
    title: 'Pas à l\'aise avec le digital ?',
    description: 'Vous n\'avez rien à apprendre ni à installer. Je fais tout — vous recevez un site qui marche, prêt à l\'emploi. Comme un électricien qui pose votre tableau et repart.',
    stat: '24/7',
    statLabel: 'pour vous',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Peur de payer pour rien ?',
    description: 'Le prix annoncé est le prix final. Pas de frais cachés, pas de modules en option. Si vous n\'êtes pas satisfait du résultat, je rembourse. Sans discussion.',
    stat: '0€',
    statLabel: 'frais cachés',
  },
];


const stats = [
  { value: '< 7j', label: 'Livraison garantie' },
  { value: '0€', label: 'Frais cachés' },
  { value: '24h', label: 'Réponse garantie' },
  { value: '100%', label: 'Sur-mesure' },
];

/* =========== COMPONENT =========== */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[900px] h-[900px] bg-accent/8 rounded-full blur-[160px] aurora-1 pointer-events-none" />
        <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] aurora-2 pointer-events-none" />
        <div className="absolute top-1/3 -right-1/4 w-[400px] h-[400px] bg-indigo-400/5 rounded-full blur-[100px] aurora-3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-24 lg:px-8"
        >
          <div className="w-full max-w-4xl text-center flex flex-col items-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-6 py-2.5 text-xs font-semibold tracking-wide text-accent badge-glow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Créateur de site web à Caen · Livraison en 7 jours
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8 text-[2.5rem] font-extrabold tracking-tight leading-[1.1] text-foreground sm:text-6xl lg:text-7xl xl:text-[5rem]"
            >
              Votre futur client cherche
              <br />
              un artisan sur Google.
              <br />
              <span className="gradient-text glow-text">Soyez le premier résultat.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-muted sm:text-lg lg:text-xl"
            >
              Un site web professionnel livré en 7 jours — optimisé pour remonter sur Google,
              pensé pour que vos visiteurs vous appellent plutôt qu&apos;un concurrent.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
            >
              <Button href="/start-project" size="lg" className="cta-pulse">
                Obtenir mon devis gratuit
              </Button>
              <Button href="/portfolio" variant="secondary" size="lg">
                Voir les réalisations
              </Button>
            </motion.div>

            {/* Trust micro-copy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-5 text-xs text-muted/60 tracking-wide"
            >
              Sans engagement · Devis gratuit · Réponse sous 24h
            </motion.p>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-16 w-full max-w-3xl"
            >
              <div className="grid grid-cols-2 gap-px rounded-2xl border border-border/40 bg-border/40 overflow-hidden sm:grid-cols-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.03)' }}
                    className="bg-surface px-6 py-8 text-center transition-colors"
                  >
                    <div className="stat-number text-2xl font-black text-foreground sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-muted">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted/50">Scroll</span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-muted/40 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===================== PROBLÈME ===================== */}
      <section className="relative section-spacing">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="section-container">
          <AnimatedSection>
            <div className="gradient-border rounded-2xl bg-surface-light p-6 sm:p-10 text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">La réalité</span>
              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Un électricien à Caen est cherché sur Google
                <span className="gradient-text"> 300 fois par mois.</span>
              </h2>
              <p className="mt-6 text-base leading-loose text-muted">
                Le premier résultat reçoit la moitié des appels. Le deuxième, une fraction. Les autres n&apos;existent pas.
                <br />
                <strong className="text-foreground">Sans site optimisé, vos clients appellent votre concurrent.</strong>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===================== CE QU'ON LIVRE ===================== */}
      <section className="relative section-spacing">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="section-container">
          <SectionHeading
            label="49€/mois · Création offerte · Sans engagement"
            title="Un site qui ramène"
            titleAccent="des clients depuis Google"
            description="Pas un site vitrine générique. Un outil conçu pour remonter dans les résultats locaux et convaincre vos visiteurs de vous appeler — pas votre concurrent."
          />

          <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl border border-border/30 bg-surface-light p-6 sm:p-8 transition-all duration-500 hover:border-accent/20"
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

          {/* Prix + CTA inline */}
          <AnimatedSection delay={0.4}>
            <div className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
              <Button href="/start-project" size="lg" className="cta-pulse">
                Obtenir mon devis gratuit
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Voir le détail & les tarifs
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-muted/60">49€/mois · Création offerte · Sans engagement · Réponse sous 24h</p>
          </AnimatedSection>
        </div>
      </section>

      {/* ===================== COMMENT ÇA MARCHE ===================== */}
      <section className="relative section-spacing overflow-hidden">
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative section-container">
          <SectionHeading
            label="Le processus"
            title="Votre site en ligne"
            titleAccent="en 3 étapes"
            description="Pas de réunion interminable, pas de dossier à remplir. Vous m'expliquez votre métier — je m'occupe du reste."
          />

          <div className="mt-10 sm:mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Vous me dites ce que vous faites',
                desc: 'Un échange de 15 minutes — votre métier, votre zone, vos clients. Pas de jargon, pas de questionnaire interminable.',
              },
              {
                step: '02',
                title: 'Je conçois et je développe',
                desc: 'Design, textes, SEO local, mise en ligne. Je gère tout. Vous n\'avez rien à faire pendant ce temps.',
              },
              {
                step: '03',
                title: 'Votre site est en ligne en 7 jours',
                desc: 'Optimisé pour Google, parfait sur mobile, prêt à déclencher des appels. Vous commencez à recevoir des clients.',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15}>
                <div className="relative">
                  <span className="text-6xl font-black gradient-text opacity-20 leading-none">{item.step}</span>
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-loose text-muted">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section className="relative section-spacing overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative section-container">
          <SectionHeading
            label="Pourquoi Tommy Studio"
            title="Les vraies questions"
            titleAccent="des vrais artisans."
            description="On connaît vos objections parce qu'on les a entendues. Voilà pourquoi Tommy Studio a été construit différemment."
          />

          <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason, i) => (
              <AnimatedSection key={reason.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl border border-border/30 bg-background/50 p-6 sm:p-8 text-center transition-all duration-500 hover:border-accent/20 hover:bg-surface-light"
                >
                  {/* Stat */}
                  <div className="mb-5">
                    <span className="stat-number text-3xl font-black gradient-text">{reason.stat}</span>
                    <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted">{reason.statLabel}</span>
                  </div>

                  {/* Icon */}
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/8 text-accent ring-1 ring-accent/10 transition-all duration-300 group-hover:bg-accent/15 group-hover:ring-accent/20 group-hover:shadow-md group-hover:shadow-accent/10">
                    {reason.icon}
                  </div>

                  <h3 className="mb-3 text-sm font-bold text-foreground">{reason.title}</h3>
                  <p className="text-xs leading-loose text-muted">{reason.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== À PROPOS THOMAS ===================== */}
      <section className="relative section-spacing">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="section-container">
          <div className="grid gap-16 lg:gap-24 lg:grid-cols-2 items-center">
            {/* Photo + Identité */}
            <AnimatedSection direction="left">
              <div className="relative flex flex-col items-center lg:items-start gap-8">
                <div className="absolute -inset-6 bg-accent/4 rounded-3xl blur-3xl pointer-events-none" />

                {/* Photo */}
                <div className="relative h-72 w-72 overflow-hidden rounded-3xl border border-accent/20">
                  <Image
                    src="/Images/Thomas_profil.png"
                    alt="Thomas Lefevre — Fondateur Tommy Studio"
                    fill
                    className="object-cover object-top"
                    sizes="288px"
                    priority
                  />
                  <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-accent/40 animate-float-slow" />
                  <div className="absolute bottom-6 left-4 h-2 w-2 rounded-full bg-violet-400/40 animate-float" />
                </div>

                {/* Identité */}
                <div>
                  <p className="text-xl font-extrabold text-foreground">Thomas Lefevre</p>
                  <p className="mt-1 text-sm font-medium text-accent">Fondateur — Tommy Studio</p>
                  <p className="mt-1 text-xs text-muted">Caen, Normandie · SIRET 10108233700011</p>
                </div>

                {/* Contacts rapides */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:thomas@tommy-studio.pro"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-5 py-2.5 text-xs font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all duration-300"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    thomas@tommy-studio.pro
                  </a>
                  <a
                    href="tel:+33612941125"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-5 py-2.5 text-xs font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all duration-300"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    +33 6 12 94 11 25
                  </a>
                </div>
              </div>
            </AnimatedSection>

            {/* Texte */}
            <AnimatedSection direction="right" delay={0.1}>
              <article>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">À propos</span>
                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Thomas a d&apos;abord construit ce site
                  <span className="gradient-text"> pour lui-même</span>
                </h2>
                <div className="mt-8 space-y-5 text-base leading-loose text-muted">
                  <p>
                    Je m&apos;appelle <strong className="text-foreground">Thomas</strong>. Avant de créer des sites pour d&apos;autres, j&apos;en ai construit un pour trouver mes propres clients — rapide, bien placé sur Google, qui donne envie d&apos;appeler.
                  </p>
                  <p>
                    Ça fonctionnait. Alors j&apos;ai décidé de faire ça pour les artisans et indépendants qui n&apos;ont pas le temps de s&apos;en occuper. Électricien, coiffeur, ostéo, maçon, auto-école — peu importe le métier, le principe est le même : <strong className="text-foreground">un site bien fait vous ramène des clients. Un site mal fait, personne ne le voit.</strong>
                  </p>
                  <p>
                    Quand vous m&apos;écrivez, c&apos;est moi qui réponds. Quand vous commandez, c&apos;est moi qui livre. En moins de <strong className="text-foreground">7 jours</strong>, au <strong className="text-foreground">prix annoncé</strong> — sans agence intermédiaire.
                  </p>
                </div>
                <div className="mt-10">
                  <Button href="/start-project">Voir comment ça marche pour mon activité</Button>
                </div>
              </article>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===================== SEO CONTENT ===================== */}
      <section className="relative section-spacing overflow-hidden">
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative section-container">
          <div className="grid gap-16 lg:gap-24 lg:grid-cols-2 items-center">
            {/* Visual side */}
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl border border-border/30 bg-background p-6 sm:p-8">
                  {/* Faux dashboard */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-3 w-3 rounded-full bg-red-500/60" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                      <div className="h-3 w-3 rounded-full bg-green-500/60" />
                      <div className="ml-4 h-5 flex-1 rounded bg-surface-light" />
                    </div>
                    {/* Chart-like bars */}
                    {[85, 60, 95, 45, 78].map((w, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${w}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-4 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, rgba(99,102,241,${0.15 + i * 0.05}), rgba(139,92,246,${0.1 + i * 0.05}))`,
                        }}
                      />
                    ))}
                    {/* Engagements */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                      {[
                        { v: '< 7j', l: 'Livraison' },
                        { v: '0€', l: 'Frais cachés' },
                        { v: '24h', l: 'Réponse' },
                      ].map((s) => (
                        <div key={s.l} className="rounded-xl bg-surface-light p-4 text-center">
                          <div className="text-sm font-bold gradient-text">{s.v}</div>
                          <div className="mt-1 text-[10px] text-muted">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Text side */}
            <AnimatedSection direction="right">
              <article>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent badge-glow">
                  Notre expertise
                </span>
                <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Votre meilleur commercial,
                  <span className="gradient-text"> disponible 24h/24</span>
                </h2>
                <div className="mt-8 space-y-6 text-sm leading-loose text-muted sm:text-base">
                  <p>
                    Votre concurrent a déjà un site. Chaque jour sans présence sur Google, c&apos;est un client qui choisit quelqu&apos;un d&apos;autre.
                    En tant que <strong className="text-foreground">créateur de site web à Caen</strong>, je construis ce qu&apos;il faut pour que vous soyez <strong className="text-foreground">visible avant lui sur Google</strong> — et convaincant dès la première visite.
                  </p>
                  <p>
                    Un <strong className="text-foreground">site vitrine artisan</strong> livré en 7 jours, optimisé pour le <strong className="text-foreground">référencement local Normandie</strong> et partout en France. En tant qu&apos;<strong className="text-foreground">agence web Caen</strong> indépendante, je propose une alternative sérieuse aux grandes agences — un <strong className="text-foreground">site web pas cher à Caen</strong> sans compromis sur la qualité. Structure pensée pour Google, mots-clés de votre métier et de votre ville, vitesse de chargement irréprochable.
                  </p>
                  <p>
                    Et côté conversion : numéro de téléphone visible dès le premier écran, preuves sociales mises en avant, design mobile-first. <strong className="text-foreground">Un visiteur qui arrive sur votre site doit savoir en 5 secondes pourquoi vous appeler.</strong>
                  </p>
                  <p>
                    <a href="/creation-site-web-caen" className="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-light transition-colors">
                      En savoir plus sur notre offre de création de site web à Caen
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  </p>
                </div>
              </article>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===================== SEO LOCAL / FAQ ===================== */}
      <section className="relative section-spacing overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative section-container">
          <div className="grid gap-16 lg:gap-24 lg:grid-cols-2">
            {/* FAQ / Questions SEO */}
            <AnimatedSection direction="left" className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Questions fréquentes</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Tout ce que vous voulez
                <span className="gradient-text"> savoir</span>
              </h2>
              <div className="mt-8 space-y-6">
                {[
                  {
                    q: 'Vous êtes bien basé à Caen ?',
                    a: 'Oui — Tommy Studio est basé à Caen, en Normandie. Je travaille principalement avec des artisans et indépendants dans le Calvados et en Normandie, mais aussi avec des clients partout en France, 100% en ligne.',
                  },
                  {
                    q: 'Combien coûte la création d\'un site web ?',
                    a: 'Tommy Studio fonctionne en abonnement à 49€/mois — sans frais de création. Ça inclut la création du site, l\'hébergement, le nom de domaine, la maintenance et les modifications illimitées. Sans engagement, résiliable à tout moment.',
                  },
                  {
                    q: 'En combien de temps est livré mon site ?',
                    a: 'En moins de 7 jours ouvrés. Je m\'engage sur un délai précis dès le début du projet, et je le respecte. Pas de "on verra" — vous savez exactement quand votre site sera en ligne.',
                  },
                  {
                    q: 'Est-ce que mon site va vraiment remonter sur Google ?',
                    a: 'C\'est construit pour ça. Structure optimisée, balises correctes, mots-clés de votre métier et de votre ville, vitesse de chargement soignée. Le SEO local est inclus dans chaque site — pas en option.',
                  },
                  {
                    q: 'Je ne suis pas à l\'aise avec la technologie, est-ce compliqué ?',
                    a: 'Non. Vous n\'avez rien à installer, rien à apprendre. Je m\'occupe de tout de A à Z. Vous recevez un site qui marche, prêt à l\'emploi — comme un électricien qui pose votre tableau et repart.',
                  },
                  {
                    q: 'Est-ce que ça marche pour mon métier ?',
                    a: 'Oui — Tommy Studio a été construit exactement pour ça. Électricien, plombier, coiffeur, ostéo, maçon, auto-école, restaurant, coach... peu importe le métier, le site est adapté à votre activité et à vos clients.',
                  },
                  {
                    q: 'Intervenez-vous partout en France ?',
                    a: 'Oui — je suis basé à Caen mais je travaille avec des artisans partout en France, 100% en ligne. Normandie, Paris, Bordeaux, Lyon — tout se fait à distance sans perte de qualité.',
                  },
                ].map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <div className="group border-b border-border/30 pb-6 last:border-0 last:pb-0">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-accent-light transition-colors">{item.q}</h3>
                      <p className="mt-3 text-sm leading-loose text-muted">{item.a}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>

            {/* Local SEO block */}
            <AnimatedSection direction="right" delay={0.1} className="min-w-0">
              <div className="space-y-8">
                <div className="gradient-border rounded-2xl bg-surface-light p-5 sm:p-7 overflow-hidden">
                  <h2 className="text-lg font-extrabold text-foreground">
                    Créateur de site web à Caen, actif partout en France
                  </h2>
                  <p className="mt-4 text-sm leading-loose text-muted">
                    Tommy Studio est un <strong className="text-foreground">créateur de site web basé à Caen</strong>, en Normandie.
                    On travaille avec des artisans et indépendants partout en France — plombiers, coiffeurs, ostéos, auto-écoles, maçons — qui veulent plus de clients sans passer leur temps sur leur téléphone.
                    Que vous soyez à Caen, Rouen, Paris ou Bordeaux — tout se fait en ligne, rapidement.
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-sm text-muted">
                    <svg className="h-4 w-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    Caen, Normandie — France
                  </div>
                </div>

                <div className="gradient-border rounded-2xl bg-surface-light p-5 sm:p-7 overflow-hidden">
                  <h3 className="text-base font-extrabold text-foreground">Nos engagements</h3>
                  <ul className="mt-6 space-y-4">
                    {[
                      { title: 'Sans engagement', desc: '49€/mois, résiliable à tout moment. Aucune contrainte.' },
                      { title: 'Livraison en < 7 jours', desc: 'On s\'engage sur un délai et on le respecte, toujours.' },
                      { title: 'Satisfaction ou remboursement', desc: 'Si vous n\'êtes pas satisfait, on rembourse.' },
                      { title: 'Support réactif', desc: 'Une vraie personne vous répond sous 2h en journée.' },
                    ].map((item) => (
                      <li key={item.title} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-accent/5 border border-accent/10 p-5 sm:p-6 overflow-hidden">
                  <p className="text-xs text-muted/70 break-all">Tommy Studio — SIRET 10108233700011</p>
                  <p className="mt-1 text-sm font-bold text-foreground break-all">thomas@tommy-studio.pro</p>
                  <p className="text-sm text-muted">+33 6 12 94 11 25</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="relative section-spacing overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        {/* Background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-accent/8 rounded-full blur-[150px] pointer-events-none aurora-1" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none aurora-2" />

        <div className="relative section-container">
          <AnimatedSection scale>
            <div className="gradient-border relative overflow-hidden rounded-[2rem] bg-surface p-8 text-center sm:p-14 lg:p-20">
              {/* Inner glow */}
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/8 blur-[80px]" />
              <div className="absolute inset-0 dot-pattern opacity-30" />

              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20"
                >
                  <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                </motion.div>

                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  Votre prochain client est
                  <br />
                  <span className="gradient-text glow-text">sur Google en ce moment.</span>
                </h2>
                <div className="mt-8 flex justify-center">
                  <p className="max-w-xl text-center text-base leading-relaxed text-muted sm:text-lg">
                    Dites-moi ce que vous faites. Je vous livre un site optimisé pour Google et pensé pour convertir — en moins de 7 jours, à prix fixe.
                  </p>
                </div>
                <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Button href="/start-project" size="lg">
                    Obtenir mon devis gratuit
                  </Button>
                  <Button href="/portfolio" variant="secondary" size="lg">
                    Voir les réalisations
                  </Button>
                </div>
                {/* Trust badges */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted/60">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-accent/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Devis 100% gratuit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-accent/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Réponse sous 24h
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-accent/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Sans engagement
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-accent/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Sans engagement
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
