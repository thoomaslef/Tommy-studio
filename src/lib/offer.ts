export const SITE_PRICE = 99; // € TTC, paiement unique à la publication
export const HOSTING_RENEWAL_PRICE = 39; // €/an, à partir de la 2e année
export const formatEuro = (amount: number) => `${amount} €`;

/** Lien de paiement Stripe (99 €) ; le webhook met le site en ligne dès le paiement confirmé */
export const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/8x25kD2tVdV483D9SybV600';
export const STRIPE_PAYMENT_LINK_ID = 'plink_1UT2b8ETk8EYU5vthkpp1izl';
