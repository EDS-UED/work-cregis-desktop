import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { buildDetailCurrencyAmountItems } from '@/scenes/tasks/shared/buildDetailCurrencyAmountItems';
import { isFeeRecordIncomeOperation } from './feeRecordOperationDirection';
import {
  feeRecordDetailShowsAmlPlan,
  feeRecordDetailShowsAmlServiceProvider,
  feeRecordDetailShowsCryptoCard,
  feeRecordDetailShowsCurrency,
  feeRecordDetailShowsOperator,
  feeRecordDetailShowsOrderNumber,
  feeRecordDetailShowsPlan,
  feeRecordDetailShowsTxHash,
  feeRecordDetailUsesBulkTransferOrderNumber,
} from './feeRecordDetailFieldPolicy';
import type { FeeRecordRow } from './feeRecordTypes';

/** 收单服务费 · 批量转账单号行 key（`itemValueLinkClick`）。 */
export const FEE_RECORD_BULK_TRANSFER_ORDER_ITEM_KEY = 'fee-bulk-transfer-order-number';

export function formatFeeRecordSignedFiatAmount(row: FeeRecordRow): string {
  const sign = isFeeRecordIncomeOperation(row.operationTypeKey) ? '+' : '-';
  return `${sign}$${row.amount}`;
}

export function buildFeeRecordDetailSections(
  row: FeeRecordRow,
  translate: (catalogKey: string) => string,
): DetailSectionData[] {
  const items: DetailItemData[] = [];

  if (feeRecordDetailShowsOperator(row.operationTypeKey)) {
    items.push({
      ...createDetailApplyItemRow('initiated-by', {
        key: 'fee-operator',
        title: translate('Operator'),
        value: row.operatorName,
      }),
      titleIcon: 'eds-user-pointer',
    });
  }

  if (feeRecordDetailShowsPlan(row.operationTypeKey) && row.planTransition?.trim()) {
    items.push({
      ...createDetailApplyItemRow('text', {
        key: 'fee-plan',
        title: translate('Fee Record Plan'),
        value: row.planTransition.trim(),
      }),
      titleIcon: 'eds-module-three',
    });
  }

  if (feeRecordDetailShowsOrderNumber(row.operationTypeKey) && row.orderNumber?.trim()) {
    const usesBulkTransferOrderNumber = feeRecordDetailUsesBulkTransferOrderNumber(
      row.operationTypeKey,
    );
    const orderNumberItem: DetailItemData = {
      ...createDetailApplyItemRow('brand-number', {
        key: usesBulkTransferOrderNumber
          ? FEE_RECORD_BULK_TRANSFER_ORDER_ITEM_KEY
          : 'fee-order-number',
        title: translate(
          usesBulkTransferOrderNumber ? 'Bulk Transfer ID' : 'Fee Record Order Number',
        ),
        value: row.orderNumber.trim(),
      }),
      titleIcon: 'eds-brand-numbers',
    };
    if (usesBulkTransferOrderNumber) {
      orderNumberItem.showValueLink = true;
      orderNumberItem.valueLinkLabel = translate('Fee Record View Bulk Transfer Records');
    }
    items.push(orderNumberItem);
  }

  if (
    feeRecordDetailShowsCurrency(row.operationTypeKey)
    && row.currencySymbol?.trim()
    && row.currencyCryptoName?.trim()
  ) {
    items.push(
      ...buildDetailCurrencyAmountItems(
        {
          amountRowValue: row.amount,
          amountCryptoSymbol: row.currencySymbol.trim(),
          amountCryptoName: row.currencyCryptoName.trim(),
          amountNetworkLabel: row.currencyShowNetwork
            ? (row.currencyNetworkLabel ?? '').trim()
            : '',
        },
        translate,
      ).map((item) => ({ ...item, key: 'fee-currency' })),
    );
  }

  if (
    feeRecordDetailShowsAmlServiceProvider(row.operationTypeKey)
    && row.amlServiceProvider?.trim()
  ) {
    items.push({
      ...createDetailApplyItemRow('text', {
        key: 'fee-aml-service-provider',
        title: translate('Service Provider'),
        value: row.amlServiceProvider.trim(),
      }),
      titleIcon: 'eds-circle-pentagram',
    });
  }

  if (feeRecordDetailShowsAmlPlan(row.operationTypeKey)) {
    items.push({
      ...createDetailApplyItemRow('text', {
        key: 'fee-aml-plan',
        title: translate('Fee Record Plan'),
        value: translate('Fee Record AML Manual Query Plan'),
      }),
      titleIcon: 'eds-module-three',
    });
  }

  if (feeRecordDetailShowsCryptoCard(row.operationTypeKey) && row.cryptoCardLabel?.trim()) {
    items.push({
      ...createDetailApplyItemRow('text', {
        key: 'fee-crypto-card',
        title: translate('Fee Record Crypto Card'),
        value: row.cryptoCardLabel.trim(),
      }),
      titleIcon: 'eds-crypto-card',
    });
  }

  items.push(
    createDetailApplyItemRow('time', {
      key: 'fee-time',
      title: translate('Time'),
      value: row.transactionTime,
    }),
  );

  if (feeRecordDetailShowsTxHash(row.operationTypeKey) && row.txHash.trim()) {
    items.push(
      createDetailApplyItemRow('txid', {
        key: 'fee-tx-hash',
        title: translate('Transaction hash'),
        value: row.txHash,
      }),
    );
  }

  items.push({
    ...createDetailApplyItemRow('text', {
      key: 'fee-account',
      title: translate('Account'),
      value: translate(row.accountKey),
    }),
    titleIcon: 'eds-fiat-currency',
  });

  return [{ items }];
}
