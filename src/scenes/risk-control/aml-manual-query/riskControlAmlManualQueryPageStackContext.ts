import type { InjectionKey, Ref } from 'vue';

export type RiskControlAmlManualQueryPageStackApi = {
  configFormOpen: Ref<boolean>;
  closeConfigForm: () => void;
  onConfigFormPageSettled: () => void;
};

export const riskControlAmlManualQueryPageStackKey: InjectionKey<RiskControlAmlManualQueryPageStackApi> =
  Symbol('riskControlAmlManualQueryPageStack');
