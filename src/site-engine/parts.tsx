/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import { Icon } from './icons';
import { TRADES } from './trades';
import type { SiteData, SiteMode, SitePhoto } from './types';

/** Garde un nombre de photos qui remplit des rangées entières (évite une photo isolée) */
export const fullRows = <T,>(items: T[], cols: number, max: number) => {
  const n = Math.min(items.length, max);
  return items.slice(0, n >= cols ? n - (n % cols) : n);
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** « Devis gratuit » : formulaire de la page si l'artisan reçoit les emails, sinon appel */
export const quoteHref = (d: SiteData) => (d.email ? '#devis' : telHref(d.phone));

export const yearsOfExperience = (d: SiteData) =>
  d.foundedYear ? Math.max(1, new Date().getFullYear() - d.foundedYear) : null;

export const zoneLabel = (d: SiteData) =>
  d.radiusKm ? `${d.city} et ${d.radiusKm} km autour` : d.zone.length ? `${d.city} et alentours` : d.city;

/** Photo du client, ou visuel de remplacement aux couleurs du site */
export function Photo({
  photo,
  data,
  className = '',
  index = 0,
}: {
  photo?: SitePhoto;
  data: SiteData;
  className?: string;
  index?: number;
}) {
  if (photo?.url) {
    return (
      <img
        src={photo.url}
        alt={photo.alt || `${TRADES[data.trade].activity} — ${data.businessName}`}
        loading={index > 1 ? 'lazy' : 'eager'}
        fetchPriority={index === 0 ? 'high' : undefined}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  const angle = [135, 45, 160, 20][index % 4];
  return (
    <div
      role="img"
      aria-label={`${TRADES[data.trade].activity} — ${data.businessName}`}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(${angle}deg, var(--s-primary), color-mix(in srgb, var(--s-primary) 55%, var(--s-text)))`,
      }}
    >
      <div className="s-stripes absolute inset-0 opacity-[0.12]" />
      <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full border-[18px] border-white/10" />
      <Icon name={TRADES[data.trade].icon} className="relative h-16 w-16 text-white/70" />
    </div>
  );
}

export function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div role="img" className="flex gap-0.5 text-(--s-accent)" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" fill className={`h-4 w-4 ${i < Math.round(rating) ? '' : 'opacity-25'}`} />
      ))}
    </div>
  );
}

export function Btn({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'light';
  className?: string;
}) {
  const styles = {
    primary: 'bg-(--s-primary) text-(--s-primary-ink) hover:brightness-110 shadow-sm',
    outline: 'border-2 border-current hover:bg-(--s-text)/5',
    ghost: 'hover:bg-(--s-text)/5',
    light: 'bg-white text-neutral-900 hover:bg-white/90',
  }[variant];
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-(--s-btn-radius) px-6 py-3.5 text-sm font-bold transition ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

export function SiteBanner({ mode, trade }: { mode: SiteMode; trade: SiteData['trade'] }) {
  if (mode === 'live' || mode === 'export') return null;
  if (mode === 'preview') {
    return <div className="bg-neutral-900 px-4 py-2 text-center text-xs font-semibold text-white">Aperçu de votre site — non publié</div>;
  }
  return (
    <a
      href={`/creer?metier=${trade}`}
      className="sticky top-0 z-[60] flex flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-neutral-900 px-4 py-3 text-center text-xs font-semibold text-white"
    >
      <span className="text-white/70">Démo (entreprise fictive) ·</span>
      <span>
        Ce site vous plaît ? <span className="underline underline-offset-2">Créez le vôtre en 10 min, 99 € →</span>
      </span>
    </a>
  );
}

/** Barre d'appel fixe en bas de l'écran sur mobile */
export function MobileCallBar({ data }: { data: SiteData }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-(--s-border) bg-(--s-border) md:hidden">
      <a href={telHref(data.phone)} className="flex items-center justify-center gap-2 bg-(--s-primary) py-4 text-sm font-bold text-(--s-primary-ink)">
        <Icon name="phone" className="h-4 w-4" /> Appeler
      </a>
      <a href={quoteHref(data)} className="flex items-center justify-center gap-2 bg-(--s-bg) py-4 text-sm font-bold text-(--s-text)">
        <Icon name="mail" className="h-4 w-4" /> Devis gratuit
      </a>
    </div>
  );
}

export function LegalNotice({ data }: { data: SiteData }) {
  return (
    <details className="mt-6 text-xs text-(--s-muted)">
      <summary className="cursor-pointer select-none font-semibold">Mentions légales</summary>
      <div className="mt-3 space-y-1 leading-relaxed">
        <p>
          Éditeur : {data.businessName}
          {data.ownerName ? ` — ${data.ownerName}` : ''}
          {data.siret ? ` — SIRET ${data.siret}` : ''}
          {data.address ? ` — ${data.address}` : ''}.
        </p>
        <p>Contact : {data.phone}{data.email ? ` — ${data.email}` : ''}.</p>
        {data.insurance && <p>Assurance : {data.insurance}.</p>}
        <p>Site réalisé et hébergé par Tommy Studio (tommy-studio.pro), hébergement Vercel Inc., 340 Pine Street Suite 401, San Francisco, CA 94104, États-Unis.</p>
      </div>
    </details>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-(--s-primary)">{eyebrow}</p>}
      <h2 className="s-heading mt-3 text-3xl sm:text-4xl">{title}</h2>
    </div>
  );
}
