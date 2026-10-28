import type { CSSProperties } from 'react';
import { designVars, resolveDesign } from './design';
import { siteFontClasses } from './fonts';
import { SiteBanner } from './parts';
import { siteJsonLd } from './seo';
import Classique from './templates/Classique';
import Moderne from './templates/Moderne';
import Robuste from './templates/Robuste';
import type { SiteData, SiteMode } from './types';

const TEMPLATES = { classique: Classique, moderne: Moderne, robuste: Robuste };

export default function SiteRenderer({ data, mode }: { data: SiteData; mode: SiteMode }) {
  const design = resolveDesign(data);
  const Template = TEMPLATES[design.template];
  const jsonLd = JSON.stringify(siteJsonLd(data)).replace(/</g, '\\u003c');

  return (
    <div className={`site-root min-h-screen ${siteFontClasses}`} style={designVars(design) as CSSProperties}>
      {/* Couleur de fond du navigateur (rebond iOS, zones hors page) */}
      <style>{`body{background:${design.palette.bg}}`}</style>
      {(mode === 'live' || mode === 'export') && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <SiteBanner mode={mode} trade={data.trade} />
      <div className="relative">
        <Template data={data} design={design} mode={mode} />
      </div>
    </div>
  );
}
