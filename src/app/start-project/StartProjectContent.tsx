'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

const serviceOptions = [
  'Création de site web',
];

const budgetOptions = ['Abonnement 49€/mois (création offerte)', 'Je voudrais en savoir plus'];
const timelineOptions = ['Dès que possible', '1 – 2 semaines', '1 mois', 'Flexible'];

const trustPoints = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Réponse personnelle sous 24h',
    description: 'Pas un bot — une vraie personne analyse votre projet et vous propose une solution sur-mesure.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Prix fixe, zéro surprise',
    description: 'Le prix annoncé est le prix final. Aucun frais caché, aucun dépassement de budget.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Livraison express garantie',
    description: 'Votre projet livré en moins de 7 jours. On s\'engage sur un délai, on le respecte.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Satisfaction ou remboursement',
    description: 'On est tellement confiants dans notre travail qu\'on offre une garantie satisfaction complète.',
  },
];

const formFields = {
  input: 'w-full rounded-xl border bg-background/50 px-5 py-4 text-sm text-foreground placeholder-muted/60 outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-background',
  label: 'mb-3 block text-sm font-semibold text-foreground',
  error: 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
  normal: 'border-border/50 hover:border-border',
};

export default function StartProjectContent() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);

  const validate = (form: FormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!form.get('name')?.toString().trim()) errs.name = 'Le nom est requis';
    const email = form.get('email')?.toString().trim() || '';
    if (!email) errs.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Entrez un email valide';
    if (!form.get('service')) errs.service = 'Veuillez sélectionner un service';
    if (!form.get('description')?.toString().trim()) errs.description = 'Veuillez décrire votre projet';
    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          service: form.get('service'),
          budget: form.get('budget'),
          timeline: form.get('timeline'),
          description: form.get('description'),
        }),
      });
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative hero-spacing overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/6 rounded-full blur-[140px] pointer-events-none aurora-1" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative section-container flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-xs font-semibold tracking-wide text-accent badge-glow"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Devis gratuit · Réponse garantie sous 24h
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Obtenez votre devis
            <br />
            <span className="gradient-text glow-text">en 2 minutes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Décrivez votre projet, on s&apos;occupe du reste. Prix fixe, délai garanti,
            zéro engagement. On vous répond personnellement sous 24h.
          </motion.p>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {[
              { icon: '✓', text: 'Devis 100% gratuit' },
              { icon: '✓', text: 'Sans engagement' },
              { icon: '✓', text: 'Sans engagement' },
              { icon: '✓', text: 'Livraison < 7 jours' },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-1.5 text-xs font-medium text-muted/70">
                <span className="text-accent text-sm">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form + Trust */}
      <section className="relative section-spacing">
        <div className="section-container">
          <div className="grid gap-24 lg:gap-32 lg:grid-cols-5">
            {/* Form */}
            <AnimatedSection className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    className="flex min-h-[550px] flex-col items-center justify-center rounded-2xl border border-accent/20 bg-surface-light p-12 text-center glow"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-accent/10 border border-accent/20"
                    >
                      <svg className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <div className="absolute inset-0 rounded-3xl animate-pulse-ring" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-extrabold text-foreground"
                    >
                      Votre devis est en route !
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 max-w-md text-muted leading-relaxed"
                    >
                      On analyse votre projet et on vous envoie une proposition sur-mesure avec un prix fixe sous 24h. En attendant, vérifiez votre boîte mail.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-8 flex items-center gap-2 text-sm text-accent"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Vérifiez votre boîte mail
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="gradient-border rounded-2xl bg-surface-light p-14 sm:p-18"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="mb-14">
                      <h2 className="text-2xl font-extrabold text-foreground">Parlez-nous de votre projet</h2>
                      <p className="mt-4 text-sm text-muted leading-relaxed">2 minutes suffisent · Devis gratuit · Réponse sous 24h</p>
                    </div>

                    <div className="grid gap-12 sm:grid-cols-2">
                      {/* Name */}
                      <div className="sm:col-span-1">
                        <label htmlFor="name" className={formFields.label}>
                          Nom <span className="text-accent">*</span>
                        </label>
                        <motion.div whileFocus={{ scale: 1.01 }}>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Votre nom"
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(null)}
                            className={`${formFields.input} ${errors.name ? formFields.error : formFields.normal} ${focused === 'name' ? 'shadow-lg shadow-accent/5' : ''}`}
                          />
                        </motion.div>
                        {errors.name && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-400">
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="sm:col-span-1">
                        <label htmlFor="email" className={formFields.label}>
                          Email <span className="text-accent">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="vous@exemple.com"
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          className={`${formFields.input} ${errors.email ? formFields.error : formFields.normal} ${focused === 'email' ? 'shadow-lg shadow-accent/5' : ''}`}
                        />
                        {errors.email && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-400">
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      {/* Service */}
                      <div className="sm:col-span-2">
                        <label htmlFor="service" className={formFields.label}>
                          Service <span className="text-accent">*</span>
                        </label>
                        <select
                          id="service"
                          name="service"
                          defaultValue=""
                          onFocus={() => setFocused('service')}
                          onBlur={() => setFocused(null)}
                          className={`${formFields.input} ${errors.service ? formFields.error : formFields.normal} ${focused === 'service' ? 'shadow-lg shadow-accent/5' : ''}`}
                        >
                          <option value="" disabled>Sélectionnez un service</option>
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {errors.service && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-400">
                            {errors.service}
                          </motion.p>
                        )}
                      </div>

                      {/* Budget */}
                      <div>
                        <label htmlFor="budget" className={formFields.label}>
                          Offre
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          defaultValue=""
                          onFocus={() => setFocused('budget')}
                          onBlur={() => setFocused(null)}
                          className={`${formFields.input} ${formFields.normal} ${focused === 'budget' ? 'shadow-lg shadow-accent/5' : ''}`}
                        >
                          <option value="" disabled>Sélectionnez</option>
                          {budgetOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Timeline */}
                      <div>
                        <label htmlFor="timeline" className={formFields.label}>
                          Délai souhaité
                        </label>
                        <select
                          id="timeline"
                          name="timeline"
                          defaultValue=""
                          onFocus={() => setFocused('timeline')}
                          onBlur={() => setFocused(null)}
                          className={`${formFields.input} ${formFields.normal} ${focused === 'timeline' ? 'shadow-lg shadow-accent/5' : ''}`}
                        >
                          <option value="" disabled>Choisir un délai</option>
                          {timelineOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div className="sm:col-span-2">
                        <label htmlFor="description" className={formFields.label}>
                          Description du projet <span className="text-accent">*</span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={6}
                          placeholder="Parlez-nous de votre projet, vos objectifs et vos besoins spécifiques..."
                          onFocus={() => setFocused('description')}
                          onBlur={() => setFocused(null)}
                          className={`${formFields.input} resize-none ${errors.description ? formFields.error : formFields.normal} ${focused === 'description' ? 'shadow-lg shadow-accent/5' : ''}`}
                        />
                        {errors.description && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-400">
                            {errors.description}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="mt-14">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative w-full overflow-hidden rounded-xl bg-accent px-8 py-5 text-base font-bold text-white shadow-lg shadow-accent/20 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/40"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-accent-light via-accent to-accent-dark opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="absolute -inset-px rounded-xl bg-gradient-to-r from-accent-light to-accent-dark opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-40" />
                        <span className="relative flex items-center justify-center gap-3">
                          {sending ? 'Envoi en cours…' : 'Obtenir mon devis gratuit'}
                          {!sending && (
                            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                          )}
                        </span>
                      </motion.button>
                      <p className="mt-4 text-center text-xs text-muted/60">
                        Sans engagement · 100% gratuit · Réponse personnelle sous 24h
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </AnimatedSection>

            {/* Trust Section */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.2} direction="right">
                <div className="sticky top-28 space-y-14">
                  <div>
                    <h2 className="text-2xl font-extrabold text-foreground">Ce qu&apos;on vous garantit</h2>
                    <p className="mt-4 text-sm text-muted leading-relaxed">
                      Des engagements clairs. Des résultats concrets.
                    </p>
                  </div>

                  {trustPoints.map((point, i) => (
                    <AnimatedSection key={point.title} delay={0.3 + i * 0.1} direction="right">
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="group flex gap-4 rounded-xl p-4 -ml-4 transition-colors hover:bg-surface-light"
                      >
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/8 text-accent ring-1 ring-accent/10 transition-all group-hover:bg-accent/15 group-hover:ring-accent/20">
                          {point.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-sm">{point.title}</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted">{point.description}</p>
                        </div>
                      </motion.div>
                    </AnimatedSection>
                  ))}

                  {/* Garanties concrètes */}
                  <AnimatedSection delay={0.7} direction="right">
                    <div className="gradient-border rounded-2xl bg-surface-light p-9 mt-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted/60 mb-6">Nos engagements écrits</p>
                      <div className="space-y-5">
                        {[
                          {
                            icon: (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ),
                            title: 'Livraison en moins de 7 jours',
                            desc: 'Une date de livraison précise est fixée dès le début. On la respecte.',
                          },
                          {
                            icon: (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                              </svg>
                            ),
                            title: 'Prix fixe, zéro surprise',
                            desc: 'Le devis envoyé est le prix final. Aucun frais caché, aucun avenant.',
                          },
                          {
                            icon: (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                              </svg>
                            ),
                            title: 'Satisfaction ou remboursement',
                            desc: 'Si le rendu ne correspond pas au brief validé, on rembourse intégralement.',
                          },
                          {
                            icon: (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                              </svg>
                            ),
                            title: 'Réponse personnelle sous 24h',
                            desc: 'Pas un bot — c\'est Thomas qui lit et répond à chaque demande.',
                          },
                        ].map((g) => (
                          <div key={g.title} className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/10">
                              {g.icon}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{g.title}</p>
                              <p className="mt-0.5 text-xs leading-relaxed text-muted">{g.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Quick contact */}
                  <AnimatedSection delay={0.9} direction="right">
                    <div className="rounded-xl bg-accent/5 border border-accent/10 p-7 text-center">
                      <p className="text-xs font-medium text-foreground">Une question avant de vous lancer ?</p>
                      <p className="mt-2 text-sm font-bold text-accent">contact@tommystudio.com</p>
                      <p className="mt-1 text-[10px] text-muted">Réponse en moins de 2h en journée</p>
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
