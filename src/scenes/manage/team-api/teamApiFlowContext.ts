import type { InjectionKey, Ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { TeamApiConfigRecord } from './teamApiMockData';

export type TeamApiVerifyIntent = 'toggle-enabled' | 'delete' | 'create' | 'view-key';

export type TeamApiFlowSurface = {
  openDetailForRow: (row: PaymentEngineRecordRow) => void;
  openEdit: (row: PaymentEngineRecordRow) => void;
  requestViewKey: (row: PaymentEngineRecordRow) => void;
  requestDelete: (row: PaymentEngineRecordRow) => void;
  requestToggleEnabled: (row: PaymentEngineRecordRow, nextEnabled: boolean) => void;
  openCreate: () => void;
  draftConfig: Ref<TeamApiConfigRecord | null>;
  configFormOpen: Ref<boolean>;
  closeConfigForm: () => void;
  onConfigFormPageSettled: () => void;
};

export const teamApiFlowKey: InjectionKey<TeamApiFlowSurface> = Symbol('teamApiFlow');
