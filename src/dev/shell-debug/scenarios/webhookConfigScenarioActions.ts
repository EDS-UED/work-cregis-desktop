import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { MANAGE_WEBHOOK_CONFIG_MENU_ITEM } from '@/scenes/manage/manageMenuData';
import { applyWebhookCreateFormQaPatch } from '@/scenes/manage/webhook/webhookCreateFormQa';
import {
  WEBHOOK_ENDPOINT_VERIFY_ERROR_KEYS,
  type WebhookEndpointVerifyErrorKey,
} from '@/scenes/manage/webhook/webhookEndpointVerifyMock';
import { webhookModuleShellApiRegistry } from '@/scenes/manage/webhook/webhookModuleShellApi';
import { UI_TEXT_ZH_CN } from '@/i18n/uiTextZhCN';
import { clearQaLoadingTimeout } from './commonScenarioActions';

export const WEBHOOK_CONFIG_PAGE_KEY =
  `Manage:${MANAGE_WEBHOOK_CONFIG_MENU_ITEM}` as const;

const VERIFY_ERROR_HOST_FRAGMENT: Record<WebhookEndpointVerifyErrorKey, string> = {
  'Webhook verify error connection timed out': 'timeout',
  'Webhook verify error DNS resolution failed': 'dns-fail',
  'Webhook verify error connection refused': 'refused',
  'Webhook verify error connection reset': 'reset',
  'Webhook verify error certificate expired': 'cert-expired',
  'Webhook verify error certificate untrusted': 'cert-untrusted',
  'Webhook verify error certificate domain mismatch': 'cert-domain',
  'Webhook verify error HTTP client error': 'http-4xx',
  'Webhook verify error HTTP server error': 'http-5xx',
  'Webhook verify error redirect loop': 'redirect',
  'Webhook verify error signature rejected': 'signature',
  'Webhook verify error challenge incorrect': 'challenge',
  'Webhook verify error internal URL not supported': 'internal',
};

export function resetWebhookConfigScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();
}

function openCreateAndApply(patch: Parameters<typeof applyWebhookCreateFormQaPatch>[0]) {
  resetWebhookConfigScenarioBaseline();
  webhookModuleShellApiRegistry.value?.openCreateForm();
  applyWebhookCreateFormQaPatch(patch);
}

export function applyWebhookCreateNameInvalidScenario() {
  openCreateAndApply({
    name: 'bad name',
    nameBlurred: true,
  });
}

export function applyWebhookCreateNameLengthScenario() {
  openCreateAndApply({
    name: 'a',
    nameBlurred: true,
  });
}

export function applyWebhookCreateEndpointHttpScenario() {
  openCreateAndApply({
    endpointUrl: 'http://example.com/hook',
    endpointBlurred: true,
  });
}

export function applyWebhookCreateEndpointVerifyPassedScenario() {
  openCreateAndApply({
    endpointVerifiedForSubmit: true,
    endpointVerifyButtonOutcome: { kind: 'success' },
  });
}

export function applyWebhookCreatedKeyDialogScenario() {
  resetWebhookConfigScenarioBaseline();
  webhookModuleShellApiRegistry.value?.openWebhookCreatedKeyDialog();
}

export function applyWebhookCreateEndpointVerifyFailedScenario(errorKey: WebhookEndpointVerifyErrorKey) {
  openCreateAndApply({
    endpointVerifyButtonOutcome: { kind: 'failed', errorKey },
  });
}

export function buildWebhookVerifyErrorQaScenarios() {
  return WEBHOOK_ENDPOINT_VERIFY_ERROR_KEYS.map((errorKey) => {
    const fragment = VERIFY_ERROR_HOST_FRAGMENT[errorKey];
    const shortLabel = UI_TEXT_ZH_CN[errorKey] ?? errorKey;
    return {
      id: `manage-webhook-create-verify-${fragment}`,
      pageKey: WEBHOOK_CONFIG_PAGE_KEY,
      label: `端点验证（${shortLabel}）`,
      description: `仅端点验证区：按钮「端点验证」+ 下方「${shortLabel}」；端点 URL 等其余字段保持空白。`,
      apply: () => applyWebhookCreateEndpointVerifyFailedScenario(errorKey),
    };
  });
}
