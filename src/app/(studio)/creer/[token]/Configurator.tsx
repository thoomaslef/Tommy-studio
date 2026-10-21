'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { FONT_PAIRS, PALETTES, resolveDesign } from '@/site-engine/design';
import { Icon } from '@/site-engine/icons';
import { CERTIFICATIONS, MAX_PHOTOS, MAX_REVIEWS, MAX_SERVICES, draftToSiteData, type SiteDraft } from '@/site-engine/sanitize';
import { TRADES, TRADE_IDS } from '@/site-engine/trades';
import type { SiteReview, SiteService, TemplateId, TradeId } from '@/site-engine/types';
import { DRAFT_STORAGE_KEY } from '../CreerStart';
import { uploadPhoto, type AssetView } from './photo-upload';

const STEPS = ['Entreprise', 'Services', 'Photos', 'Style', 'Aperçu'] as const;

const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'classique', name: 'Classique', desc: 'Clair et rassurant. Idéal pour inspirer confiance.' },
  { id: 'moderne', name: 'Moderne', desc: 'Grande typographie, blocs de couleur, très actuel.' },
  { id: 'robuste', name: 'Robuste', desc: 'Style chantier : majuscules, contrastes forts.' },
];

const inputClass =
  'w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground placeholder-muted/50 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20';

function Field({ label, hint, children, required }: { label: string; hint?: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {hint && <span className="mb-2 block text-xs text-muted">{hint}</span>}
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/50 px-4 py-3 text-sm text-foreground">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#6366f1]" />
      {label}
    </label>
  );
}

function LivePreview({ token, version, compact = false }: { token: string; version: number; compact?: boolean }) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);
  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  const frameW = device === 'mobile' ? 390 : 1280;
  const frameH = device === 'mobile' ? 844 : 900;
  const scale = Math.min(1, width / frameW);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="inline-flex rounded-xl border border-border/50 p-1 text-xs font-semibold">
          {(['mobile', 'desktop'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              className={`rounded-lg px-3 py-1.5 ${device === d ? 'bg-accent text-white' : 'text-muted'}`}
            >
              {d === 'mobile' ? 'Téléphone' : 'Ordinateur'}
            </button>
          ))}
        </div>
        <a href={`/apercu/${token}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-accent underline">
          Ouvrir en grand
        </a>
      </div>
      <div ref={box} className="w-full">
      <div
        className="mx-auto overflow-hidden rounded-2xl border border-border/50 bg-white"
        style={{ height: (compact ? 0.75 : 1) * frameH * scale, width: frameW * scale }}
      >
        <iframe
          key={`${version}-${device}`}
          src={`/apercu/${token}?v=${version}`}
          title="Aperçu de votre site"
          className="origin-top-left border-0"
          style={{ width: frameW, height: frameH, transform: `scale(${scale})` }}
        />
      </div>
      </div>
    </div>
  );
}

export default function Configurator({
  token,
  initialDraft,
  initialAssets,
  status,
}: {
  token: string;
  initialDraft: SiteDraft;
  initialAssets: AssetView[];
  status: string;
}) {
  const startTrade: TradeId = initialDraft.trade ?? 'multiservice';
  const [draft, setDraft] = useState<SiteDraft>(() => ({
    freeQuote: true,
    certifications: [],
    zone: [],
    reviews: [],
    ...initialDraft,
    trade: startTrade,
    services: initialDraft.services?.length ? initialDraft.services : TRADES[startTrade].services,
    style: initialDraft.style ?? { template: 'classique' },
  }));
  const [assets, setAssets] = useState<AssetView[]>(initialAssets);
  const [step, setStep] = useState(0);
  const [save, setSave] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [version, setVersion] = useState(0);
  const [zoneText, setZoneText] = useState((initialDraft.zone ?? []).join(', '));
  const [uploads, setUploads] = useState<{ name: string; pct: number; error?: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const firstRender = useRef(true);
  const top = useRef<HTMLDivElement>(null);
  const locked = status !== 'draft' && status !== 'live';

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, token);
    } catch {}
  }, [token]);

  // Sauvegarde automatique, 700 ms après la dernière modification
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (locked) return;
    setSave('saving');
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/projets/${token}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft }),
        });
        if (!res.ok) throw new Error();
        setSave('saved');
        setVersion((v) => v + 1);
      } catch {
        setSave('error');
      }
    }, 700);
    return () => clearTimeout(t);
  }, [draft, token, locked]);

  const set = <K extends keyof SiteDraft>(key: K, value: SiteDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const trade = TRADES[draft.trade ?? 'multiservice'];
  const photos = assets.filter((a) => a.kind === 'photo').sort((a, b) => a.position - b.position);
  const logo = assets.find((a) => a.kind === 'logo');

  // Textes proposés automatiquement, affichés en exemple dans les champs facultatifs
  const auto = useMemo(() => {
    const d = resolveDesign(draftToSiteData(token, { ...draft, tagline: undefined, about: undefined }, []));
    return { tagline: d.tagline, about: d.about, palette: d.palette.name };
  }, [draft, token]);

  const goTo = (s: number) => {
    setStep(s);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const missing = [
    !draft.businessName && 'le nom de votre entreprise',
    !draft.city && 'votre ville',
    !draft.phone && 'votre téléphone',
    photos.length === 0 && 'au moins une photo',
  ].filter(Boolean) as string[];

  const onFiles = async (files: FileList | null, kind: 'photo' | 'logo') => {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, kind === 'logo' ? 1 : Math.max(0, MAX_PHOTOS - photos.length));
    for (const file of list) {
      setUploads((u) => [...u, { name: file.name, pct: 0 }]);
      try {
        const asset = await uploadPhoto(token, file, kind, (pct) =>
          setUploads((u) => u.map((x) => (x.name === file.name ? { ...x, pct } : x))),
        );
        setAssets((a) => (kind === 'logo' ? [...a.filter((x) => x.kind !== 'logo'), asset] : [...a, asset]));
        setUploads((u) => u.filter((x) => x.name !== file.name));
        setVersion((v) => v + 1);
      } catch (err) {
        setUploads((u) => u.map((x) => (x.name === file.name ? { ...x, error: err instanceof Error ? err.message : 'Échec' } : x)));
      }
    }
  };

  const removeAsset = async (id: string) => {
    setAssets((a) => a.filter((x) => x.id !== id));
    await fetch(`/api/projets/${token}/photos/${id}`, { method: 'DELETE' });
    setVersion((v) => v + 1);
  };

  const makeFirst = async (id: string) => {
    const ordered = [id, ...photos.filter((p) => p.id !== id).map((p) => p.id)];
    setAssets((a) => a.map((x) => (x.kind === 'photo' ? { ...x, position: ordered.indexOf(x.id) } : x)));
    await fetch(`/api/projets/${token}/photos/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: ordered }),
    });
    setVersion((v) => v + 1);
  };

  const services = draft.services ?? [];
  const setService = (i: number, patch: Partial<SiteService>) => set('services', services.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const reviews = draft.reviews ?? [];
  const setReview = (i: number, patch: Partial<SiteReview>) => set('reviews', reviews.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const hasInsurance = !!draft.insurance;
  const insurer = (draft.insurance ?? '').replace(/^Assurance décennale\s*[—-]?\s*/i, '');
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/creer/${token}` : `/creer/${token}`;

  return (
    <section className="pt-28 pb-24 sm:pt-32">
      <div ref={top} className="section-container scroll-mt-24">
        {/* Progression */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {trade.label} · Étape {step + 2} sur 6
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">{draft.businessName || 'Votre site'}</h1>
          </div>
          <p className="text-xs font-medium text-muted" aria-live="polite">
            {locked
              ? 'Site verrouillé (paiement en cours)'
              : save === 'saving'
                ? 'Enregistrement…'
                : save === 'saved'
                  ? '✓ Enregistré automatiquement'
                  : save === 'error'
                    ? '⚠ Non enregistré, vérifiez votre connexion'
                    : 'Sauvegarde automatique'}
          </p>
        </div>
        <ol className="mt-6 grid grid-cols-5 gap-2">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button type="button" onClick={() => goTo(i)} className="block w-full text-left">
                <span className={`block h-1.5 rounded-full ${i <= step ? 'bg-accent' : 'bg-border/50'}`} />
                <span className={`mt-2 hidden text-[11px] font-medium sm:block ${i === step ? 'text-foreground' : 'text-muted/70'}`}>{s}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 space-y-8 lg:col-span-7">
            {/* ===== ENTREPRISE ===== */}
            {step === 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Métier" required>
                    <select value={draft.trade} onChange={(e) => set('trade', e.target.value as TradeId)} className={inputClass}>
                      {TRADE_IDS.map((id) => (
                        <option key={id} value={id}>
                          {TRADES[id].label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Nom de l’entreprise" required>
                    <input value={draft.businessName ?? ''} onChange={(e) => set('businessName', e.target.value)} placeholder="Ex : Durand Plomberie" className={inputClass} />
                  </Field>
                  <Field label="Ville" required>
                    <input value={draft.city ?? ''} onChange={(e) => set('city', e.target.value)} placeholder="Ex : Caen" className={inputClass} />
                  </Field>
                  <Field label="Rayon d’intervention">
                    <select value={draft.radiusKm ?? ''} onChange={(e) => set('radiusKm', e.target.value ? Number(e.target.value) : undefined)} className={inputClass}>
                      <option value="">Non précisé</option>
                      {[10, 20, 30, 40, 50, 80].map((km) => (
                        <option key={km} value={km}>
                          {km} km autour
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Communes desservies" hint="Séparées par des virgules. Elles aident Google à vous trouver dans ces villes.">
                  <input
                    value={zoneText}
                    onChange={(e) => {
                      setZoneText(e.target.value);
                      set('zone', e.target.value.split(',').map((z) => z.trim()).filter(Boolean));
                    }}
                    placeholder="Ex : Caen, Hérouville-Saint-Clair, Ifs"
                    className={inputClass}
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Téléphone" required>
                    <input type="tel" value={draft.phone ?? ''} onChange={(e) => set('phone', e.target.value)} placeholder="06 12 34 56 78" className={inputClass} />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={draft.email ?? ''} onChange={(e) => set('email', e.target.value)} placeholder="contact@monentreprise.fr" className={inputClass} />
                  </Field>
                  <Field label="Horaires">
                    <input value={draft.hours ?? ''} onChange={(e) => set('hours', e.target.value)} placeholder="Lun–Ven 8h–18h" className={inputClass} />
                  </Field>
                  <Field label="Adresse" hint="Facultatif, si vous recevez des clients.">
                    <input value={draft.address ?? ''} onChange={(e) => set('address', e.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Année de création">
                    <input
                      inputMode="numeric"
                      value={draft.foundedYear ?? ''}
                      onChange={(e) => set('foundedYear', e.target.value ? Number(e.target.value.replace(/\D/g, '').slice(0, 4)) : undefined)}
                      placeholder="Ex : 2012"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="SIRET" hint="Affiché dans les mentions légales.">
                    <input value={draft.siret ?? ''} onChange={(e) => set('siret', e.target.value)} className={inputClass} />
                  </Field>
                </div>
                <div className="space-y-3">
                  <Toggle
                    checked={hasInsurance}
                    onChange={(v) => set('insurance', v ? 'Assurance décennale' : undefined)}
                    label="J’ai une assurance décennale"
                  />
                  {hasInsurance && (
                    <input
                      value={insurer}
                      onChange={(e) => set('insurance', `Assurance décennale${e.target.value ? ` — ${e.target.value}` : ''}`)}
                      placeholder="Nom de l’assureur (facultatif)"
                      className={inputClass}
                    />
                  )}
                  <Toggle checked={!!draft.emergency} onChange={(v) => set('emergency', v)} label="J’interviens en urgence" />
                  <Toggle checked={draft.freeQuote !== false} onChange={(v) => set('freeQuote', v)} label="Je propose des devis gratuits" />
                </div>
                <Field label="Certifications et labels">
                  <div className="flex flex-wrap gap-2">
                    {CERTIFICATIONS.map((c) => {
                      const on = draft.certifications?.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          aria-pressed={on}
                          onClick={() => set('certifications', on ? draft.certifications?.filter((x) => x !== c) : [...(draft.certifications ?? []), c])}
                          className={`rounded-full border px-4 py-2 text-xs font-medium ${on ? 'border-accent bg-accent/10 text-foreground' : 'border-border/50 text-muted'}`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </>
            )}

            {/* ===== SERVICES ===== */}
            {step === 1 && (
              <>
                <Field label="Accroche" hint="Facultatif : laissez vide pour garder celle que nous proposons.">
                  <input value={draft.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} placeholder={auto.tagline} className={inputClass} />
                </Field>
                <Field label="Présentation" hint="Facultatif : laissez vide pour garder notre proposition.">
                  <textarea rows={4} value={draft.about ?? ''} onChange={(e) => set('about', e.target.value)} placeholder={auto.about} className={`${inputClass} resize-none`} />
                </Field>
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">Vos services</h2>
                    <button type="button" onClick={() => set('services', trade.services)} className="text-xs font-semibold text-accent underline">
                      Reprendre les services proposés
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {services.map((s, i) => (
                      <div key={i} className="rounded-2xl border border-border/40 bg-surface-light p-4">
                        <div className="flex gap-3">
                          <input value={s.title} onChange={(e) => setService(i, { title: e.target.value })} placeholder="Nom du service" className={`${inputClass} font-semibold`} />
                          <button
                            type="button"
                            aria-label="Retirer ce service"
                            onClick={() => set('services', services.filter((_, j) => j !== i))}
                            className="rounded-xl border border-border/50 px-3 text-muted hover:text-foreground"
                          >
                            ✕
                          </button>
                        </div>
                        <textarea rows={2} value={s.description ?? ''} onChange={(e) => setService(i, { description: e.target.value })} placeholder="Description courte" className={`${inputClass} mt-3 resize-none`} />
                        <input value={s.price ?? ''} onChange={(e) => setService(i, { price: e.target.value })} placeholder="Prix (facultatif), ex : Dès 90 €" className={`${inputClass} mt-3`} />
                      </div>
                    ))}
                  </div>
                  {services.length < MAX_SERVICES && (
                    <button
                      type="button"
                      onClick={() => set('services', [...services, { title: '' }])}
                      className="mt-4 w-full rounded-xl border border-dashed border-border px-4 py-3 text-sm font-semibold text-muted hover:text-foreground"
                    >
                      + Ajouter un service
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Avis de vos clients</h2>
                  <p className="mt-1 text-xs text-muted">Facultatif. Uniquement de vrais avis (Google, Pages Jaunes, messages reçus) : les faux avis sont interdits par la loi.</p>
                  <div className="mt-4 space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="rounded-2xl border border-border/40 bg-surface-light p-4">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <input value={r.author} onChange={(e) => setReview(i, { author: e.target.value })} placeholder="Prénom N." className={inputClass} />
                          <input value={r.city ?? ''} onChange={(e) => setReview(i, { city: e.target.value })} placeholder="Ville" className={inputClass} />
                          <select value={r.rating ?? 5} onChange={(e) => setReview(i, { rating: Number(e.target.value) })} className={inputClass}>
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>
                                {'★'.repeat(n)} ({n}/5)
                              </option>
                            ))}
                          </select>
                        </div>
                        <textarea rows={2} value={r.text} onChange={(e) => setReview(i, { text: e.target.value })} placeholder="Texte de l’avis" className={`${inputClass} mt-3 resize-none`} />
                        <button type="button" onClick={() => set('reviews', reviews.filter((_, j) => j !== i))} className="mt-2 text-xs text-muted underline">
                          Retirer cet avis
                        </button>
                      </div>
                    ))}
                  </div>
                  {reviews.length < MAX_REVIEWS && (
                    <button
                      type="button"
                      onClick={() => set('reviews', [...reviews, { author: '', text: '', rating: 5 }])}
                      className="mt-4 w-full rounded-xl border border-dashed border-border px-4 py-3 text-sm font-semibold text-muted hover:text-foreground"
                    >
                      + Ajouter un avis
                    </button>
                  )}
                </div>
              </>
            )}

            {/* ===== PHOTOS ===== */}
            {step === 2 && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Votre logo</h2>
                  <p className="mt-1 text-xs text-muted">Facultatif. Sans logo, le nom de votre entreprise est affiché.</p>
                  <div className="mt-4 flex items-center gap-4">
                    {logo && (
                      <div className="relative flex h-20 w-32 items-center justify-center rounded-xl border border-border/50 bg-white p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.url} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <label className="cursor-pointer rounded-xl border border-border/50 px-4 py-3 text-sm font-semibold text-foreground hover:border-accent">
                      {logo ? 'Changer le logo' : 'Ajouter mon logo'}
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFiles(e.target.files, 'logo')} />
                    </label>
                    {logo && (
                      <button type="button" onClick={() => removeAsset(logo.id)} className="text-xs text-muted underline">
                        Retirer
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Photos de vos chantiers</h2>
                  <p className="mt-1 text-xs text-muted">
                    Jusqu’à {MAX_PHOTOS} photos. La première sert d’image principale. Les photos de téléphone sont acceptées et réduites automatiquement.
                  </p>
                  <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 px-6 py-10 text-center hover:border-accent/50 hover:bg-accent/5">
                    <span className="text-sm font-semibold text-foreground">Touchez pour ajouter des photos</span>
                    <span className="mt-1 text-xs text-muted">
                      {photos.length} / {MAX_PHOTOS}
                    </span>
                    <input type="file" accept="image/*" multiple className="sr-only" disabled={photos.length >= MAX_PHOTOS} onChange={(e) => onFiles(e.target.files, 'photo')} />
                  </label>
                  {uploads.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {uploads.map((u) => (
                        <li key={u.name} className="rounded-xl border border-border/40 px-4 py-2 text-xs">
                          <div className="flex justify-between gap-3">
                            <span className="truncate text-foreground">{u.name}</span>
                            <span className={u.error ? 'text-red-400' : 'text-muted'}>{u.error ?? `${u.pct} %`}</span>
                          </div>
                          {!u.error && (
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-border/40">
                              <div className="h-full bg-accent transition-all" style={{ width: `${u.pct}%` }} />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photos.map((p, i) => (
                      <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                        {i === 0 && <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-1 text-[10px] font-bold text-white">Photo principale</span>}
                        <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/60 p-1.5">
                          {i > 0 && (
                            <button type="button" onClick={() => makeFirst(p.id)} className="flex-1 rounded-md bg-white/15 py-1 text-[10px] font-semibold text-white">
                              Principale
                            </button>
                          )}
                          <button type="button" onClick={() => removeAsset(p.id)} className="flex-1 rounded-md bg-white/15 py-1 text-[10px] font-semibold text-white">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ===== STYLE ===== */}
            {step === 3 && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Modèle</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {TEMPLATES.map((t) => {
                      const on = draft.style?.template === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => set('style', { ...(draft.style ?? { template: t.id }), template: t.id })}
                          className={`rounded-2xl border p-4 text-left ${on ? 'border-accent bg-accent/10' : 'border-border/50 hover:border-accent/40'}`}
                        >
                          <p className="font-bold text-foreground">{t.name}</p>
                          <p className="mt-1 text-xs text-muted">{t.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Couleurs</h2>
                  <p className="mt-1 text-xs text-muted">« Automatique » choisit des couleurs adaptées à votre métier ({auto.palette}).</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      aria-pressed={!draft.style?.palette}
                      onClick={() => set('style', { template: draft.style?.template ?? 'classique', fonts: draft.style?.fonts })}
                      className={`rounded-xl border px-4 py-2 text-xs font-semibold ${!draft.style?.palette ? 'border-accent bg-accent/10 text-foreground' : 'border-border/50 text-muted'}`}
                    >
                      Automatique
                    </button>
                    {PALETTES.map((p) => {
                      const on = draft.style?.palette === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          title={p.name}
                          aria-label={p.name}
                          aria-pressed={on}
                          onClick={() => set('style', { template: draft.style?.template ?? 'classique', fonts: draft.style?.fonts, palette: p.id })}
                          className={`flex h-10 w-10 overflow-hidden rounded-full border-2 ${on ? 'border-accent ring-2 ring-accent/40' : 'border-white/10'}`}
                        >
                          <span className="h-full w-1/2" style={{ background: p.primary }} />
                          <span className="h-full w-1/2" style={{ background: p.bg }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Typographie</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[{ id: '', name: 'Automatique' }, ...FONT_PAIRS].map((f) => {
                      const on = (draft.style?.fonts ?? '') === f.id;
                      return (
                        <button
                          key={f.id || 'auto'}
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            set('style', { template: draft.style?.template ?? 'classique', palette: draft.style?.palette, ...(f.id ? { fonts: f.id } : {}) })
                          }
                          className={`rounded-xl border px-4 py-2 text-xs font-semibold ${on ? 'border-accent bg-accent/10 text-foreground' : 'border-border/50 text-muted'}`}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ===== APERÇU ===== */}
            {step === 4 && (
              <>
                <LivePreview token={token} version={version} />
                {missing.length > 0 && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
                    Il manque encore : {missing.join(', ')}.
                  </div>
                )}
                <div className="rounded-2xl border border-border/40 bg-surface-light p-5">
                  <p className="text-sm font-bold text-foreground">Gardez ce lien pour revenir plus tard</p>
                  <p className="mt-1 text-xs text-muted">Il donne accès à votre site en création : ne le partagez pas.</p>
                  <div className="mt-3 flex gap-2">
                    <input readOnly value={shareUrl} className={`${inputClass} text-xs`} onFocus={(e) => e.target.select()} />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(shareUrl).then(() => setCopied(true));
                      }}
                      className="rounded-xl border border-border/50 px-4 text-xs font-semibold text-foreground"
                    >
                      {copied ? 'Copié' : 'Copier'}
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <p className="font-bold text-foreground">Votre site vous plaît ?</p>
                  <p className="mt-1 text-sm text-muted">
                    La mise en ligne avec paiement sécurisé arrive très bientôt. Votre site est déjà sauvegardé : vous pourrez le publier depuis ce lien.
                  </p>
                  <button type="button" disabled className="mt-4 w-full cursor-not-allowed rounded-xl bg-accent/40 px-6 py-4 text-sm font-bold text-white">
                    Publier mon site — bientôt disponible
                  </button>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex flex-col-reverse gap-3 border-t border-border/30 pt-6 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)} className="rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-muted hover:text-foreground">
                  Retour
                </button>
              ) : (
                <span />
              )}
              {step < STEPS.length - 1 && (
                <button type="button" onClick={() => goTo(step + 1)} className="rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/20">
                  {step === STEPS.length - 2 ? 'Voir mon site' : 'Continuer'}
                </button>
              )}
            </div>
          </div>

          {/* Aperçu en direct (ordinateur) */}
          {step < 4 && (
            <aside className="hidden lg:col-span-5 lg:block">
              <div className="sticky top-28">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  <Icon name="sun" className="h-3.5 w-3.5 text-accent" /> Aperçu en direct
                </p>
                <LivePreview token={token} version={version} compact />
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
