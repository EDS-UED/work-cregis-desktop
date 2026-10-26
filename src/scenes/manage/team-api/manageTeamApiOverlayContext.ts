import { shallowRef, type Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { TeamApiConfigRecord } from './teamApiMockData';

export type ManageTeamApiOverlaySurface = {
  detailOpen: Ref<boolean>;
  detailRow: Ref<PaymentEngineRecordRow | null>;
  verifyOpen: Ref<boolean>;
  keyDialogOpen: Ref<boolean>;
  keyDialogRecord: Ref<TeamApiConfigRecord | null>;
  deleteDialogOpen: Ref<boolean>;
  statusToggleDialogOpen: Ref<boolean>;
  statusToggleEnabling: Ref<boolean>;
  onStatusToggleConfirm: () => void;
  onStatusToggleCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onVerifySucceeded: () => void;
  onVerifyClosed: () => void;
};

export const manageTeamApiOverlayRegistry = shallowRef<ManageTeamApiOverlaySurface | null>(
  null,
);

export function registerManageTeamApiOverlay(surface: ManageTeamApiOverlaySurface | null) {
  manageTeamApiOverlayRegistry.value = surface;
}
