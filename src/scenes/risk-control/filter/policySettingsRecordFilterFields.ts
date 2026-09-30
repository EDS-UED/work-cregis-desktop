import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolvePaymentEngineRecordRowCount } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import {
  buildPolicySettingsRecordStatusFilterOptions,
  buildPolicySettingsRecordTypeFilterOptions,
} from './buildPolicySettingsRecordFilterOptions';
import {
  POLICY_SETTINGS_RECORD_FILTER_FIELD_LABEL_KEYS,
  type PolicySettingsRecordFilterFieldId,
} from './policySettingsRecordFilterFieldLabelKeys';

const POLICY_SETTINGS_RECORD_FILTER_FIELD_IDS: readonly PolicySettingsRecordFilterFieldId[] = [
  'policyType',
  'policyStatus',
  'policyName',
  'policyNumber',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: PolicySettingsRecordFilterFieldId,
): string {
  return translate(POLICY_SETTINGS_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
): Record<PolicySettingsRecordFilterFieldId, EgFilterField> {
  return {
    policyType: {
      id: 'policyType',
      label: filterLabel(translate, 'policyType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildPolicySettingsRecordTypeFilterOptions(translate),
    },
    policyStatus: {
      id: 'policyStatus',
      label: filterLabel(translate, 'policyStatus'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildPolicySettingsRecordStatusFilterOptions(translate),
    },
    policyName: {
      id: 'policyName',
      label: filterLabel(translate, 'policyName'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    policyNumber: {
      id: 'policyNumber',
      label: filterLabel(translate, 'policyNumber'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export const POLICY_SETTINGS_RECORD_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;

export function buildPolicySettingsRecordFilterFields(
  translate: (key: string) => string,
  _rowCount = resolvePaymentEngineRecordRowCount('Policy Settings'),
): EgFilterField[] {
  const catalog = buildFieldCatalog(translate);
  return POLICY_SETTINGS_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
