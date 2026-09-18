import {
  BULK_TRANSFER_COLUMNS,
  CALLBACK_ERROR_COLUMNS,
  HISTORY_CALLBACK_COLUMNS,
  ORDER_RECORD_COLUMNS,
  PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG,
  PAYMENT_EXCEPTION_COLUMNS,
  REFUND_COLUMNS,
  type PaymentEngineRecordPageConfig,
  WALLET_PAYOUT_COLUMNS,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { WaasOrderModeMenuItem } from './waasMenuData';

export const WAAS_ORDER_MODE_RECORD_PAGE_CONFIG: Record<
  WaasOrderModeMenuItem,
  PaymentEngineRecordPageConfig
> = {
  'Order Record': PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG,
  'Bulk Transfer Record': {
    showExport: true,
    columns: BULK_TRANSFER_COLUMNS,
  },
  'Refund Record': {
    showExport: true,
    columns: REFUND_COLUMNS,
  },
  'Payment Exception Record': {
    showExport: true,
    columns: PAYMENT_EXCEPTION_COLUMNS,
  },
  'Wallet Payout': {
    showExport: true,
    columns: WALLET_PAYOUT_COLUMNS,
  },
  'Callback Error': {
    showExport: false,
    showBatchSelect: true,
    columns: CALLBACK_ERROR_COLUMNS,
  },
  'History Callback': {
    showExport: false,
    columns: HISTORY_CALLBACK_COLUMNS,
  },
};

export function resolveWaasOrderModeRecordConfig(menuItem: string): PaymentEngineRecordPageConfig {
  return (
    WAAS_ORDER_MODE_RECORD_PAGE_CONFIG[menuItem as WaasOrderModeMenuItem]
    ?? PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG
  );
}
