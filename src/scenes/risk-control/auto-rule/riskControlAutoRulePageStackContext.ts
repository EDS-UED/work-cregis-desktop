import type { InjectionKey, Ref } from 'vue';

/** AML 自动规则 · 列表↔创建/编辑 motion-page（对齐 Webhook configFormOpen）。 */
export type RiskControlAutoRulePageStackApi = {
  configFormOpen: Ref<boolean>;
  closeConfigForm: () => void;
  onConfigFormPageSettled: () => void;
};

export const riskControlAutoRulePageStackKey: InjectionKey<RiskControlAutoRulePageStackApi> =
  Symbol('riskControlAutoRulePageStack');
