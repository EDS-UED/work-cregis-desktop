import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { GAS_PROXY_PAYMENT_RECORDS_DEMO_TOTAL } from '../gasProxyPaymentRecordData';
import { buildGasProxyPaymentRecordFilterOptionsFromRows } from './buildGasProxyPaymentRecordFilterOptionsFromRows';
import {
  GAS_PROXY_PAYMENT_RECORD_FILTER_FIELD_IDS,
  GAS_PROXY_PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS,
  type GasProxyPaymentRecordFilterFieldId,
} from './gasProxyPaymentRecordFilterFieldLabelKeys';

function filterLabel(
  translate: (key: string) => string,
  fieldId: GasProxyPaymentRecordFilterFieldId,
): string {
  return translate(GAS_PROXY_PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowCount: number,
): Record<GasProxyPaymentRecordFilterFieldId, EgFilterField> {
  const rowOptions = buildGasProxyPaymentRecordFilterOptionsFromRows(translate, rowCount);

  return {
    gasProxyCurrency: {
      id: 'gasProxyCurrency',
      label: filterLabel(translate, 'gasProxyCurrency'),
      kind: 'currency',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.currencyOptions,
    },
    gasProxyTransactionType: {
      id: 'gasProxyTransactionType',
      label: filterLabel(translate, 'gasProxyTransactionType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.transactionTypeOptions,
    },
    gasProxyTxHash: {
      id: 'gasProxyTxHash',
      label: filterLabel(translate, 'gasProxyTxHash'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    gasProxyDeductedAccount: {
      id: 'gasProxyDeductedAccount',
      label: filterLabel(translate, 'gasProxyDeductedAccount'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.deductedAccountOptions,
    },
    gasProxyTransactionTime: {
      id: 'gasProxyTransactionTime',
      label: filterLabel(translate, 'gasProxyTransactionTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
  };
}

export const GAS_PROXY_PAYMENT_RECORD_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;

export function buildGasProxyPaymentRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? GAS_PROXY_PAYMENT_RECORDS_DEMO_TOTAL,
  );
  const catalog = buildFieldCatalog(translate, sourceRowCount);
  return GAS_PROXY_PAYMENT_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
