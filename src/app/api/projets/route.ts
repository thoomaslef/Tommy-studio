import { isTradeId } from '@/site-engine/trades';
import { countRecentProjects, createProject, getSupabase } from '@/lib/supabase-server';
import { PROJECTS_PER_DAY, PROJECTS_PER_HOUR, clientIpHash } from '@/lib/rate-limit';
import { json, readJson } from '@/lib/projects-api';

export async function POST(request: Request) {
  if (!getSupabase()) return json({ error: 'Le service est momentanément indisponible.' }, 503);
  const body = await readJson(request);
  if (!body) return json({ error: 'Requête invalide.' }, 400);
  // Champ piège : seuls les robots le remplissent
  if (typeof body.website === 'string' && body.website) return json({ token: null }, 200);
  if (!isTradeId(body.trade)) return json({ error: 'Choisissez un métier.' }, 400);

  try {
    const ipHash = clientIpHash(request);
    if (ipHash) {
      const [hour, day] = await Promise.all([countRecentProjects(ipHash, 3600e3), countRecentProjects(ipHash, 86400e3)]);
      if (hour >= PROJECTS_PER_HOUR || day >= PROJECTS_PER_DAY) {
        return json({ error: 'Trop de sites créés depuis votre connexion. Reprenez votre site existant ou réessayez plus tard.' }, 429);
      }
    }
    const { token } = await createProject({ trade: body.trade, style: { template: 'classique' } }, ipHash);
    return json({ token }, 201);
  } catch (error) {
    console.error('createProject', error);
    return json({ error: 'Impossible de créer votre site pour le moment.' }, 500);
  }
}
