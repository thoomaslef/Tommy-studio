/** Origine d'une visite (liens de campagne ?utm_source=…) : gardée le temps de la visite puis rattachée au projet créé */
export const SOURCE_STORAGE_KEY = 'ts-source';

export type Source = { source: string; medium?: string; campaign?: string };

const TOKEN = /^[a-z0-9][a-z0-9_.-]{0,39}$/;
const clean = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const v = value.trim().toLowerCase();
  return TOKEN.test(v) ? v : undefined;
};

/** Valeurs inconnues ou mal formées ignorées : on ne stocke que des mots simples */
export function sanitizeSource(value: unknown): Source | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  const source = clean(v.source);
  if (!source) return null;
  const medium = clean(v.medium);
  const campaign = clean(v.campaign);
  return { source, ...(medium && { medium }), ...(campaign && { campaign }) };
}

export function sourceFromSearch(search: string): Source | null {
  const params = new URLSearchParams(search);
  return sanitizeSource({ source: params.get('utm_source'), medium: params.get('utm_medium'), campaign: params.get('utm_campaign') });
}

export const describeSource = (s: Source) => [s.source, s.medium, s.campaign].filter(Boolean).join(' / ');

type ProjectLike = { source?: unknown; created_at: string; paid_at?: string | null };

/** Par origine, sur les `days` derniers jours : sites commencés et sites payés (origine inconnue regroupée à part) */
export function summarizeSources(projects: ProjectLike[], now: number, days = 30) {
  const since = now - days * 86400e3;
  const rows = new Map<string, { label: string; created: number; paid: number }>();
  for (const p of projects) {
    if (new Date(p.created_at).getTime() < since) continue;
    const s = sanitizeSource(p.source);
    const label = s ? s.source : 'direct / inconnu';
    const row = rows.get(label) ?? { label, created: 0, paid: 0 };
    row.created += 1;
    if (p.paid_at) row.paid += 1;
    rows.set(label, row);
  }
  return [...rows.values()].sort((a, b) => b.paid - a.paid || b.created - a.created);
}
