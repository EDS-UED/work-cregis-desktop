import type { TagStatus } from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type ManageMemberStatusKey = 'pending-join' | 'disabled' | 'normal';

const STATUS_LABEL_KEY: Record<ManageMemberStatusKey, string> = {
  'pending-join': 'Pending join',
  disabled: 'Member Disabled',
  normal: 'Normal',
};

const STATUS_TAG: Record<ManageMemberStatusKey, TagStatus> = {
  'pending-join': 'ready',
  disabled: 'danger',
  normal: 'success',
};

export function resolveManageMemberStatusKey(
  raw: PaymentEngineRecordRow['manageMemberStatusKey'],
): ManageMemberStatusKey {
  if (raw === 'pending-join' || raw === 'disabled' || raw === 'normal') return raw;
  return 'normal';
}

export function resolveManageMemberStatusLabelKey(statusKey: ManageMemberStatusKey): string {
  return STATUS_LABEL_KEY[statusKey];
}

export function resolveManageMemberStatusTagStatus(statusKey: ManageMemberStatusKey): TagStatus {
  return STATUS_TAG[statusKey];
}
