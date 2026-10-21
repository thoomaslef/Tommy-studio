/* eslint-disable @next/next/no-img-element */
import { navItems, stats, whyPoints } from '../content';
import type { Design } from '../design';
import { Icon } from '../icons';
import { Btn, fullRows, LegalNotice, MobileCallBar, Photo, SectionTitle, Stars, quoteHref, telHref, zoneLabel } from '../parts';
import { TRADES } from '../trades';
import type { SiteData } from '../types';

type Props = { data: SiteData; design: Design };

function Logo({ data }: { data: SiteData }) {
  return data.logoUrl ? (
    <img src={data.logoUrl} alt={data.businessName} className="h-11 w-auto max-w-[140px] object-contain" />
  ) : (
    <span className="s-heading flex h-11 w-11 items-center justify-center rounded-(--s-radius) bg-(--s-primary) text-lg text-(--s-primary-ink)">
      {data.businessName.charAt(0)}
    </span>
  );
}

function Hero({ data, design }: Props) {
  const trade = TRADES[data.trade];
  const eyebrow = `${trade.label} à ${data.city}`;
  const buttons = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Btn href={telHref(data.phone)}>
        <Icon name="phone" className="h-4 w-4" /> {data.phone}
      </Btn>
      <Btn href={quoteHref(data)} variant="outline">
        Demander un devis gratuit
      </Btn>
    </div>
  );

  if (design.heroVariant === 1) {
    return (
      <section className="relative isolate min-h-[560px] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Photo photo={data.photos[0]} data={data} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        </div>
        <div className="mx-auto flex max-w-6xl flex-col justify-center px-5 py-24 text-white sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">{eyebrow}</p>
          <h1 className="s-heading mt-4 max-w-2xl text-4xl sm:text-6xl">{design.tagline}</h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">{design.about}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Btn href={telHref(data.phone)}>
              <Icon name="phone" className="h-4 w-4" /> {data.phone}
            </Btn>
            <Btn href={quoteHref(data)} variant="light">
              Demander un devis gratuit
            </Btn>
          </div>
        </div>
      </section>
    );
  }

  if (design.heroVariant === 2) {
    return (
      <section className="bg-(--s-surface)">
        <div className="mx-auto max-w-4xl px-5 pt-20 pb-12 text-center sm:pt-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--s-primary)">{eyebrow}</p>
          <h1 className="s-heading mt-4 text-4xl sm:text-6xl">{design.tagline}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-(--s-muted)">{design.about}</p>
          <div className="flex justify-center">{buttons}</div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-5 pb-16 sm:gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`overflow-hidden rounded-(--s-radius) ${i === 1 ? 'aspect-[3/4] -mt-4' : 'aspect-[3/4] mt-6'}`}>
              <Photo photo={data.photos[i]} data={data} index={i} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:py-24 lg:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--s-primary)">{eyebrow}</p>
        <h1 className="s-heading mt-4 text-4xl sm:text-5xl lg:text-6xl">{design.tagline}</h1>
        <p className="mt-6 max-w-xl text-lg text-(--s-muted)">{design.about}</p>
        {buttons}
      </div>
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden rounded-(--s-radius) shadow-xl">
          <Photo photo={data.photos[0]} data={data} />
        </div>
        {(data.certifications[0] || data.insurance) && (
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-(--s-radius) border border-(--s-border) bg-(--s-bg) px-4 py-3 shadow-lg">
            <Icon name="shield" className="h-6 w-6 text-(--s-primary)" />
            <p className="text-sm font-semibold">{data.certifications[0] ?? 'Travaux assurés'}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Services({ data, design }: Props) {
  const trade = TRADES[data.trade];
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <SectionTitle eyebrow="Nos services" title={`${trade.activity} à ${data.city}`} />
      {design.servicesVariant === 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.services.map((s) => (
            <div key={s.title} className="rounded-(--s-radius) border border-(--s-border) bg-(--s-bg) p-6 transition hover:shadow-lg">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--s-primary)/10 text-(--s-primary)">
                <Icon name={trade.icon} />
              </span>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              {s.description && <p className="mt-2 text-sm text-(--s-muted)">{s.description}</p>}
              {s.price && <p className="mt-4 text-sm font-bold text-(--s-primary)">{s.price}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-x-12 sm:grid-cols-2">
          {data.services.map((s) => (
            <div key={s.title} className="flex gap-4 border-b border-(--s-border) py-6">
              <Icon name="check" className="mt-1 h-5 w-5 flex-shrink-0 text-(--s-primary)" />
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  {s.price && <span className="text-sm font-bold whitespace-nowrap text-(--s-primary)">{s.price}</span>}
                </div>
                {s.description && <p className="mt-1 text-sm text-(--s-muted)">{s.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Why({ data }: Props) {
  return (
    <section className="bg-(--s-surface)">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionTitle eyebrow="Pourquoi nous choisir" title={`${data.businessName}, un artisan de confiance`} />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints(data).map((p) => (
            <div key={p.title}>
              <Icon name={p.icon} className="h-7 w-7 text-(--s-primary)" />
              <h3 className="mt-4 font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-(--s-muted)">{p.text}</p>
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
      <SectionTitle eyebrow="Réalisations" title="Quelques chantiers récents" />
      {design.galleryVariant === 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {fullRows(photos, 3, 6).map((p, i) => (
            <div key={p.url} className="aspect-square overflow-hidden rounded-(--s-radius)">
              <Photo photo={p} data={data} index={i + 2} className="transition duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-4 sm:gap-5">
          {photos.slice(0, 4).map((p, i) => (
            <div
              key={p.url}
              className={`overflow-hidden rounded-(--s-radius) ${i === 0 ? 'col-span-2 row-span-2' : ''} ${i === 3 ? 'sm:col-span-2' : ''}`}
            >
              <Photo photo={p} data={data} index={i + 2} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Reviews({ data }: Props) {
  if (!data.reviews.length) return null;
  return (
    <section id="avis" className="bg-(--s-surface) scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionTitle eyebrow="Avis clients" title="Ils nous ont fait confiance" align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {data.reviews.slice(0, 3).map((r) => (
            <figure key={r.author + r.text.slice(0, 10)} className="rounded-(--s-radius) bg-(--s-bg) p-6 shadow-sm">
              <Stars rating={r.rating} />
              <blockquote className="mt-4 text-sm leading-relaxed">« {r.text} »</blockquote>
              <figcaption className="mt-4 text-sm font-bold">
                {r.author}
                {r.city && <span className="font-normal text-(--s-muted)"> — {r.city}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Classique({ data, design }: Props) {
  const trade = TRADES[data.trade];
  const sections = { services: Services, why: Why, gallery: Gallery, reviews: Reviews };
  const keyStats = stats(data);

  return (
    <div className="pb-16 md:pb-0">
      <div className="hidden bg-(--s-text) text-(--s-bg) md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 text-xs">
          <span className="flex items-center gap-2">
            <Icon name="pin" className="h-3.5 w-3.5" /> Intervention : {zoneLabel(data)}
          </span>
          {data.hours && (
            <span className="flex items-center gap-2">
              <Icon name="clock" className="h-3.5 w-3.5" /> {data.hours}
            </span>
          )}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-(--s-border) bg-(--s-bg)/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            <Logo data={data} />
            <span className="leading-tight">
              <span className="block font-bold">{data.businessName}</span>
              <span className="block text-xs text-(--s-muted)">{trade.activity}</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            {navItems(data).map((n) => (
              <a key={n.href} href={n.href} className="hover:text-(--s-primary)">
                {n.label}
              </a>
            ))}
          </nav>
          <Btn href={telHref(data.phone)} className="hidden !px-4 !py-2.5 sm:inline-flex">
            <Icon name="phone" className="h-4 w-4" /> Appeler
          </Btn>
        </div>
      </header>

      <Hero data={data} design={design} />

      {keyStats.length > 0 && (
        <div className="border-y border-(--s-border)">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4">
            {keyStats.map((s) => (
              <div key={s.label}>
                <p className="s-heading text-2xl text-(--s-primary)">{s.value}</p>
                <p className="text-xs text-(--s-muted)">{s.label}</p>
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
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Zone d’intervention" title={zoneLabel(data)} />
            {data.zone.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {data.zone.map((c) => (
                  <li key={c} className="rounded-full border border-(--s-border) px-3 py-1.5 text-sm">
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-(--s-radius) bg-(--s-primary) p-8 text-(--s-primary-ink) sm:p-10">
            <h2 className="s-heading text-3xl">Parlons de votre projet</h2>
            <p className="mt-3 opacity-90">{data.freeQuote !== false ? 'Devis gratuit et sans engagement.' : 'Réponse rapide à toutes vos demandes.'}</p>
            <ul className="mt-8 space-y-4">
              <li>
                <a href={telHref(data.phone)} className="flex items-center gap-3 text-xl font-bold">
                  <Icon name="phone" /> {data.phone}
                </a>
              </li>
              {data.email && (
                <li>
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 break-all">
                    <Icon name="mail" /> {data.email}
                  </a>
                </li>
              )}
              {data.address && (
                <li className="flex items-center gap-3">
                  <Icon name="pin" /> {data.address}
                </li>
              )}
              {data.hours && (
                <li className="flex items-center gap-3">
                  <Icon name="clock" /> {data.hours}
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-(--s-border) bg-(--s-surface)">
        <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-(--s-muted)">
          <p>
            © {new Date().getFullYear()} {data.businessName} — {trade.label} à {data.city}
          </p>
          <LegalNotice data={data} />
        </div>
      </footer>
      <MobileCallBar data={data} />
    </div>
  );
}
