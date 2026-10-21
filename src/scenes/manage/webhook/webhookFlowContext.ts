import type { InjectionKey, Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { WebhookConfigRecord } from './webhookMockData';

export type WebhookVerifyIntent =
  | 'toggle-enabled'
  | 'view-key'
  | 'delete'
  | 'create'
  | 'repush';

export type WebhookFlowApi = {
  openCreate: () => void;
  openEdit: (row: PaymentEngineRecordRow) => void;
  requestToggleEnabled: (row: PaymentEngineRecordRow, nextEnabled: boolean) => void;
  requestViewKey: (row: PaymentEngineRecordRow) => void;
  requestDelete: (row: PaymentEngineRecordRow) => void;
  openPushDetail: (row: PaymentEngineRecordRow) => void;
  requestRepush: (row: PaymentEngineRecordRow) => void;
  requestBatchRepush: (
    rows: PaymentEngineRecordRow[],
    onSettled?: () => void,
  ) => void;
  draftConfig: Ref<WebhookConfigRecord | null>;
  /** Webhook 配置 · 列表↔创建/编辑 motion-page。 */
  configFormOpen: Ref<boolean>;
  closeConfigForm: () => void;
  onConfigFormPageSettled: () => void;
};

export const webhookFlowKey: InjectionKey<WebhookFlowApi> = Symbol('webhookFlow');
