import { shallowRef, type Ref } from 'vue';

export type ManageOverviewOverlaySurface = {
  confirmDialogOpen: Ref<boolean>;
  confirmEnabling: Ref<boolean>;
  verifyOpen: Ref<boolean>;
  noPermissionDialogOpen: Ref<boolean>;
  setTransactionPasswordDialogOpen: Ref<boolean>;
  confirmToggleDialog: () => void;
  cancelToggleDialog: () => void;
  submitTradePassword: (code: string) => boolean;
  onVerifyClosed: (accepted: boolean) => void;
};

export const manageOverviewOverlayRegistry = shallowRef<ManageOverviewOverlaySurface | null>(
  null,
);

export function registerManageOverviewOverlay(surface: ManageOverviewOverlaySurface | null) {
  manageOverviewOverlayRegistry.value = surface;
}
