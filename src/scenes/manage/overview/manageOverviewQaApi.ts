import { shallowRef } from 'vue';
import type { OverviewGasRechargeAccountKey } from './overviewRechargeSkidData';

export type ManageOverviewQaSnapshot = {
  gasProxyEnabled: boolean;
  balanceAmountVisible: boolean;
  overviewSkidOpen: boolean;
  canConfigureGasProxyPayment: boolean;
};

export type ManageOverviewQaApi = {
  applySnapshot: (patch: Partial<ManageOverviewQaSnapshot>) => void;
  resetOverviewQaBaseline: () => void;
  openRechargeSkid: (
    target: 'team' | 'gas',
    gasAccountKey?: OverviewGasRechargeAccountKey,
  ) => void;
  openBalanceReminderSkid: () => void;
  closeOverviewSkid: () => void;
};

export const manageOverviewQaApiRegistry = shallowRef<ManageOverviewQaApi | null>(null);
