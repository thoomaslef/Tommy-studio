'use client';

import { useEffect, useState } from 'react';
import { DRAFT_STORAGE_KEY } from '../../creer/CreerStart';
import { liveSiteUrl } from '@/lib/live-site';

type State = { kind: 'waiting' } | { kind: 'live'; url: string; token: string } | { kind: 'unknown'; token: string | null };

/** Après le paiement : on attend la confirmation de Stripe (quelques secondes) puis on affiche l'adresse du site */
export default function PaymentStatus() {
  const [state, setState] = useState<State>({ kind: 'waiting' });

  useEffect(() => {
    let token: string | null = null;
    try {
      token = localStorage.getItem(DRAFT_STORAGE_KEY);
    } catch {}
    if (!token) {
      setState({ kind: 'unknown', token: null });
      return;
    }
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      tries++;
      try {
        const res = await fetch(`/api/projets/${token}`, { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.status === 'live' && data.slug) {
          setState({ kind: 'live', url: liveSiteUrl(data.slug), token: token! });
          return;
        }
      } catch {}
      if (tries < 20) timer = setTimeout(check, 3000);
      else setState({ kind: 'unknown', token });
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
          <a href={state.url} target="_blank" rel="noopener" className="mt-5 block break-all rounded-xl bg-background/60 px-4 py-4 text-base font-bold text-accent underline">
            {state.url}
          </a>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={state.url} target="_blank" rel="noopener" className="rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/20">
              Voir mon site
            </a>
            <a href={`/creer/${state.token}`} className="rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-foreground">
              Modifier mon site
            </a>
          </div>
          <p className="mt-6 text-xs text-muted">Vous pouvez modifier votre site à tout moment depuis votre lien privé : les changements sont en ligne aussitôt.</p>
        </>
      )}

      {state.kind === 'unknown' && (
        <>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Votre paiement est bien enregistré. La mise en ligne prend parfois quelques minutes : vous recevrez l’adresse de votre site par email.
          </p>
          {state.token && (
            <a href={`/creer/${state.token}`} className="mt-6 inline-block rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-foreground">
              Revenir à mon site
            </a>
          )}
          <p className="mt-6 text-xs text-muted">
            Une question ? <a href="mailto:thomas@tommy-studio.pro" className="text-accent underline">thomas@tommy-studio.pro</a>
          </p>
        </>
      )}
    </div>
  );
}
