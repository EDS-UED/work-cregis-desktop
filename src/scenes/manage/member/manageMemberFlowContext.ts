import type { InjectionKey } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type ManageMemberFlow = {
  openDetailForRow: (row: PaymentEngineRecordRow) => void;
  requestDeleteMember: (row: PaymentEngineRecordRow) => void;
};

export const manageMemberFlowKey: InjectionKey<ManageMemberFlow> = Symbol('manageMemberFlow');
