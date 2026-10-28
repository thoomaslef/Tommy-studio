import { beforeEach, describe, expect, it, vi } from 'vitest';

const notifyOwnerOnce = vi.fn(async () => true);
vi.mock('@/lib/emails', () => ({ notifyOwnerOnce, esc: (s: string) => s }));

const request = { path: '/creer/SECRET-TOKEN', method: 'GET', headers: { cookie: 'x' } };
const context = { routerKind: 'App Router', routePath: '/creer/[token]', routeType: 'render', renderSource: 'server-rendering', revalidateReason: undefined, renderType: 'dynamic' } as const;

describe('alertes d’erreur', () => {
  beforeEach(() => notifyOwnerOnce.mockClear());

  it('prévient Thomas sans divulguer le lien privé ni les en-têtes', async () => {
    const { onRequestError } = await import('../src/instrumentation');
    await onRequestError(new Error('boom'), request, context);
    expect(notifyOwnerOnce).toHaveBeenCalledOnce();
    const [, subject, html] = notifyOwnerOnce.mock.calls[0] as unknown as [string, string, string];
    expect(subject).toContain('/creer/[token]');
    expect(html).toContain('boom');
    expect(html + subject).not.toContain('SECRET-TOKEN');
    expect(html).not.toContain('cookie');
  });
  it('ignore les pages introuvables et les redirections', async () => {
    const { onRequestError } = await import('../src/instrumentation');
    await onRequestError(Object.assign(new Error('NEXT_NOT_FOUND'), { digest: 'NEXT_HTTP_ERROR_FALLBACK;404' }), request, context);
    await onRequestError(Object.assign(new Error('x'), { digest: 'NEXT_REDIRECT;replace;/;307;' }), request, context);
    expect(notifyOwnerOnce).not.toHaveBeenCalled();
  });
});
