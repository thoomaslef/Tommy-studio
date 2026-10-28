import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectByToken } from '@/lib/supabase-server';
import { siteFromProject } from '@/lib/site-from-project';
import { liveSiteUrl } from '@/lib/live-site';
import { customDomainUrl } from '@/lib/domain';
import { CATEGORY_HINTS, DESCRIPTION_MAX, googleDescription, googleServices, reviewRequestMessage, serviceArea } from '@/lib/google-kit';
import { TRADES } from '@/site-engine/trades';
import { CONTACT_PHONE, whatsappUrl } from '@/lib/contact';
import { Checklist } from '../_components/Checklist';
import { CopyField } from '../_components/CopyField';
import { Card, GuideShell, NotPublished, Notice, Step } from '../_components/GuideShell';

export const metadata: Metadata = { title: 'Ma fiche Google', robots: { index: false, follow: false } };

export default async function GoogleGuidePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const project = await getProjectByToken(token);
  if (!project) notFound();
  if (project.status !== 'live' || !project.slug) return <NotPublished token={token} />;

  const data = await siteFromProject(project);
  const trade = TRADES[data.trade];
  const hint = CATEGORY_HINTS[data.trade];
  const siteUrl = project.custom_domain && project.custom_domain_status === 'active' ? customDomainUrl(project.custom_domain) : liveSiteUrl(project.slug);
  const description = googleDescription(data);
  const services = googleServices(data);
  const area = serviceArea(data);

  return (
    <GuideShell
      token={token}
      title="Ma fiche Google"
      intro={
        <>
          <p>
            Quand quelqu’un cherche « {trade.label.toLowerCase()} {data.city} » sur son téléphone, Google affiche d’abord une carte avec quelques entreprises : c’est la{' '}
            <strong className="text-foreground">fiche Google Business Profile</strong>. Elle est gratuite, et c’est elle qui fait sonner le téléphone. Votre site s’y ajoute en un clic.
          </p>
          <p className="mt-3">
            J’ai déjà rédigé tout ce qu’il faut à partir de votre site : vous n’avez qu’à copier-coller. Comptez 15 minutes, plus le délai de vérification par Google.
          </p>
        </>
      }
    >
      <Step n={1} title="Créer la fiche">
        <p>
          Sur votre téléphone ou votre ordinateur, ouvrez <strong className="text-foreground">google.com/business</strong> (ou cherchez le nom de votre entreprise sur Google : si une fiche existe déjà,
          cliquez sur « Gérer cette fiche » plutôt que d’en créer une autre, <strong className="text-foreground">ne créez jamais de doublon</strong>). Connectez-vous avec un compte Google que vous garderez, pas celui d’un proche.
        </p>
        <Card>
          <CopyField
            label="Nom de l’entreprise"
            value={data.businessName}
            hint="Exactement le nom que vous utilisez sur vos devis, votre camion et vos factures. N’y ajoutez ni ville ni mots-clés : Google peut suspendre une fiche dont le nom est modifié."
          />
        </Card>
      </Step>

      <Step n={2} title="Choisir la catégorie">
        <p>
          C’est le réglage le plus important : il décide des recherches où votre fiche peut apparaître. Dans le champ « Catégorie », tapez{' '}
          <strong className="text-foreground">« {hint.search} »</strong>
          {hint.alternatives.length > 0 && <> (ou {hint.alternatives.map((a) => `« ${a} »`).join(', ')})</>} et choisissez la suggestion qui correspond le mieux à votre métier.
        </p>
        <Notice>
          Vous pouvez ajouter des <strong className="text-foreground">catégories secondaires</strong> pour vos autres activités. Tapez des mots de vos services (par exemple{' '}
          {data.services
            .slice(0, 3)
            .map((s) => `« ${s.title.toLowerCase()} »`)
            .join(', ')}
          ) et gardez seulement celles qui correspondent vraiment à ce que vous faites. Google affiche la liste exacte de ses catégories quand vous tapez : elle peut évoluer.
        </Notice>
      </Step>

      <Step n={3} title="Adresse et zone d’intervention">
        <p>
          Google demande si vous accueillez des clients à une adresse. Si vous vous déplacez chez eux (cas de la plupart des artisans), répondez{' '}
          <strong className="text-foreground">« Non »</strong> : votre adresse ne s’affichera pas, et vous indiquerez à la place les villes où vous intervenez. N’utilisez jamais une fausse adresse ou une
          simple boîte aux lettres pour passer la vérification : c’est une cause fréquente de suspension.
        </p>
        <Card>
          <CopyField label="Zone d’intervention" value={area.join(', ')} hint="À saisir ville par ville dans « Zone de service ». Gardez les communes où vous allez réellement : une zone trop large est contre-productive." />
        </Card>
      </Step>

      <Step n={4} title="Téléphone et site web">
        <Card>
          <CopyField label="Téléphone" value={data.phone} />
          <CopyField label="Site web" value={siteUrl} hint="Vérifiez qu’il s’ouvre bien. Si vous branchez plus tard votre propre nom de domaine, pensez à remplacer ce lien dans la fiche." />
        </Card>
      </Step>

      <Step n={5} title="Vérification par Google">
        <p>
          Google doit vérifier que l’entreprise existe. Selon votre cas, il propose un appel ou un SMS, une <strong className="text-foreground">courte vidéo</strong> (montrez votre véhicule, votre matériel, un
          chantier) ou une carte postale avec un code, qui arrive en général sous quelques jours à une semaine. Suivez simplement ce que Google vous demande, sans passer par un intermédiaire.
        </p>
        <Notice tone="warn">
          Méfiance : certaines sociétés vous appellent pour « vérifier » ou « remonter » votre fiche contre de l’argent. La fiche est gratuite, et vous n’avez besoin de personne pour la valider.
        </Notice>
      </Step>

      <Step n={6} title="Description, horaires et services">
        <Card>
          <CopyField
            label={`Description (${description.length} caractères sur ${DESCRIPTION_MAX} maximum)`}
            value={description}
            multiline
            hint="Les premières lignes sont les plus lues : elles contiennent l’essentiel. Relisez-la et adaptez-la à votre façon de parler."
          />
          {data.hours ? (
            <CopyField label="Horaires" value={data.hours} hint="À saisir jour par jour dans « Horaires d’ouverture »." />
          ) : (
            <p>Pensez à renseigner vos horaires dans la fiche : ajoutez-les aussi à votre site, ils s’y afficheront.</p>
          )}
        </Card>
        {services.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-foreground">Vos services</p>
            <p>Dans la rubrique « Services » de la fiche, ajoutez chacun de vos services avec sa description :</p>
            {services.map((s) => (
              <Card key={s.name}>
                <CopyField label={s.name} value={s.description || s.name} multiline />
              </Card>
            ))}
          </div>
        )}
      </Step>

      <Step n={7} title="Photos">
        <p>
          Ajoutez votre <strong className="text-foreground">logo</strong>, 3 à 5 photos de chantiers terminés et une photo de vous ou de votre véhicule. Une fiche avec de vraies photos inspire bien plus confiance qu’une fiche
          vide. Vous pouvez réutiliser celles de votre site.
        </p>
      </Step>

      <Step n={8} title="Demander des avis après chaque chantier">
        <p>
          Les avis sont ce qui fait choisir une entreprise plutôt qu’une autre. Dans votre fiche, cliquez sur « Demander des avis » pour obtenir votre lien, puis envoyez ce message par SMS ou WhatsApp à chaque client
          satisfait, à la fin du chantier :
        </p>
        <Card>
          <CopyField label="Message à envoyer à vos clients" value={reviewRequestMessage(data)} multiline />
        </Card>
        <p>
          Répondez ensuite à chaque avis, même court : c’est visible et rassurant pour les futurs clients. N’achetez jamais d’avis et n’en écrivez pas vous-même : Google les supprime et peut sanctionner la fiche.
        </p>
      </Step>

      <section>
        <h2 className="text-xl font-extrabold text-foreground">Votre check-list</h2>
        <div className="mt-4">
          <Checklist
            storageKey={`ts-google-${project.id}`}
            items={[
              'Fiche créée avec le nom exact de mon entreprise',
              'Catégorie principale choisie',
              'Zone d’intervention renseignée (adresse masquée si je me déplace)',
              'Téléphone et site web ajoutés',
              'Vérification demandée à Google',
              'Description, horaires et services ajoutés',
              'Logo et photos de chantiers ajoutés',
              'Premier avis client demandé',
            ]}
          />
        </div>
      </section>

      <Notice>
        Un blocage, une fiche suspendue, un écran qui ne ressemble pas à ce guide (Google change souvent ses menus) ? Écrivez-moi sur{' '}
        <a href={whatsappUrl('Bonjour Thomas, j’ai une question sur ma fiche Google.')} target="_blank" rel="noopener" className="font-semibold text-accent-light underline">
          WhatsApp
        </a>{' '}
        ou appelez le {CONTACT_PHONE}, je vous aide.
      </Notice>
    </GuideShell>
  );
}
