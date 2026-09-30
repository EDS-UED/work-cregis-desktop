import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { resolvePaymentEngineRecordRowCount } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { buildLogsRecordOperatorFilterOptions } from './buildLogsRecordOperatorFilterOptions';
import {
  buildLogsRecordLogEventFilterOptions,
  buildLogsRecordLogTypeFilterOptions,
} from './buildLogsRecordFilterOptions';
import {
  LOGS_RECORD_FILTER_FIELD_LABEL_KEYS,
  type LogsRecordFilterFieldId,
} from './logsRecordFilterFieldLabelKeys';

const LOGS_RECORD_FILTER_FIELD_IDS: readonly LogsRecordFilterFieldId[] = [
  'logType',
  'logOperator',
  'logStrategyName',
  'logStrategyNumber',
  'logEvent',
  'createdAt',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: LogsRecordFilterFieldId,
): string {
  return translate(LOGS_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowCount: number,
): Record<LogsRecordFilterFieldId, EgFilterField> {
  const memberOptions = buildLogsRecordOperatorFilterOptions(rowCount);

  return {
    logType: {
      id: 'logType',
      label: filterLabel(translate, 'logType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildLogsRecordLogTypeFilterOptions(translate),
    },
    logOperator: {
      id: 'logOperator',
      label: filterLabel(translate, 'logOperator'),
      kind: 'member',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      memberOptions,
      waasProjectOptions: [],
      showTypeTabs: false,
    },
    logStrategyName: {
      id: 'logStrategyName',
      label: filterLabel(translate, 'logStrategyName'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    logStrategyNumber: {
      id: 'logStrategyNumber',
      label: filterLabel(translate, 'logStrategyNumber'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    logEvent: {
      id: 'logEvent',
      label: filterLabel(translate, 'logEvent'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildLogsRecordLogEventFilterOptions(translate),
    },
    createdAt: {
      id: 'createdAt',
      label: filterLabel(translate, 'createdAt'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
  };
}

export function buildLogsRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? resolvePaymentEngineRecordRowCount('Logs'),
  );
  const catalog = buildFieldCatalog(translate, sourceRowCount);
  return LOGS_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}

export const LOGS_RECORD_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;
