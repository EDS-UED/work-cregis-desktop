import type { InjectionKey } from 'vue';

export type RiskControlAmlRecordDetailActions = {
  closeDetail: () => void;
};

export const riskControlAmlRecordDetailActionsKey: InjectionKey<RiskControlAmlRecordDetailActions> =
  Symbol('riskControlAmlRecordDetailActions');
