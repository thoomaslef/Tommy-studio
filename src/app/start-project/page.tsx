import type { Metadata } from 'next';
import StartProjectContent from './StartProjectContent';
import { isPlanId } from '@/lib/plans';

export const metadata: Metadata = {
  title: 'Commander mon site web dès 99€ | Tommy Studio',
  description:
    'Commandez votre site web en 5 étapes : choisissez votre formule (99€, 149€ ou 199€), décrivez votre activité et payez en ligne. Aucun rendez-vous.',
  alternates: {
    canonical: 'https://www.tommy-studio.pro/start-project',
  },
  openGraph: {
    title: 'Commander mon site web — Tommy Studio',
    description:
      'Site web professionnel à prix fixe dès 99€. Commande en ligne en 5 étapes, sans rendez-vous.',
    url: 'https://www.tommy-studio.pro/start-project',
  },
};

export default async function StartProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const formule = Array.isArray(params.formule) ? params.formule[0] : params.formule;

  return <StartProjectContent initialPlan={isPlanId(formule) ? formule : undefined} cancelled={params.annule === '1'} />;
}
