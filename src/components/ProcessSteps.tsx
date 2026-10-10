'use client';

import AnimatedSection from '@/components/AnimatedSection';

export const PROCESS_STEPS = [
  {
    title: 'Vous remplissez votre brief',
    desc: 'Environ 5 minutes en ligne : votre formule, votre activité, le style voulu, vos infos pratiques. Aucun rendez-vous, aucun appel.',
    who: 'Vous',
  },
  {
    title: 'Vous réglez en ligne',
    desc: 'Un seul paiement, au prix fixe de la formule choisie. Pas d\'abonnement obligatoire.',
    who: 'Vous',
  },
  {
    title: 'Vous m\'envoyez vos contenus',
    desc: 'Logo, photos, vidéos, documents : un lien d\'envoi sécurisé vous est indiqué. Vous pouvez compléter plus tard.',
    who: 'Vous',
  },
  {
    title: 'Je crée votre site',
    desc: 'Design, textes, optimisation Google et mobile. Livraison en moins de 7 jours après réception de vos contenus.',
    who: 'Moi',
  },
  {
    title: 'Vous validez, c\'est en ligne',
    desc: 'Vous relisez le site, une retouche est incluse, puis je le mets en ligne. L\'hébergement est inclus la 1re année.',
    who: 'Ensemble',
  },
];

export default function ProcessSteps({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={`grid gap-5 ${compact ? 'sm:grid-cols-5' : 'sm:grid-cols-2 lg:grid-cols-5'}`}>
      {PROCESS_STEPS.map((step, i) => (
        <li key={step.title}>
          <AnimatedSection delay={i * 0.08} className="h-full">
            <div className={`flex h-full flex-col rounded-2xl border border-border/30 bg-surface-light ${compact ? 'p-4 sm:p-6' : 'p-6'}`}>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black gradient-text opacity-40 leading-none">{String(i + 1).padStart(2, '0')}</span>
                <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  {step.who}
                </span>
              </div>
              <h3 className={`text-sm font-bold text-foreground ${compact ? 'mt-3 sm:mt-5' : 'mt-5'}`}>{step.title}</h3>
              <p className={`mt-3 text-xs leading-loose text-muted ${compact ? 'hidden sm:block' : ''}`}>{step.desc}</p>
            </div>
          </AnimatedSection>
        </li>
      ))}
    </ol>
  );
}
