import { shallowRef, type Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type ManageRoleOverlaySurface = {
  detailOpen: Ref<boolean>;
  detailRow: Ref<PaymentEngineRecordRow | null>;
};

export const manageRoleOverlayRegistry = shallowRef<ManageRoleOverlaySurface | null>(null);

export function registerManageRoleOverlay(surface: ManageRoleOverlaySurface | null) {
  manageRoleOverlayRegistry.value = surface;
}
