import type { Instrumentation } from 'next';

/** Erreurs normales de Next (page introuvable, redirection) : à ne pas signaler */
const EXPECTED = /NEXT_(NOT_FOUND|REDIRECT|HTTP_ERROR_FALLBACK)/;

/**
 * Alerte par email quand une page ou une route plante pour un vrai visiteur (à la place d'un service comme Sentry).
 * On n'envoie ni l'adresse complète (elle peut contenir un lien privé), ni les en-têtes : seulement le modèle de la route.
 */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (process.env.NEXT_RUNTIME === 'edge') return;
  try {
    const message = err instanceof Error ? err.message : String(err);
    const digest = typeof err === 'object' && err !== null && 'digest' in err ? String(err.digest) : '';
    if (EXPECTED.test(message) || EXPECTED.test(digest)) return;

    const { esc, notifyOwnerOnce } = await import('./lib/emails');
    const route = context.routePath || 'inconnue';
    await notifyOwnerOnce(
      `erreur:${route}:${message.slice(0, 120)}`,
      `⚠ Erreur sur le site — ${route}`,
      `<p>Une erreur s’est produite pour un visiteur.</p>
       <p><strong>Route :</strong> ${esc(route)} (${esc(context.routeType)}, ${esc(request.method)})<br/>
       <strong>Message :</strong> ${esc(message.slice(0, 300))}<br/>
       ${digest ? `<strong>Identifiant :</strong> ${esc(digest)}<br/>` : ''}</p>
       <p style="color:#6b6b8a;font-size:12px;">Une seule alerte par heure pour une même erreur. Demandez à Claude d’analyser les journaux Vercel de cette route.</p>`,
    );
  } catch (error) {
    console.error('onRequestError', error);
  }
};
