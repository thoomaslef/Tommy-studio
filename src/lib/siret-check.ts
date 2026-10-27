import 'server-only';
import { siretDigits } from './siret';

export type SiretCheck = {
  status: 'active' | 'closed' | 'unknown' | 'unverified';
  name?: string;
  city?: string;
  checkedAt: string;
};

type Etablissement = { siret: string; etat_administratif: string; libelle_commune?: string };
type Result = { nom_complet: string; matching_etablissements?: Etablissement[]; siege?: Etablissement };

/**
 * Vérifie le SIRET dans le répertoire public des entreprises (API Recherche d'entreprises, gratuite et sans clé).
 * Si l'API ne répond pas, on ne bloque pas la vente : le résultat « unverified » est signalé à Thomas.
 */
export async function checkSiret(siret: string): Promise<SiretCheck> {
  const digits = siretDigits(siret);
  const checkedAt = new Date().toISOString();
  try {
    const res = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${digits}&per_page=1`, {
      signal: AbortSignal.timeout(5000),
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return { status: 'unverified', checkedAt };
    const data = (await res.json()) as { results?: Result[] };
    const result = data.results?.[0];
    const etab = [...(result?.matching_etablissements ?? []), ...(result?.siege ? [result.siege] : [])].find((e) => e.siret === digits);
    if (!result || !etab) return { status: 'unknown', checkedAt };
    return { status: etab.etat_administratif === 'A' ? 'active' : 'closed', name: result.nom_complet, city: etab.libelle_commune, checkedAt };
  } catch {
    return { status: 'unverified', checkedAt };
  }
}
