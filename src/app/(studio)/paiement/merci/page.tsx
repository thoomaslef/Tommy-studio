import type { Metadata } from 'next';
import PaymentStatus from './PaymentStatus';

export const metadata: Metadata = {
  title: 'Merci pour votre commande',
  robots: { index: false, follow: false },
};

export default function MerciPage() {
  return (
    <section className="pt-32 pb-24 sm:pt-40">
      <div className="section-container max-w-2xl">
        <PaymentStatus />
      </div>
    </section>
  );
}
