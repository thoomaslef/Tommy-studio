'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { TRADES, TRADE_IDS } from '@/site-engine/trades';
import { Icon } from '@/site-engine/icons';
import type { TradeId } from '@/site-engine/types';

export const DRAFT_STORAGE_KEY = 'ts-draft-token';

const noSubscribe = () => () => {};
const readSavedToken = () => {
  try {
    return localStorage.getItem(DRAFT_STORAGE_KEY);
  } catch {
    return null;
  }
};

export default function CreerStart() {
  const router = useRouter();
  const [loading, setLoading] = useState<TradeId | null>(null);
  const [error, setError] = useState('');
  // Lien privé gardé sur cet appareil (null côté serveur et en navigation privée)
  const resume = useSyncExternalStore(noSubscribe, readSavedToken, () => null);
  const [website, setWebsite] = useState('');

  const start = async (trade: TradeId) => {
    setLoading(trade);
    setError('');
    try {
      const res = await fetch('/api/projets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade, website }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || 'Une erreur est survenue.');
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, data.token);
      } catch {}
      router.push(`/creer/${data.token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setLoading(null);
    }
  };

  return (
    <section className="hero-spacing">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Étape 1 sur 6</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Créez le site de votre entreprise <span className="gradient-text">en 10 minutes</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Choisissez votre métier, remplissez vos infos, ajoutez vos photos : votre site s’affiche au fur et à mesure. Vous ne payez que lorsqu’il vous plaît.
          </p>
        </div>

        {resume && (
          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-accent/5 px-5 py-4 text-sm sm:flex-row">
            <span className="text-foreground">Vous avez déjà commencé un site sur cet appareil.</span>
            <a href={`/creer/${resume}`} className="rounded-xl bg-accent px-5 py-2.5 font-bold text-white">
              Reprendre mon site
            </a>
          </div>
        )}

        <h2 className="mt-14 text-center text-lg font-bold text-foreground">Quel est votre métier ?</h2>
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {TRADE_IDS.map((id) => {
            const t = TRADES[id];
            return (
              <button
                key={id}
                type="button"
                disabled={!!loading}
                onClick={() => start(id)}
                className="flex flex-col items-start gap-3 rounded-2xl border border-border/50 bg-surface-light p-5 text-left transition hover:border-accent/50 hover:bg-accent/5 disabled:opacity-60"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon name={t.icon} />
                </span>
                <span>
                  <span className="block font-bold text-foreground">{t.label}</span>
                  <span className="block text-xs text-muted">{loading === id ? 'Création…' : t.activity}</span>
                </span>
              </button>
            );
          })}
        </div>
        {error && <p role="alert" className="mt-6 text-center text-sm text-red-400">{error}</p>}
        <p className="mt-10 text-center text-xs text-muted/70">Gratuit jusqu’à la publication · Aucun compte à créer · Vos infos sont sauvegardées automatiquement</p>
      </div>
    </section>
  );
}
