import type { EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import { AUTO_RULE_OUTFLOW_CURRENCY_OPTIONS } from './riskControlAutoRuleOutflowCurrencyOptions';

/** Add 多选菜单展示全量 catalog；已提交 entry 由菜单行 `disabled` 表达。 */
export function buildAutoRuleOutflowCurrencyAddPickerOptions(): EgFilterFieldCurrencyOption[] {
  return [...AUTO_RULE_OUTFLOW_CURRENCY_OPTIONS];
}
