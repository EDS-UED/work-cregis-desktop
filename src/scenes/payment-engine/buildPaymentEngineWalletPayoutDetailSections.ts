import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  createPaymentEngineDetailTimeRowByIndex,
  type PaymentEngineTimeRowOverrides,
} from './paymentEngineDetailApplyItemRows';
import { resolvePaymentWalletPayoutRecordDetail } from './paymentEngineWalletPayoutDetailData';

function buildWalletPayoutDetailItems(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  const detail = resolvePaymentWalletPayoutRecordDetail(row);
  const timeFieldTotal = detail.completionTime ? 2 : 1;
  let timeFieldIndex = 0;
  const timeRow = (overrides: PaymentEngineTimeRowOverrides) =>
    createPaymentEngineDetailTimeRowByIndex(overrides, timeFieldIndex++, timeFieldTotal);

  const items: DetailItemData[] = [
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
    timeRow({
      key: 'wallet-payout-initiation-time',
      title: translate('Initiation Time'),
      value: detail.initiationTime,
    }),
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
    {
      ...createDetailApplyItemRow('text', {
        key: 'wallet-payout-callback-address',
        title: translate('Callback URL'),
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

  if (detail.txHash) {
    items.push(
      createDetailApplyItemRow('txid', {
        key: 'wallet-payout-tx-hash',
        title: translate('Transaction hash'),
        value: detail.txHash,
      }),
    );
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
    items.push(
      createDetailApplyItemRow('fee', {
        key: 'wallet-payout-miner-fee',
        title: translate('Miner Fee'),
        value: detail.minerFee,
      }),
    );
  }

  if (detail.completionTime) {
    items.push(
      timeRow({
        key: 'wallet-payout-completion-time',
        title: translate('Completion Time'),
        value: detail.completionTime,
      }),
    );
  }

  return items;
}

export function buildPaymentEngineWalletPayoutDetailSections(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string,
): DetailSectionData[] {
  return [
    {
      key: 'wallet-payout-detail',
      showDivider: false,
      items: buildWalletPayoutDetailItems(row, translate),
    },
  ];
}
