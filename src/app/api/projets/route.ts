import { isTradeId } from '@/site-engine/trades';
import { createProject, getSupabase } from '@/lib/supabase-server';
import { json, readJson } from '@/lib/projects-api';

export async function POST(request: Request) {
  if (!getSupabase()) return json({ error: 'Le service est momentanément indisponible.' }, 503);
  const body = await readJson(request);
  if (!body) return json({ error: 'Requête invalide.' }, 400);
  // Champ piège : seuls les robots le remplissent
  if (typeof body.website === 'string' && body.website) return json({ token: null }, 200);
  if (!isTradeId(body.trade)) return json({ error: 'Choisissez un métier.' }, 400);

  try {
    const { token } = await createProject({ trade: body.trade, style: { template: 'classique' } });
    return json({ token }, 201);
  } catch (error) {
    console.error('createProject', error);
    return json({ error: 'Impossible de créer votre site pour le moment.' }, 500);
  }
}
