import type { Metadata } from 'next';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Hébergement renouvelé',
  robots: { index: false, follow: false },
};

export default function RenouvellementPage() {
  return (
    <section className="pt-32 pb-24 sm:pt-40">
      <div className="section-container max-w-2xl">
        <div className="rounded-3xl border border-border/40 bg-surface-light p-8 text-center sm:p-12">
          <p className="text-4xl" aria-hidden>
            ✓
          </p>
          <h1 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">Merci, votre site reste en ligne</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            L’hébergement de votre site est prolongé d’un an. Vous allez recevoir un email de confirmation, et votre facture par Stripe.
          </p>
          <p className="mt-8 border-t border-border/40 pt-6 text-sm text-muted">
            Une question ? Appelez-moi au{' '}
            <a href={CONTACT_PHONE_HREF} className="font-semibold text-accent-light underline">
              {CONTACT_PHONE}
            </a>{' '}
            ou écrivez à{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-accent-light underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
