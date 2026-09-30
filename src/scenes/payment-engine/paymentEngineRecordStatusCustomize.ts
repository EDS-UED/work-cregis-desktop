import type { TagStatus } from '@eds/desktop-components';
import {
  isPaymentCallbackRecordMenuItem,
  isPaymentExceptionRecordMenuItem,
  isPaymentOrderRecordMenuItem,
} from './paymentEngineOrderRecordData';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import { resolvePaymentEngineOrderStatusLabelKey } from './paymentEngineOrderStatusLabels';

type PaymentEngineRecordStatusCustomize = {
  status: TagStatus;
  label: string;
};

const WALLET_PAYOUT_RECORD_STATUS_MAP: Record<
  PaymentEngineRecordRow['status'],
  PaymentEngineRecordStatusCustomize
> = {
  'external-pending': { status: 'ready', label: 'Pending External Confirmation' },
  approving: { status: 'warning', label: 'Approving' },
  'signature-pending': { status: 'warning', label: 'Pending Signature' },
  'signed-pending-confirmation': { status: 'ready', label: 'Signed Pending Confirmation' },
  completed: { status: 'success', label: 'Transaction Completed' },
  'transaction-failed': { status: 'danger', label: 'Transaction Failed' },
  rejected: { status: 'danger', label: 'Reject' },
  pending: { status: 'warning', label: 'Transferring' },
  transferred: { status: 'success', label: 'Transaction Completed' },
  success: { status: 'success', label: 'Transaction Completed' },
  failed: { status: 'danger', label: 'Transaction Failed' },
  initiated: { status: 'ready', label: 'Pending External Confirmation' },
  'additional-payment-required': { status: 'warning', label: 'Approving' },
  expired: { status: 'danger', label: 'Transaction Failed' },
  cancelled: { status: 'danger', label: 'Reject' },
  paid: { status: 'ready', label: 'Signed Pending Confirmation' },
};

const REFUND_RECORD_STATUS_MAP: Record<
  PaymentEngineRecordRow['status'],
  PaymentEngineRecordStatusCustomize
> = {
  initiated: { status: 'ready', label: 'Not Refunded' },
  pending: { status: 'warning', label: 'Refunding' },
  success: { status: 'success', label: 'Refund Successful' },
  failed: { status: 'danger', label: 'Refund Failed' },
  'additional-payment-required': { status: 'ready', label: 'Not Refunded' },
  expired: { status: 'danger', label: 'Refund Failed' },
  cancelled: { status: 'danger', label: 'Refund Failed' },
  paid: { status: 'success', label: 'Refund Successful' },
  transferred: { status: 'success', label: 'Refund Successful' },
  'external-pending': { status: 'ready', label: 'Not Refunded' },
  approving: { status: 'warning', label: 'Refunding' },
  'signature-pending': { status: 'warning', label: 'Refunding' },
  'signed-pending-confirmation': { status: 'warning', label: 'Refunding' },
  completed: { status: 'success', label: 'Refund Successful' },
  'transaction-failed': { status: 'danger', label: 'Refund Failed' },
  rejected: { status: 'danger', label: 'Refund Failed' },
};

const SETTLEMENT_RECORD_STATUS_MAP: Record<
  PaymentEngineRecordRow['status'],
  PaymentEngineRecordStatusCustomize
> = {
  pending: { status: 'warning', label: 'Settling' },
  success: { status: 'success', label: 'Settled' },
  failed: { status: 'danger', label: 'Settled' },
  initiated: { status: 'warning', label: 'Settling' },
  'additional-payment-required': { status: 'warning', label: 'Settling' },
  expired: { status: 'success', label: 'Settled' },
  cancelled: { status: 'success', label: 'Settled' },
  paid: { status: 'success', label: 'Settled' },
  transferred: { status: 'success', label: 'Settled' },
  'external-pending': { status: 'warning', label: 'Settling' },
  approving: { status: 'warning', label: 'Settling' },
  'signature-pending': { status: 'warning', label: 'Settling' },
  'signed-pending-confirmation': { status: 'warning', label: 'Settling' },
  completed: { status: 'success', label: 'Settled' },
  'transaction-failed': { status: 'success', label: 'Settled' },
  rejected: { status: 'success', label: 'Settled' },
};

/** 批量转账 / 异常支付单列表共用状态 Tag。 */
const TRANSFER_RECORD_STATUS_MAP: Record<
  PaymentEngineRecordRow['status'],
  PaymentEngineRecordStatusCustomize
> = {
  initiated: { status: 'ready', label: 'Not Transferred' },
  pending: { status: 'warning', label: 'Transferring' },
  failed: { status: 'danger', label: 'Transfer Failed' },
  success: { status: 'success', label: 'Transfer Successful' },
  'additional-payment-required': { status: 'warning', label: 'Transferring' },
  expired: { status: 'danger', label: 'Transfer Failed' },
  cancelled: { status: 'danger', label: 'Transfer Failed' },
  paid: { status: 'success', label: 'Transfer Successful' },
  transferred: { status: 'success', label: 'Transfer Successful' },
  'external-pending': { status: 'ready', label: 'Not Transferred' },
  approving: { status: 'warning', label: 'Transferring' },
  'signature-pending': { status: 'warning', label: 'Transferring' },
  'signed-pending-confirmation': { status: 'warning', label: 'Transferring' },
  completed: { status: 'success', label: 'Transfer Successful' },
  'transaction-failed': { status: 'danger', label: 'Transfer Failed' },
  rejected: { status: 'danger', label: 'Transfer Failed' },
};

const CALLBACK_RECORD_STATUS_MAP: Record<
  NonNullable<PaymentEngineRecordRow['callbackStatus']>,
  PaymentEngineRecordStatusCustomize
> = {
  ignore: { status: 'invalid', label: 'Ignore' },
  normal: { status: 'success', label: 'Normal' },
};

function isSettlementRecordMenuItem(menuItem: string): boolean {
  return menuItem === 'Settlement Record';
}

function isBulkTransferRecordMenuItem(menuItem: string): boolean {
  return menuItem === 'Bulk Transfer Record';
}

function isTransferRecordMenuItem(menuItem: string): boolean {
  return isBulkTransferRecordMenuItem(menuItem) || isPaymentExceptionRecordMenuItem(menuItem);
}

function isWalletPayoutMenuItem(menuItem: string): boolean {
  return menuItem === 'Wallet Payout' || menuItem === 'Sub-Address Payout';
}

export function buildPaymentEngineRecordStatusCustomize(
  row: PaymentEngineRecordRow,
  menuItem: string,
): Record<string, unknown> {
  const status = row.status;

  if (menuItem === 'Refund Record') {
    const item = REFUND_RECORD_STATUS_MAP[status];
    if (item) return item;
  }

  if (isTransferRecordMenuItem(menuItem)) {
    const item = TRANSFER_RECORD_STATUS_MAP[status];
    if (item) return item;
  }

  if (isWalletPayoutMenuItem(menuItem)) {
    const item = WALLET_PAYOUT_RECORD_STATUS_MAP[status];
    if (item) return item;
  }

  if (isSettlementRecordMenuItem(menuItem)) {
    const item = SETTLEMENT_RECORD_STATUS_MAP[status];
    if (item) return item;
  }

  if (menuItem === 'Task Record') {
    if (status === 'pending') {
      return { status: 'warning', label: 'Collecting' };
    }
    return { status: 'invalid', label: 'Finished' };
  }

  if (menuItem === 'API Collection') {
    const item = WALLET_PAYOUT_RECORD_STATUS_MAP[status];
    if (item) return item;
  }

  if (menuItem === 'History') {
    if (status === 'failed' || status === 'transaction-failed') {
      return { status: 'danger', label: 'Failed' };
    }
    if (status === 'cancelled') {
      return { status: 'invalid', label: 'Canceled' };
    }
    return { status: 'success', label: 'Success' };
  }

  if (menuItem === 'Processing') {
    if (status === 'pending') {
      return { status: 'warning', label: 'Pending' };
    }
    if (status === 'success') {
      return { status: 'success', label: 'Success' };
    }
  }

  if (menuItem === 'Collection History') {
    if (status === 'failed' || status === 'transaction-failed') {
      return { status: 'danger', label: 'Failed' };
    }
    if (status === 'cancelled') {
      return { status: 'invalid', label: 'Canceled' };
    }
    return { status: 'success', label: 'Success' };
  }

  if (menuItem === 'Collection Processing') {
    if (status === 'pending') {
      return { status: 'warning', label: 'Pending' };
    }
    if (status === 'success' || status === 'completed') {
      return { status: 'success', label: 'Success' };
    }
    if (status === 'failed' || status === 'transaction-failed') {
      return { status: 'danger', label: 'Transaction Failed' };
    }
  }

  if (isPaymentCallbackRecordMenuItem(menuItem) && row.callbackStatus) {
    const item = CALLBACK_RECORD_STATUS_MAP[row.callbackStatus];
    if (item) return item;
  }

  if (isPaymentOrderRecordMenuItem(menuItem)) {
    return {
      status: 'success',
      label: resolvePaymentEngineOrderStatusLabelKey(status),
    };
  }

  if (status === 'success') {
    return { status: 'success', label: 'Success' };
  }
  if (status === 'completed') {
    return { status: 'success', label: 'Transaction Completed' };
  }
  if (status === 'pending') {
    return { status: 'warning', label: 'Pending' };
  }
  if (status === 'failed' || status === 'transaction-failed') {
    return { status: 'danger', label: 'Transaction Failed' };
  }

  return {
    status: 'success',
    label: 'Success',
  };
}

export function resolvePaymentEngineRecordStatusDetailLabel(
  row: PaymentEngineRecordRow,
  menuItem: string,
  translate: (key: string) => string,
): string {
  if (menuItem === 'Refund Record') {
    const item = REFUND_RECORD_STATUS_MAP[row.status];
    return translate(item?.label ?? row.status);
  }

  if (isTransferRecordMenuItem(menuItem)) {
    const item = TRANSFER_RECORD_STATUS_MAP[row.status];
    return translate(item?.label ?? row.status);
  }

  if (isWalletPayoutMenuItem(menuItem)) {
    const item = WALLET_PAYOUT_RECORD_STATUS_MAP[row.status];
    return translate(item?.label ?? row.status);
  }

  if (isSettlementRecordMenuItem(menuItem)) {
    const item = SETTLEMENT_RECORD_STATUS_MAP[row.status];
    return translate(item?.label ?? row.status);
  }

  if (menuItem === 'History') {
    if (row.status === 'failed' || row.status === 'transaction-failed') {
      return translate('Failed');
    }
    if (row.status === 'cancelled') {
      return translate('Canceled');
    }
    return translate('Success');
  }

  if (menuItem === 'Processing') {
    if (row.status === 'pending') {
      return translate('Pending');
    }
    if (row.status === 'success') {
      return translate('Success');
    }
  }

  if (isPaymentCallbackRecordMenuItem(menuItem) && row.callbackStatus) {
    const item = CALLBACK_RECORD_STATUS_MAP[row.callbackStatus];
    return translate(item?.label ?? row.callbackStatus);
  }

  if (isPaymentOrderRecordMenuItem(menuItem)) {
    return translate(resolvePaymentEngineOrderStatusLabelKey(row.status));
  }

  return row.status;
}

export function resolvePaymentEngineRecordStatusDetailTagStatus(
  row: PaymentEngineRecordRow,
  menuItem: string,
): TagStatus {
  if (menuItem === 'Refund Record') {
    return REFUND_RECORD_STATUS_MAP[row.status]?.status ?? 'success';
  }

  if (isTransferRecordMenuItem(menuItem)) {
    return TRANSFER_RECORD_STATUS_MAP[row.status]?.status ?? 'success';
  }

  if (isWalletPayoutMenuItem(menuItem)) {
    return WALLET_PAYOUT_RECORD_STATUS_MAP[row.status]?.status ?? 'success';
  }

  if (isSettlementRecordMenuItem(menuItem)) {
    return SETTLEMENT_RECORD_STATUS_MAP[row.status]?.status ?? 'success';
  }

  if (menuItem === 'History') {
    if (row.status === 'failed' || row.status === 'transaction-failed') return 'danger';
    if (row.status === 'cancelled') return 'invalid';
    return 'success';
  }

  if (menuItem === 'Processing') {
    if (row.status === 'pending') return 'warning';
    return 'success';
  }

  if (isPaymentCallbackRecordMenuItem(menuItem) && row.callbackStatus) {
    return CALLBACK_RECORD_STATUS_MAP[row.callbackStatus]?.status ?? 'success';
  }

  return 'success';
}
