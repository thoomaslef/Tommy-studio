/* eslint-disable @next/next/no-img-element */
import { navItems, stats, whyPoints } from '../content';
import type { Design } from '../design';
import { Icon } from '../icons';
import { fullRows, LegalNotice, MobileCallBar, Photo, Stars, quoteHref, telHref, zoneLabel } from '../parts';
import { TRADES } from '../trades';
import type { SiteData } from '../types';

type Props = { data: SiteData; design: Design };

function BlockButton({ href, children, inverse = false }: { href: string; children: React.ReactNode; inverse?: boolean }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-(--s-btn-radius) border-2 px-6 py-4 text-sm font-extrabold uppercase tracking-wider transition ${
        inverse
          ? 'border-current hover:bg-white/10'
          : 'border-(--s-primary) bg-(--s-primary) text-(--s-primary-ink) hover:brightness-110'
      }`}
    >
      {children}
    </a>
  );
}

function Hero({ data, design }: Props) {
  const trade = TRADES[data.trade];

  if (design.heroVariant === 1) {
    return (
      <section className="bg-(--s-primary) text-(--s-primary-ink)">
        <div className="mx-auto grid max-w-6xl items-stretch lg:grid-cols-2">
          <div className="px-5 py-16 sm:py-24 lg:pr-12">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em]">
              {trade.label} — {data.city}
            </p>
            <h1 className="s-heading mt-5 text-5xl sm:text-7xl">{design.tagline}</h1>
            <p className="mt-6 max-w-lg text-lg opacity-90">{design.about}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={telHref(data.phone)}
                className="inline-flex items-center justify-center gap-2 rounded-(--s-btn-radius) bg-(--s-text) px-6 py-4 text-sm font-extrabold uppercase tracking-wider text-(--s-bg)"
              >
                <Icon name="phone" className="h-4 w-4" /> {data.phone}
              </a>
              <BlockButton href={quoteHref(data)} inverse>
                Devis gratuit
              </BlockButton>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]">
            <Photo photo={data.photos[0]} data={data} className="absolute inset-0" />
          </div>
        </div>
      </section>
    );
  }

  if (design.heroVariant === 2) {
    return (
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <Photo photo={data.photos[0]} data={data} />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-36">
          <div className="max-w-2xl border-l-8 border-(--s-primary) bg-(--s-bg) p-8 sm:p-12">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-(--s-primary)">
              {trade.label} — {data.city}
            </p>
            <h1 className="s-heading mt-4 text-4xl sm:text-6xl">{design.tagline}</h1>
            <p className="mt-5 text-(--s-muted)">{design.about}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BlockButton href={telHref(data.phone)}>
                <Icon name="phone" className="h-4 w-4" /> {data.phone}
              </BlockButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-(--s-text) text-(--s-bg)">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-24 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="inline-block bg-(--s-primary) px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-(--s-primary-ink)">
            {trade.label} — {data.city}
          </p>
          <h1 className="s-heading mt-6 text-5xl sm:text-7xl">{design.tagline}</h1>
          <p className="mt-6 max-w-xl text-lg opacity-75">{design.about}</p>
          <a href={telHref(data.phone)} className="s-heading mt-10 block text-4xl text-(--s-primary) sm:text-5xl">
            {data.phone}
          </a>
          <div className="mt-6">
            <BlockButton href={quoteHref(data)} inverse>
              Demander un devis gratuit <Icon name="arrow" className="h-4 w-4" />
            </BlockButton>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="aspect-[4/5] overflow-hidden rounded-(--s-radius) border-4 border-(--s-primary)">
            <Photo photo={data.photos[0]} data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Heading({ kicker, title, light = false }: { kicker: string; title: string; light?: boolean }) {
  return (
    <div>
      <p className={`text-xs font-extrabold uppercase tracking-[0.25em] ${light ? 'text-(--s-primary)' : 'text-(--s-primary)'}`}>{kicker}</p>
      <h2 className="s-heading mt-3 text-4xl sm:text-5xl">{title}</h2>
      <div className="mt-5 h-1.5 w-20 bg-(--s-primary)" />
    </div>
  );
}

function Services({ data, design }: Props) {
  const trade = TRADES[data.trade];
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <Heading kicker="Nos prestations" title={trade.activity} />
      {design.servicesVariant === 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.services.map((s) => (
            <div key={s.title} className="rounded-(--s-radius) border-2 border-(--s-border) border-t-8 border-t-(--s-primary) bg-(--s-surface) p-6">
              <Icon name={trade.icon} className="h-8 w-8 text-(--s-primary)" />
              <h3 className="s-heading mt-5 text-xl">{s.title}</h3>
              {s.description && <p className="mt-2 text-sm text-(--s-muted)">{s.description}</p>}
              {s.price && <p className="mt-4 text-sm font-extrabold uppercase">{s.price}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 border-2 border-(--s-text)">
          {data.services.map((s, i) => (
            <div key={s.title} className={`grid gap-2 p-6 sm:grid-cols-[1fr_2fr_auto] sm:items-center sm:gap-8 ${i ? 'border-t-2 border-(--s-text)' : ''}`}>
              <h3 className="s-heading text-xl">{s.title}</h3>
              <p className="text-sm text-(--s-muted)">{s.description}</p>
              <span className="flex items-center gap-2 text-sm font-extrabold uppercase text-(--s-primary)">
                {s.price ?? 'Sur devis'} <Icon name="arrow" className="h-4 w-4" />
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Why({ data }: Props) {
  return (
    <section className="bg-(--s-text) text-(--s-bg)">
      <div className="s-hazard h-3" />
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Heading kicker="Nos engagements" title="Du solide, rien d’autre" light />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints(data).map((p) => (
            <div key={p.title} className="border-2 border-(--s-bg)/15 p-6">
              <span className="flex h-12 w-12 items-center justify-center bg-(--s-primary) text-(--s-primary-ink)">
                <Icon name={p.icon} />
              </span>
              <h3 className="s-heading mt-5 text-lg">{p.title}</h3>
              <p className="mt-2 text-sm opacity-70">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ data, design }: Props) {
  // La 1re photo sert déjà en en-tête : la galerie commence à la suivante
  const photos = data.photos.slice(1, 7);
  if (photos.length < 2) return null;
  return (
    <section id="realisations" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <Heading kicker="Réalisations" title="Sur le terrain" />
      <div className={`mt-12 grid gap-4 ${design.galleryVariant === 0 ? 'grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {(design.galleryVariant === 0 ? fullRows(photos, 3, 6) : fullRows(photos, 2, 4)).map((p, i) => (
          <div key={p.url} className={`overflow-hidden border-4 border-(--s-text) ${design.galleryVariant === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}>
            <Photo photo={p} data={data} index={i + 2} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews({ data }: Props) {
  if (!data.reviews.length) return null;
  return (
    <section id="avis" className="bg-(--s-surface) scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Heading kicker="Avis clients" title="Ce qu’ils en disent" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {data.reviews.slice(0, 3).map((r) => (
            <figure key={r.author + r.text.slice(0, 10)} className="border-2 border-(--s-text) bg-(--s-bg) p-6 shadow-[6px_6px_0_var(--s-primary)]">
              <Stars rating={r.rating} />
              <blockquote className="mt-4 text-sm leading-relaxed">{r.text}</blockquote>
              <figcaption className="mt-4 text-sm font-extrabold uppercase">
                {r.author}
                {r.city && <span className="font-medium normal-case text-(--s-muted)"> — {r.city}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Robuste({ data, design }: Props) {
  const trade = TRADES[data.trade];
  const sections = { services: Services, why: Why, gallery: Gallery, reviews: Reviews };
  const keyStats = stats(data);

  return (
    <div className="pb-16 md:pb-0">
      <div className="s-hazard h-2" />
      <header className="sticky top-0 z-40 border-b-4 border-(--s-primary) bg-(--s-text) text-(--s-bg)">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt={data.businessName} className="h-10 w-auto max-w-[140px] object-contain" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center bg-(--s-primary) text-(--s-primary-ink)">
                <Icon name={trade.icon} />
              </span>
            )}
            <span className="s-heading text-lg">{data.businessName}</span>
          </a>
          <nav className="hidden items-center gap-6 text-xs font-extrabold uppercase tracking-wider md:flex">
            {navItems(data).map((n) => (
              <a key={n.href} href={n.href} className="hover:text-(--s-primary)">
                {n.label}
              </a>
            ))}
          </nav>
          <a href={telHref(data.phone)} className="hidden items-center gap-2 bg-(--s-primary) px-4 py-2.5 text-sm font-extrabold text-(--s-primary-ink) sm:flex">
            <Icon name="phone" className="h-4 w-4" /> {data.phone}
          </a>
        </div>
      </header>

      <Hero data={data} design={design} />

      {data.emergency && (
        <div className="bg-(--s-primary) text-(--s-primary-ink)">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:flex-row sm:text-left">
            <p className="s-heading text-xl">Urgence ? Nous intervenons rapidement à {data.city}.</p>
            <a href={telHref(data.phone)} className="flex items-center gap-2 font-extrabold uppercase">
              <Icon name="phone" className="h-5 w-5" /> {data.phone}
            </a>
          </div>
        </div>
      )}

      {keyStats.length > 0 && (
        <div className="mx-auto max-w-6xl px-5 pt-16">
          <div className="grid grid-cols-2 border-2 border-(--s-text) sm:grid-cols-4">
            {keyStats.map((s, i) => (
              <div key={s.label} className={`p-5 ${i ? 'border-l-2 border-(--s-text)' : ''} ${i === 2 ? 'border-l-0 border-t-2 sm:border-t-0 sm:border-l-2' : ''} ${i === 3 ? 'border-t-2 sm:border-t-0' : ''}`}>
                <p className="s-heading text-3xl text-(--s-primary)">{s.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {design.middleOrder.map((key) => {
        const Section = sections[key];
        return <Section key={key} data={data} design={design} />;
      })}

      <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="border-4 border-(--s-text) p-8 lg:col-span-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-(--s-primary)">Zone d’intervention</p>
            <p className="s-heading mt-4 text-6xl">{data.radiusKm ? `${data.radiusKm} km` : data.city}</p>
            <p className="mt-2 font-bold uppercase">{data.radiusKm ? `autour de ${data.city}` : 'et alentours'}</p>
            {data.zone.length > 0 && <p className="mt-6 text-sm text-(--s-muted)">{data.zone.join(', ')}</p>}
          </div>
          <a href={telHref(data.phone)} className="group flex flex-col justify-between bg-(--s-primary) p-8 text-(--s-primary-ink) lg:col-span-1">
            <Icon name="phone" className="h-10 w-10" />
            <div className="mt-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] opacity-80">Appelez-nous</p>
              <p className="s-heading mt-2 text-3xl">{data.phone}</p>
              {data.hours && <p className="mt-2 text-sm opacity-85">{data.hours}</p>}
            </div>
          </a>
          <a href={quoteHref(data)} className="flex flex-col justify-between bg-(--s-text) p-8 text-(--s-bg) lg:col-span-1">
            <Icon name="mail" className="h-10 w-10 text-(--s-primary)" />
            <div className="mt-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] opacity-70">Devis gratuit</p>
              <p className="s-heading mt-2 text-3xl">Écrivez-nous</p>
              {data.email && <p className="mt-2 break-all text-sm opacity-75">{data.email}</p>}
            </div>
          </a>
        </div>
        {data.address && (
          <p className="mt-6 flex items-center gap-2 text-sm font-bold">
            <Icon name="pin" className="h-4 w-4 text-(--s-primary)" /> {data.address}
          </p>
        )}
      </section>

      <footer className="bg-(--s-text) text-(--s-bg)">
        <div className="s-hazard h-2" />
        <div className="mx-auto max-w-6xl px-5 py-10 text-sm">
          <p className="s-heading text-lg">{data.businessName}</p>
          <p className="mt-1 opacity-70">
            {trade.label} à {data.city} — {zoneLabel(data)} · © {new Date().getFullYear()}
          </p>
          <div className="[&_details]:opacity-80 [&_*]:!text-(--s-bg)">
            <LegalNotice data={data} />
          </div>
        </div>
      </footer>
      <MobileCallBar data={data} />
    </div>
  );
}
