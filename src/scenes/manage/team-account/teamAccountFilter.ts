import {
  defaultConditionFilterRows,
  filledConditionFilterRows,
  type ConditionFilterFieldOption,
  type ConditionFilterRow,
} from '@/components/condition-filter/conditionFilter';
import { txDisplayTitleKey, type BalanceTx } from './teamAccountData';

export const TEAM_ACCOUNT_FILTER_FIELDS: ConditionFilterFieldOption[] = [
  { key: 'hash', labelKey: 'Transaction hash' },
  { key: 'type', labelKey: 'Operation Type' },
  { key: 'operator', labelKey: 'Operator' },
];

export const TEAM_ACCOUNT_FILTER_DEFAULT_KEYS = TEAM_ACCOUNT_FILTER_FIELDS.map(
  (field) => field.key,
);

export function defaultTeamAccountFilterRows(): ConditionFilterRow[] {
  return defaultConditionFilterRows(TEAM_ACCOUNT_FILTER_DEFAULT_KEYS);
}

function haystackForTx(
  tx: BalanceTx,
  field: string,
  translate: (key: string) => string,
): string {
  if (field === 'hash') return tx.txid ?? '';
  if (field === 'type') {
    const titleKey = txDisplayTitleKey(tx.type);
    return `${tx.type} ${titleKey} ${translate(titleKey)}`;
  }
  if (field === 'operator') return tx.operator ?? '';
  if (field === 'time') return tx.time;
  if (field === 'amount') return tx.amount;
  return '';
}

export function txMatchesFilterConditions(
  tx: BalanceTx,
  conditions: ConditionFilterRow[],
  translate: (key: string) => string,
): boolean {
  const filled = filledConditionFilterRows(conditions);
  if (filled.length === 0) return true;
  return filled.every((condition) =>
    haystackForTx(tx, condition.field, translate)
      .toLowerCase()
      .includes(condition.value.trim().toLowerCase()),
  );
}
