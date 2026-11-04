import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { FEE_RECORDS_DEMO_TOTAL } from '../feeRecordData';
import { buildFeeRecordFilterOptionsFromRows } from './buildFeeRecordFilterOptionsFromRows';
import { buildFeeRecordOperatorFilterOptions } from './buildFeeRecordOperatorFilterOptions';
import {
  FEE_RECORD_FILTER_FIELD_IDS,
  FEE_RECORD_FILTER_FIELD_LABEL_KEYS,
  type FeeRecordFilterFieldId,
} from './feeRecordFilterFieldLabelKeys';

function filterLabel(
  translate: (key: string) => string,
  fieldId: FeeRecordFilterFieldId,
): string {
  return translate(FEE_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowCount: number,
): Record<FeeRecordFilterFieldId, EgFilterField> {
  const rowOptions = buildFeeRecordFilterOptionsFromRows(translate);
  const memberOptions = buildFeeRecordOperatorFilterOptions(rowCount);

  return {
    feeOperationType: {
      id: 'feeOperationType',
      label: filterLabel(translate, 'feeOperationType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.operationTypeOptions,
    },
    feeTxHash: {
      id: 'feeTxHash',
      label: filterLabel(translate, 'feeTxHash'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    feeOperator: {
      id: 'feeOperator',
      label: filterLabel(translate, 'feeOperator'),
      kind: 'member',
      selectionMode: 'multi',
      showTypeTabs: false,
      placeholder: FILTER_SELECT_PLACEHOLDER,
      memberOptions,
      waasProjectOptions: [],
    },
    feeTransactionTime: {
      id: 'feeTransactionTime',
      label: filterLabel(translate, 'feeTransactionTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    feeAccount: {
      id: 'feeAccount',
      label: filterLabel(translate, 'feeAccount'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.accountOptions,
    },
  };
}

export const FEE_RECORD_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;

export function buildFeeRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? FEE_RECORDS_DEMO_TOTAL,
  );
  const catalog = buildFieldCatalog(translate, sourceRowCount);
  return FEE_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
