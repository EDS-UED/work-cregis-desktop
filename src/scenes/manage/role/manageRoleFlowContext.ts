import type { InjectionKey } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type ManageRoleFlow = {
  openDetailForRow: (row: PaymentEngineRecordRow) => void;
  requestEditPermissions: (row: PaymentEngineRecordRow) => void;
  requestToggleEnabled: (row: PaymentEngineRecordRow, nextEnabled: boolean) => void;
  /** EgDialog 确认 → Google 验证 → 全局 EgEndFeedbackCard。 */
  requestDeleteRole: (row: PaymentEngineRecordRow) => void;
};

export const manageRoleFlowKey: InjectionKey<ManageRoleFlow> = Symbol('manageRoleFlow');
