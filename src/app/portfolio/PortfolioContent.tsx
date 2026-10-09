'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import Button from '@/components/Button';

const projects = [
  {
    title: 'Les Jardins de Jérôme — Jardinier & Bricoleur',
    description: "Site vitrine pour Jérôme, jardinier et bricoleur artisan à Saint-Aubin-sur-Mer dans le Calvados. Design naturel aux tons verts, présentation des services, zone d'intervention de 30 km autour de la Côte de Nacre.",
    gradient: 'from-green-600/25 via-emerald-500/10 to-transparent',
    image: '/Portfolio/jardins-de-jerome.png',
    tags: ['Vitrine', 'Artisan', 'Calvados'],
    href: 'https://jardins-de-jerome.vercel.app/',
  },
  {
    title: 'MYSCOPE — Coaching professionnel',
    description: "Site vitrine pour Gabriel Saintrais, coach professionnel certifié à Caen. Présentation des offres de coaching individuel, méthode TrainCoaching et ateliers d'équipe. Design élégant, animations au scroll, formulaire de contact.",
    gradient: 'from-violet-500/25 via-indigo-500/10 to-transparent',
    image: '/Portfolio/myscope.png',
    tags: ['Vitrine', 'Caen', 'SEO local'],
    href: 'https://myscope-lake.vercel.app/',
  },
];

export default function PortfolioContent() {
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
            Sites web livrés · Caen &amp; Normandie
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Sites web réalisés à Caen
            <br />
            <span className="gradient-text glow-text">et en Normandie</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Sites web pour artisans, commerçants et indépendants — des projets concrets
            livrés en moins de 7 jours pour des clients en Normandie et partout en France.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="relative section-spacing-sm">
        <div className="section-container">
          <div className="grid gap-8 sm:grid-cols-2">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="card-shine glow-hover group relative h-full overflow-hidden rounded-2xl border border-border/40 bg-surface-light transition-all duration-500 hover:border-accent/30"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-accent-light">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-sm leading-loose text-muted">
                      {project.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-accent/5 border border-accent/10 px-2.5 py-0.5 text-[10px] font-medium text-accent/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* CTA */}
      <section className="relative section-spacing bg-surface overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative section-container !max-w-3xl text-center">
          <AnimatedSection scale>
            <div className="gradient-border rounded-[2rem] bg-background p-12 sm:p-20">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Votre success story
                <span className="gradient-text"> commence ici</span>
              </h2>
              <div className="mt-8 flex justify-center">
                <p className="max-w-xl text-center text-base leading-relaxed text-muted sm:text-lg">
                  Obtenez un devis gratuit en 2 minutes. Rejoignez les entrepreneurs
                  qui ont transformé leur business avec Tommy Studio.
                </p>
              </div>
              <div className="mt-12">
                <Button href="/start-project" size="lg">Obtenir mon devis gratuit</Button>
              </div>
              <p className="mt-5 text-xs text-muted/60">Sans engagement · Réponse sous 24h</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
