'use client';

import { useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import ProcessSteps from '@/components/ProcessSteps';
import {
  DOMAIN_OPTIONS,
  EMPTY_BRIEF,
  LOGO_OPTIONS,
  PAGE_OPTIONS,
  STEP_TITLES,
  STYLE_OPTIONS,
  TEXTS_OPTIONS,
  stepErrors,
  type Brief,
} from '@/lib/brief';
import {
  EXTRA_REVISION_PRICE,
  HOSTING_RENEWAL_PRICE,
  PLANS,
  PLAN_IDS,
  formatEuro,
  type PlanId,
} from '@/lib/plans';

const inputClass =
  'w-full rounded-xl border border-border/50 bg-background/50 px-5 py-4 text-sm text-foreground placeholder-muted/60 outline-none transition-all duration-300 hover:border-border focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-background';
const errorClass = 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20';

function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {hint && <p className="mb-3 text-xs leading-relaxed text-muted">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function RadioList({
  options,
  value,
  onChange,
  invalid,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  return (
    <div className="grid gap-2" role="radiogroup">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
              active
                ? 'border-accent bg-accent/10 text-foreground'
                : `${invalid ? 'border-red-500/40' : 'border-border/50'} text-muted hover:border-accent/40 hover:text-foreground`
            }`}
          >
            <span
              className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${
                active ? 'border-accent' : 'border-border'
              }`}
            >
              {active && <span className="h-2 w-2 rounded-full bg-accent" />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function StartProjectContent({
  initialPlan,
  cancelled,
}: {
  initialPlan?: PlanId;
  cancelled?: boolean;
}) {
  const [brief, setBrief] = useState<Brief>({ ...EMPTY_BRIEF, plan: initialPlan ?? '' });
  const [step, setStep] = useState(initialPlan ? 1 : 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [manualRef, setManualRef] = useState<string | null>(null);
  const formTop = useRef<HTMLDivElement>(null);

  const plan = brief.plan ? PLANS[brief.plan] : null;

  const set = <K extends keyof Brief>(key: K, value: Brief[K]) => {
    setBrief((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const goTo = (target: number) => {
    setStep(target);
    setSubmitError('');
    requestAnimationFrame(() => formTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const next = () => {
    const errs = stepErrors(step, brief);
    setErrors(errs);
    if (Object.keys(errs).length === 0) goTo(step + 1);
  };

  const togglePage = (page: string) => {
    if (!plan) return;
    const selected = brief.pages.includes(page);
    if (!selected && brief.pages.length >= plan.maxPages) {
      setErrors((prev) => ({ ...prev, pages: `Votre formule inclut ${plan.maxPages} pages maximum.` }));
      return;
    }
    set('pages', selected ? brief.pages.filter((p) => p !== page) : [...brief.pages, page]);
  };

  const submit = async () => {
    const errs = stepErrors(4, brief);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fields) {
          setErrors(data.fields);
          const firstStep = [0, 1, 2, 3, 4].find((s) => Object.keys(stepErrors(s, brief)).length > 0);
          if (firstStep !== undefined) goTo(firstStep);
        }
        throw new Error(data.error || 'Une erreur est survenue.');
      }
      if (data.mode === 'stripe' && data.url) {
        window.location.href = data.url;
        return;
      }
      setManualRef(data.ref);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSending(false);
    }
  };

  const recapRow = (label: string, value: string) =>
    value ? (
      <div className="grid gap-1 py-2 sm:grid-cols-3 sm:gap-4">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="text-sm text-foreground sm:col-span-2 whitespace-pre-line break-words">{value}</dd>
      </div>
    ) : null;

  return (
    <>
      {/* Hero */}
      <section className="relative hero-spacing overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="relative section-container flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-xs font-semibold tracking-wide text-accent"
          >
            Dès 99€ · Paiement unique · Aucun rendez-vous
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Commandez votre site
            <br />
            <span className="gradient-text glow-text">en 5 étapes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Choisissez votre formule, racontez-moi votre activité, payez en ligne : je m&apos;occupe de la création.
            Voici comment ça se passe, de la commande à la mise en ligne.
          </motion.p>
        </div>
      </section>

      {/* Process */}
      <section className="relative pb-16 sm:pb-20">
        <div className="section-container">
          <ProcessSteps compact />
        </div>
      </section>

      {/* Form */}
      <section className="relative section-spacing !pt-0">
        <div ref={formTop} className="section-container scroll-mt-24">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-5">
            <AnimatedSection className="lg:col-span-3 min-w-0">
              {manualRef ? (
                <div className="flex flex-col items-center rounded-2xl border border-accent/20 bg-surface-light p-8 text-center glow sm:p-12">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-accent/20 bg-accent/10">
                    <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground">Commande enregistrée</h2>
                  <p className="mt-2 text-xs text-muted">Référence : {manualRef}</p>
                  <ol className="mt-8 w-full max-w-md space-y-4 text-left text-sm text-muted">
                    <li className="flex gap-3">
                      <span className="font-bold text-accent">1.</span>
                      <span>
                        Je vous envoie <strong className="text-foreground">votre lien de paiement par email</strong> sous 24 h
                        ({plan ? formatEuro(plan.price) : ''}). Pensez à vérifier vos spams.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-accent">2.</span>
                      <span>Une fois le paiement reçu, vous m&apos;envoyez vos photos, votre logo et vos documents.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-accent">3.</span>
                      <span>Je crée votre site et vous le présente en moins de 7 jours après réception de vos contenus.</span>
                    </li>
                  </ol>
                  <Link
                    href="/envoi-fichiers"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl border border-accent/30 px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
                  >
                    Envoyer mes fichiers dès maintenant
                  </Link>
                </div>
              ) : (
                <div className="gradient-border rounded-2xl bg-surface-light p-6 sm:p-10">
                  {cancelled && (
                    <p className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
                      Le paiement a été annulé : votre commande n&apos;est pas validée. Vous pouvez la reprendre ci-dessous.
                    </p>
                  )}

                  {/* Progress */}
                  <nav aria-label="Étapes" className="mb-10">
                    <ol className="grid grid-cols-5 gap-2">
                      {STEP_TITLES.map((title, i) => (
                        <li key={title}>
                          <button
                            type="button"
                            disabled={i > step}
                            onClick={() => goTo(i)}
                            aria-current={i === step ? 'step' : undefined}
                            className="block w-full text-left disabled:cursor-default"
                          >
                            <span
                              className={`block h-1.5 rounded-full transition-colors ${
                                i <= step ? 'bg-accent' : 'bg-border/50'
                              }`}
                            />
                            <span
                              className={`mt-2 hidden text-[11px] font-medium sm:block ${
                                i === step ? 'text-foreground' : 'text-muted/70'
                              }`}
                            >
                              {i + 1}. {title}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-3 text-xs font-medium text-muted sm:hidden">
                      Étape {step + 1} sur 5 — {STEP_TITLES[step]}
                    </p>
                  </nav>

                  {/* Honeypot */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Site web
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={brief.website}
                        onChange={(e) => set('website', e.target.value)}
                      />
                    </label>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* ÉTAPE 1 — Formule */}
                      {step === 0 && (
                        <>
                          <div>
                            <h2 className="text-2xl font-extrabold text-foreground">Choisissez votre formule</h2>
                            <p className="mt-2 text-sm text-muted">Prix fixe, payé une seule fois. Vous pourrez changer d&apos;avis avant de payer.</p>
                          </div>
                          <div className="grid gap-4" role="radiogroup" aria-label="Formule">
                            {PLAN_IDS.map((id) => {
                              const p = PLANS[id];
                              const active = brief.plan === id;
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  role="radio"
                                  aria-checked={active}
                                  onClick={() => set('plan', id)}
                                  className={`rounded-2xl border p-5 text-left transition-all ${
                                    active ? 'border-accent bg-accent/10' : 'border-border/50 hover:border-accent/40'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">{p.tagline}</p>
                                      <p className="mt-1 text-lg font-extrabold text-foreground">{p.name}</p>
                                      <p className="mt-1 text-sm text-muted">{p.summary}</p>
                                    </div>
                                    <p className="text-3xl font-black gradient-text">{formatEuro(p.price)}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {errors.plan && <p role="alert" className="text-xs text-red-400">{errors.plan}</p>}
                        </>
                      )}

                      {/* ÉTAPE 2 — Activité */}
                      {step === 1 && (
                        <>
                          <div>
                            <h2 className="text-2xl font-extrabold text-foreground">Parlez-moi de votre activité</h2>
                            <p className="mt-2 text-sm text-muted">Plus vous êtes précis, plus le site vous ressemblera — et moins il y aura de retouches.</p>
                          </div>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <Field label="Nom de l'activité" htmlFor="businessName" required error={errors.businessName}>
                              <input id="businessName" value={brief.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder="Ex : Les Jardins de Jérôme" className={`${inputClass} ${errors.businessName ? errorClass : ''}`} />
                            </Field>
                            <Field label="Métier / secteur" htmlFor="sector" required error={errors.sector}>
                              <input id="sector" value={brief.sector} onChange={(e) => set('sector', e.target.value)} placeholder="Ex : paysagiste, coiffeuse, plombier…" className={`${inputClass} ${errors.sector ? errorClass : ''}`} />
                            </Field>
                            <div className="sm:col-span-2">
                              <Field label="Ville ou zone d'intervention" htmlFor="city" required error={errors.city}>
                                <input id="city" value={brief.city} onChange={(e) => set('city', e.target.value)} placeholder="Ex : Caen et 30 km autour" className={`${inputClass} ${errors.city ? errorClass : ''}`} />
                              </Field>
                            </div>
                          </div>
                          <Field label="Décrivez votre activité" htmlFor="activity" required hint="Ce que vous faites, depuis quand, ce qui vous différencie." error={errors.activity}>
                            <textarea id="activity" rows={5} value={brief.activity} onChange={(e) => set('activity', e.target.value)} className={`${inputClass} resize-none ${errors.activity ? errorClass : ''}`} />
                          </Field>
                          <Field label="Vos services ou produits principaux" htmlFor="services" hint="Une ligne par service, avec les prix si vous voulez les afficher.">
                            <textarea id="services" rows={4} value={brief.services} onChange={(e) => set('services', e.target.value)} className={`${inputClass} resize-none`} />
                          </Field>
                          <Field label="Vos clients types" htmlFor="audience">
                            <input id="audience" value={brief.audience} onChange={(e) => set('audience', e.target.value)} placeholder="Ex : particuliers, petites entreprises…" className={inputClass} />
                          </Field>
                        </>
                      )}

                      {/* ÉTAPE 3 — Site */}
                      {step === 2 && (
                        <>
                          <div>
                            <h2 className="text-2xl font-extrabold text-foreground">Votre site</h2>
                            <p className="mt-2 text-sm text-muted">Pages, style, logo et nom de domaine.</p>
                          </div>

                          {plan?.id === 'essentiel' ? (
                            <p className="rounded-xl border border-border/40 bg-background/40 px-4 py-3 text-sm text-muted">
                              La formule <strong className="text-foreground">Essentiel</strong> est un site d&apos;une seule page : accueil, présentation, services et contact y sont regroupés.
                            </p>
                          ) : (
                            <Field
                              label="Pages souhaitées"
                              hint={`Choisissez jusqu'à ${plan?.maxPages ?? 5} pages (${brief.pages.length} sélectionnée${brief.pages.length > 1 ? 's' : ''}).`}
                              error={errors.pages}
                            >
                              <div className="flex flex-wrap gap-2">
                                {PAGE_OPTIONS.map((page) => {
                                  const active = brief.pages.includes(page);
                                  return (
                                    <button
                                      key={page}
                                      type="button"
                                      aria-pressed={active}
                                      onClick={() => togglePage(page)}
                                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                                        active ? 'border-accent bg-accent/10 text-foreground' : 'border-border/50 text-muted hover:border-accent/40'
                                      }`}
                                    >
                                      {page}
                                    </button>
                                  );
                                })}
                              </div>
                            </Field>
                          )}

                          <Field label="Style souhaité" required error={errors.style}>
                            <RadioList options={STYLE_OPTIONS} value={brief.style} onChange={(v) => set('style', v)} invalid={!!errors.style} />
                          </Field>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <Field label="Couleurs" htmlFor="colors" hint="Celles de votre logo, ou vos préférences.">
                              <input id="colors" value={brief.colors} onChange={(e) => set('colors', e.target.value)} placeholder="Ex : vert foncé et beige" className={inputClass} />
                            </Field>
                            <Field label="Sites que vous aimez" htmlFor="inspirations" hint="Liens facultatifs.">
                              <input id="inspirations" value={brief.inspirations} onChange={(e) => set('inspirations', e.target.value)} placeholder="https://…" className={inputClass} />
                            </Field>
                          </div>
                          <Field label="Logo" required error={errors.logo}>
                            <RadioList options={LOGO_OPTIONS} value={brief.logo} onChange={(v) => set('logo', v)} invalid={!!errors.logo} />
                          </Field>
                          <Field label="Textes du site" required error={errors.texts}>
                            <RadioList options={TEXTS_OPTIONS} value={brief.texts} onChange={(v) => set('texts', v)} invalid={!!errors.texts} />
                          </Field>
                          <Field label="Nom de domaine" required hint="L'adresse de votre site. Si vous en achetez un, c'est vous qui le payez (environ 10 €/an) et je vous guide." error={errors.domain}>
                            <RadioList options={DOMAIN_OPTIONS} value={brief.domain} onChange={(v) => set('domain', v)} invalid={!!errors.domain} />
                          </Field>
                          {brief.domain === DOMAIN_OPTIONS[1] && (
                            <Field label="Votre nom de domaine" htmlFor="domainName" required error={errors.domainName}>
                              <input id="domainName" value={brief.domainName} onChange={(e) => set('domainName', e.target.value)} placeholder="monentreprise.fr" className={`${inputClass} ${errors.domainName ? errorClass : ''}`} />
                            </Field>
                          )}
                        </>
                      )}

                      {/* ÉTAPE 4 — Infos pratiques */}
                      {step === 3 && (
                        <>
                          <div>
                            <h2 className="text-2xl font-extrabold text-foreground">Infos à afficher sur le site</h2>
                            <p className="mt-2 text-sm text-muted">Ce que vos visiteurs verront pour vous contacter.</p>
                          </div>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <Field label="Téléphone" htmlFor="phone" error={errors.phone}>
                              <input id="phone" type="tel" value={brief.phone} onChange={(e) => set('phone', e.target.value)} placeholder="06 12 34 56 78" className={`${inputClass} ${errors.phone ? errorClass : ''}`} />
                            </Field>
                            <Field label="Email professionnel" htmlFor="publicEmail" error={errors.publicEmail}>
                              <input id="publicEmail" type="email" value={brief.publicEmail} onChange={(e) => set('publicEmail', e.target.value)} placeholder="contact@monentreprise.fr" className={`${inputClass} ${errors.publicEmail ? errorClass : ''}`} />
                            </Field>
                          </div>
                          <Field label="Adresse" htmlFor="address" hint="Facultatif — pour afficher une carte Google Maps.">
                            <input id="address" value={brief.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
                          </Field>
                          <Field label="Horaires" htmlFor="hours">
                            <textarea id="hours" rows={3} value={brief.hours} onChange={(e) => set('hours', e.target.value)} placeholder="Lun–Ven : 9h–18h" className={`${inputClass} resize-none`} />
                          </Field>
                          <Field label="Réseaux sociaux" htmlFor="socials" hint="Liens Instagram, Facebook, etc.">
                            <textarea id="socials" rows={2} value={brief.socials} onChange={(e) => set('socials', e.target.value)} className={`${inputClass} resize-none`} />
                          </Field>
                          <Field label="Autre chose à me dire ?" htmlFor="extra">
                            <textarea id="extra" rows={3} value={brief.extra} onChange={(e) => set('extra', e.target.value)} className={`${inputClass} resize-none`} />
                          </Field>
                        </>
                      )}

                      {/* ÉTAPE 5 — Récap + coordonnées */}
                      {step === 4 && (
                        <>
                          <div>
                            <h2 className="text-2xl font-extrabold text-foreground">Vérifiez et validez</h2>
                            <p className="mt-2 text-sm text-muted">Dernière étape : vos coordonnées, puis le paiement.</p>
                          </div>

                          <div className="grid gap-6 sm:grid-cols-2">
                            <Field label="Votre nom" htmlFor="name" required error={errors.name}>
                              <input id="name" autoComplete="name" value={brief.name} onChange={(e) => set('name', e.target.value)} className={`${inputClass} ${errors.name ? errorClass : ''}`} />
                            </Field>
                            <Field label="Votre email" htmlFor="email" required hint="Pour la facture et le suivi." error={errors.email}>
                              <input id="email" type="email" autoComplete="email" value={brief.email} onChange={(e) => set('email', e.target.value)} className={`${inputClass} ${errors.email ? errorClass : ''}`} />
                            </Field>
                            <div className="sm:col-span-2">
                              <Field label="Téléphone (facultatif)" htmlFor="contactPhone">
                                <input id="contactPhone" type="tel" autoComplete="tel" value={brief.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} className={inputClass} />
                              </Field>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-border/40 bg-background/40 p-5">
                            <h3 className="text-sm font-bold text-foreground">Récapitulatif</h3>
                            <dl className="mt-3 divide-y divide-border/30">
                              <div className="flex items-center justify-between gap-3 py-2">
                                <dt className="text-sm font-semibold text-foreground">{plan?.name} — {plan?.summary}</dt>
                                <dd className="text-sm font-bold text-accent">{plan ? formatEuro(plan.price) : ''}</dd>
                              </div>
                              {recapRow('Activité', `${brief.businessName} — ${brief.sector}, ${brief.city}`)}
                              {recapRow('Pages', plan?.id === 'essentiel' ? 'Une page' : brief.pages.join(', '))}
                              {recapRow('Style', brief.style)}
                              {recapRow('Textes', brief.texts)}
                              {recapRow('Nom de domaine', [brief.domain, brief.domainName].filter(Boolean).join(' — '))}
                              {recapRow('Affiché sur le site', [brief.phone, brief.publicEmail].filter(Boolean).join(' · '))}
                            </dl>
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                              {[
                                ['Formule', 0],
                                ['Activité', 1],
                                ['Site', 2],
                                ['Infos', 3],
                              ].map(([label, target]) => (
                                <button key={label as string} type="button" onClick={() => goTo(target as number)} className="text-xs font-medium text-accent underline underline-offset-2">
                                  Modifier : {label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-accent/15 bg-accent/5 p-5 text-xs leading-relaxed text-muted">
                            <p className="font-semibold text-foreground">Total à payer aujourd&apos;hui : {plan ? formatEuro(plan.price) : ''}</p>
                            <p className="mt-2">
                              Hébergement inclus la 1re année, puis {formatEuro(HOSTING_RENEWAL_PRICE)}/an. Une retouche incluse, les suivantes {formatEuro(EXTRA_REVISION_PRICE)} chacune.
                            </p>
                          </div>

                          <div>
                            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted">
                              <input
                                type="checkbox"
                                checked={brief.acceptCgv}
                                onChange={(e) => set('acceptCgv', e.target.checked)}
                                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#6366f1]"
                              />
                              <span>
                                J&apos;ai lu et j&apos;accepte les{' '}
                                <Link href="/cgv" target="_blank" className="font-semibold text-accent underline">
                                  conditions générales de vente
                                </Link>
                                . Je demande le démarrage de la prestation dès le paiement et je reconnais que, si je suis un consommateur, mon droit de rétractation prend fin lorsque le service est pleinement exécuté.
                              </span>
                            </label>
                            {errors.acceptCgv && <p role="alert" className="mt-2 text-xs text-red-400">{errors.acceptCgv}</p>}
                          </div>

                          {submitError && (
                            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                              {submitError}
                            </p>
                          )}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => goTo(step - 1)}
                        disabled={sending}
                        className="rounded-xl border border-border/50 px-6 py-4 text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-50"
                      >
                        Retour
                      </button>
                    ) : (
                      <span />
                    )}
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={next}
                        className="rounded-xl bg-accent px-8 py-4 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/40"
                      >
                        Continuer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submit}
                        disabled={sending}
                        className="rounded-xl bg-accent px-8 py-4 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/40 disabled:cursor-wait disabled:opacity-70"
                      >
                        {sending ? 'Validation…' : `Valider et payer ${plan ? formatEuro(plan.price) : ''}`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </AnimatedSection>

            {/* Sidebar */}
            <aside className="lg:col-span-2">
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="gradient-border rounded-2xl bg-surface-light p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted/70">Votre commande</p>
                  {plan ? (
                    <>
                      <div className="mt-4 flex items-baseline justify-between">
                        <p className="text-xl font-extrabold text-foreground">{plan.name}</p>
                        <p className="text-3xl font-black gradient-text">{formatEuro(plan.price)}</p>
                      </div>
                      <ul className="mt-5 space-y-3">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-xs text-muted">
                            <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="mt-4 text-sm text-muted">Choisissez une formule pour voir le détail.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-border/30 bg-surface-light p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted/70">Nos engagements</p>
                  <ul className="mt-4 space-y-4 text-xs leading-relaxed text-muted">
                    <li><strong className="text-foreground">Prix fixe.</strong> Le prix de la formule est le prix final, sans frais cachés.</li>
                    <li><strong className="text-foreground">Livraison en moins de 7 jours</strong> après réception de vos contenus.</li>
                    <li><strong className="text-foreground">Une retouche incluse</strong> après la livraison.</li>
                    <li><strong className="text-foreground">Réponse personnelle</strong> sous 24 h ouvrées.</li>
                  </ul>
                </div>

                <p className="text-center text-xs text-muted">
                  Une question avant de commander ?{' '}
                  <a href="mailto:thomas@tommy-studio.pro" className="font-semibold text-accent underline">
                    thomas@tommy-studio.pro
                  </a>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
