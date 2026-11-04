import { shallowRef, type Ref } from 'vue';
import type { GasProxyPaymentRecordRow } from './gasProxyPaymentRecordTypes';

export type ManageGasProxyPaymentRecordsOverlaySurface = {
  detailOpen: Ref<boolean>;
  detailRow: Ref<GasProxyPaymentRecordRow | null>;
};

export const manageGasProxyPaymentRecordsOverlayRegistry =
  shallowRef<ManageGasProxyPaymentRecordsOverlaySurface | null>(null);

export function registerManageGasProxyPaymentRecordsOverlay(
  surface: ManageGasProxyPaymentRecordsOverlaySurface | null,
) {
  manageGasProxyPaymentRecordsOverlayRegistry.value = surface;
}
