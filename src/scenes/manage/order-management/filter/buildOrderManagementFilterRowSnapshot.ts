import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { OrderManagementRow } from '../orderManagementTypes';
import {
  resolveOrderManagementOperationTypeFilterOptionId,
  resolveOrderManagementStatusFilterOptionId,
} from './buildOrderManagementFilterOptions';

export function buildOrderManagementFilterRowSnapshot(row: OrderManagementRow): EgFilterRowSnapshot {
  return {
    orderOperationType: resolveOrderManagementOperationTypeFilterOptionId(row.operationTypeKey),
    orderStatus: resolveOrderManagementStatusFilterOptionId(row.statusKey),
    orderCompletionTime: row.completionTime ?? '',
  };
}
