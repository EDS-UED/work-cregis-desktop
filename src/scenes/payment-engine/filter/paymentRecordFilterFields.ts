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
import { buildPaymentRecordFilterOptionsFromRows } from './buildPaymentRecordFilterOptions';
import {
  PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS,
  type PaymentRecordFilterFieldId,
} from './paymentRecordFilterFieldLabelKeys';

const PAYMENT_RECORD_FILTER_FIELD_IDS: readonly PaymentRecordFilterFieldId[] = [
  'orderId',
  'merchantOrderId',
  'orderStatus',
  'settlementStatus',
  'createdAt',
  'paymentTxHash',
  'paymentSender',
  'paymentReceiver',
  'orderCurrency',
  'orderAmount',
  'paymentCurrency',
  'receivedAmount',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: PaymentRecordFilterFieldId,
): string {
  return translate(PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowOptions: ReturnType<typeof buildPaymentRecordFilterOptionsFromRows>,
): Record<PaymentRecordFilterFieldId, EgFilterField> {
  return {
    orderId: {
      id: 'orderId',
      label: filterLabel(translate, 'orderId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    merchantOrderId: {
      id: 'merchantOrderId',
      label: filterLabel(translate, 'merchantOrderId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    orderStatus: {
      id: 'orderStatus',
      label: filterLabel(translate, 'orderStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.orderStatusOptions,
    },
    settlementStatus: {
      id: 'settlementStatus',
      label: filterLabel(translate, 'settlementStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.settlementStatusOptions,
    },
    createdAt: {
      id: 'createdAt',
      label: filterLabel(translate, 'createdAt'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    paymentTxHash: {
      id: 'paymentTxHash',
      label: filterLabel(translate, 'paymentTxHash'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    paymentSender: {
      id: 'paymentSender',
      label: filterLabel(translate, 'paymentSender'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    paymentReceiver: {
      id: 'paymentReceiver',
      label: filterLabel(translate, 'paymentReceiver'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    orderCurrency: {
      id: 'orderCurrency',
      label: filterLabel(translate, 'orderCurrency'),
      kind: 'currency',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.orderCurrencyOptions,
    },
    orderAmount: {
      id: 'orderAmount',
      label: filterLabel(translate, 'orderAmount'),
      kind: 'amount',
      amountMode: 'range',
      unit: '',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    paymentCurrency: {
      id: 'paymentCurrency',
      label: filterLabel(translate, 'paymentCurrency'),
      kind: 'currency',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.paymentCurrencyOptions,
    },
    receivedAmount: {
      id: 'receivedAmount',
      label: filterLabel(translate, 'receivedAmount'),
      kind: 'amount',
      amountMode: 'range',
      unit: '',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export function buildPaymentRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? resolvePaymentEngineRecordRowCount('Payment Record'),
  );
  const rowOptions = buildPaymentRecordFilterOptionsFromRows(sourceRowCount);
  const catalog = buildFieldCatalog(translate, rowOptions);

  return PAYMENT_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}

export const PAYMENT_RECORD_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;
