import type { TagStatus } from '@eds/desktop-components';
import type { PaymentEngineBulkTransferLineRecord } from './paymentEngineRecordConfigs';

const BULK_TRANSFER_LINE_STATUS_MAP: Record<
  PaymentEngineBulkTransferLineRecord['status'],
  { status: TagStatus; labelKey: string }
> = {
  pending: { status: 'warning', labelKey: 'Transferring' },
  success: { status: 'success', labelKey: 'Success' },
  failed: { status: 'danger', labelKey: 'Transfer Failed' },
};

export function buildPaymentEngineBulkTransferLineStatusCustomize(
  line: PaymentEngineBulkTransferLineRecord,
  translate: (key: string) => string,
): Record<string, unknown> {
  const item = BULK_TRANSFER_LINE_STATUS_MAP[line.status];
  return {
    status: item.status,
    label: translate(item.labelKey),
  };
}
