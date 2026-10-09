'use client';

import { motion } from 'framer-motion';
import Button from '@/components/Button';
import AnimatedSection from '@/components/AnimatedSection';

const included = [
  'Création du site offerte — 0€ de frais d\'entrée',
  'Hébergement + nom de domaine inclus',
  'Maintenance & mises à jour continues',
  'Support client réactif — réponse sous 2h',
  'Modifications illimitées sur demande',
];

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: 'Formulaire de contact',
    description: 'Vos visiteurs vous envoient un message directement depuis le site. Vous recevez une notification — plus aucune demande ratée.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: 'Prise de rendez-vous en ligne',
    description: 'Vos clients réservent un créneau directement depuis le site, 24h/24. Fini les allers-retours pour caler un RDV.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: 'Galerie photos & réalisations',
    description: 'Montrez votre travail — chantiers, créations, avant/après. Les photos convainquent mieux que n\'importe quel texte.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Avis clients & témoignages',
    description: 'Intégration de vos avis Google ou ajout de témoignages clients sur votre site. La preuve sociale qui déclenche l\'appel.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Carte Google Maps intégrée',
    description: 'Vos clients trouvent votre adresse et votre itinéraire directement depuis votre site. Indispensable pour les commerces physiques.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: 'Page menu / catalogue',
    description: 'Pour les restaurants, artisans ou prestataires — présentez vos offres, prix et prestations de façon claire et attractive.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    title: 'Blog & actualités',
    description: 'Publiez des articles sur votre métier, vos projets, vos conseils. Chaque article améliore votre référencement Google sur le long terme.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
    title: 'Liens réseaux sociaux',
    description: 'Connexion de votre site à votre Instagram, Facebook ou autre. Vos visiteurs suivent votre activité, vos clients restent engagés.',
  },
];

export default function ServicesContent() {
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
            49€/mois · Création offerte · Sans engagement
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Création de site web à Caen
            <br />
            <span className="gradient-text glow-text">pour artisans et indépendants</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Un site professionnel livré en 7 jours — optimisé pour remonter sur Google,
            pensé pour que vos visiteurs vous appellent plutôt qu&apos;un concurrent.
          </motion.p>
        </div>
      </section>

      {/* ===== SERVICE PRINCIPAL ===== */}
      <section id="websites" className="relative section-spacing overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute -right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/15 to-indigo-500/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

        <div className="relative section-container">
          <div className="grid items-center gap-16 lg:gap-24 lg:grid-cols-2">
            {/* Content */}
            <AnimatedSection direction="left">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/8 text-accent ring-1 ring-accent/15">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Soyez visible, attirez des clients</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Création de site web sur-mesure
              </h2>
              <p className="mt-8 text-base leading-loose text-muted">
                Votre site web est votre meilleur commercial — disponible 24h/24, visible sur Google, accessible depuis n&apos;importe quel téléphone.
                Je vous livre un site professionnel, rapide et pensé pour transformer vos visiteurs en clients. En 7 jours, clé en main.
              </p>

              <div className="mt-12">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex flex-col rounded-2xl border border-accent/20 bg-accent/5 px-8 py-5 glow"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black gradient-text">49€</span>
                    <span className="text-lg font-semibold text-muted">/mois</span>
                  </div>
                  <span className="mt-1 text-xs font-medium text-accent">Création du site offerte · 0€ de frais d&apos;entrée</span>
                </motion.div>
              </div>

              <p className="mt-4 text-xs text-muted/60 italic">
                Sans engagement — résiliable à tout moment.
              </p>

              <div className="mt-8">
                <Button href="/start-project">Démarrer pour 49€/mois</Button>
              </div>
            </AnimatedSection>

            {/* Included */}
            <AnimatedSection delay={0.15} direction="right">
              <div className="gradient-border rounded-2xl bg-surface-light p-10 sm:p-14">
                <h3 className="mb-10 text-base font-bold text-foreground flex items-center gap-2">
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ce qui est inclus
                </h3>
                <ul className="space-y-7">
                  {included.map((benefit, j) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + j * 0.08 }}
                      className="flex items-start gap-3.5 group"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent ring-1 ring-accent/10 transition-all group-hover:bg-accent/20 group-hover:ring-accent/25">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="text-sm leading-relaxed text-muted transition-colors group-hover:text-foreground">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== FONCTIONNALITÉS ===== */}
      <section className="relative section-spacing overflow-hidden bg-surface">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <div className="relative section-container">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Sur-mesure</span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ce qu&apos;on peut intégrer
                <span className="gradient-text"> à votre site</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Chaque site est adapté à votre activité. Voici les fonctionnalités qu&apos;on peut ajouter selon vos besoins — discutons-en lors de votre devis.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl border border-border/30 bg-background/60 p-9 transition-all duration-500 hover:border-accent/20 hover:bg-surface-light h-full"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/8 text-accent ring-1 ring-accent/10 transition-all duration-300 group-hover:bg-accent/15 group-hover:ring-accent/20">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-foreground">{feature.title}</h3>
                  <p className="text-xs leading-loose text-muted">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
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
                Votre prochain client
                <span className="gradient-text"> est sur Google.</span>
              </h2>
              <p className="mt-8 text-base leading-relaxed text-muted sm:text-lg">
                Dites-moi ce que vous faites. Je crée votre site, je le mets en ligne en 7 jours — et je m&apos;occupe de tout pour seulement 49€/mois.
              </p>
              <div className="mt-12">
                <Button href="/start-project" size="lg">Démarrer pour 49€/mois</Button>
              </div>
              <p className="mt-5 text-xs text-muted/60">Sans engagement · Résiliable à tout moment · Réponse sous 24h</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
