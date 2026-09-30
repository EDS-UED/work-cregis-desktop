import type { TagStatus } from '@eds/desktop-components';
import type { PaymentEngineCollectionDetailLineRecord } from './paymentEngineRecordConfigs';

const COLLECTION_DETAIL_LINE_STATUS_MAP: Record<
  PaymentEngineCollectionDetailLineRecord['status'],
  { status: TagStatus; labelKey: string }
> = {
  'pending-confirmation': { status: 'ready', labelKey: 'Pending Confirmation' },
  confirming: { status: 'warning', labelKey: 'Confirming' },
  'send-failed': { status: 'danger', labelKey: 'Send Failed' },
  success: { status: 'success', labelKey: 'Success' },
};

export function buildPaymentEngineCollectionDetailLineStatusCustomize(
  line: PaymentEngineCollectionDetailLineRecord,
  translate: (key: string) => string,
): Record<string, unknown> {
  const item = COLLECTION_DETAIL_LINE_STATUS_MAP[line.status];
  return {
    status: item.status,
    label: translate(item.labelKey),
  };
}
