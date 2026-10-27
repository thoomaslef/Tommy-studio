import 'server-only';
import { createHash, randomBytes } from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { MAX_PHOTOS, type SiteDraft } from '@/site-engine/sanitize';
import { RESERVED_SLUGS, slugify } from './live-site';
import { encryptToken } from './token-crypto';
import type { SiretCheck } from './siret-check';

export const SITE_MEDIA_BUCKET = 'site-media';

let client: SupabaseClient | null = null;

/** Client Supabase côté serveur uniquement (clé secrète). Null si non configuré. */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export type ProjectStatus = 'draft' | 'paid' | 'live' | 'offline';

export type ProjectRow = {
  id: string;
  slug: string | null;
  status: ProjectStatus;
  plan: string | null;
  options: string[];
  data: SiteDraft;
  contact_name: string | null;
  contact_email: string | null;
  stripe_session_id: string | null;
  siret_check: SiretCheck | null;
  hosting_until: string | null;
  paid_at: string | null;
  publish_requested_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const PROJECT_COLUMNS = 'id, slug, status, plan, options, data, contact_name, contact_email, stripe_session_id, siret_check, hosting_until, paid_at, publish_requested_at, published_at, created_at, updated_at';

/** Le lien privé du client contient un jeton ; seule son empreinte est stockée. */
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const isTokenFormat = (token: string) => /^[A-Za-z0-9_-]{32,64}$/.test(token);

/** Nombre de projets créés depuis cette adresse IP pendant la période donnée */
export async function countRecentProjects(ipHash: string, sinceMs: number) {
  const db = getSupabase();
  if (!db) return 0;
  const since = new Date(Date.now() - sinceMs).toISOString();
  const { count, error } = await db.from('site_projects').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since);
  if (error) throw error;
  return count ?? 0;
}

export async function createProject(initial: SiteDraft = {}, ipHash: string | null = null) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const token = randomBytes(24).toString('base64url');
  const { data, error } = await db
    .from('site_projects')
    .insert({ token_hash: hashToken(token), edit_token_enc: encryptToken(token), ip_hash: ipHash, data: initial })
    .select(PROJECT_COLUMNS)
    .single();
  if (error) throw error;
  return { token, project: data as ProjectRow };
}

export async function getProjectByToken(token: string): Promise<ProjectRow | null> {
  const db = getSupabase();
  if (!db || !isTokenFormat(token)) return null;
  const { data, error } = await db.from('site_projects').select(PROJECT_COLUMNS).eq('token_hash', hashToken(token)).maybeSingle();
  if (error) throw error;
  return (data as ProjectRow) ?? null;
}

export async function getProjectById(id: string): Promise<ProjectRow | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db.from('site_projects').select(PROJECT_COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as ProjectRow) ?? null;
}

export async function getLiveProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db.from('site_projects').select(PROJECT_COLUMNS).eq('slug', slug).eq('status', 'live').maybeSingle();
  if (error) throw error;
  return (data as ProjectRow) ?? null;
}

/** Remplace le brouillon (déjà nettoyé) ; refusé une fois le projet payé ou hors ligne */
export async function saveDraft(id: string, draft: SiteDraft) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const { data, error } = await db.from('site_projects').update({ data: draft }).eq('id', id).in('status', ['draft', 'live']).select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('Projet non modifiable');
}

export type AssetRow = { id: string; path: string; kind: 'photo' | 'logo'; position: number; width: number | null; height: number | null };

export async function listAssets(projectId: string): Promise<AssetRow[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from('site_assets')
    .select('id, path, kind, position, width, height')
    .eq('project_id', projectId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as AssetRow[];
}

/** Enregistre une photo après vérification qu'elle existe bien dans le stockage */
export async function registerAsset(projectId: string, path: string, kind: 'photo' | 'logo', meta: { width?: number; height?: number }) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  if (!path.startsWith(`${projectId}/`)) throw new Error('Chemin invalide');
  const { data: owner } = await db.from('site_projects').select('status').eq('id', projectId).maybeSingle();
  if (!owner || (owner.status !== 'draft' && owner.status !== 'live')) throw new Error('Projet non modifiable');
  if (kind === 'photo' && (await listAssets(projectId)).filter((a) => a.kind === 'photo').length >= MAX_PHOTOS) throw new Error('Trop de photos');
  const folder = projectId;
  const name = path.slice(folder.length + 1);
  const { data: found, error: listError } = await db.storage.from(SITE_MEDIA_BUCKET).list(folder, { search: name, limit: 1 });
  if (listError) throw listError;
  const file = found?.find((f) => f.name === name);
  if (!file) throw new Error('Fichier introuvable');
  const size = (file.metadata as { size?: number } | null)?.size ?? null;

  if (kind === 'logo') {
    // Un seul logo : on remplace l'ancien
    const old = (await listAssets(projectId)).filter((a) => a.kind === 'logo');
    for (const a of old) await deleteAsset(projectId, a.id);
  }
  const position = kind === 'logo' ? 0 : (await listAssets(projectId)).filter((a) => a.kind === 'photo').length;
  const { data, error } = await db
    .from('site_assets')
    .insert({ project_id: projectId, path, kind, position, width: meta.width ?? null, height: meta.height ?? null, size_bytes: size })
    .select('id, path, kind, position, width, height')
    .single();
  if (error) throw error;
  return data as AssetRow;
}

export async function deleteAsset(projectId: string, assetId: string) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const { data, error } = await db.from('site_assets').delete().eq('id', assetId).eq('project_id', projectId).select('path');
  if (error) throw error;
  const paths = (data ?? []).map((d) => d.path as string);
  if (paths.length) await db.storage.from(SITE_MEDIA_BUCKET).remove(paths);
}

/** Réordonne les photos selon la liste d'identifiants reçue */
export async function reorderPhotos(projectId: string, ids: string[]) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  for (const [position, id] of ids.entries()) {
    const { error } = await db.from('site_assets').update({ position }).eq('id', id).eq('project_id', projectId).eq('kind', 'photo');
    if (error) throw error;
  }
}

/** Nombre de fichiers déjà envoyés dans le dossier du projet (y compris ceux jamais confirmés) */
export async function countProjectFiles(projectId: string) {
  const db = getSupabase();
  if (!db) return 0;
  const { data, error } = await db.storage.from(SITE_MEDIA_BUCKET).list(projectId, { limit: 100 });
  if (error) throw error;
  return data?.length ?? 0;
}

/** URL d'envoi signée : le navigateur envoie la photo directement à Supabase. */
export async function createPhotoUpload(projectId: string, extension: 'jpg' | 'png' | 'webp') {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const path = `${projectId}/${randomBytes(12).toString('hex')}.${extension}`;
  const { data, error } = await db.storage.from(SITE_MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error) throw error;
  return { path, signedUrl: data.signedUrl, token: data.token };
}

export function publicMediaUrl(path: string) {
  const db = getSupabase();
  if (!db) return '';
  return db.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function saveSiretCheck(id: string, check: SiretCheck) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const { error } = await db.from('site_projects').update({ siret_check: check }).eq('id', id);
  if (error) throw error;
}

/** Copie chiffrée du lien privé, pour les projets créés avant son enregistrement */
export async function ensureEditToken(id: string, token: string) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const enc = encryptToken(token);
  if (!enc) return;
  const { error } = await db.from('site_projects').update({ edit_token_enc: enc }).eq('id', id).is('edit_token_enc', null);
  if (error) throw error;
}

export async function getEditTokenEnc(id: string): Promise<string | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db.from('site_projects').select('edit_token_enc').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data?.edit_token_enc as string | null) ?? null;
}

/** Projet payé par cette session Stripe (page de remerciement) */
export async function getProjectByStripeSession(sessionId: string): Promise<ProjectRow | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db.from('site_projects').select(PROJECT_COLUMNS).eq('stripe_session_id', sessionId).maybeSingle();
  if (error) throw error;
  return (data as ProjectRow) ?? null;
}

/** Le client demande la publication : on garde ses coordonnées pour lui envoyer le paiement */
export async function requestPublication(id: string, name: string, email: string) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const { error } = await db
    .from('site_projects')
    .update({ contact_name: name, contact_email: email, publish_requested_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/** Adresses possibles, de la plus courte à la plus précise : « martin-plomberie », puis « martin-plomberie-caen », puis « -2 », « -3 »… */
function slugCandidates(draft: SiteDraft) {
  const base = slugify(draft.businessName ?? '') || 'artisan';
  const withCity = slugify(`${base} ${draft.city ?? ''}`) || base;
  const list = [base, withCity];
  for (let i = 2; i < 30; i++) list.push(`${withCity.slice(0, 36)}-${i}`);
  return [...new Set(list)].filter((s) => s.length >= 3 && !RESERVED_SLUGS.has(s));
}

/** Adresse que recevrait le site s'il était publié maintenant (indicatif : attribuée pour de bon au paiement) */
export async function availableSlug(draft: SiteDraft) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const candidates = slugCandidates(draft);
  const { data, error } = await db.from('site_projects').select('slug').in('slug', candidates);
  if (error) throw error;
  const taken = new Set((data ?? []).map((r) => r.slug as string));
  return candidates.find((c) => !taken.has(c)) ?? null;
}

type Payment = { sessionId: string; amountCents: number | null; email: string | null; name: string | null };

/**
 * Paiement confirmé : le projet passe directement en ligne avec une adresse unique.
 * Idempotent : un webhook rejoué pour la même session renvoie le projet déjà publié.
 */
export async function publishPaidProject(id: string, payment: Payment): Promise<{ project: ProjectRow; alreadyDone: boolean } | null> {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const { data: current, error: readError } = await db.from('site_projects').select(PROJECT_COLUMNS).eq('id', id).maybeSingle();
  if (readError) throw readError;
  const project = current as ProjectRow | null;
  if (!project) return null;
  if (project.stripe_session_id === payment.sessionId) return { project, alreadyDone: true };
  if (project.status !== 'draft') return { project, alreadyDone: true };

  const now = new Date().toISOString();
  for (const slug of slugCandidates(project.data)) {
    const { data, error } = await db
      .from('site_projects')
      .update({
        status: 'live',
        slug,
        stripe_session_id: payment.sessionId,
        amount_cents: payment.amountCents,
        paid_at: now,
        published_at: now,
        contact_email: project.contact_email ?? payment.email,
        contact_name: project.contact_name ?? payment.name,
      })
      .eq('id', id)
      .eq('status', 'draft')
      .select(PROJECT_COLUMNS);
    if (error?.code === '23505' && error.message.includes('slug')) continue; // adresse déjà prise
    if (error) throw error;
    if (data?.length) return { project: data[0] as ProjectRow, alreadyDone: false };
    // Un autre webhook est passé entre-temps
    const { data: again } = await db.from('site_projects').select(PROJECT_COLUMNS).eq('id', id).maybeSingle();
    return again ? { project: again as ProjectRow, alreadyDone: true } : null;
  }
  throw new Error('Aucune adresse disponible');
}
