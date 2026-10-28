'use client';

import { useState } from 'react';
import { DNS_A_VALUE, DNS_CNAME_VALUE } from '@/lib/domain';
import { CopyField } from './CopyField';

type Status = 'pending' | 'active' | null;
type Dns = { apex: 'ok' | 'missing' | 'other'; www: 'ok' | 'missing' | 'other' };

const inputClass =
  'w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-base text-foreground placeholder-muted/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm';

const dnsLabel = (s: 'ok' | 'missing' | 'other') => (s === 'ok' ? '✓ Bien configuré' : s === 'missing' ? '✗ Aucun enregistrement trouvé' : '⚠ Pointe encore ailleurs');

/** Saisie du nom de domaine, enregistrements DNS à créer, et vérification en direct */
export function DomainPanel({ token, initialDomain, initialStatus }: { token: string; initialDomain: string | null; initialStatus: Status }) {
  const [domain, setDomain] = useState<string | null>(initialDomain);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dns, setDns] = useState<Dns | null>(null);
  const [checkedOnce, setCheckedOnce] = useState(false);

  const call = async (path: string, method: string, body?: unknown) => {
    const res = await fetch(`/api/projets/${token}/domaine${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Une erreur est survenue.');
    return data;
  };

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await call('', 'POST', { domain: input });
      setDomain(data.domain);
      setStatus(data.status);
      setDns(null);
      setCheckedOnce(false);
      setInput('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    }
    setBusy(false);
  };

  const verify = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await call('/verifier', 'POST');
      setStatus(data.status);
      setDns(data.dns);
      setCheckedOnce(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    }
    setBusy(false);
  };

  const remove = async () => {
    if (!confirm('Retirer ce nom de domaine ? Votre site restera en ligne sur son adresse tommy-studio.pro.')) return;
    setBusy(true);
    try {
      await call('', 'DELETE');
      setDomain(null);
      setStatus(null);
      setDns(null);
      setCheckedOnce(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    }
    setBusy(false);
  };

  if (!domain) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground" htmlFor="domain">
          Votre nom de domaine
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input id="domain" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ex : durand-plomberie.fr" inputMode="url" autoCapitalize="none" autoCorrect="off" className={inputClass} />
          <button
            type="button"
            onClick={save}
            disabled={busy || !input.trim()}
            className="rounded-xl bg-accent-dark px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy ? 'Enregistrement…' : 'Continuer'}
          </button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/40 bg-surface-light p-5">
        <div>
          <p className="text-xs text-muted">Votre nom de domaine</p>
          <p className="text-lg font-extrabold text-foreground">{domain}</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${status === 'active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-200'}`}>
          {status === 'active' ? '✓ Actif' : 'En cours de branchement'}
        </span>
      </div>

      {status === 'active' ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm leading-relaxed text-foreground">
          <p className="font-bold">Votre site est en ligne sur {domain} 🎉</p>
          <p className="mt-2 text-muted">
            <a href={`https://${domain}`} target="_blank" rel="noopener" className="font-semibold text-accent-light underline">
              Ouvrir https://{domain}
            </a>
            . Pensez à mettre cette adresse dans votre fiche Google, vos cartes de visite et sur votre camion. L’ancienne adresse reste valable.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 rounded-2xl border border-border/40 bg-surface-light p-5 sm:p-6">
            <p className="text-sm font-bold text-foreground">Les deux lignes à ajouter dans la « zone DNS » de votre domaine</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-border/40 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-accent-light">Ligne 1 · type A</p>
                <p className="text-xs text-muted">Nom (ou « hôte ») : <strong className="text-foreground">@</strong> (ou laissez vide)</p>
                <CopyField label="Valeur" value={DNS_A_VALUE} />
              </div>
              <div className="space-y-3 rounded-xl border border-border/40 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-accent-light">Ligne 2 · type CNAME</p>
                <p className="text-xs text-muted">Nom (ou « hôte ») : <strong className="text-foreground">www</strong></p>
                <CopyField label="Valeur" value={DNS_CNAME_VALUE} />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Si une ligne « A » ou « CNAME » existe déjà pour le même nom (souvent une page d’attente de votre fournisseur), supprimez-la ou remplacez sa valeur. Ne touchez pas aux lignes « MX » ou « TXT » :
              ce sont celles de vos emails.
            </p>
          </div>

          <div className="space-y-4">
            <button type="button" onClick={verify} disabled={busy} className="w-full rounded-xl bg-accent-dark px-6 py-4 text-sm font-bold text-white shadow-lg shadow-accent/20 disabled:opacity-60 sm:w-auto">
              {busy ? 'Vérification…' : 'Vérifier mon domaine'}
            </button>
            {dns && (
              <ul className="space-y-1.5 rounded-2xl border border-border/40 bg-surface-light p-4 text-sm">
                <li>
                  <span className="text-muted">{domain} :</span> <strong className="text-foreground">{dnsLabel(dns.apex)}</strong>
                </li>
                <li>
                  <span className="text-muted">www.{domain} :</span> <strong className="text-foreground">{dnsLabel(dns.www)}</strong>
                </li>
              </ul>
            )}
            {checkedOnce && dns?.apex === 'ok' && (
              <p className="rounded-2xl border border-accent/25 bg-accent/5 p-4 text-sm leading-relaxed text-muted">
                <strong className="text-foreground">Vos réglages sont bons.</strong> Il me reste à brancher votre domaine de mon côté : je suis prévenu automatiquement, c’est fait en général sous 1 à 2 jours ouvrés.
                Revenez sur cette page pour voir le statut passer à « Actif ».
              </p>
            )}
            {checkedOnce && dns && dns.apex !== 'ok' && (
              <p className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-200">
                Les changements de DNS peuvent prendre de quelques minutes à quelques heures pour être pris en compte. Vérifiez que les deux lignes sont bien enregistrées, puis réessayez un peu plus tard.
              </p>
            )}
          </div>
        </>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
      <button type="button" onClick={remove} disabled={busy} className="text-xs font-semibold text-muted underline hover:text-foreground">
        Changer ou retirer ce nom de domaine
      </button>
    </div>
  );
}
