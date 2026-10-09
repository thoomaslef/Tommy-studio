import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales — Tommy Studio',
  description: 'Mentions légales du site tommy-studio.pro — éditeur, hébergeur, propriété intellectuelle.',
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-40">
        {/* Header */}
        <div className="mb-16 border-b border-border/50 pb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Informations légales</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Mentions légales
          </h1>
          <p className="mt-4 text-sm text-muted">Conformément aux articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique.</p>
        </div>

        <div className="prose-custom max-w-3xl space-y-14">

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">1. Éditeur du site</h2>
            <div className="space-y-3 text-sm leading-loose text-muted">
              <p>Le présent site <strong className="text-foreground">tommy-studio.pro</strong> est édité par :</p>
              <div className="gradient-border rounded-2xl bg-surface-light p-6 space-y-2">
                <p><strong className="text-foreground">Nom :</strong> Thomas Lefevre</p>
                <p><strong className="text-foreground">Forme juridique :</strong> Entrepreneur individuel</p>
                <p><strong className="text-foreground">SIRET :</strong> 10108233700011</p>
                <p><strong className="text-foreground">Adresse :</strong> Caen, Normandie, France</p>
                <p><strong className="text-foreground">E-mail :</strong> <a href="mailto:thomas@tommy-studio.pro" className="text-accent hover:text-accent-light transition-colors">thomas@tommy-studio.pro</a></p>
                <p><strong className="text-foreground">Téléphone :</strong> <a href="tel:+33612941125" className="text-accent hover:text-accent-light transition-colors">+33 6 12 94 11 25</a></p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">2. Directeur de la publication</h2>
            <p className="text-sm leading-loose text-muted">Le directeur de la publication est <strong className="text-foreground">Thomas Lefevre</strong>, joignable à l&apos;adresse e-mail suivante : <a href="mailto:thomas@tommy-studio.pro" className="text-accent hover:text-accent-light transition-colors">thomas@tommy-studio.pro</a>.</p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">3. Hébergeur</h2>
            <div className="space-y-3 text-sm leading-loose text-muted">
              <p>Le site est hébergé par :</p>
              <div className="gradient-border rounded-2xl bg-surface-light p-6 space-y-2">
                <p><strong className="text-foreground">Société :</strong> Vercel Inc.</p>
                <p><strong className="text-foreground">Adresse :</strong> 340 Pine Street Suite 401, San Francisco, CA 94104, États-Unis</p>
                <p><strong className="text-foreground">Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-light transition-colors">vercel.com</a></p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">4. Propriété intellectuelle</h2>
            <p className="text-sm leading-loose text-muted">L&apos;ensemble du contenu du site tommy-studio.pro (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) est la propriété exclusive de Thomas Lefevre, à l&apos;exception des marques, logos ou contenus appartenant à d&apos;autres sociétés partenaires ou auteurs.</p>
            <p className="mt-4 text-sm leading-loose text-muted">Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de Thomas Lefevre.</p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">5. Liens hypertextes et cookies</h2>
            <p className="text-sm leading-loose text-muted">Le site tommy-studio.pro ne contient aucun cookie tiers à des fins de tracking ou de publicité. Seuls des cookies techniques essentiels au bon fonctionnement du site peuvent être utilisés.</p>
            <p className="mt-4 text-sm leading-loose text-muted">La présence de liens hypertextes vers d&apos;autres sites ne peut engager la responsabilité de Tommy Studio quant à leur contenu.</p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">6. Droit applicable et juridiction</h2>
            <p className="text-sm leading-loose text-muted">Tout litige en relation avec l&apos;utilisation du site tommy-studio.pro est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Caen (Normandie).</p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-extrabold text-foreground mb-6 pb-3 border-b border-border/30">7. Contact</h2>
            <p className="text-sm leading-loose text-muted">Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :</p>
            <div className="mt-4 gradient-border rounded-2xl bg-surface-light p-6 space-y-2 text-sm text-muted">
              <p>📧 <a href="mailto:thomas@tommy-studio.pro" className="text-accent hover:text-accent-light transition-colors">thomas@tommy-studio.pro</a></p>
              <p>📞 <a href="tel:+33612941125" className="text-accent hover:text-accent-light transition-colors">+33 6 12 94 11 25</a></p>
              <p>📍 Caen, Normandie, France</p>
            </div>
          </section>

          <p className="text-xs text-muted/50 pt-8 border-t border-border/30">Dernière mise à jour : avril 2025</p>
        </div>
      </div>
    </div>
  );
}
