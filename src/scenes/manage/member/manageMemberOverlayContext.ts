import { shallowRef, type Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type ManageMemberVerifyIntent = 'delete-member';

export type ManageMemberOverlaySurface = {
  detailOpen: Ref<boolean>;
  detailRow: Ref<PaymentEngineRecordRow | null>;
  verifyOpen: Ref<boolean>;
  deleteDialogOpen: Ref<boolean>;
  requestDeleteMember: (row: PaymentEngineRecordRow) => void;
  requestVerify: (intent: ManageMemberVerifyIntent, row?: PaymentEngineRecordRow) => void;
  onVerifySucceeded: () => void;
  onVerifyClosed: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
};

export const manageMemberOverlayRegistry = shallowRef<ManageMemberOverlaySurface | null>(null);

export function registerManageMemberOverlay(surface: ManageMemberOverlaySurface | null) {
  manageMemberOverlayRegistry.value = surface;
}
