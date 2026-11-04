import { shallowRef, type Ref } from 'vue';
import type { OrderManagementRow } from './orderManagementTypes';

export type ManageOrderManagementOverlaySurface = {
  detailOpen: Ref<boolean>;
  detailRow: Ref<OrderManagementRow | null>;
};

export const manageOrderManagementOverlayRegistry =
  shallowRef<ManageOrderManagementOverlaySurface | null>(null);

export function registerManageOrderManagementOverlay(
  surface: ManageOrderManagementOverlaySurface | null,
) {
  manageOrderManagementOverlayRegistry.value = surface;
}
