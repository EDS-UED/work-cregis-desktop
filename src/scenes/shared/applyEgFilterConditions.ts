import {
  isValuelessOperator,
  parseFilterDateRangeValue,
  parseFilterNumericRangeValue,
  resolveFilterFieldKind,
  resolveFilterMemberPreset,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterFieldKind,
  type EgFilterLogicMode,
} from '@eds/desktop-components';
import { FILTER_NETWORK_KEY_TO_ROW_LABEL } from './mapRowNetworkLabelToFilterKey';

export type EgFilterRowSnapshot = Record<string, string | undefined>;

function normalizeComparableText(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeCompactComparableText(value: string): string {
  return value.replace(/\s+/g, '').trim().toLowerCase();
}

/** 地址 / 编号类：等于时允许匹配复合 haystack 中的单个片段，并忽略粘贴换行空格。 */
function equalsFilterText(haystack: string, needle: string): boolean {
  const left = normalizeComparableText(haystack);
  const right = normalizeComparableText(needle);
  if (!right) return left.length === 0;
  if (left === right) return true;

  const compactLeft = normalizeCompactComparableText(haystack);
  const compactRight = normalizeCompactComparableText(needle);
  if (compactLeft === compactRight) return true;

  for (const segment of left.split(/\s+/)) {
    if (!segment) continue;
    if (segment === right) return true;
    if (normalizeCompactComparableText(segment) === compactRight) return true;
  }

  return compactLeft.includes(compactRight);
}

function containsFilterText(haystack: string, needle: string): boolean {
  const left = normalizeComparableText(haystack);
  const right = normalizeComparableText(needle);
  if (!right) return true;
  if (left.includes(right)) return true;
  return normalizeCompactComparableText(haystack).includes(normalizeCompactComparableText(needle));
}

export function isActiveEgFilterCondition(condition: EgFilterCondition): boolean {
  if (!condition.fieldId || !condition.operatorId) return false;
  if (isValuelessOperator(condition.operatorId)) return true;
  return Boolean(condition.value.trim());
}

export function hasActiveEgFilterConditions(conditions: EgFilterCondition[]): boolean {
  return conditions.some(isActiveEgFilterCondition);
}

function parseFilterCurrencyConditionValue(raw: string): { symbol: string; networkKey: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { symbol: '', networkKey: '' };
  const [currencyId, networkKey = ''] = trimmed.split(':');
  const id = currencyId ?? '';
  const dashIndex = id.indexOf('-');
  const symbol =
    dashIndex >= 0 ? id.slice(dashIndex + 1).trim().toUpperCase() : id.trim().toUpperCase();
  return { symbol, networkKey: networkKey.trim() };
}

function parseRowDateKey(raw: string): string | null {
  const matched = /^(\d{4}-\d{2}-\d{2})/.exec(raw.trim());
  return matched?.[1] ?? null;
}

function compareNumericStrings(left: string, right: string): number | null {
  const a = Number.parseFloat(left.replace(/,/g, ''));
  const b = Number.parseFloat(right.replace(/,/g, ''));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return a - b;
}

function matchTextOperator(operatorId: string, haystack: string, needle: string): boolean {
  const left = normalizeComparableText(haystack);
  const right = normalizeComparableText(needle);

  switch (operatorId) {
    case 'equals':
      return equalsFilterText(haystack, needle);
    case 'not-equals':
      return !equalsFilterText(haystack, needle);
    case 'contains':
      return containsFilterText(haystack, needle);
    case 'not-contains':
      return !containsFilterText(haystack, needle);
    case 'is-empty':
      return left.length === 0;
    case 'is-not-empty':
      return left.length > 0;
    case 'greater-than':
    case 'less-than':
    case 'greater-or-equal':
    case 'less-or-equal': {
      const delta = compareNumericStrings(haystack, needle);
      if (delta == null) return false;
      if (operatorId === 'greater-than') return delta > 0;
      if (operatorId === 'less-than') return delta < 0;
      if (operatorId === 'greater-or-equal') return delta >= 0;
      return delta <= 0;
    }
    default:
      return true;
  }
}

function matchCurrencyCondition(
  operatorId: string,
  rowCurrency: string | undefined,
  rowNetwork: string | undefined,
  conditionValue: string,
): boolean {
  if (isValuelessOperator(operatorId)) {
    const combined = [rowCurrency, rowNetwork].filter(Boolean).join(' ');
    return matchTextOperator(operatorId, combined, '');
  }

  const selectedValues = conditionValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (selectedValues.length === 0) return true;

  const rowSymbol = normalizeComparableText(rowCurrency ?? '');
  const rowNetworkText = normalizeComparableText(rowNetwork ?? '');

  const matched = selectedValues.some((valueKey) => {
    const { symbol, networkKey } = parseFilterCurrencyConditionValue(valueKey);
    if (!symbol) return false;
    if (rowSymbol !== normalizeComparableText(symbol)) return false;
    if (!networkKey) return true;

    const expectedNetwork = FILTER_NETWORK_KEY_TO_ROW_LABEL[networkKey] ?? networkKey;
    return rowNetworkText.includes(normalizeComparableText(expectedNetwork));
  });

  if (operatorId === 'not-equals') return !matched;
  return matched;
}

function matchDropdownCondition(
  operatorId: string,
  rowOptionId: string | undefined,
  conditionValue: string,
): boolean {
  if (isValuelessOperator(operatorId)) {
    return matchTextOperator(operatorId, rowOptionId ?? '', '');
  }

  const selectedValues = conditionValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (selectedValues.length === 0) return true;

  const rowValue = (rowOptionId ?? '').trim();
  const matched = selectedValues.some((valueKey) => valueKey === rowValue);

  if (operatorId === 'not-equals') return !matched;
  return matched;
}

function matchMemberCondition(
  operatorId: string,
  rowMemberId: string | undefined,
  rowInitiatorText: string | undefined,
  conditionValue: string,
): boolean {
  if (isValuelessOperator(operatorId)) {
    return matchTextOperator(operatorId, rowMemberId ?? rowInitiatorText ?? '', '');
  }

  const selectedValues = conditionValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (selectedValues.length === 0) return true;

  const initiatorText = rowInitiatorText ?? '';
  const matched = selectedValues.some((valueKey) => {
    if (valueKey === rowMemberId) return true;
    const preset = resolveFilterMemberPreset(valueKey);
    if (preset) {
      return (
        containsFilterText(initiatorText, preset.name)
        || containsFilterText(initiatorText, preset.label)
      );
    }
    return containsFilterText(initiatorText, valueKey);
  });

  if (operatorId === 'not-equals') return !matched;
  return matched;
}

function matchStatusCondition(
  operatorId: string,
  rowPresetId: string | undefined,
  conditionValue: string,
): boolean {
  if (isValuelessOperator(operatorId)) {
    return matchTextOperator(operatorId, rowPresetId ?? '', '');
  }

  const selectedValues = conditionValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (selectedValues.length === 0) return true;

  const rowValue = (rowPresetId ?? '').trim();
  const matched = selectedValues.some((valueKey) => valueKey === rowValue);

  if (operatorId === 'not-equals') return !matched;
  return matched;
}

function matchTimeRangeCondition(
  operatorId: string,
  rowValue: string | undefined,
  conditionValue: string,
): boolean {
  if (isValuelessOperator(operatorId)) {
    return matchTextOperator(operatorId, rowValue ?? '', '');
  }

  const rowDateKey = parseRowDateKey(rowValue ?? '');
  if (!rowDateKey) return operatorId === 'not-equals';

  const { start, end } = parseFilterDateRangeValue(conditionValue);
  if (!start && !end) return true;

  const startKey = start ? `${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')}` : null;
  const endKey = end ? `${end.year}-${String(end.month).padStart(2, '0')}-${String(end.day).padStart(2, '0')}` : null;

  let inRange = true;
  if (startKey) inRange = inRange && rowDateKey >= startKey;
  if (endKey) inRange = inRange && rowDateKey <= endKey;

  if (operatorId === 'not-equals') return !inRange;
  return inRange;
}

function matchNumericAmountCondition(
  operatorId: string,
  rowValue: string | undefined,
  conditionValue: string,
): boolean {
  if (isValuelessOperator(operatorId)) {
    return matchTextOperator(operatorId, rowValue ?? '', '');
  }

  const rowNumber = (rowValue ?? '').replace(/,/g, '').trim();
  const { min, max } = parseFilterNumericRangeValue(conditionValue);
  const hasRange = Boolean(min || max);

  if (hasRange) {
    const minDelta = min ? compareNumericStrings(rowNumber, min) : null;
    const maxDelta = max ? compareNumericStrings(rowNumber, max) : null;
    const inRange =
      (minDelta == null || minDelta >= 0)
      && (maxDelta == null || maxDelta <= 0);
    if (operatorId === 'not-equals') return !inRange;
    return inRange;
  }

  return matchTextOperator(operatorId, rowNumber, conditionValue.trim());
}

function matchConditionForField(
  fieldKind: EgFilterFieldKind | undefined,
  operatorId: string,
  rowValue: string | undefined,
  conditionValue: string,
  snapshot: EgFilterRowSnapshot,
  fieldId: string,
): boolean {
  if (fieldKind === 'currency') {
    const symbol = String(rowValue ?? snapshot.currencySymbol ?? '').trim();
    return matchCurrencyCondition(
      operatorId,
      symbol,
      snapshot.currencyNetwork,
      conditionValue,
    );
  }

  if (fieldKind === 'status') {
    return matchStatusCondition(operatorId, rowValue, conditionValue);
  }

  if (fieldKind === 'member') {
    return matchMemberCondition(
      operatorId,
      fieldId === 'initiator' ? snapshot.initiator : rowValue,
      snapshot.initiatorSearch ?? snapshot.initiator,
      conditionValue,
    );
  }

  if (fieldKind === 'dropdown') {
    return matchDropdownCondition(operatorId, rowValue, conditionValue);
  }

  if (fieldKind === 'time-range' || fieldId === 'createdAt') {
    return matchTimeRangeCondition(operatorId, rowValue, conditionValue);
  }

  if (fieldKind === 'amount' || fieldKind === 'gas-fee') {
    return matchNumericAmountCondition(operatorId, rowValue, conditionValue);
  }

  return matchTextOperator(operatorId, rowValue ?? '', conditionValue);
}

function resolveFieldKind(fields: EgFilterField[], fieldId: string): EgFilterFieldKind | undefined {
  const field = fields.find((item) => item.id === fieldId);
  return resolveFilterFieldKind(field, fieldId);
}

export function applyEgFilterConditions(options: {
  snapshot: EgFilterRowSnapshot;
  conditions: EgFilterCondition[];
  fields: EgFilterField[];
  logicMode?: EgFilterLogicMode;
}): boolean {
  const activeConditions = options.conditions.filter(isActiveEgFilterCondition);
  if (activeConditions.length === 0) return true;

  const logicMode = options.logicMode ?? 'all';
  const results = activeConditions.map((condition) => {
    const fieldKind = resolveFieldKind(options.fields, condition.fieldId);
    const rowValue = options.snapshot[condition.fieldId];
    return matchConditionForField(
      fieldKind,
      condition.operatorId,
      rowValue,
      condition.value,
      options.snapshot,
      condition.fieldId,
    );
  });

  return logicMode === 'any' ? results.some(Boolean) : results.every(Boolean);
}
