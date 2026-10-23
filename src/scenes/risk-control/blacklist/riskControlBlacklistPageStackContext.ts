import type { InjectionKey, Ref } from 'vue';

export type RiskControlBlacklistPageStackApi = {
  configFormOpen: Ref<boolean>;
  closeConfigForm: () => void;
  onConfigFormPageSettled: () => void;
};

export const riskControlBlacklistPageStackKey: InjectionKey<RiskControlBlacklistPageStackApi> =
  Symbol('riskControlBlacklistPageStack');
