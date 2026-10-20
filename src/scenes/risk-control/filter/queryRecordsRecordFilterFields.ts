import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolvePaymentEngineRecordRowCount } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import {
  buildQueryRecordsCurrencyFilterOptions,
  buildQueryRecordsObjectFilterOptions,
  buildQueryRecordsProviderFilterOptions,
  buildQueryRecordsResultFilterOptions,
  buildQueryRecordsTypeFilterOptions,
  buildQueryRecordsWaasProjectFilterOptions,
} from './buildQueryRecordsRecordFilterOptions';
import {
  QUERY_RECORDS_FILTER_FIELD_LABEL_KEYS,
  type QueryRecordsFilterFieldId,
} from './queryRecordsRecordFilterFieldLabelKeys';

const QUERY_RECORDS_FILTER_FIELD_IDS: readonly QueryRecordsFilterFieldId[] = [
  'amlCurrency',
  'amlWaasProject',
  'amlQueryResult',
  'amlServiceProvider',
  'amlQueryObject',
  'amlQueryType',
  'amlQueryTime',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: QueryRecordsFilterFieldId,
): string {
  return translate(QUERY_RECORDS_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowCount: number,
): Record<QueryRecordsFilterFieldId, EgFilterField> {
  return {
    amlCurrency: {
      id: 'amlCurrency',
      label: filterLabel(translate, 'amlCurrency'),
      kind: 'currency',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: buildQueryRecordsCurrencyFilterOptions(rowCount),
    },
    amlWaasProject: {
      id: 'amlWaasProject',
      label: filterLabel(translate, 'amlWaasProject'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildQueryRecordsWaasProjectFilterOptions(rowCount),
    },
    amlQueryResult: {
      id: 'amlQueryResult',
      label: filterLabel(translate, 'amlQueryResult'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildQueryRecordsResultFilterOptions(translate),
    },
    amlServiceProvider: {
      id: 'amlServiceProvider',
      label: filterLabel(translate, 'amlServiceProvider'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildQueryRecordsProviderFilterOptions(translate),
    },
    amlQueryObject: {
      id: 'amlQueryObject',
      label: filterLabel(translate, 'amlQueryObject'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildQueryRecordsObjectFilterOptions(translate),
    },
    amlQueryType: {
      id: 'amlQueryType',
      label: filterLabel(translate, 'amlQueryType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildQueryRecordsTypeFilterOptions(translate),
    },
    amlQueryTime: {
      id: 'amlQueryTime',
      label: filterLabel(translate, 'amlQueryTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
  };
}

export const QUERY_RECORDS_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;

export function buildQueryRecordsRecordFilterFields(
  translate: (key: string) => string,
  rowCount = resolvePaymentEngineRecordRowCount('AML'),
): EgFilterField[] {
  const catalog = buildFieldCatalog(translate, rowCount);
  return QUERY_RECORDS_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
