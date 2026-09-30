import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolvePaymentEngineRecordRowCount } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import {
  buildAutomationRecordStatusFilterOptions,
  buildAutomationRecordTypeFilterOptions,
} from './buildAutomationRecordFilterOptions';
import {
  AUTOMATION_RECORD_FILTER_FIELD_LABEL_KEYS,
  type AutomationRecordFilterFieldId,
} from './automationRecordFilterFieldLabelKeys';

const AUTOMATION_RECORD_FILTER_FIELD_IDS: readonly AutomationRecordFilterFieldId[] = [
  'automationType',
  'automationStatus',
  'automationName',
  'automationNumber',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: AutomationRecordFilterFieldId,
): string {
  return translate(AUTOMATION_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
): Record<AutomationRecordFilterFieldId, EgFilterField> {
  return {
    automationType: {
      id: 'automationType',
      label: filterLabel(translate, 'automationType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildAutomationRecordTypeFilterOptions(translate),
    },
    automationStatus: {
      id: 'automationStatus',
      label: filterLabel(translate, 'automationStatus'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildAutomationRecordStatusFilterOptions(translate),
    },
    automationName: {
      id: 'automationName',
      label: filterLabel(translate, 'automationName'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    automationNumber: {
      id: 'automationNumber',
      label: filterLabel(translate, 'automationNumber'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export const AUTOMATION_RECORD_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;

export function buildAutomationRecordFilterFields(
  translate: (key: string) => string,
  _rowCount = resolvePaymentEngineRecordRowCount('Automation'),
): EgFilterField[] {
  const catalog = buildFieldCatalog(translate);
  return AUTOMATION_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
