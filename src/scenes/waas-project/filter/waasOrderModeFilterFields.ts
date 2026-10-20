import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '../../shared/buildListDerivedFilterOptions';
import type { WaasOrderModeMenuItem } from '../waasMenuData';
import { resolvePaymentEngineRecordRowCount } from '../../payment-engine/paymentEngineOrderRecordData';
import { buildWaasDataListFilterFields } from './waasDataListFilterFields';
import { buildWaasOrderModeFilterOptionsFromRows } from './buildWaasOrderModeFilterOptionsFromRows';
import { buildWaasOrderModeStatusFilterOptions } from './buildWaasOrderModeStatusFilterOptions';
import {
  WAAS_ORDER_MODE_FILTER_FIELD_LABEL_KEYS,
  type WaasOrderModeFilterFieldId,
} from './waasOrderModeFilterFieldLabelKeys';

function filterLabel(
  translate: (key: string) => string,
  fieldId: WaasOrderModeFilterFieldId,
): string {
  return translate(WAAS_ORDER_MODE_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

const WAAS_ORDER_MODE_FILTER_FIELD_IDS_BY_MENU: Record<
  WaasOrderModeMenuItem,
  readonly WaasOrderModeFilterFieldId[]
> = {
  'Order Record': [
    'merchantOrderId',
    'orderId',
    'createdAt',
    'paymentTxHash',
    'orderStatus',
    'orderCurrency',
    'orderAmount',
    'receivingCurrency',
  ],
  'Bulk Transfer Record': [
    'bulkTransferId',
    'bulkTransferStatus',
    'createdAt',
    'bulkTransferAmount',
    'transferCurrency',
  ],
  'Refund Record': [
    'currency',
    'orderId',
    'refundReason',
    'refundStatus',
    'refundType',
    'createdAt',
  ],
  'Payment Exception Record': [
    'currency',
    'sender',
    'receiver',
    'txHash',
    'abnormalReason',
    'transferStatus',
    'createdAt',
  ],
  'Wallet Payout': [
    'thirdPartyBizId',
    'receiver',
    'transactionStatus',
    'currency',
    'transactionTime',
    'memo',
    'remark',
  ],
  'Callback Error': ['cregisId', 'businessType', 'callbackAddress', 'callbackTime'],
  'History Callback': [
    'cregisId',
    'pushStatus',
    'businessType',
    'callbackAddress',
    'callbackTime',
  ],
};

function buildFieldCatalog(
  translate: (key: string) => string,
  rowOptions: ReturnType<typeof buildWaasOrderModeFilterOptionsFromRows>,
): Record<WaasOrderModeFilterFieldId, EgFilterField> {
  return {
    merchantOrderId: {
      id: 'merchantOrderId',
      label: filterLabel(translate, 'merchantOrderId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    orderId: {
      id: 'orderId',
      label: filterLabel(translate, 'orderId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
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
    orderStatus: {
      id: 'orderStatus',
      label: filterLabel(translate, 'orderStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.orderStatusOptions,
    },
    orderCurrency: {
      id: 'orderCurrency',
      label: filterLabel(translate, 'orderCurrency'),
      kind: 'currency',
      selectionMode: 'single',
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
    receivingCurrency: {
      id: 'receivingCurrency',
      label: filterLabel(translate, 'receivingCurrency'),
      kind: 'currency',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.receivingCurrencyOptions,
    },
    bulkTransferId: {
      id: 'bulkTransferId',
      label: filterLabel(translate, 'bulkTransferId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    bulkTransferStatus: {
      id: 'bulkTransferStatus',
      label: filterLabel(translate, 'bulkTransferStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.bulkTransferStatusOptions,
    },
    bulkTransferAmount: {
      id: 'bulkTransferAmount',
      label: filterLabel(translate, 'bulkTransferAmount'),
      kind: 'amount',
      amountMode: 'range',
      unit: '',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    transferCurrency: {
      id: 'transferCurrency',
      label: filterLabel(translate, 'transferCurrency'),
      kind: 'currency',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.transferCurrencyOptions,
    },
    currency: {
      id: 'currency',
      label: filterLabel(translate, 'currency'),
      kind: 'currency',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.currencyOptions,
    },
    refundReason: {
      id: 'refundReason',
      label: filterLabel(translate, 'refundReason'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.refundReasonOptions,
    },
    refundStatus: {
      id: 'refundStatus',
      label: filterLabel(translate, 'refundStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.refundStatusOptions,
    },
    refundType: {
      id: 'refundType',
      label: filterLabel(translate, 'refundType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.refundTypeOptions,
    },
    sender: {
      id: 'sender',
      label: filterLabel(translate, 'sender'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    receiver: {
      id: 'receiver',
      label: filterLabel(translate, 'receiver'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    txHash: {
      id: 'txHash',
      label: filterLabel(translate, 'txHash'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    abnormalReason: {
      id: 'abnormalReason',
      label: filterLabel(translate, 'abnormalReason'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    transferStatus: {
      id: 'transferStatus',
      label: filterLabel(translate, 'transferStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.transferStatusOptions,
    },
    thirdPartyBizId: {
      id: 'thirdPartyBizId',
      label: filterLabel(translate, 'thirdPartyBizId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    transactionStatus: {
      id: 'transactionStatus',
      label: filterLabel(translate, 'transactionStatus'),
      kind: 'status',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.transactionStatusOptions,
    },
    transactionTime: {
      id: 'transactionTime',
      label: filterLabel(translate, 'transactionTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    memo: {
      id: 'memo',
      label: filterLabel(translate, 'memo'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    remark: {
      id: 'remark',
      label: filterLabel(translate, 'remark'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    cregisId: {
      id: 'cregisId',
      label: filterLabel(translate, 'cregisId'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    businessType: {
      id: 'businessType',
      label: filterLabel(translate, 'businessType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.businessTypeOptions,
    },
    callbackAddress: {
      id: 'callbackAddress',
      label: filterLabel(translate, 'callbackAddress'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    callbackTime: {
      id: 'callbackTime',
      label: filterLabel(translate, 'callbackTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    pushStatus: {
      id: 'pushStatus',
      label: filterLabel(translate, 'pushStatus'),
      kind: 'status',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      statusOptions: rowOptions.pushStatusOptions,
    },
  };
}

export function buildWaasOrderModeFilterFields(
  menuItem: string,
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  if (menuItem === 'Wallet Payout') {
    return buildWaasDataListFilterFields(menuItem, translate, rowCount);
  }

  const resolvedMenu = menuItem as WaasOrderModeMenuItem;
  const fieldIds =
    WAAS_ORDER_MODE_FILTER_FIELD_IDS_BY_MENU[resolvedMenu]
    ?? WAAS_ORDER_MODE_FILTER_FIELD_IDS_BY_MENU['Order Record'];

  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? resolvePaymentEngineRecordRowCount(menuItem),
  );

  const rowOptions = buildWaasOrderModeFilterOptionsFromRows(sourceRowCount, menuItem);
  const catalog = buildFieldCatalog(translate, rowOptions);

  return fieldIds.map((fieldId) => {
    const field = catalog[fieldId];

    if (fieldId === 'orderStatus' && resolvedMenu === 'Order Record') {
      return {
        ...field,
        statusOptions: buildWaasOrderModeStatusFilterOptions(
          sourceRowCount,
          menuItem,
          'orderStatus',
        ),
      };
    }

    if (fieldId === 'pushStatus' && resolvedMenu === 'History Callback') {
      return {
        ...field,
        selectionMode: 'single' as const,
        statusOptions: buildWaasOrderModeStatusFilterOptions(
          sourceRowCount,
          menuItem,
          'pushStatus',
        ),
      };
    }

    if (
      fieldId === 'businessType'
      && (resolvedMenu === 'Callback Error' || resolvedMenu === 'History Callback')
    ) {
      return {
        ...field,
        selectionMode: 'multi' as const,
        dropdownOptions: rowOptions.businessTypeOptions,
      };
    }

    return field;
  });
}

export const WAAS_ORDER_MODE_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;
