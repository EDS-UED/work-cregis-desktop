import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { buildDetailCurrencyAmountItems } from '@/scenes/tasks/shared/buildDetailCurrencyAmountItems';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import {
  isTransactionRecordCompactCollectionDetailType,
  isTransactionRecordExtendedCollectionOutDetailType,
  isTransactionRecordTransferOutDetailType,
  TRANSACTION_RECORD_DETAIL_NORMAL_IN,
  TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION,
  TRANSACTION_RECORD_DETAIL_PARALLEL_OUT,
} from './transactionRecordDetailTypes';
import type { TransactionRecordRow } from './transactionRecordTypes';

/** sender/receiver 变体 catalog 自带演示 tag；无别名时须传 '' 清掉，与列表侧一致。 */
function resolveDetailAddressTag(alias?: string): string {
  return alias?.trim() ?? '';
}

function formatTransactionCountDisplayValue(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): string {
  if (row.transactionCountShowsDetailLink) {
    return `${row.transactionCount}${translate('Signing transaction count unit')}`;
  }
  return row.transactionCount;
}

function buildTransactionCountDetailItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  const item: DetailItemData = {
    ...createDetailApplyItemRow('text', {
      key: 'transaction-count',
      title: translate('Transaction Count'),
      value: formatTransactionCountDisplayValue(row, translate),
    }),
    titleIcon: 'eds-text-numerical',
  };

  if (row.transactionCountShowsDetailLink) {
    item.showValueLink = true;
    item.valueLinkLabel = translate('View details');
  }

  return item;
}

function buildDetailItemsThroughReceivingAddress(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    ...buildDetailCurrencyAmountItems(
      {
        amountRowValue: row.amount,
        amountCryptoSymbol: row.symbol,
        amountCryptoName: row.cryptoName,
        amountNetworkLabel: row.showNetwork ? row.networkLabel : '',
      },
      translate,
    ),
    {
      ...createDetailApplyItemRow('time', {
        key: 'created-time',
        title: translate('Creation Time'),
        value: row.createdTime,
      }),
      titleIcon: 'eds-calendar-start',
    },
    {
      ...createDetailApplyItemRow('time', {
        key: 'transaction-time',
        title: translate('Transaction Time'),
        value: row.transactionTime,
      }),
      titleIcon: 'eds-calendar-end',
    },
    createDetailApplyItemRow('type', {
      key: 'transaction-type',
      title: translate('Transaction Type'),
      value: row.transactionType,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'wallet',
        title: translate('Affiliated Wallet'),
        value: row.walletName,
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('sender', {
      key: 'payment-address',
      title: translate('Payment Address'),
      value: row.fromAddress,
      tag: resolveDetailAddressTag(row.fromAlias),
    }),
    createDetailApplyItemRow('receiver', {
      key: 'receiving-address',
      title: translate('Receiving Address'),
      value: row.toAddress,
      tag: resolveDetailAddressTag(row.toAlias),
    }),
  ];
}

function buildTransactionOutcomeItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    buildTransactionCountDetailItem(row, translate),
    createDetailApplyItemRow('txid', {
      key: 'transaction-hash',
      title: translate('Transaction hash'),
      value: row.txHash,
    }),
    createDetailApplyItemRow('fee', {
      key: 'miner-fee',
      title: translate('Miner Fee'),
      value: row.minerFeeDisplay,
    }),
  ];
}

function buildTransferOutDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    ...buildDetailItemsThroughReceivingAddress(row, translate),
    createDetailApplyItemRow('tripartite-number', {
      key: 'third-party',
      title: translate('Third-party Reference'),
      value: row.thirdPartyRef ?? '',
    }),
    ...buildTransactionOutcomeItems(row, translate),
    createDetailApplyItemRow('initiated-by', {
      key: 'initiator',
      title: translate('Initiator'),
      value: row.initiatorDisplay ?? '',
    }),
    buildSignerDetailItem(row, translate),
    createDetailApplyItemRow('memo', {
      key: 'remark',
      title: translate('Remark'),
      value: formatEmptyDisplayValue(row.remark),
    }),
  ];
}

function buildSignerDetailItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('initiated-by', {
      key: 'signer',
      title: translate('Signer'),
      value: row.signerDisplay ?? '',
    }),
    titleIcon: 'eds-signature-pen',
  };
}

function buildCollectionNumberItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('brand-number', {
      key: 'collection-number',
      title: translate('Collection Number'),
      value: row.collectionNumber ?? '',
    }),
    titleIcon: 'eds-steps-number',
  };
}

function buildCollectionOutDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    ...buildDetailItemsThroughReceivingAddress(row, translate),
    ...buildTransactionOutcomeItems(row, translate),
    buildCollectionNumberItem(row, translate),
  ];
}

/** 并行转出：创建时间 + 矿工费 + 签名人（11 字段）。 */
function buildParallelOutDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    ...buildDetailItemsThroughReceivingAddress(row, translate),
    ...buildTransactionOutcomeItems(row, translate),
    buildSignerDetailItem(row, translate),
  ];
}

/** 链上操作：创建时间 + 矿工费 + 签名人 + 归集编号（12 字段）。 */
function buildOnChainOperationDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    ...buildDetailItemsThroughReceivingAddress(row, translate),
    ...buildTransactionOutcomeItems(row, translate),
    buildSignerDetailItem(row, translate),
    buildCollectionNumberItem(row, translate),
  ];
}

function buildInboundDetailItemsThroughHash(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    ...buildDetailCurrencyAmountItems(
      {
        amountRowValue: row.amount,
        amountCryptoSymbol: row.symbol,
        amountCryptoName: row.cryptoName,
        amountNetworkLabel: row.showNetwork ? row.networkLabel : '',
      },
      translate,
    ),
    {
      ...createDetailApplyItemRow('time', {
        key: 'transaction-time',
        title: translate('Transaction Time'),
        value: row.transactionTime,
      }),
      titleIcon: 'eds-calendar-end',
    },
    createDetailApplyItemRow('type', {
      key: 'transaction-type',
      title: translate('Transaction Type'),
      value: row.transactionType,
    }),
    {
      ...createDetailApplyItemRow('text', {
        key: 'wallet',
        title: translate('Affiliated Wallet'),
        value: row.walletName,
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('sender', {
      key: 'payment-address',
      title: translate('Payment Address'),
      value: row.fromAddress,
      tag: resolveDetailAddressTag(row.fromAlias),
    }),
    createDetailApplyItemRow('receiver', {
      key: 'receiving-address',
      title: translate('Receiving Address'),
      value: row.toAddress,
      tag: resolveDetailAddressTag(row.toAlias),
    }),
    buildTransactionCountDetailItem(row, translate),
    createDetailApplyItemRow('txid', {
      key: 'transaction-hash',
      title: translate('Transaction hash'),
      value: row.txHash,
    }),
  ];
}

/** 普通转入：无创建时间、矿工费、归集编号（8 字段）。 */
function buildNormalInDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return buildInboundDetailItemsThroughHash(row, translate);
}

/** 紧凑归集详情：无创建时间、矿工费（9 字段）。 */
function buildCompactCollectionDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    ...buildInboundDetailItemsThroughHash(row, translate),
    buildCollectionNumberItem(row, translate),
  ];
}

function buildDefaultDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [
    ...buildDetailItemsThroughReceivingAddress(row, translate),
    ...buildTransactionOutcomeItems(row, translate),
  ];
}

function resolveDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  if (isTransactionRecordTransferOutDetailType(row.transactionType)) {
    return buildTransferOutDetailItems(row, translate);
  }

  if (isTransactionRecordExtendedCollectionOutDetailType(row.transactionType)) {
    return buildCollectionOutDetailItems(row, translate);
  }

  if (isTransactionRecordCompactCollectionDetailType(row.transactionType)) {
    return buildCompactCollectionDetailItems(row, translate);
  }

  if (row.transactionType === TRANSACTION_RECORD_DETAIL_NORMAL_IN) {
    return buildNormalInDetailItems(row, translate);
  }

  if (row.transactionType === TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION) {
    return buildOnChainOperationDetailItems(row, translate);
  }

  if (row.transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT) {
    return buildParallelOutDetailItems(row, translate);
  }

  return buildDefaultDetailItems(row, translate);
}

export function buildTransactionRecordDetailSections(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  return [
    {
      key: 'transaction',
      items: resolveDetailItems(row, translate),
    },
  ];
}
