import type { WebhookEndpointVerifyErrorKey } from './webhookEndpointVerifyMock';

/** 仅「端点验证」按钮 mock 完成后、展示在按钮下方的结果（与名称/URL 字段校验无关）。 */
export type WebhookEndpointVerifyButtonOutcome =
  | null
  | { kind: 'success' }
  | { kind: 'failed'; errorKey: WebhookEndpointVerifyErrorKey };

export const WEBHOOK_ENDPOINT_VERIFY_MOCK_DELAY_MS = 2000;
