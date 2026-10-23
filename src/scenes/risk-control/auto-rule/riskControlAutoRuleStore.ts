import { ref } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export const riskControlAutoRuleRowsRef = ref<PaymentEngineRecordRow[] | null>(null);
const autoRuleRows = riskControlAutoRuleRowsRef;
let serialCounter = 0;

function formatRuleNumber(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  serialCounter += 1;
  const seq = String(serialCounter).padStart(5, '0');
  return `AML${y}${m}${d}${seq}`;
}

export function seedAutoRuleRowsIfNeeded(
  buildRow: (rowIndex: number) => PaymentEngineRecordRow,
  count: number,
): PaymentEngineRecordRow[] {
  if (!autoRuleRows.value) {
    autoRuleRows.value = Array.from({ length: count }, (_, index) => buildRow(index));
    serialCounter = Math.max(serialCounter, count);
  }
  return autoRuleRows.value;
}

export function listAutoRuleRows(): PaymentEngineRecordRow[] {
  return autoRuleRows.value ?? [];
}

export function findAutoRuleRowById(id: string): PaymentEngineRecordRow | undefined {
  return autoRuleRows.value?.find((row) => row.id === id);
}

export function autoRuleNameExists(name: string, excludeId?: string): boolean {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return false;
  return (autoRuleRows.value ?? []).some((row) => {
    if (excludeId && row.id === excludeId) return false;
    return (row.ruleName ?? '').trim().toLowerCase() === normalized;
  });
}

function outflowScopeParts(raw: string): string[] {
  return raw
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

/** 收款规则：同一 WaaS 项目仅允许一条规则。 */
export function autoRuleInflowScopeTaken(
  scopeLabel: string,
  excludeRuleId?: string,
): boolean {
  const normalized = scopeLabel.trim().toLowerCase();
  if (!normalized) return false;
  return (autoRuleRows.value ?? []).some((row) => {
    if (row.autoRuleDirection !== 'inflow') return false;
    if (excludeRuleId && row.id === excludeRuleId) return false;
    return (row.autoRuleWaasProject ?? '').trim().toLowerCase() === normalized;
  });
}

/** 出款规则：同一出款类型下 WaaS 项目 / 钱包 scope 仅允许一条规则。 */
export function autoRuleOutflowScopeTaken(
  scopeLabel: string,
  withdrawalTypeKey: string,
  excludeRuleId?: string,
): boolean {
  const normalized = scopeLabel.trim().toLowerCase();
  if (!normalized || !withdrawalTypeKey) return false;
  return (autoRuleRows.value ?? []).some((row) => {
    if (row.autoRuleDirection !== 'outflow') return false;
    if (excludeRuleId && row.id === excludeRuleId) return false;
    if ((row.autoRuleScopeKey ?? '') !== withdrawalTypeKey) return false;
    const parts = outflowScopeParts(row.autoRuleWaasProject ?? '');
    if (parts.length <= 1 && !String(row.autoRuleWaasProject ?? '').includes(',')) {
      return (row.autoRuleWaasProject ?? '').trim().toLowerCase() === normalized;
    }
    return parts.includes(normalized);
  });
}

export function updateAutoRuleRowEnabled(id: string, enabled: boolean) {
  const row = findAutoRuleRowById(id);
  if (row) row.ruleEnabled = enabled;
}

export function deleteAutoRuleRow(id: string) {
  if (!autoRuleRows.value) return;
  autoRuleRows.value = autoRuleRows.value.filter((row) => row.id !== id);
}

export function upsertAutoRuleRow(row: PaymentEngineRecordRow) {
  if (!autoRuleRows.value) {
    autoRuleRows.value = [row];
    return;
  }
  const index = autoRuleRows.value.findIndex((entry) => entry.id === row.id);
  if (index >= 0) {
    autoRuleRows.value.splice(index, 1, row);
    return;
  }
  autoRuleRows.value = [row, ...autoRuleRows.value];
}

export function buildNewAutoRuleRowFromDraft(input: {
  direction: 'inflow' | 'outflow';
  ruleName: string;
  withdrawalTypeKey?: string;
  scopeLabel: string;
  waasProject?: string;
  serviceProvider: string;
  existingId?: string;
  existingNumber?: string;
  createdAt?: string;
}): PaymentEngineRecordRow {
  const now = new Date();
  const createdAt = input.createdAt ?? now.toISOString().replace('T', ' ').slice(0, 19);
  const id = input.existingId ?? formatRuleNumber(now);
  const ruleNumber = input.existingNumber ?? id;

  return {
    id,
    merchantOrderId: id,
    status: 'success',
    createdAt,
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: input.ruleName.trim(),
    ruleNumber,
    ruleEnabled: false,
    autoRuleDirection: input.direction,
    autoRuleScopeKey: input.withdrawalTypeKey ?? 'Manual Transfer',
    autoRuleWaasProject: input.waasProject ?? input.scopeLabel,
    autoRuleServiceProvider: input.serviceProvider,
  };
}
