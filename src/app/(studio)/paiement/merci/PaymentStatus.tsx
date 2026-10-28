'use client';

import { useEffect, useState } from 'react';
import { DRAFT_STORAGE_KEY } from '@/lib/draft-storage';
import { liveSiteUrl } from '@/lib/live-site';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, whatsappUrl } from '@/lib/contact';

type State = { kind: 'waiting' } | { kind: 'live'; url: string; editToken: string | null } | { kind: 'unknown' };

/**
 * Après le paiement : on attend la confirmation de Stripe (quelques secondes) puis on affiche l'adresse du site.
 * Le site est retrouvé par la session Stripe de l'URL, ou à défaut par le lien privé gardé sur cet appareil.
 */
export default function PaymentStatus() {
  const [state, setState] = useState<State>({ kind: 'waiting' });

  useEffect(() => {
    const session = new URLSearchParams(window.location.search).get('session');
    let token: string | null = null;
    try {
      token = localStorage.getItem(DRAFT_STORAGE_KEY);
    } catch {}

    // Lien de modification proposé seulement si le projet de cet appareil est bien celui qui vient d'être publié
    const ownProject = async () => {
      if (!token) return null;
      const res = await fetch(`/api/projets/${token}`, { cache: 'no-store' });
      const data = await res.json();
      return res.ok && data.status === 'live' && data.slug ? { url: liveSiteUrl(data.slug), token } : null;
    };

    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      tries++;
      try {
        const mine = await ownProject();
        if (session) {
          const res = await fetch(`/api/paiement/statut?session=${encodeURIComponent(session)}`, { cache: 'no-store' });
          const data = await res.json();
          if (res.ok && data.status === 'live') {
            setState({ kind: 'live', url: data.url, editToken: mine && mine.url === data.url ? mine.token : null });
            return;
          }
        } else if (mine) {
          setState({ kind: 'live', url: mine.url, editToken: mine.token });
          return;
        }
      } catch {}
      if ((session || token) && tries < 20) timer = setTimeout(check, 3000);
      else setState({ kind: 'unknown' });
    };
    check();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-3xl border border-border/40 bg-surface-light p-8 text-center sm:p-12">
      <p className="text-4xl" aria-hidden>
        {state.kind === 'live' ? '🎉' : '✓'}
      </p>
      <h1 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">
        {state.kind === 'live' ? 'Votre site est en ligne !' : 'Merci, paiement reçu'}
      </h1>

      {state.kind === 'waiting' && (
        <p className="mt-4 text-sm leading-relaxed text-muted" aria-live="polite">
          Mise en ligne de votre site en cours… cela prend quelques secondes.
        </p>
      )}

      {state.kind === 'live' && (
        <>
          <p className="mt-4 text-sm leading-relaxed text-muted">Voici son adresse, à partager à vos clients et à ajouter sur votre fiche Google :</p>
          <a href={state.url} target="_blank" rel="noopener" className="mt-5 block break-all rounded-xl bg-background/60 px-4 py-4 text-base font-bold text-accent-light underline">
            {state.url.replace('https://', '')}
          </a>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={state.url} target="_blank" rel="noopener" className="rounded-xl bg-accent-dark px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/20">
              Voir mon site
            </a>
            {state.editToken && (
              <a href={`/creer/${state.editToken}`} className="rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-foreground">
                Modifier mon site
              </a>
            )}
          </div>
          {state.editToken && (
            <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
              <a href={`/creer/${state.editToken}/google`} className="rounded-xl border border-border/50 p-4 hover:border-accent/50">
                <span className="block text-sm font-bold text-foreground">Étape suivante : ma fiche Google →</span>
                <span className="mt-1 block text-xs text-muted">Apparaître sur Google Maps, en 15 minutes.</span>
              </a>
              <a href={`/creer/${state.editToken}/domaine`} className="rounded-xl border border-border/50 p-4 hover:border-accent/50">
                <span className="block text-sm font-bold text-foreground">Mon nom de domaine →</span>
                <span className="mt-1 block text-xs text-muted">Facultatif : votre-entreprise.fr</span>
              </a>
            </div>
          )}
          <p className="mt-6 text-xs leading-relaxed text-muted">
            Vous venez de recevoir un email avec l’adresse de votre site et votre lien privé pour le modifier à tout moment. Pensez à vérifier vos spams.
          </p>
        </>
      )}

      {state.kind === 'unknown' && (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Votre paiement est bien enregistré. La mise en ligne prend parfois quelques minutes : vous allez recevoir par email l’adresse de votre site et votre
          lien pour le modifier.
        </p>
      )}

      <p className="mt-8 border-t border-border/40 pt-6 text-sm text-muted">
        Une question ? Appelez-moi au{' '}
        <a href={CONTACT_PHONE_HREF} className="font-semibold text-accent-light underline">
          {CONTACT_PHONE}
        </a>
        , sur{' '}
        <a href={whatsappUrl()} target="_blank" rel="noopener" className="font-semibold text-accent-light underline">
          WhatsApp
        </a>{' '}
        ou à{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-accent-light underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
