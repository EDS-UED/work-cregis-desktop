import type { EgFilterCondition, PaginerStatisticsItem } from '@eds/desktop-components';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import {
  hasActiveEgFilterConditions,
  isActiveEgFilterCondition,
} from '@/scenes/shared/applyEgFilterConditions';
import { buildGasProxyPaymentRecordRow } from './gasProxyPaymentRecordData';

function formatFilteredTotalUsd(total: number): string {
  if (!Number.isFinite(total) || total <= 0) {
    return '$0';
  }
  const [whole = '0', fraction = '00'] = total.toFixed(2).split('.');
  return `$${formatGroupedDecimalAmount(whole)}.${fraction}`;
}

function conditionTargetsFilteredTotalField(condition: EgFilterCondition): boolean {
  if (!isActiveEgFilterCondition(condition)) return false;
  return condition.fieldId === 'gasProxyCurrency' || condition.fieldId === 'gasProxyDeductedAccount';
}

/** 币种或扣费账户筛选生效时，Paginer 右下角展示筛选结果合计（USD）。 */
export function shouldShowGasProxyFilterAmountTotal(
  conditions: ReadonlyArray<EgFilterCondition>,
): boolean {
  if (!hasActiveEgFilterConditions([...conditions])) return false;
  return conditions.some(conditionTargetsFilteredTotalField);
}

export function buildGasProxyFilterPaginerStatistics(
  indices: readonly number[],
  translate: (catalogKey: string) => string,
  conditions: readonly EgFilterCondition[],
): PaginerStatisticsItem[] {
  if (!shouldShowGasProxyFilterAmountTotal(conditions)) {
    return [];
  }

  let totalUsd = 0;
  for (const index of indices) {
    totalUsd += buildGasProxyPaymentRecordRow(index).deductedAmountUsd;
  }

  return [
    {
      text: translate('Total amount'),
      number: formatFilteredTotalUsd(totalUsd),
    },
  ];
}
