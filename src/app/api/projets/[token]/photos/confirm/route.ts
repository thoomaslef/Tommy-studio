import { registerAsset } from '@/lib/supabase-server';
import { assetView, json, loadProject, readJson } from '@/lib/projects-api';

/** Confirme une photo envoyée : vérifiée dans le stockage puis ajoutée au site */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const project = await loadProject((await params).token);
  if (project instanceof Response) return project;
  const body = await readJson(request);
  if (!body || typeof body.path !== 'string') return json({ error: 'Requête invalide.' }, 400);
  const kind = body.kind === 'logo' ? 'logo' : 'photo';
  const num = (v: unknown) => (typeof v === 'number' && v > 0 && v < 20000 ? Math.round(v) : undefined);

  try {
    const asset = await registerAsset(project.id, body.path, kind, { width: num(body.width), height: num(body.height) });
    return json({ asset: assetView(asset) }, 201);
  } catch (error) {
    console.error('registerAsset', error);
    return json({ error: 'Photo introuvable, réessayez.' }, 400);
  }
}
