import 'server-only';
import { getProjectByToken, getSupabase, publicMediaUrl, type AssetRow, type ProjectRow } from './supabase-server';

export const json = (body: unknown, status = 200) => Response.json(body, { status });

/** Charge le projet du lien privé, ou renvoie la réponse d'erreur adaptée */
export async function loadProject(token: string): Promise<ProjectRow | Response> {
  if (!getSupabase()) return json({ error: 'Le service est momentanément indisponible.' }, 503);
  try {
    const project = await getProjectByToken(token);
    return project ?? json({ error: 'Lien introuvable ou expiré.' }, 404);
  } catch (error) {
    console.error('loadProject', error);
    return json({ error: 'Erreur serveur.' }, 500);
  }
}

export const assetView = (a: AssetRow) => ({ id: a.id, kind: a.kind, position: a.position, url: publicMediaUrl(a.path) });

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
