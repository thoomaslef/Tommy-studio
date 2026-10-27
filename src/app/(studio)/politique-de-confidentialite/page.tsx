import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = pageMetadata({
  title: 'Politique de confidentialité',
  description: 'Protection des données personnelles sur tommy-studio.pro, conformément au RGPD.',
  path: '/politique-de-confidentialite',
});

const sections = [
  {
    title: '1. Responsable du traitement',
    body: <p>Thomas Lefevre, entrepreneur individuel (Tommy Studio) — SIRET 10108233700011 — 7 boulevard Leroy, 14000 Caen, France — thomas@tommy-studio.pro.</p>,
  },
  {
    title: '2. Données collectées',
    body: (
      <ul>
        <li>Les informations que vous saisissez pour créer votre site : nom de l’entreprise, métier, ville et zone d’intervention, coordonnées professionnelles, SIRET, services, avis, textes.</li>
        <li>Les photos et le logo que vous ajoutez.</li>
        <li>Votre nom et votre email lorsque vous demandez la publication de votre site.</li>
        <li>Les informations de paiement, traitées directement par le prestataire de paiement : nous n’avons jamais accès à vos données bancaires.</li>
      </ul>
    ),
  },
  {
    title: '3. Finalités et base légale',
    body: (
      <p>
        Ces données servent à créer, afficher, publier et héberger votre site, à vous contacter au sujet de votre commande et à respecter nos obligations
        comptables. Le traitement est fondé sur l’exécution du service que vous demandez (article 6.1.b du RGPD) et, pour la comptabilité, sur nos
        obligations légales (article 6.1.c).
      </p>
    ),
  },
  {
    title: '4. Données publiées',
    body: (
      <p>
        Les informations que vous saisissez pour votre site (coordonnées professionnelles, photos, textes) sont destinées à être rendues publiques lorsque le
        site est mis en ligne. N’y indiquez que ce que vous souhaitez rendre visible.
      </p>
    ),
  },
  {
    title: '5. Durée de conservation',
    body: (
      <ul>
        <li>Site en création non publié : conservé au plus 12 mois après votre dernière modification, puis supprimé.</li>
        <li>Site publié : conservé pendant toute la durée de l’hébergement, puis au plus 3 mois après sa mise hors ligne.</li>
        <li>Factures et pièces comptables : 10 ans, comme l’exige la loi.</li>
      </ul>
    ),
  },
  {
    title: '6. Sous-traitants',
    body: (
      <>
        <p>Vos données ne sont jamais vendues ni louées. Elles sont confiées uniquement aux prestataires techniques nécessaires au service :</p>
        <ul>
          <li>Vercel Inc. — hébergement du site (États-Unis) ;</li>
          <li>Supabase — base de données et stockage des photos (serveurs situés en Irlande, Union européenne) ;</li>
          <li>Resend — envoi des emails ;</li>
          <li>Stripe — paiement en ligne.</li>
        </ul>
        <p>Lorsque des données sont traitées hors de l’Union européenne, ces prestataires s’engagent à appliquer des garanties appropriées, comme les clauses contractuelles types de la Commission européenne.</p>
      </>
    ),
  },
  {
    title: '7. Cookies et stockage local',
    body: (
      <p>
        Le site n’utilise aucun cookie publicitaire ni outil de suivi. Pour vous permettre de reprendre votre site en création, le lien de votre brouillon
        est mémorisé dans le stockage local de votre navigateur. Ce stockage est strictement nécessaire au service et vous pouvez l’effacer à tout moment.
      </p>
    ),
  },
  {
    title: '8. Vos droits',
    body: (
      <p>
        Vous pouvez accéder à vos données, les rectifier, les effacer, en limiter l’utilisation, vous y opposer ou les récupérer. Écrivez à
        thomas@tommy-studio.pro : nous répondons sous 30 jours au plus. Vous pouvez aussi adresser une réclamation à la CNIL (www.cnil.fr).
      </p>
    ),
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      eyebrow="RGPD et confidentialité"
      title={
        <>
          Politique de <span className="gradient-text">confidentialité</span>
        </>
      }
      updated="21 octobre 2026"
      sections={sections}
    />
  );
}
