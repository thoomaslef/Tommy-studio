import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';
import { GUARANTEE_DAYS, HOSTING_RENEWAL_PRICE, SITE_PRICE, formatEuro } from '@/lib/offer';

export const metadata: Metadata = pageMetadata({
  title: 'Conditions générales de vente',
  description: 'Conditions générales de vente du service de création de sites internet Tommy Studio.',
  path: '/cgv',
});

const sections = [
  {
    title: '1. Objet',
    body: (
      <p>
        Les présentes conditions générales de vente (« CGV ») encadrent l’utilisation du service Tommy Studio, qui permet de créer en ligne le site
        internet d’une entreprise, de le prévisualiser gratuitement puis de le faire publier et héberger. Le service est fourni par Thomas Lefevre,
        entrepreneur individuel exerçant sous le nom Tommy Studio (SIRET 10108233700011, 7 boulevard Leroy, 14000 Caen, France — thomas@tommy-studio.pro — +33 6 12 94 11 25),
        ci-après « le Prestataire ». Toute demande de publication implique l’acceptation sans réserve des CGV.
      </p>
    ),
  },
  {
    title: '2. Service réservé aux professionnels',
    body: (
      <p>
        Le service est exclusivement destiné aux professionnels (artisans, entrepreneurs individuels, sociétés) qui commandent un site pour les besoins de
        leur activité. Le Client indique son numéro SIRET et confirme, au moment de la commande, agir dans le cadre de son activité professionnelle. Le
        service n’est pas proposé aux consommateurs : les dispositions du Code de la consommation qui leur sont propres, notamment le droit de rétractation et
        la médiation de la consommation, ne s’appliquent donc pas.
      </p>
    ),
  },
  {
    title: '3. Le service',
    body: (
      <>
        <p>
          Le Client crée son site sur tommy-studio.pro/creer : il choisit son métier, saisit les informations de son entreprise, ajoute ses photos et choisit
          un style. La création et l’aperçu sont gratuits et sans engagement.
        </p>
        <p>
          Le site publié comprend une page complète (présentation, services, réalisations, avis, zone d’intervention, contact), adaptée aux téléphones, ainsi
          que son hébergement à l’adresse <strong>nom-de-l’entreprise.tommy-studio.pro</strong> ou sur le nom de domaine du Client s’il en dispose.
        </p>
      </>
    ),
  },
  {
    title: '4. Prix',
    body: (
      <>
        <p>
          La publication du site coûte <strong>{formatEuro(SITE_PRICE)}</strong>, payés à la publication. Ce prix comprend l’hébergement pendant les douze mois
          qui suivent la mise en ligne. L’hébergement se renouvelle ensuite pour <strong>{formatEuro(HOSTING_RENEWAL_PRICE)} par an</strong>, sans engagement.
        </p>
        <p>Les prix sont indiqués en euros et correspondent au montant total à payer. TVA non applicable, article 293 B du Code général des impôts. Un nom de domaine personnalisé, s’il est souhaité, est acheté et payé par le Client auprès du fournisseur de son choix.</p>
      </>
    ),
  },
  {
    title: '5. Commande et paiement',
    body: (
      <p>
        Lorsque son site lui convient, le Client demande sa publication depuis l’aperçu, indique son nom, son email et le SIRET de son entreprise, et accepte les CGV. Le paiement
        s’effectue en totalité en ligne, par carte bancaire, sur la page de paiement sécurisée de Stripe. La commande est ferme à la confirmation du paiement.
        Les données bancaires sont traitées par le prestataire de paiement et ne sont jamais conservées par le Prestataire. Une facture acquittée est envoyée par email au Client après le paiement ; le Client professionnel peut y faire figurer la raison sociale et le numéro de TVA de son entreprise.
      </p>
    ),
  },
  {
    title: '6. Mise en ligne',
    body: <p>Le site est mis en ligne automatiquement dès la confirmation du paiement, en général en quelques secondes. Son adresse est affichée au Client à l’écran puis lui est envoyée par email. En cas d’incident technique, la mise en ligne intervient au plus tard sous 48 heures ouvrées.</p>,
  },
  {
    title: '7. Contenus et modifications',
    body: (
      <>
        <p>
          Le Client est seul responsable des informations, textes, photos et avis qu’il publie. Il garantit qu’ils sont exacts, qu’il en détient les droits et
          que les avis clients publiés sont authentiques. Le Prestataire peut retirer tout contenu manifestement illicite.
        </p>
        <p>
          Le Client modifie lui-même son site, à tout moment, depuis le lien privé qui lui est attribué. Ce lien est personnel : le Client est responsable de sa
          confidentialité et prévient le Prestataire en cas de perte.
        </p>
      </>
    ),
  },
  {
    title: '8. Hébergement et renouvellement',
    body: (
      <p>
        L’hébergement est renouvelé chaque année au tarif indiqué à l’article 4. Il est sans engagement : le Client est prévenu par email avant chaque
        échéance et choisit de renouveler ou non. À défaut de renouvellement, le site est mis hors ligne à l’échéance ; ses contenus peuvent être supprimés
        trois mois plus tard.
      </p>
    ),
  },
  {
    title: '9. Propriété intellectuelle',
    body: (
      <p>
        Le Client reste propriétaire de ses contenus (textes, photos, logo). Les modèles, mises en page et éléments graphiques fournis par Tommy Studio
        restent la propriété du Prestataire, qui en concède au Client un droit d’utilisation pour toute la durée de l’hébergement.
      </p>
    ),
  },
  {
    title: '10. Exécution immédiate et garantie « satisfait ou remboursé »',
    body: (
      <>
        <p>
          Le Client demande la mise en ligne immédiate de son site dès le paiement. Le service étant réservé aux professionnels, aucun délai légal de
          rétractation ne s’applique. Tant que le site n’est pas publié, le Client peut abandonner sa création à tout moment, sans frais.
        </p>
        <p>
          À titre commercial, le Prestataire offre une garantie <strong>« satisfait ou remboursé » de {GUARANTEE_DAYS} jours</strong> à compter de la mise
          en ligne : si le site ne convient pas au Client, il peut demander le remboursement intégral du prix de la publication ({formatEuro(SITE_PRICE)}) en
          écrivant à thomas@tommy-studio.pro, sans avoir à se justifier. Le remboursement est effectué sur le moyen de paiement utilisé, sous quelques
          jours, et le site est alors mis hors ligne. Cette garantie ne s’applique pas au renouvellement de l’hébergement.
        </p>
      </>
    ),
  },
  {
    title: '11. Responsabilité',
    body: (
      <p>
        Le Prestataire est tenu à une obligation de moyens. Il ne garantit ni un positionnement précis dans les moteurs de recherche ni un volume de clients,
        et met en œuvre des moyens raisonnables pour assurer la disponibilité du site. Sa responsabilité est limitée au montant payé par le Client au cours des
        douze derniers mois, dans les limites permises par la loi.
      </p>
    ),
  },
  {
    title: '12. Données personnelles',
    body: (
      <p>
        Les données sont traitées conformément à notre{' '}
        <a href="/politique-de-confidentialite" className="font-semibold text-accent underline">
          politique de confidentialité
        </a>
        .
      </p>
    ),
  },
  {
    title: '13. Réclamations',
    body: (
      <p>
        Toute réclamation peut être adressée à thomas@tommy-studio.pro. Le Prestataire s’engage à y répondre sous 7 jours et à rechercher une solution
        amiable avant toute action.
      </p>
    ),
  },
  {
    title: '14. Droit applicable',
    body: (
      <p>
        Les CGV sont soumises au droit français. À défaut de résolution amiable, tout litige relève de la compétence exclusive des tribunaux de Caen.
      </p>
    ),
  },
];

export default function CgvPage() {
  return (
    <LegalPage
      eyebrow="Conditions de vente"
      title={
        <>
          Conditions générales <span className="gradient-text">de vente</span>
        </>
      }
      updated="21 octobre 2026"
      sections={sections}
    />
  );
}
