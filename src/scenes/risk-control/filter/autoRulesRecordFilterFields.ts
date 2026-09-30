import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_SELECT_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolvePaymentEngineRecordRowCount } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import {
  buildAutoRulesRecordProviderFilterOptions,
  buildAutoRulesRecordStatusFilterOptions,
  buildAutoRulesRecordWaasProjectFilterOptions,
} from './buildAutoRulesRecordFilterOptions';
import {
  AUTO_RULES_RECORD_FILTER_FIELD_LABEL_KEYS,
  type AutoRulesRecordFilterFieldId,
} from './autoRulesRecordFilterFieldLabelKeys';

const AUTO_RULES_RECORD_FILTER_FIELD_IDS: readonly AutoRulesRecordFilterFieldId[] = [
  'autoRuleWaasProject',
  'autoRuleStatus',
  'autoRuleServiceProvider',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: AutoRulesRecordFilterFieldId,
): string {
  return translate(AUTO_RULES_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowCount: number,
): Record<AutoRulesRecordFilterFieldId, EgFilterField> {
  return {
    autoRuleWaasProject: {
      id: 'autoRuleWaasProject',
      label: filterLabel(translate, 'autoRuleWaasProject'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildAutoRulesRecordWaasProjectFilterOptions(rowCount),
    },
    autoRuleStatus: {
      id: 'autoRuleStatus',
      label: filterLabel(translate, 'autoRuleStatus'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildAutoRulesRecordStatusFilterOptions(translate),
    },
    autoRuleServiceProvider: {
      id: 'autoRuleServiceProvider',
      label: filterLabel(translate, 'autoRuleServiceProvider'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildAutoRulesRecordProviderFilterOptions(translate),
    },
  };
}

export const AUTO_RULES_RECORD_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;

export function buildAutoRulesRecordFilterFields(
  translate: (key: string) => string,
  rowCount = resolvePaymentEngineRecordRowCount('Auto Rules'),
): EgFilterField[] {
  const catalog = buildFieldCatalog(translate, rowCount);
  return AUTO_RULES_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
