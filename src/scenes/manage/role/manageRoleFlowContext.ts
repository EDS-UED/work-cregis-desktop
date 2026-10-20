import type { InjectionKey } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type ManageRoleFlow = {
  openDetailForRow: (row: PaymentEngineRecordRow) => void;
};

export const manageRoleFlowKey: InjectionKey<ManageRoleFlow> = Symbol('manageRoleFlow');
