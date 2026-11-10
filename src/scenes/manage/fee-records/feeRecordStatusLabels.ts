import type { TagStatus } from '@eds/desktop-components';
import type { FeeRecordRow, FeeRecordStatusKey } from './feeRecordTypes';

const STATUS_LABEL_KEY: Record<FeeRecordStatusKey, string> = {
  Processing: 'Processing',
  Failed: 'Failed',
  Completed: 'Fee Record Status Completed',
};

const STATUS_TAG: Record<FeeRecordStatusKey, TagStatus> = {
  Processing: 'warning',
  Failed: 'danger',
  Completed: 'success',
};

export function resolveFeeRecordRowStatusKey(row: FeeRecordRow): FeeRecordStatusKey {
  if (row.recordStatusKey) return row.recordStatusKey;
  if (row.operationStatusTagKey === 'Failed') return 'Failed';
  if (row.operationStatusTagKey === 'Processing') return 'Processing';
  return 'Completed';
}

export function resolveFeeRecordStatusLabelKey(statusKey: FeeRecordStatusKey): string {
  return STATUS_LABEL_KEY[statusKey];
}

export function resolveFeeRecordStatusTagStatus(statusKey: FeeRecordStatusKey): TagStatus {
  return STATUS_TAG[statusKey];
}
