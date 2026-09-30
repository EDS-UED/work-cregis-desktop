import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '../../shared/buildListDerivedFilterOptions';
import { TRANSACTION_RECORDS_DEMO_TOTAL } from '../transactionRecordData';
import { buildTransactionRecordsFilterOptionsFromRows } from './buildTransactionRecordsFilterOptionsFromRows';
import {
  TRANSACTION_RECORDS_FILTER_FIELD_IDS,
  TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS,
  type TransactionRecordsFilterFieldId,
} from './transactionRecordsFilterFieldLabelKeys';

function filterLabel(
  translate: (key: string) => string,
  fieldId: TransactionRecordsFilterFieldId,
): string {
  return translate(TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowOptions: ReturnType<typeof buildTransactionRecordsFilterOptionsFromRows>,
): Record<TransactionRecordsFilterFieldId, EgFilterField> {
  return {
    wallet: {
      id: 'wallet',
      label: filterLabel(translate, 'wallet'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    currency: {
      id: 'currency',
      label: filterLabel(translate, 'currency'),
      kind: 'currency',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.currencyOptions,
    },
    transactionTime: {
      id: 'transactionTime',
      label: filterLabel(translate, 'transactionTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    incomeExpenseType: {
      id: 'incomeExpenseType',
      label: filterLabel(translate, 'incomeExpenseType'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.incomeExpenseTypeOptions,
    },
    transactionType: {
      id: 'transactionType',
      label: filterLabel(translate, 'transactionType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.transactionTypeOptions,
    },
    txHash: {
      id: 'txHash',
      label: filterLabel(translate, 'txHash'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    paymentAddress: {
      id: 'paymentAddress',
      label: filterLabel(translate, 'paymentAddress'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    receivingAddress: {
      id: 'receivingAddress',
      label: filterLabel(translate, 'receivingAddress'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export function buildTransactionRecordsFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? TRANSACTION_RECORDS_DEMO_TOTAL,
  );
  const rowOptions = buildTransactionRecordsFilterOptionsFromRows(sourceRowCount);
  const catalog = buildFieldCatalog(translate, rowOptions);

  return TRANSACTION_RECORDS_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}

export const TRANSACTION_RECORDS_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;
