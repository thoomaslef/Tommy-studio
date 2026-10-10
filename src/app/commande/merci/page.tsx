import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Merci pour votre commande | Tommy Studio',
  robots: { index: false, follow: false },
};

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawRef = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const ref = rawRef && /^CMD-\d{6}-[A-F0-9]{4}$/.test(rawRef) ? rawRef : null;

  return (
    <section className="relative hero-spacing overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative section-container !max-w-2xl">
        <div className="flex flex-col items-center rounded-2xl border border-accent/20 bg-surface-light p-8 text-center glow sm:p-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-accent/20 bg-accent/10">
            <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Merci, c&apos;est payé !</h1>
          {ref && <p className="mt-2 text-xs text-muted">Référence de commande : {ref}</p>}
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
            Votre paiement est bien enregistré et votre brief m&apos;a été transmis. Vous allez recevoir votre reçu de paiement par email.
          </p>

          <div className="mt-10 w-full max-w-md text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted/70">Et maintenant ?</p>
            <ol className="mt-4 space-y-4 text-sm text-muted">
              <li className="flex gap-3">
                <span className="font-bold text-accent">1.</span>
                <span>
                  <strong className="text-foreground">Envoyez-moi vos contenus</strong> : logo, photos, vidéos, documents. Vous pouvez en ajouter plus tard.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent">2.</span>
                <span>Je crée votre site et je vous le présente en moins de 7 jours après réception de vos contenus.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent">3.</span>
                <span>Vous validez, je fais la retouche incluse, puis je mets le site en ligne.</span>
              </li>
            </ol>
          </div>

          <Link
            href="/envoi-fichiers"
            className="mt-10 inline-flex w-full items-center justify-center rounded-xl bg-accent px-8 py-4 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/40 sm:w-auto"
          >
            Envoyer mes fichiers
          </Link>
          <p className="mt-6 text-xs text-muted">
            Une question ? <a href="mailto:thomas@tommy-studio.pro" className="font-semibold text-accent underline">thomas@tommy-studio.pro</a>
          </p>
        </div>
      </div>
    </section>
  );
}
