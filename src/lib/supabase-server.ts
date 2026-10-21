import 'server-only';
import { createHash, randomBytes } from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SiteDraft } from '@/site-engine/sanitize';

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
  paid_at: string | null;
  publish_requested_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const PROJECT_COLUMNS = 'id, slug, status, plan, options, data, contact_name, contact_email, paid_at, publish_requested_at, published_at, created_at, updated_at';

/** Le lien privé du client contient un jeton ; seule son empreinte est stockée. */
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const isTokenFormat = (token: string) => /^[A-Za-z0-9_-]{32,64}$/.test(token);

export async function createProject(initial: SiteDraft = {}) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const token = randomBytes(24).toString('base64url');
  const { data, error } = await db
    .from('site_projects')
    .insert({ token_hash: hashToken(token), data: initial })
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
