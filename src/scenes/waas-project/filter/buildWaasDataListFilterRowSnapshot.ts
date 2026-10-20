import type { EgFilterRowSnapshot } from '../../shared/applyEgFilterConditions';
import { resolvePaymentApiCollectionRecordDetail } from '../../payment-engine/paymentEngineApiCollectionDetailData';
import { resolvePaymentCallbackErrorRecordDetail } from '../../payment-engine/paymentEngineCallbackErrorDetailData';
import { resolvePaymentCollectionRecordDetail } from '../../payment-engine/paymentEngineCollectionRecordDetailData';
import type { PaymentEngineRecordRow } from '../../payment-engine/paymentEngineRecordConfigs';
import { resolvePaymentTransactionRecordDetail } from '../../payment-engine/paymentEngineTransactionRecordDetailData';
import { resolvePaymentWalletPayoutRecordDetail } from '../../payment-engine/paymentEngineWalletPayoutDetailData';
import { resolveWaasFilterStatusOptionId } from './buildWaasDataListStatusFilterOptions';
import {
  joinWaasFilterSearchParts,
  resolveWaasBusinessTypeLabel,
  resolveWaasFilterDropdownOptionId,
  resolveWaasIncomeExpenseLabel,
  resolveWaasPushMethodLabel,
} from './waasDataListFilterShared';

function buildCurrencySnapshot(row: PaymentEngineRecordRow): Pick<
  EgFilterRowSnapshot,
  'currency' | 'currencySymbol' | 'currencyNetwork'
> {
  return {
    currency: row.currencySymbol ?? row.orderSymbol,
    currencySymbol: row.currencySymbol ?? row.orderSymbol,
    currencyNetwork: String(row.currencyNetwork ?? row.networkLabel ?? '').trim(),
  };
}

function buildDropdownSnapshot(
  row: PaymentEngineRecordRow,
): Pick<EgFilterRowSnapshot, 'incomeExpenseType' | 'transactionType' | 'businessType' | 'pushMethod'> {
  const incomeExpenseLabel = resolveWaasIncomeExpenseLabel(row);
  const businessTypeLabel = resolveWaasBusinessTypeLabel(row);
  const pushMethodLabel = resolveWaasPushMethodLabel(row);
  const transactionTypeKey = row.transactionTypeKey?.trim();

  return {
    incomeExpenseType: incomeExpenseLabel
      ? resolveWaasFilterDropdownOptionId('waas-income-expense', incomeExpenseLabel)
      : undefined,
    transactionType: transactionTypeKey
      ? resolveWaasFilterDropdownOptionId('waas-tx-type', transactionTypeKey)
      : undefined,
    businessType: businessTypeLabel
      ? resolveWaasFilterDropdownOptionId('waas-business-type', businessTypeLabel)
      : undefined,
    pushMethod: pushMethodLabel
      ? resolveWaasFilterDropdownOptionId('waas-push-method', pushMethodLabel)
      : undefined,
  };
}

function buildAddressPairSnapshot(
  senderAddress?: string,
  senderAlias?: string,
  receiverAddress?: string,
  receiverAlias?: string,
): Pick<EgFilterRowSnapshot, 'sender' | 'receiver' | 'paymentAddress' | 'receivingAddress'> {
  return {
    sender: joinWaasFilterSearchParts([senderAddress, senderAlias]),
    receiver: joinWaasFilterSearchParts([receiverAddress, receiverAlias]),
    paymentAddress: joinWaasFilterSearchParts([senderAddress, senderAlias]),
    receivingAddress: joinWaasFilterSearchParts([receiverAddress, receiverAlias]),
  };
}

function buildSubAddressSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  return {
    ...buildCurrencySnapshot(row),
    addressStatus: resolveWaasFilterStatusOptionId(row, menuItem, 'addressStatus', rowIndex),
    address: joinWaasFilterSearchParts([row.walletFromAddress]),
    addressAlias: joinWaasFilterSearchParts([row.walletFromAlias]),
    callbackAddress: joinWaasFilterSearchParts([row.callbackUrl]),
  };
}

function buildWalletPayoutSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  const detail = resolvePaymentWalletPayoutRecordDetail(row);

  return {
    ...buildCurrencySnapshot(row),
    ...buildAddressPairSnapshot(
      detail.senderAddress,
      detail.senderAlias,
      detail.receiverAddress,
      detail.receiverAlias,
    ),
    thirdPartyBizId: detail.thirdPartyBusinessNo,
    transactionStatus: resolveWaasFilterStatusOptionId(row, menuItem, 'transactionStatus', rowIndex),
    transactionTime: detail.initiationTime,
    memo: detail.memo ?? '',
    remark: detail.remark ?? '',
  };
}

function buildTransactionRecordSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
  options: { includeTransactionStatus: boolean },
): EgFilterRowSnapshot {
  const detail = resolvePaymentTransactionRecordDetail(row, menuItem);
  const businessTypeLabel = resolveWaasBusinessTypeLabel(row);

  return {
    ...buildCurrencySnapshot(row),
    amount: row.orderAmount,
    collectionId: row.collectionId ?? row.id,
    txHash: detail.txHash ?? '',
    initiationTime: detail.createdAt,
    businessType: businessTypeLabel
      ? resolveWaasFilterDropdownOptionId('waas-business-type', businessTypeLabel)
      : undefined,
    ...(options.includeTransactionStatus
      ? {
          transactionStatus: resolveWaasFilterStatusOptionId(
            row,
            menuItem,
            'transactionStatus',
            rowIndex,
          ),
        }
      : {}),
    ...buildAddressPairSnapshot(
      detail.senderAddress,
      detail.senderAlias,
      detail.receiverAddress,
      detail.receiverAlias,
    ),
  };
}

function buildTransactionHistorySnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  return buildTransactionRecordSnapshot(rowIndex, row, menuItem, {
    includeTransactionStatus: true,
  });
}

function buildTransactionProcessingSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  return buildTransactionRecordSnapshot(rowIndex, row, menuItem, {
    includeTransactionStatus: false,
  });
}

function buildRuleConfigurationSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  return {
    ...buildCurrencySnapshot(row),
    ruleName: row.ruleName ?? '',
    ruleNumber: row.ruleNumber ?? row.id,
    ruleStatus: resolveWaasFilterStatusOptionId(row, menuItem, 'ruleStatus', rowIndex),
  };
}

function buildTaskRecordSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  return {
    ...buildCurrencySnapshot(row),
    status: resolveWaasFilterStatusOptionId(row, menuItem, 'status', rowIndex),
    collectionId: row.collectionId ?? row.id,
    transactionCount: row.taskTransactionCount ?? '',
    startTime: row.taskStartAt ?? row.createdAt,
  };
}

function buildApiCollectionSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  const detail = resolvePaymentApiCollectionRecordDetail(row);

  return {
    ...buildCurrencySnapshot(row),
    ...buildAddressPairSnapshot(
      detail.senderAddress,
      detail.senderAlias,
      detail.receiverAddress,
      detail.receiverAlias,
    ),
    transactionStatus: resolveWaasFilterStatusOptionId(row, menuItem, 'transactionStatus', rowIndex),
    transactionTime: detail.createdAt,
  };
}

function buildCollectionRecordSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
  options: { includeStatus: boolean },
): EgFilterRowSnapshot {
  const detail = resolvePaymentCollectionRecordDetail(row, menuItem);
  const businessTypeLabel = resolveWaasBusinessTypeLabel(row);

  return {
    ...buildCurrencySnapshot(row),
    amount: row.orderAmount,
    collectionId: detail.collectionNumber,
    txHash: detail.txHash ?? '',
    initiationTime: detail.startTime ?? row.createdAt,
    businessType: businessTypeLabel
      ? resolveWaasFilterDropdownOptionId('waas-business-type', businessTypeLabel)
      : undefined,
    ...(options.includeStatus
      ? {
          status: resolveWaasFilterStatusOptionId(row, menuItem, 'status', rowIndex),
        }
      : {}),
    ...buildAddressPairSnapshot(
      detail.senderAddress,
      detail.senderAlias,
      detail.receiverAddress,
      detail.receiverAlias,
    ),
  };
}

function buildCollectionHistorySnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  return buildCollectionRecordSnapshot(rowIndex, row, menuItem, { includeStatus: true });
}

function buildCollectionProcessingSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  return buildCollectionRecordSnapshot(rowIndex, row, menuItem, { includeStatus: false });
}

function buildCallbackSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  const detail = resolvePaymentCallbackErrorRecordDetail(row);
  const businessTypeLabel = detail.businessTypeKey;
  const pushMethodLabel = resolveWaasPushMethodLabel(row);

  return {
    ...buildCurrencySnapshot(row),
    txHash: detail.txHash ?? '',
    receiver: joinWaasFilterSearchParts([detail.receiverAddress, detail.receiverAlias]),
    businessType: businessTypeLabel
      ? resolveWaasFilterDropdownOptionId('waas-business-type', businessTypeLabel)
      : undefined,
    thirdPartyBizId: detail.thirdPartyBusinessNo,
    callbackAddress: detail.callbackUrl,
    cregisId: joinWaasFilterSearchParts([detail.callbackRecordId, row.callbackEventId, row.id]),
    pushMethod: pushMethodLabel
      ? resolveWaasFilterDropdownOptionId('waas-push-method', pushMethodLabel)
      : undefined,
    pushStatus: resolveWaasFilterStatusOptionId(row, menuItem, 'pushStatus', rowIndex),
  };
}

/** 与 WaaS 列表同行数据对齐，供 EgFilter 条件匹配。 */
export function buildWaasDataListFilterRowSnapshot(
  rowIndex: number,
  row: PaymentEngineRecordRow,
  menuItem: string,
): EgFilterRowSnapshot {
  switch (menuItem) {
    case 'Sub-Address':
      return buildSubAddressSnapshot(rowIndex, row, menuItem);
    case 'Wallet Payout':
      return buildWalletPayoutSnapshot(rowIndex, row, menuItem);
    case 'Sub-Address Payout':
      return buildWalletPayoutSnapshot(rowIndex, row, menuItem);
    case 'History':
      return buildTransactionHistorySnapshot(rowIndex, row, menuItem);
    case 'Processing':
      return buildTransactionProcessingSnapshot(rowIndex, row, menuItem);
    case 'Rule Configuration':
      return buildRuleConfigurationSnapshot(rowIndex, row, menuItem);
    case 'Task Record':
      return buildTaskRecordSnapshot(rowIndex, row, menuItem);
    case 'API Collection':
      return buildApiCollectionSnapshot(rowIndex, row, menuItem);
    case 'Collection History':
      return buildCollectionHistorySnapshot(rowIndex, row, menuItem);
    case 'Collection Processing':
      return buildCollectionProcessingSnapshot(rowIndex, row, menuItem);
    case 'Callback Error':
    case 'History Callback':
      return buildCallbackSnapshot(rowIndex, row, menuItem);
    default:
      return buildCurrencySnapshot(row);
  }
}
