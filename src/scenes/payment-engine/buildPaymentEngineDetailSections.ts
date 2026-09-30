import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import { buildDetailCurrencyAmountItems } from '@/scenes/tasks/shared/buildDetailCurrencyAmountItems';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import { buildPaymentEngineCallbackErrorDetailSections } from './buildPaymentEngineCallbackErrorDetailSections';
import { createPaymentEngineTransferBlockTimeRow } from './paymentEngineDetailApplyItemRows';
import { buildPaymentEnginePaymentExceptionDetailSections } from './buildPaymentEnginePaymentExceptionDetailSections';
import { buildPaymentEngineRefundRecordDetailSections } from './buildPaymentEngineRefundRecordDetailSections';
import { buildPaymentEngineWalletPayoutDetailSections } from './buildPaymentEngineWalletPayoutDetailSections';
import { buildPaymentEngineTransactionRecordDetailSections } from './buildPaymentEngineTransactionRecordDetailSections';
import { buildPaymentEngineApiCollectionDetailSections } from './buildPaymentEngineApiCollectionDetailSections';
import { buildPaymentEngineCollectionRecordDetailSections } from './buildPaymentEngineCollectionRecordDetailSections';
import { buildPaymentEngineRuleConfigurationDetailSections } from './buildPaymentEngineRuleConfigurationDetailSections';
import { buildRiskControlAmlRecordDetailSections } from '@/scenes/risk-control/buildRiskControlAmlRecordDetailSections';
import { buildRiskControlAutoRuleDetailSections } from '@/scenes/risk-control/buildRiskControlAutoRuleDetailSections';
import { buildRiskControlLogDetailSections } from '@/scenes/risk-control/buildRiskControlLogDetailSections';
import {
  isRiskControlAmlMenuItem,
  isRiskControlAutoRulesMenuItem,
  isRiskControlLogsMenuItem,
} from '@/scenes/risk-control/riskControlMenuData';
import {
  isApiCollectionRecordMenuItem,
  isCollectionRecordDetailMenuItem,
  isRuleConfigurationRecordMenuItem,
  isTransactionRecordDetailMenuItem,
  isWalletPayoutRecordMenuItem,
} from './paymentEngineOrderRecordData';
import { resolvePaymentSettlementRecordDetail } from './paymentEngineSettlementDetailData';
import {
  resolvePaymentEngineRecordStatusDetailLabel,
  resolvePaymentEngineRecordStatusDetailTagStatus,
} from './paymentEngineRecordStatusCustomize';

function buildTransferStatusDetailItem(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('status', {
      key: 'transfer-status',
      title: translate('Status'),
      tag: resolvePaymentEngineRecordStatusDetailLabel(row, menuItem, translate),
    }),
    tagFamily: 'status',
    tagStatus: resolvePaymentEngineRecordStatusDetailTagStatus(row, menuItem),
    valueTagOnly: true,
    value: '',
  };
}

function buildSettlementRecordDetailItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentSettlementRecordDetail(row);
  const cryptoName =
    resolveCryptoNameFromSymbol(row.currencySymbol ?? row.orderSymbol) ?? 'eds-usdt-tether';
  const networkLabel = (row.currencyNetwork ?? row.networkLabel ?? '').trim();

  return [
    createDetailApplyItemRow('crypto', {
      key: 'settlement-currency',
      title: translate('Settlement Currency'),
      value: row.currencySymbol ?? row.orderSymbol,
      valueSymbolCrypto: cryptoName,
      valueIcon: cryptoName,
      tag: networkLabel,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'settlement-id',
        title: translate('Settlement ID'),
        value: row.id,
      }),
      titleIcon: 'eds-text-numerical',
    },
    createPaymentEngineTransferBlockTimeRow({
      key: 'settlement-time',
      title: translate('Settlement Time'),
      value: row.createdAt,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'settlement-successful-payment-count',
        title: translate('Total Successful Payment Count'),
        value: detail.successfulPaymentCount,
      }),
      titleIcon: 'eds-text-numerical',
    },
    createDetailApplyItemRow('amount', {
      key: 'settlement-total-transaction-amount',
      title: translate('Total Transaction Amount'),
      value: `${detail.totalTransactionAmount} ${detail.totalTransactionSymbol}`,
      tag: networkLabel,
    }),
    createDetailApplyItemRow('fee', {
      key: 'settlement-total-fee',
      title: translate('Total Fee'),
      value: `${detail.totalFee} ${detail.totalFeeSymbol}`,
    }),
    createDetailApplyItemRow('receiver', {
      key: 'settlement-address',
      title: translate('Settlement Address'),
      value: detail.settlementAddress,
      tag: '',
    }),
  ];
}

function buildBulkTransferDetailItems(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
  timeLabelKey: string,
  idLabelKey: string,
  amountLabelKey: string,
): DetailItemData[] {
  const cryptoName =
    resolveCryptoNameFromSymbol(row.currencySymbol ?? row.orderSymbol) ?? 'eds-usdt-tether';
  const transferId = row.bulkTransferId ?? row.id;

  return [
    ...buildDetailCurrencyAmountItems(
      {
        amountRowValue: row.orderAmount,
        amountCryptoSymbol: row.currencySymbol ?? row.orderSymbol,
        amountCryptoName: cryptoName,
        amountNetworkLabel: row.currencyNetwork ?? '',
      },
      translate,
    ),
    {
      ...createDetailApplyItemRow('text', {
        key: 'transfer-id',
        title: translate(idLabelKey),
        value: transferId,
      }),
      titleIcon: 'eds-text-numerical',
    },
    buildTransferStatusDetailItem(row, menuItem, translate),
    createDetailApplyItemRow('time', {
      key: 'transfer-time',
      title: translate(timeLabelKey),
      value: row.createdAt,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'transfer-amount',
        title: translate(amountLabelKey),
        value: `${row.orderAmount} ${row.orderSymbol}`,
      }),
      titleIcon: 'eds-wallet',
    },
  ];
}

export function buildPaymentEngineDetailSections(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): DetailSectionData[] {
  let items: DetailItemData[];

  if (menuItem === 'Settlement Record') {
    items = buildSettlementRecordDetailItems(row, translate);
  } else if (menuItem === 'Bulk Transfer Record') {
    items = buildBulkTransferDetailItems(
      row,
      menuItem,
      translate,
      'Bulk Transfer Time',
      'Bulk Transfer ID',
      'Bulk Transfer Amount',
    );
  } else if (isWalletPayoutRecordMenuItem(menuItem)) {
    return buildPaymentEngineWalletPayoutDetailSections(row, translate);
  } else if (isTransactionRecordDetailMenuItem(menuItem)) {
    return buildPaymentEngineTransactionRecordDetailSections(row, menuItem, translate);
  } else if (isApiCollectionRecordMenuItem(menuItem)) {
    return buildPaymentEngineApiCollectionDetailSections(row, translate);
  } else if (isCollectionRecordDetailMenuItem(menuItem)) {
    return buildPaymentEngineCollectionRecordDetailSections(row, menuItem, translate);
  } else if (isRuleConfigurationRecordMenuItem(menuItem)) {
    return buildPaymentEngineRuleConfigurationDetailSections(row, translate);
  } else if (menuItem === 'Refund Record') {
    return buildPaymentEngineRefundRecordDetailSections(row, translate);
  } else if (menuItem === 'Payment Exception Record') {
    return buildPaymentEnginePaymentExceptionDetailSections(row, translate);
  } else if (menuItem === 'Callback Error' || menuItem === 'History Callback') {
    return buildPaymentEngineCallbackErrorDetailSections(row, 0, translate, menuItem);
  } else if (isRiskControlAmlMenuItem(menuItem)) {
    return buildRiskControlAmlRecordDetailSections(row, 0, translate);
  } else if (isRiskControlAutoRulesMenuItem(menuItem)) {
    return buildRiskControlAutoRuleDetailSections(row, translate);
  } else if (isRiskControlLogsMenuItem(menuItem)) {
    return buildRiskControlLogDetailSections(row, translate);
  } else {
    return [];
  }

  return [{ items }];
}
