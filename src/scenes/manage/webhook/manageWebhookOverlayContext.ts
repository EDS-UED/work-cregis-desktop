import { shallowRef, type Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { WebhookConfigRecord } from './webhookMockData';

export type ManageWebhookOverlaySurface = {
  verifyOpen: Ref<boolean>;
  onVerified: () => void;
  keyDialogOpen: Ref<boolean>;
  keyDialogRecord: Ref<WebhookConfigRecord | null>;
  keyDialogOneTime: Ref<boolean>;
  onKeyDialogConfirm: () => void;
  pushDetailOpen: Ref<boolean>;
  pushDetailRow: Ref<PaymentEngineRecordRow | null>;
  onPushDetailRepush: () => void;
  deleteDialogOpen: Ref<boolean>;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
};

export const manageWebhookOverlayRegistry = shallowRef<ManageWebhookOverlaySurface | null>(
  null,
);

export function registerManageWebhookOverlay(surface: ManageWebhookOverlaySurface | null) {
  manageWebhookOverlayRegistry.value = surface;
}
