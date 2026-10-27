'use client';

import { useRef, useState } from 'react';
import type { SiteData, SiteMode } from './types';
import { telHref } from './parts';

const field =
  'w-full rounded-(--s-radius) border border-(--s-border) bg-(--s-bg) px-4 py-3 text-base text-(--s-text) outline-none placeholder:text-(--s-muted) focus:border-(--s-primary) sm:text-sm';

/** Formulaire de demande de devis : envoyé par email à l'artisan (le message n'est pas conservé) */
export default function QuoteForm({ data, mode }: { data: SiteData; mode: SiteMode }) {
  const openedAt = useRef(0);
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  if (!data.email) return null;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (mode !== 'live') {
      setError(mode === 'demo' ? 'Formulaire de démonstration : rien n’est envoyé.' : 'Le formulaire sera actif une fois votre site publié.');
      return;
    }
    const form = new FormData(e.currentTarget);
    setState('sending');
    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: data.slug, elapsed: Date.now() - openedAt.current, ...Object.fromEntries(form) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Envoi impossible.');
      setState('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi impossible.');
      setState('idle');
    }
  };

  return (
    <section id="devis" className="scroll-mt-20 px-5 py-16">
      <div className="mx-auto max-w-2xl rounded-(--s-radius) border border-(--s-border) bg-(--s-surface) p-6 sm:p-10">
        <h2 className="s-heading text-3xl">{data.freeQuote !== false ? 'Demandez votre devis gratuit' : 'Écrivez-nous'}</h2>
        <p className="mt-2 text-(--s-muted)">Décrivez votre besoin, {data.businessName} vous recontacte rapidement.</p>
        {state === 'sent' ? (
          <p role="status" className="mt-8 rounded-(--s-radius) bg-(--s-primary) p-5 font-bold text-(--s-primary-ink)">
            Merci, votre demande est envoyée ✓ Vous serez recontacté très vite.
          </p>
        ) : (
          <form onSubmit={submit} onFocus={() => (openedAt.current ||= Date.now())} className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold">
                Nom
                <input name="name" required maxLength={80} autoComplete="name" className={field} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                Téléphone
                <input name="phone" required type="tel" maxLength={30} autoComplete="tel" className={field} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold">
                Email (facultatif)
                <input name="email" type="email" maxLength={120} autoComplete="email" className={field} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                Commune des travaux
                <input name="city" maxLength={80} autoComplete="address-level2" className={field} />
              </label>
            </div>
            <label className="grid gap-1.5 text-sm font-semibold">
              Votre besoin
              <textarea name="message" required rows={5} maxLength={2000} className={field} />
            </label>
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {error && (
              <p role="alert" className="text-sm font-semibold text-red-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={state === 'sending'}
              className="rounded-(--s-btn-radius) bg-(--s-primary) px-6 py-4 font-bold text-(--s-primary-ink) disabled:opacity-60"
            >
              {state === 'sending' ? 'Envoi…' : 'Envoyer ma demande'}
            </button>
            <p className="text-xs text-(--s-muted)">
              Vos coordonnées sont transmises uniquement à {data.businessName} pour répondre à votre demande. Vous préférez appeler ?{' '}
              <a href={telHref(data.phone)} className="font-semibold underline">
                {data.phone}
              </a>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
