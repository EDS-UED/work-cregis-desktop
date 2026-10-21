import { shallowRef, type Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type ManageRoleVerifyIntent = 'save-permissions' | 'delete-role';

export type ManageRoleOverlaySurface = {
  detailOpen: Ref<boolean>;
  detailRow: Ref<PaymentEngineRecordRow | null>;
  initialEnterEdit: Ref<boolean>;
  enterEditNonce: Ref<number>;
  verifyOpen: Ref<boolean>;
  deleteDialogOpen: Ref<boolean>;
  consumeInitialEnterEdit: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  /** 与列表 RoleListFieldActions 删除同一链：Dialog → 验证 → 成功反馈。 */
  requestDeleteRole: (row: PaymentEngineRecordRow) => void;
  requestVerify: (intent: ManageRoleVerifyIntent, row?: PaymentEngineRecordRow) => void;
  setSavePermissionsVerifiedHandler: (handler: (() => void) | null) => void;
  onVerifySucceeded: () => void;
  onVerifyClosed: () => void;
};

export const manageRoleOverlayRegistry = shallowRef<ManageRoleOverlaySurface | null>(null);

export function registerManageRoleOverlay(surface: ManageRoleOverlaySurface | null) {
  manageRoleOverlayRegistry.value = surface;
}
