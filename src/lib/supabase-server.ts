import 'server-only';
import { createHash, randomBytes } from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SiteData } from '@/site-engine/types';

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
  data: Partial<SiteData>;
  contact_name: string | null;
  contact_email: string | null;
  paid_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const PROJECT_COLUMNS = 'id, slug, status, plan, options, data, contact_name, contact_email, paid_at, published_at, created_at, updated_at';

/** Le lien privé du client contient un jeton ; seule son empreinte est stockée. */
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export const isTokenFormat = (token: string) => /^[A-Za-z0-9_-]{32,64}$/.test(token);

export async function createProject(initial: Partial<SiteData> = {}) {
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

export async function updateProjectData(id: string, patch: Partial<SiteData>) {
  const db = getSupabase();
  if (!db) throw new Error('Supabase non configuré');
  const { data: current, error: readError } = await db.from('site_projects').select('data, status').eq('id', id).single();
  if (readError) throw readError;
  if (current.status !== 'draft' && current.status !== 'live') throw new Error('Projet non modifiable');
  const { error } = await db
    .from('site_projects')
    .update({ data: { ...(current.data as object), ...patch } })
    .eq('id', id);
  if (error) throw error;
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
