import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import { createPaymentEngineTransferBlockTimeRow, createPaymentEngineTransferCreationTimeRow } from './paymentEngineDetailApplyItemRows';
import { resolvePaymentWalletPayoutRecordDetail } from './paymentEngineWalletPayoutDetailData';

function buildWalletPayoutOverviewItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentWalletPayoutRecordDetail(row);

  return [
    {
      ...createDetailApplyItemRow('text', {
        key: 'wallet-payout-wallet',
        title: translate('Wallet'),
        value: formatEmptyDisplayValue(detail.walletName),
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('tripartite-number', {
      key: 'wallet-payout-third-party-business-no',
      title: translate('Third-party Reference'),
      value: detail.thirdPartyBusinessNo,
    }),
    createPaymentEngineTransferCreationTimeRow({
      key: 'wallet-payout-initiation-time',
      title: translate('Initiation Time'),
      value: detail.initiationTime,
    }),
  ];
}

function buildWalletPayoutTransferItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentWalletPayoutRecordDetail(row);

  const items: DetailItemData[] = [
    createDetailApplyItemRow('sender', {
      key: 'wallet-payout-sender',
      title: translate('Sender'),
      value: detail.senderAddress,
      tag: detail.senderAlias ?? '',
    }),
    createDetailApplyItemRow('receiver', {
      key: 'wallet-payout-receiver',
      title: translate('Receiver'),
      value: detail.receiverAddress,
      tag: detail.receiverAlias ?? '',
    }),
  ];

  if (detail.txHash) {
    items.push(createDetailApplyItemRow('txid', {
      key: 'wallet-payout-tx-hash',
      title: translate('Transaction hash'),
      value: detail.txHash,
    }));
  }

  if (detail.blockNumber) {
    items.push({
      ...createDetailApplyItemRow('text', {
        key: 'wallet-payout-block',
        title: translate('Block'),
        value: detail.blockNumber,
      }),
      titleIcon: 'eds-blockchain',
    });
  }

  if (detail.minerFee) {
    items.push(createDetailApplyItemRow('fee', {
      key: 'wallet-payout-miner-fee',
      title: translate('Miner Fee'),
      value: detail.minerFee,
    }));
  }

  if (detail.completionTime) {
    items.push(createPaymentEngineTransferBlockTimeRow({
      key: 'wallet-payout-completion-time',
      title: translate('Completion Time'),
      value: detail.completionTime,
    }));
  }

  return items;
}

function buildWalletPayoutCallbackMetaItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentWalletPayoutRecordDetail(row);

  return [
    {
      ...createDetailApplyItemRow('text', {
        key: 'wallet-payout-callback-address',
        title: translate('Callback Address'),
        value: detail.callbackAddress,
      }),
      titleIcon: 'eds-link',
    },
    createDetailApplyItemRow('ip', {
      key: 'wallet-payout-ip-address',
      title: translate('IP Address'),
      value: detail.ipAddress,
    }),
    createDetailApplyItemRow('memo', {
      key: 'wallet-payout-remark',
      title: translate('Remark'),
      value: formatEmptyDisplayValue(detail.remark),
    }),
  ];
}

export function buildPaymentEngineWalletPayoutDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  return [
    {
      key: 'wallet-payout-overview',
      showDivider: true,
      items: buildWalletPayoutOverviewItems(row, translate),
    },
    {
      key: 'wallet-payout-transfer',
      showDivider: true,
      items: buildWalletPayoutTransferItems(row, translate),
    },
    {
      key: 'wallet-payout-callback-meta',
      items: buildWalletPayoutCallbackMetaItems(row, translate),
    },
  ];
}
