import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectByToken } from '@/lib/supabase-server';
import { HOSTING_RENEWAL_PRICE, formatEuro } from '@/lib/offer';
import { CONTACT_PHONE, whatsappUrl } from '@/lib/contact';
import { Card, GuideShell, NotPublished, Notice, Step } from '../_components/GuideShell';

export const metadata: Metadata = { title: 'Héberger mon site moi-même', robots: { index: false, follow: false } };

export default async function SelfHostGuidePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const project = await getProjectByToken(token);
  if (!project) notFound();
  if (project.status !== 'live' || !project.slug) return <NotPublished token={token} />;

  return (
    <GuideShell
      token={token}
      title="Héberger mon site moi-même"
      intro={
        <>
          <p>
            Votre site vous appartient : vous pouvez en télécharger une <strong className="text-foreground">copie complète</strong> et la mettre en ligne chez l’hébergeur de votre choix, ou l’envoyer à
            quelqu’un qui s’occupe de votre informatique. Aucun frais, aucune condition.
          </p>
          <p className="mt-3">
            Pour la plupart des artisans, le plus simple reste de garder l’hébergement Tommy Studio ({formatEuro(HOSTING_RENEWAL_PRICE)} par an après la première année). Mais vous êtes libre.
          </p>
        </>
      }
    >
      <Step n={1} title="Télécharger la copie de votre site">
        <Card>
          <a
            href={`/api/projets/${token}/export`}
            download
            className="inline-block w-full rounded-xl bg-accent-dark px-6 py-4 text-center text-sm font-bold text-white shadow-lg shadow-accent/20 sm:w-auto"
          >
            Télécharger mon site (fichier ZIP)
          </a>
          <p className="text-xs">
            Vous obtenez un dossier avec votre page <code className="text-foreground">index.html</code>, ses images et ses polices, et un fichier <code className="text-foreground">LISEZ-MOI.txt</code>. C’est une copie à la
            date du téléchargement : si vous modifiez ensuite votre site dans l’outil, retéléchargez-la.
          </p>
        </Card>
      </Step>

      <Step n={2} title="Choisir où le mettre en ligne">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="font-bold text-foreground">Gratuit : Netlify ou Cloudflare Pages</p>
            <p>
              Décompressez le ZIP, puis glissez-déposez le dossier sur <strong className="text-foreground">app.netlify.com/drop</strong> : votre site est en ligne en quelques secondes, avec le HTTPS.
              Cloudflare Pages propose la même chose (« Direct Upload »). Vous pouvez ensuite y brancher votre nom de domaine.
            </p>
          </Card>
          <Card>
            <p className="font-bold text-foreground">Un hébergeur classique : OVH, o2switch, IONOS…</p>
            <p>
              Envoyez tout le contenu du dossier à la racine de votre hébergement (dossier « www » ou « public_html »), avec le gestionnaire de fichiers de l’hébergeur ou un logiciel FTP.
              Le fichier <code className="text-foreground">index.html</code> doit être à la racine.
            </p>
          </Card>
        </div>
      </Step>

      <Step n={3} title="Ce qui change">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Le formulaire de devis</strong> devient un bouton « Envoyer un email » et un bouton d’appel : il a besoin de nos serveurs pour fonctionner.
          </li>
          <li>
            <strong className="text-foreground">Les modifications</strong> ne passent plus par l’outil Tommy Studio : il faut modifier le fichier <code className="text-foreground">index.html</code> (un éditeur de texte suffit), ou
            demander à un prestataire.
          </li>
          <li>
            <strong className="text-foreground">Le HTTPS, les sauvegardes et le renouvellement du domaine</strong> sont à votre charge chez votre hébergeur.
          </li>
          <li>
            Votre site actuel chez Tommy Studio reste en ligne tant que l’hébergement est renouvelé : vous pouvez le garder jusqu’à ce que le nouveau fonctionne, puis ne pas le renouveler.
          </li>
        </ul>
        <Notice>
          Vos textes, vos photos et votre logo vous appartiennent. La mise en page peut être utilisée pour ce site sans limite de durée, mais pas revendue ni réutilisée pour d’autres sites.
        </Notice>
      </Step>

      <Notice>
        Besoin d’aide pour la mise en ligne ? Écrivez-moi sur{' '}
        <a href={whatsappUrl('Bonjour Thomas, j’aimerais de l’aide pour héberger mon site ailleurs.')} target="_blank" rel="noopener" className="font-semibold text-accent-light underline">
          WhatsApp
        </a>{' '}
        ou appelez le {CONTACT_PHONE}.
      </Notice>
    </GuideShell>
  );
}
