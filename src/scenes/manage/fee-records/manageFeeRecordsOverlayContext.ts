import { shallowRef, type Ref } from 'vue';
import type { FeeRecordRow } from './feeRecordTypes';

export type ManageFeeRecordsOverlaySurface = {
  detailOpen: Ref<boolean>;
  detailRow: Ref<FeeRecordRow | null>;
};

export const manageFeeRecordsOverlayRegistry = shallowRef<ManageFeeRecordsOverlaySurface | null>(
  null,
);

export function registerManageFeeRecordsOverlay(surface: ManageFeeRecordsOverlaySurface | null) {
  manageFeeRecordsOverlayRegistry.value = surface;
}
