/* eslint-disable @next/next/no-img-element */
import { navItems, stats, whyPoints } from '../content';
import type { Design } from '../design';
import { Icon } from '../icons';
import { Btn, fullRows, LegalNotice, MobileCallBar, Photo, Stars, quoteHref, telHref, zoneLabel } from '../parts';
import QuoteForm from '../QuoteForm';
import { TRADES } from '../trades';
import type { SiteData, SiteMode } from '../types';

type Props = { data: SiteData; design: Design };

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] ${light ? 'opacity-80' : 'text-(--s-primary)'}`}>
      <span className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

function Hero({ data, design }: Props) {
  const trade = TRADES[data.trade];
  const label = `${trade.label} · ${data.city}`;

  if (design.heroVariant === 0) {
    // Bloc sombre, photo décalée
    return (
      <section className="bg-(--s-text) text-(--s-bg)">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-28 pb-16 lg:grid-cols-12 lg:pb-0">
          <div className="lg:col-span-7 lg:pb-24">
            <Eyebrow light>{label}</Eyebrow>
            <h1 className="s-heading mt-6 text-5xl sm:text-7xl">{design.tagline}</h1>
            <p className="mt-8 max-w-xl text-lg opacity-75">{design.about}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Btn href={telHref(data.phone)}>
                <Icon name="phone" className="h-4 w-4" /> {data.phone}
              </Btn>
              <Btn href={quoteHref(data)} variant="outline">
                Devis gratuit <Icon name="arrow" className="h-4 w-4" />
              </Btn>
            </div>
          </div>
          <div className="lg:col-span-5 lg:self-end">
            <div className="aspect-[4/5] overflow-hidden rounded-t-(--s-radius) lg:translate-y-16">
              <Photo photo={data.photos[0]} data={data} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (design.heroVariant === 1) {
    // Fond couleur principale, photo arrondie
    return (
      <section className="bg-(--s-primary) text-(--s-primary-ink)">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-28 pb-20 lg:grid-cols-2">
          <div>
            <Eyebrow light>{label}</Eyebrow>
            <h1 className="s-heading mt-6 text-5xl sm:text-6xl">{design.tagline}</h1>
            <p className="mt-6 max-w-xl text-lg opacity-85">{design.about}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={telHref(data.phone)}
                className="inline-flex items-center justify-center gap-2 rounded-(--s-btn-radius) bg-(--s-primary-ink) px-6 py-3.5 text-sm font-bold text-(--s-primary)"
              >
                <Icon name="phone" className="h-4 w-4" /> {data.phone}
              </a>
              <Btn href={quoteHref(data)} variant="outline">
                Devis gratuit
              </Btn>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="aspect-square overflow-hidden rounded-[40%_12%_40%_12%] shadow-2xl">
              <Photo photo={data.photos[0]} data={data} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Typographie géante, photo panoramique
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 pt-32 pb-12">
        <Eyebrow>{label}</Eyebrow>
        <h1 className="s-heading mt-6 max-w-5xl text-5xl sm:text-7xl lg:text-8xl">{design.tagline}</h1>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-xl text-lg text-(--s-muted)">{design.about}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Btn href={telHref(data.phone)}>
              <Icon name="phone" className="h-4 w-4" /> {data.phone}
            </Btn>
            <Btn href={quoteHref(data)} variant="outline">
              Devis gratuit
            </Btn>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5">
        <div className="aspect-[21/9] overflow-hidden rounded-(--s-radius)">
          <Photo photo={data.photos[0]} data={data} />
        </div>
      </div>
    </section>
  );
}

function Services({ data, design }: Props) {
  const trade = TRADES[data.trade];
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>Services</Eyebrow>
          <h2 className="s-heading mt-5 text-4xl">Ce que nous faisons</h2>
          <p className="mt-5 text-(--s-muted)">
            {trade.activity} pour particuliers et professionnels — {zoneLabel(data)}.
          </p>
        </div>
        <div className="lg:col-span-8">
          {design.servicesVariant === 0 ? (
            <ol>
              {data.services.map((s, i) => (
                <li key={s.title} className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-(--s-border) py-7 last:border-b">
                  <span className="s-heading text-2xl text-(--s-primary)">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="s-heading text-2xl">{s.title}</h3>
                      {s.price && <span className="text-sm font-bold whitespace-nowrap">{s.price}</span>}
                    </div>
                    {s.description && <p className="mt-2 text-(--s-muted)">{s.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.services.map((s, i) => (
                <div
                  key={s.title}
                  className={`rounded-(--s-radius) p-7 ${i % 3 === 0 ? 'bg-(--s-primary) text-(--s-primary-ink)' : 'bg-(--s-surface)'}`}
                >
                  <Icon name={trade.icon} className="h-8 w-8" />
                  <h3 className="s-heading mt-8 text-2xl">{s.title}</h3>
                  {s.description && <p className={`mt-2 text-sm ${i % 3 === 0 ? 'opacity-85' : 'text-(--s-muted)'}`}>{s.description}</p>}
                  {s.price && <p className="mt-4 text-sm font-bold">{s.price}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: Props) {
  const steps = [
    { title: 'Vous nous contactez', text: 'Par téléphone ou par email, en quelques minutes.' },
    { title: data.freeQuote !== false ? 'Devis gratuit' : 'Devis détaillé', text: 'Visite si besoin, puis un devis clair et sans surprise.' },
    { title: 'Réalisation', text: 'Travaux réalisés dans les délais, chantier protégé.' },
    { title: 'Suivi', text: 'Vérification avec vous et conseils d’entretien.' },
  ];
  const points = whyPoints(data);
  return (
    <section className="bg-(--s-surface)">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <Eyebrow>Comment ça se passe</Eyebrow>
        <h2 className="s-heading mt-5 max-w-2xl text-4xl">Simple, clair, sans mauvaise surprise</h2>
        <div className="mt-14 grid gap-px overflow-hidden rounded-(--s-radius) bg-(--s-border) sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-(--s-bg) p-7">
              <span className="s-heading text-5xl text-(--s-primary)/30">{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-(--s-muted)">{s.text}</p>
            </div>
          ))}
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
          {points.map((p) => (
            <li key={p.title} className="flex items-center gap-2">
              <Icon name={p.icon} className="h-4 w-4 text-(--s-primary)" /> {p.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Gallery({ data, design }: Props) {
  // La 1re photo sert déjà en en-tête : la galerie commence à la suivante
  const photos = data.photos.slice(1, 8);
  if (photos.length < 2) return null;
  return (
    <section id="realisations" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Eyebrow>Réalisations</Eyebrow>
        <h2 className="s-heading mt-5 text-4xl">Nos derniers chantiers</h2>
      </div>
      {design.galleryVariant === 0 ? (
        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] lg:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]">
          {photos.map((p, i) => (
            <div key={p.url} className="aspect-[3/4] w-[75vw] max-w-sm flex-shrink-0 snap-start overflow-hidden rounded-(--s-radius)">
              <Photo photo={p} data={data} index={i + 2} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 px-5 lg:grid-cols-3">
          {fullRows(photos, 3, 6).map((p, i) => (
            <div key={p.url} className={`overflow-hidden rounded-(--s-radius) ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'} ${i === 1 ? 'lg:translate-y-10' : ''}`}>
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
  const [first, ...rest] = data.reviews;
  return (
    <section id="avis" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <figure className="lg:col-span-7">
          <Icon name="quote" fill className="h-10 w-10 text-(--s-primary)" />
          <blockquote className="s-heading mt-6 text-3xl leading-snug normal-case sm:text-4xl">{first.text}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-sm">
            <Stars rating={first.rating} />
            <span className="font-bold">{first.author}</span>
            {first.city && <span className="text-(--s-muted)">{first.city}</span>}
          </figcaption>
        </figure>
        <div className="space-y-6 lg:col-span-5">
          {rest.slice(0, 2).map((r) => (
            <figure key={r.author + r.text.slice(0, 10)} className="border-l-2 border-(--s-primary) pl-5">
              <blockquote className="text-sm leading-relaxed">« {r.text} »</blockquote>
              <figcaption className="mt-3 text-sm font-bold">
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

export default function Moderne({ data, design, mode }: Props & { mode: SiteMode }) {
  const trade = TRADES[data.trade];
  const sections = { services: Services, why: Process, gallery: Gallery, reviews: Reviews };
  const keyStats = stats(data);
  const darkHero = design.heroVariant !== 2;

  return (
    <div className="pb-16 md:pb-0">
      <header className={`absolute inset-x-0 z-40 ${darkHero ? (design.heroVariant === 0 ? 'text-(--s-bg)' : 'text-(--s-primary-ink)') : ''}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <a href="#" className="flex items-center gap-3">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt={data.businessName} className="h-10 w-auto max-w-[140px] object-contain" />
            ) : (
              <span className="s-heading text-xl">{data.businessName}</span>
            )}
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            {navItems(data).map((n) => (
              <a key={n.href} href={n.href} className="opacity-80 hover:opacity-100">
                {n.label}
              </a>
            ))}
          </nav>
          <a href={telHref(data.phone)} className="hidden items-center gap-2 rounded-(--s-btn-radius) border border-current px-4 py-2 text-sm font-bold sm:inline-flex">
            <Icon name="phone" className="h-4 w-4" /> {data.phone}
          </a>
        </div>
      </header>

      <Hero data={data} design={design} />

      {keyStats.length > 0 && (
        <div className={`mx-auto max-w-6xl px-5 ${design.heroVariant === 0 ? 'pt-24' : 'pt-16'}`}>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {keyStats.map((s) => (
              <div key={s.label} className="border-t-2 border-(--s-primary) pt-4">
                <p className="s-heading text-3xl">{s.value}</p>
                <p className="mt-1 text-sm text-(--s-muted)">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {design.middleOrder.map((key) => {
        const Section = sections[key];
        return <Section key={key} data={data} design={design} />;
      })}

      <section id="contact" className="scroll-mt-20 px-5 pb-24">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-(--s-radius) bg-(--s-text) text-(--s-bg) lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <Eyebrow light>Contact</Eyebrow>
            <h2 className="s-heading mt-5 text-4xl sm:text-5xl">Un projet ? Parlons-en.</h2>
            <p className="mt-5 opacity-75">{data.freeQuote !== false ? 'Devis gratuit, réponse rapide.' : 'Réponse rapide à toutes vos demandes.'}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Btn href={telHref(data.phone)}>
                <Icon name="phone" className="h-4 w-4" /> {data.phone}
              </Btn>
              {data.email && (
                <Btn href={quoteHref(data)} variant="outline">
                  <Icon name="mail" className="h-4 w-4" /> Écrire
                </Btn>
              )}
            </div>
          </div>
          <div className="space-y-6 bg-(--s-primary) p-8 text-(--s-primary-ink) sm:p-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-75">Zone d’intervention</p>
              <p className="s-heading mt-2 text-2xl">{zoneLabel(data)}</p>
              {data.zone.length > 0 && <p className="mt-3 text-sm opacity-85">{data.zone.join(' · ')}</p>}
            </div>
            {data.hours && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-75">Horaires</p>
                <p className="mt-2">{data.hours}</p>
              </div>
            )}
            {data.address && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-75">Adresse</p>
                <p className="mt-2">{data.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <QuoteForm data={data} mode={mode} />

      <footer className="mx-auto max-w-6xl px-5 pb-10 text-sm text-(--s-muted)">
        <div className="flex flex-col justify-between gap-2 border-t border-(--s-border) pt-8 sm:flex-row">
          <p className="s-heading text-base text-(--s-text)">{data.businessName}</p>
          <p>
            {trade.activity} — {data.city} · © {new Date().getFullYear()}
          </p>
        </div>
        <LegalNotice data={data} />
      </footer>
      <MobileCallBar data={data} />
    </div>
  );
}
