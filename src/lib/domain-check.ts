import 'server-only';
import { VERCEL_IPS } from './domain';

export type DnsState = 'ok' | 'missing' | 'other';
export type DnsCheck = { apex: DnsState; www: DnsState; apexValues: string[]; wwwValues: string[] };

type Answer = { type: number; data: string };

async function resolve(name: string, type: 'A' | 'CNAME'): Promise<string[]> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`, { signal: AbortSignal.timeout(4000), cache: 'no-store' });
    if (!res.ok) return [];
    const json = (await res.json()) as { Answer?: Answer[] };
    return (json.Answer ?? []).filter((a) => a.type === (type === 'A' ? 1 : 5)).map((a) => a.data.replace(/\.$/, ''));
  } catch {
    return [];
  }
}

const state = (ips: string[], cnames: string[]): DnsState => {
  if (cnames.some((c) => c.endsWith('vercel-dns.com') || /vercel-dns-\d+\.com$/.test(c)) || ips.some((ip) => VERCEL_IPS.has(ip))) return 'ok';
  return ips.length || cnames.length ? 'other' : 'missing';
};

/** Le domaine pointe-t-il vers Vercel ? (résolution publique, sans clé) */
export async function checkDns(domain: string): Promise<DnsCheck> {
  const [apexA, apexCname, wwwA, wwwCname] = await Promise.all([
    resolve(domain, 'A'),
    resolve(domain, 'CNAME'),
    resolve(`www.${domain}`, 'A'),
    resolve(`www.${domain}`, 'CNAME'),
  ]);
  return { apex: state(apexA, apexCname), www: state(wwwA, wwwCname), apexValues: [...apexA, ...apexCname], wwwValues: [...wwwA, ...wwwCname] };
}

/** Le site répond-il vraiment sur ce domaine ? Le site publié porte une balise « ts-site » avec son adresse. */
export async function checkServing(domain: string, slug: string): Promise<boolean> {
  try {
    const res = await fetch(`https://${domain}/`, { signal: AbortSignal.timeout(6000), cache: 'no-store', redirect: 'follow' });
    if (!res.ok) return false;
    const html = await res.text();
    return html.includes(`name="ts-site" content="${slug}"`);
  } catch {
    return false;
  }
}
