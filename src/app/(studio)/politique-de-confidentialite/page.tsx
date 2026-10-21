import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Tommy Studio',
  description: 'Politique de confidentialité et de protection des données personnelles du site tommy-studio.pro, conforme au RGPD.',
  robots: { index: false, follow: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-40">
        {/* Header */}
        <div className="mb-16 border-b border-border/50 pb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">RGPD &amp; Confidentialité</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-sm text-muted">Conformément au Règlement Général sur la Protection des Données (RGPD) — Règlement UE 2016/679.</p>
        </div>

        <div className="max-w-3xl space-y-14">

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">1. Responsable du traitement</h2>
            <div className="gradient-border rounded-2xl bg-surface-light p-6 space-y-2 text-sm text-muted">
              <p><strong className="text-foreground">Responsable :</strong> Thomas Lefevre (Tommy Studio)</p>
              <p><strong className="text-foreground">SIRET :</strong> 10108233700011</p>
              <p><strong className="text-foreground">Adresse :</strong> Caen, Normandie, France</p>
              <p><strong className="text-foreground">E-mail :</strong> <a href="mailto:thomas@tommy-studio.pro" className="text-accent hover:text-accent-light transition-colors">thomas@tommy-studio.pro</a></p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">2. Données collectées</h2>
            <p className="text-sm leading-loose text-muted mb-4">Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact du site :</p>
            <ul className="space-y-3">
              {[
                { label: 'Nom', detail: 'Pour personnaliser notre réponse.' },
                { label: 'Adresse e-mail', detail: 'Pour vous recontacter avec votre devis.' },
                { label: 'Service souhaité et description du projet', detail: 'Pour comprendre votre besoin et vous proposer une solution adaptée.' },
                { label: 'Budget et délai souhaité (optionnel)', detail: 'Pour adapter notre proposition.' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="text-sm text-muted">
                    <strong className="text-foreground">{item.label}</strong> — {item.detail}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl bg-accent/5 border border-accent/10 p-4 text-sm text-muted">
              <strong className="text-foreground">Nous ne collectons aucune autre donnée</strong> : pas de tracking comportemental, pas de cookie publicitaire, pas de données de navigation.
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">3. Finalité du traitement</h2>
            <p className="text-sm leading-loose text-muted">Les données collectées via le formulaire sont utilisées exclusivement pour :</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-accent mt-1">→</span> Répondre à votre demande de devis</li>
              <li className="flex items-start gap-2"><span className="text-accent mt-1">→</span> Établir une proposition commerciale personnalisée</li>
              <li className="flex items-start gap-2"><span className="text-accent mt-1">→</span> Assurer le suivi du projet si vous devenez client</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">4. Base légale</h2>
            <p className="text-sm leading-loose text-muted">Le traitement de vos données est fondé sur votre <strong className="text-foreground">consentement explicite</strong> (article 6.1.a du RGPD), exprimé au moment de la soumission du formulaire de contact.</p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">5. Durée de conservation</h2>
            <p className="text-sm leading-loose text-muted">Vos données sont conservées pendant <strong className="text-foreground">3 ans</strong> à compter de votre dernier contact, sauf demande de suppression de votre part. Elles sont ensuite supprimées définitivement de nos systèmes.</p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">6. Destinataires des données</h2>
            <p className="text-sm leading-loose text-muted">Vos données sont <strong className="text-foreground">strictement confidentielles</strong> et ne sont jamais vendues, louées ou cédées à des tiers à des fins commerciales.</p>
            <p className="mt-4 text-sm leading-loose text-muted">Elles peuvent être transmises uniquement à des sous-traitants techniques nécessaires au fonctionnement du service (hébergeur Vercel), dans le respect du RGPD et dans le cadre d&apos;un accord de traitement des données.</p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">7. Cookies</h2>
            <p className="text-sm leading-loose text-muted">Le site tommy-studio.pro <strong className="text-foreground">n&apos;utilise pas de cookies tiers</strong> (publicité, réseaux sociaux, analytics). Aucune technologie de tracking comportemental n&apos;est employée.</p>
            <p className="mt-4 text-sm leading-loose text-muted">Des cookies techniques essentiels (session, sécurité) peuvent être utilisés pour le bon fonctionnement du site. Ils ne collectent aucune donnée personnelle identifiable.</p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">8. Vos droits</h2>
            <p className="text-sm leading-loose text-muted mb-6">Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { right: 'Droit d\'accès', desc: 'Obtenir une copie des données que nous détenons sur vous.' },
                { right: 'Droit de rectification', desc: 'Corriger des données inexactes ou incomplètes.' },
                { right: 'Droit à l\'effacement', desc: 'Demander la suppression de vos données ("droit à l\'oubli").' },
                { right: 'Droit à la portabilité', desc: 'Recevoir vos données dans un format structuré et lisible.' },
                { right: 'Droit d\'opposition', desc: 'Vous opposer au traitement de vos données.' },
                { right: 'Droit à la limitation', desc: 'Demander la suspension du traitement dans certains cas.' },
              ].map((item) => (
                <div key={item.right} className="gradient-border rounded-xl bg-surface-light p-4">
                  <p className="text-sm font-bold text-foreground">{item.right}</p>
                  <p className="mt-1 text-xs text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 gradient-border rounded-2xl bg-surface-light p-6 text-sm text-muted">
              <p>Pour exercer ces droits, contactez-nous à :</p>
              <p className="mt-2"><a href="mailto:thomas@tommy-studio.pro" className="text-accent font-bold hover:text-accent-light transition-colors">thomas@tommy-studio.pro</a></p>
              <p className="mt-1 text-xs text-muted/70">Nous répondrons dans un délai maximum de 30 jours.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">9. Réclamation auprès de la CNIL</h2>
            <p className="text-sm leading-loose text-muted">Si vous estimez que vos droits n&apos;ont pas été respectés, vous avez le droit d&apos;introduire une réclamation auprès de la <strong className="text-foreground">Commission Nationale de l&apos;Informatique et des Libertés (CNIL)</strong> — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-light transition-colors">www.cnil.fr</a>.</p>
          </section>

          <p className="text-xs text-muted/50 pt-8 border-t border-border/30">Dernière mise à jour : avril 2025</p>
        </div>
      </div>
    </div>
  );
}
