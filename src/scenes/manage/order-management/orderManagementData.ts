import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import type {
  OrderManagementOperationTypeKey,
  OrderManagementRow,
  OrderManagementStatusKey,
} from './orderManagementTypes';
import { ORDER_MANAGEMENT_OPERATION_TYPE_KEYS } from './orderManagementTypes';

export const ORDER_MANAGEMENT_DEMO_TOTAL = 24;

type PlanPair = readonly [from: string, to: string];

const PLAN_BY_OPERATION: Record<OrderManagementOperationTypeKey, readonly PlanPair[]> = {
  Renewal: [
    ['企业版', '1个月'],
    ['商业版', '1个月'],
    ['企业版', '3个月'],
  ],
  Upgrade: [
    ['商业版', '企业版'],
    ['商业版', '企业版'],
    ['Starter', '商业版'],
  ],
  'Benefits Renewal': [
    ['WaaS子地址', '3个月'],
    ['API地址', '6个月'],
    ['WaaS子地址', '1个月'],
  ],
  'Benefits Capacity Expansion': [
    ['MCP多签钱包', '2'],
    ['单签钱包', '5'],
    ['团队成员', '10'],
  ],
  'Automation Feature Activation': [
    ['自动续费/升级', '1个月'],
    ['自动归集/批签', '1个月'],
    ['自动续费', '3个月'],
  ],
};

function resolveOperationType(index: number): OrderManagementOperationTypeKey {
  return ORDER_MANAGEMENT_OPERATION_TYPE_KEYS[
    index % ORDER_MANAGEMENT_OPERATION_TYPE_KEYS.length
  ]!;
}

function resolvePlanPair(
  index: number,
  operationTypeKey: OrderManagementOperationTypeKey,
): PlanPair {
  const plans = PLAN_BY_OPERATION[operationTypeKey];
  return plans[index % plans.length]!;
}

/** 第 1 条待支付 · 第 2–3 条已完成 · 第 5 条已取消 · 其余已完成。 */
function resolveStatusKey(index: number): OrderManagementStatusKey {
  if (index === 0) return 'Pending Payment';
  if (index === 4) return 'Order Cancelled';
  return 'Order Completed';
}

function formatOrderTime(index: number): string {
  const day = 10 + (index % 18);
  const hour = 9 + (index % 10);
  const minute = (index * 11) % 60;
  const second = (index * 17) % 60;
  return `2032-10-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

function formatCompletionTime(index: number, statusKey: OrderManagementStatusKey): string | undefined {
  if (statusKey === 'Pending Payment') return undefined;
  const day = 11 + (index % 17);
  const hour = 14 + (index % 6);
  const minute = (index * 9) % 60;
  return `2032-10-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

function formatAmountDisplay(index: number): string {
  const base = 89 + (index % 7) * 137 + Math.floor(index / 3) * 42;
  const cents = (index * 17) % 100;
  return `$${formatGroupedDecimalAmount(`${base}.${String(cents).padStart(2, '0')}`)}`;
}

function buildOrderNumber(index: number): string {
  return `OM${String(203210000000 + index * 7919)}`;
}

export function buildOrderManagementRow(index: number): OrderManagementRow {
  const operationTypeKey = resolveOperationType(index);
  const statusKey = resolveStatusKey(index);
  const [planFrom, planTo] = resolvePlanPair(index, operationTypeKey);

  return {
    id: buildOrderNumber(index),
    operationTypeKey,
    planFrom,
    planTo,
    amountDisplay: formatAmountDisplay(index),
    orderPlacedTime: formatOrderTime(index),
    completionTime: formatCompletionTime(index, statusKey),
    statusKey,
    orderNumber: buildOrderNumber(index),
  };
}

export function buildOrderManagementPageRows(indices: readonly number[]): OrderManagementRow[] {
  return indices.map((index) => buildOrderManagementRow(index));
}
