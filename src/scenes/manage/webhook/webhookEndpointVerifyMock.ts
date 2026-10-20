/** 端点验证 mock：URL 主机片段触发对应客户端报错（见产品映射表）。 */

export const WEBHOOK_ENDPOINT_VERIFY_ERROR_KEYS = [
  'Webhook verify error connection timed out',
  'Webhook verify error DNS resolution failed',
  'Webhook verify error connection refused',
  'Webhook verify error connection reset',
  'Webhook verify error certificate expired',
  'Webhook verify error certificate untrusted',
  'Webhook verify error certificate domain mismatch',
  'Webhook verify error HTTP client error',
  'Webhook verify error HTTP server error',
  'Webhook verify error redirect loop',
  'Webhook verify error signature rejected',
  'Webhook verify error challenge incorrect',
  'Webhook verify error internal URL not supported',
] as const;

export type WebhookEndpointVerifyErrorKey = (typeof WEBHOOK_ENDPOINT_VERIFY_ERROR_KEYS)[number];

const HOST_TRIGGER: Record<string, WebhookEndpointVerifyErrorKey> = {
  timeout: 'Webhook verify error connection timed out',
  'dns-fail': 'Webhook verify error DNS resolution failed',
  refused: 'Webhook verify error connection refused',
  reset: 'Webhook verify error connection reset',
  'cert-expired': 'Webhook verify error certificate expired',
  'cert-untrusted': 'Webhook verify error certificate untrusted',
  'cert-domain': 'Webhook verify error certificate domain mismatch',
  'http-4xx': 'Webhook verify error HTTP client error',
  'http-5xx': 'Webhook verify error HTTP server error',
  redirect: 'Webhook verify error redirect loop',
  signature: 'Webhook verify error signature rejected',
  challenge: 'Webhook verify error challenge incorrect',
  internal: 'Webhook verify error internal URL not supported',
};

export function resolveWebhookEndpointVerifyMock(
  endpointUrl: string,
): { ok: true } | { ok: false; errorKey: WebhookEndpointVerifyErrorKey } {
  const trimmed = endpointUrl.trim();
  let host = '';
  try {
    host = new URL(trimmed).hostname.toLowerCase();
  } catch {
    return { ok: true };
  }

  for (const [fragment, errorKey] of Object.entries(HOST_TRIGGER)) {
    if (host.includes(fragment)) {
      return { ok: false, errorKey };
    }
  }

  if (host === 'invalid.webhook') {
    return { ok: false, errorKey: 'Webhook verify error HTTP client error' };
  }

  return { ok: true };
}
