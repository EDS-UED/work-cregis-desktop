import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '../../shared/buildListDerivedFilterOptions';
import { resolvePaymentEngineRecordRowCount } from '../paymentEngineOrderRecordData';
import { buildSettlementRecordFilterOptionsFromRows } from './buildSettlementRecordFilterOptions';
import {
  SETTLEMENT_RECORD_FILTER_FIELD_LABEL_KEYS,
  type SettlementRecordFilterFieldId,
} from './settlementRecordFilterFieldLabelKeys';

const SETTLEMENT_RECORD_FILTER_FIELD_IDS: readonly SettlementRecordFilterFieldId[] = [
  'settlementId',
  'settlementStatus',
  'settlementCurrency',
  'settlementTime',
  'settlementAmount',
  'settlementWalletAddress',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: SettlementRecordFilterFieldId,
): string {
  return translate(SETTLEMENT_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowOptions: ReturnType<typeof buildSettlementRecordFilterOptionsFromRows>,
): Record<SettlementRecordFilterFieldId, EgFilterField> {
  return {
    settlementId: {
      id: 'settlementId',
      label: filterLabel(translate, 'settlementId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    settlementStatus: {
      id: 'settlementStatus',
      label: filterLabel(translate, 'settlementStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.settlementStatusOptions,
    },
    settlementCurrency: {
      id: 'settlementCurrency',
      label: filterLabel(translate, 'settlementCurrency'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.settlementCurrencyOptions,
    },
    settlementTime: {
      id: 'settlementTime',
      label: filterLabel(translate, 'settlementTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    settlementAmount: {
      id: 'settlementAmount',
      label: filterLabel(translate, 'settlementAmount'),
      kind: 'amount',
      amountMode: 'range',
      unit: '',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    settlementWalletAddress: {
      id: 'settlementWalletAddress',
      label: filterLabel(translate, 'settlementWalletAddress'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export function buildSettlementRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? resolvePaymentEngineRecordRowCount('Settlement Record'),
  );
  const rowOptions = buildSettlementRecordFilterOptionsFromRows(sourceRowCount);
  const catalog = buildFieldCatalog(translate, rowOptions);

  return SETTLEMENT_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}

export const SETTLEMENT_RECORD_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;
