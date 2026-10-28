import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectByToken } from '@/lib/supabase-server';
import { liveSiteUrl } from '@/lib/live-site';
import { CONTACT_PHONE, whatsappUrl } from '@/lib/contact';
import { DomainPanel } from '../_components/DomainPanel';
import { GuideShell, NotPublished, Notice, Step } from '../_components/GuideShell';

export const metadata: Metadata = { title: 'Mon nom de domaine', robots: { index: false, follow: false } };

export default async function DomainGuidePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const project = await getProjectByToken(token);
  if (!project) notFound();
  if (project.status !== 'live' || !project.slug) return <NotPublished token={token} />;
  const current = liveSiteUrl(project.slug).replace('https://', '');

  return (
    <GuideShell
      token={token}
      title="Mon nom de domaine"
      intro={
        <>
          <p>
            Votre site est en ligne sur <strong className="text-foreground">{current}</strong>. Avec votre <strong className="text-foreground">propre nom de domaine</strong>, par exemple{' '}
            <em>durand-plomberie.fr</em>, il fait plus professionnel sur un devis ou un camion, et vous le gardez même si vous changez un jour de prestataire.
          </p>
          <p className="mt-3">
            C’est facultatif. Le branchement est inclus, seul le nom de domaine est à payer à votre fournisseur : en général <strong className="text-foreground">8 à 15 € par an</strong>. Comptez 15 minutes.
          </p>
        </>
      }
    >
      <Step n={1} title="Acheter le nom de domaine">
        <p>
          Choisissez un nom court, facile à dicter au téléphone : votre entreprise, ou votre métier et votre ville (<em>durand-plomberie.fr</em>, <em>plombier-caen.fr</em>). Les extensions <strong className="text-foreground">.fr</strong> et{' '}
          <strong className="text-foreground">.com</strong> inspirent le plus confiance.
        </p>
        <p>
          Vous pouvez l’acheter chez n’importe quel fournisseur : OVH, Gandi, IONOS, Namecheap… Achetez <strong className="text-foreground">uniquement le nom de domaine</strong>, sans hébergement ni site web, ni les options qu’on vous propose en plus.
          Faites-le à votre nom et avec une adresse email que vous gardez : le domaine est à vous.
        </p>
      </Step>

      <Step n={2} title="Indiquer votre nom de domaine">
        <DomainPanel token={token} initialDomain={project.custom_domain} initialStatus={project.custom_domain_status} />
      </Step>

      <Step n={3} title="Où ajouter ces deux lignes ?">
        <p>
          Chez le fournisseur où vous avez acheté le domaine, cherchez « <strong className="text-foreground">Zone DNS</strong> », « Enregistrements DNS » ou « Gérer le DNS », puis « Ajouter un enregistrement ».
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-foreground">OVH</strong> : espace client → Noms de domaine → votre domaine → onglet « Zone DNS » → « Ajouter une entrée ».
          </li>
          <li>
            <strong className="text-foreground">Gandi</strong> : Domaines → votre domaine → « Enregistrements DNS » → « Ajouter ».
          </li>
          <li>
            <strong className="text-foreground">Autres</strong> : cherchez « DNS » dans les réglages du domaine, ou demandez à leur assistance « comment ajouter un enregistrement A et un CNAME ».
          </li>
        </ul>
        <Notice>
          Les changements peuvent mettre de quelques minutes à quelques heures pour s’appliquer (rarement plus). Votre site actuel et vos emails continuent de fonctionner pendant ce temps.
          Si votre domaine servait déjà à un autre site, il sera remplacé par celui-ci.
        </Notice>
      </Step>

      <Notice>
        Bloqué à une étape ? Écrivez-moi sur{' '}
        <a href={whatsappUrl('Bonjour Thomas, j’ai une question sur mon nom de domaine.')} target="_blank" rel="noopener" className="font-semibold text-accent-light underline">
          WhatsApp
        </a>{' '}
        ou appelez le {CONTACT_PHONE}. Envoyez-moi une capture d’écran de votre zone DNS, je vous dis quoi changer.
      </Notice>
    </GuideShell>
  );
}
