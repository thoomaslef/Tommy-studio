import type { Metadata } from 'next';
import { EXTRA_REVISION_PRICE, HOSTING_RENEWAL_PRICE, PLANS, PLAN_IDS, formatEuro } from '@/lib/plans';

export const metadata: Metadata = {
  title: 'Conditions générales de vente | Tommy Studio',
  description: 'Conditions générales de vente des services de création de site web de Tommy Studio.',
  alternates: { canonical: 'https://www.tommy-studio.pro/cgv' },
};

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Objet',
    body: (
      <p>
        Les présentes conditions générales de vente (« CGV ») régissent les commandes de création de site web passées sur
        tommy-studio.pro auprès de Thomas Lefevre, entrepreneur individuel exerçant sous le nom Tommy Studio (SIRET 10108233700011,
        Caen, France — thomas@tommy-studio.pro — +33 6 12 94 11 25), ci-après « le Prestataire ». Toute commande implique l&apos;acceptation sans réserve des CGV.
      </p>
    ),
  },
  {
    title: '2. Services et prix',
    body: (
      <>
        <p>Le Prestataire propose trois formules de création de site web, à prix fixe et payables en une seule fois :</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {PLAN_IDS.map((id) => (
            <li key={id}>
              <strong className="text-foreground">{PLANS[id].name} — {formatEuro(PLANS[id].price)}</strong> : {PLANS[id].summary.toLowerCase()}.
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Les prix sont indiqués en euros et correspondent au montant total à payer pour la formule choisie. L&apos;hébergement du site est inclus
          la première année ; il se renouvelle ensuite pour {formatEuro(HOSTING_RENEWAL_PRICE)} par an. Le nom de domaine personnalisé,
          s&apos;il est souhaité, est acheté et payé par le Client.
        </p>
      </>
    ),
  },
  {
    title: '3. Commande',
    body: (
      <p>
        Le Client choisit sa formule et remplit le brief en ligne (activité, pages, style, informations de contact). Il vérifie le
        récapitulatif, accepte les CGV, puis procède au paiement. La commande est ferme à réception du paiement. Le Client garantit
        l&apos;exactitude des informations transmises.
      </p>
    ),
  },
  {
    title: '4. Paiement',
    body: (
      <p>
        Le paiement est exigible en totalité à la commande, par les moyens proposés sur la page de paiement sécurisée. Les données
        bancaires sont traitées par le prestataire de paiement et ne sont jamais conservées par le Prestataire.
      </p>
    ),
  },
  {
    title: '5. Contenus du Client',
    body: (
      <p>
        Le Client fournit les contenus nécessaires (logo, photos, vidéos, textes, documents) via le lien d&apos;envoi indiqué après la
        commande. Il garantit détenir les droits sur ces contenus et en autorise l&apos;utilisation pour la création et la publication
        de son site. Le Prestataire ne peut être tenu responsable d&apos;un retard lié à la transmission tardive ou incomplète des contenus.
      </p>
    ),
  },
  {
    title: '6. Délai de livraison',
    body: (
      <p>
        Le Prestataire s&apos;engage à présenter le site au Client en moins de 7 jours calendaires à compter de la réception du
        paiement et de l&apos;ensemble des contenus nécessaires. Ce délai est indicatif en cas de force majeure ou de contenus
        manquants.
      </p>
    ),
  },
  {
    title: '7. Validation et retouches',
    body: (
      <p>
        Le Client examine le site présenté. Une série de retouches est incluse dans le prix. Les retouches supplémentaires sont
        facturées {formatEuro(EXTRA_REVISION_PRICE)} chacune. Une retouche est une modification ponctuelle de textes, d&apos;images ou
        de mise en forme ; elle ne comprend pas la création de nouvelles pages ou fonctionnalités, qui font l&apos;objet d&apos;un devis.
        Sans retour du Client dans un délai raisonnable, le site est réputé validé.
      </p>
    ),
  },
  {
    title: '8. Hébergement',
    body: (
      <p>
        Le site est hébergé par le Prestataire auprès d&apos;un hébergeur professionnel. L&apos;hébergement est inclus la première année
        suivant la mise en ligne, puis renouvelé annuellement au tarif de {formatEuro(HOSTING_RENEWAL_PRICE)} sauf résiliation par le Client avant
        l&apos;échéance, auquel cas le site est mis hors ligne à la date d&apos;échéance.
      </p>
    ),
  },
  {
    title: '9. Propriété intellectuelle',
    body: (
      <p>
        Sous réserve du paiement intégral, le Prestataire cède au Client les droits d&apos;exploitation sur les éléments de création du
        site réalisés pour lui. Les outils, bibliothèques et composants tiers utilisés restent soumis à leurs licences propres. Le
        Prestataire peut mentionner la réalisation à titre de référence, sauf opposition écrite du Client.
      </p>
    ),
  },
  {
    title: '10. Droit de rétractation',
    body: (
      <p>
        Si le Client est un consommateur, il dispose en principe d&apos;un délai de 14 jours pour se rétracter d&apos;un contrat conclu à
        distance. Toutefois, le Client demande expressément le démarrage immédiat de la prestation dès le paiement et reconnaît
        perdre son droit de rétractation lorsque le service est pleinement exécuté avant la fin de ce délai. En cas de rétractation
        avant exécution complète, il est tenu de payer un montant proportionnel au service déjà fourni. Le droit de rétractation ne
        s&apos;applique pas aux clients professionnels, sauf dispositions légales contraires.
      </p>
    ),
  },
  {
    title: '11. Responsabilité',
    body: (
      <p>
        Le Prestataire est tenu à une obligation de moyens. Il ne garantit pas de résultat précis en matière de positionnement dans
        les moteurs de recherche ni de volume de clients. Sa responsabilité est limitée au montant payé par le Client pour la
        commande concernée, dans les limites permises par la loi.
      </p>
    ),
  },
  {
    title: '12. Données personnelles',
    body: (
      <p>
        Les données collectées sont utilisées pour traiter la commande et créer le site. Elles sont traitées conformément à notre{' '}
        <a href="/politique-de-confidentialite" className="font-semibold text-accent underline">politique de confidentialité</a>.
      </p>
    ),
  },
  {
    title: '13. Réclamations et médiation',
    body: (
      <p>
        Pour toute réclamation, le Client peut écrire à thomas@tommy-studio.pro. Conformément au Code de la consommation, tout
        consommateur peut recourir gratuitement à un médiateur de la consommation en cas de litige non résolu.
      </p>
    ),
  },
  {
    title: '14. Droit applicable',
    body: (
      <p>
        Les CGV sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents de
        Caen seront seuls compétents, sous réserve des règles protectrices applicables aux consommateurs.
      </p>
    ),
  },
];

export default function CgvPage() {
  return (
    <section className="relative hero-spacing">
      <div className="section-container !max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Conditions générales <span className="gradient-text">de vente</span>
        </h1>
        <p className="mt-4 text-sm text-muted">Dernière mise à jour : octobre 2026</p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-4 border-b border-border/30 pb-3 text-xl font-extrabold text-foreground">{s.title}</h2>
              <div className="text-sm leading-loose text-muted">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
