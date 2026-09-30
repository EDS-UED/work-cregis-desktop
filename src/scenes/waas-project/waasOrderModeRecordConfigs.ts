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
  'Order Record': {
    ...PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG,
    toolbarPreset: 'filter-refresh',
  },
  'Bulk Transfer Record': {
    showExport: true,
    toolbarPreset: 'filter-refresh',
    columns: BULK_TRANSFER_COLUMNS,
  },
  'Refund Record': {
    showExport: true,
    toolbarPreset: 'filter-refresh',
    columns: REFUND_COLUMNS,
  },
  'Payment Exception Record': {
    showExport: true,
    toolbarPreset: 'filter-refresh',
    columns: PAYMENT_EXCEPTION_COLUMNS,
  },
  'Wallet Payout': {
    showExport: true,
    toolbarPreset: 'filter-refresh',
    columns: WALLET_PAYOUT_COLUMNS,
  },
  'Callback Error': {
    showExport: false,
    showBatchSelect: true,
    toolbarPreset: 'batch-filter-refresh',
    columns: CALLBACK_ERROR_COLUMNS,
  },
  'History Callback': {
    showExport: false,
    toolbarPreset: 'filter-refresh',
    columns: HISTORY_CALLBACK_COLUMNS,
  },
};

export function resolveWaasOrderModeRecordConfig(menuItem: string): PaymentEngineRecordPageConfig {
  return (
    WAAS_ORDER_MODE_RECORD_PAGE_CONFIG[menuItem as WaasOrderModeMenuItem]
    ?? PAYMENT_ENGINE_ORDER_RECORD_LIST_PAGE_CONFIG
  );
}
