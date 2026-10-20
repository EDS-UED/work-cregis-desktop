import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailItemValueEntry,
} from '@eds/desktop-components';
import { resolveDataListCryptoName } from '@/scenes/shared/resolveDataListCryptoName';
import {
  mergeRiskControlCurrencyConditions,
  type RiskControlCurrencyCondition,
} from './riskControlCurrencyConditionDemoData';

export function formatRiskControlCurrencyConditionThresholdLabel(
  entry: RiskControlCurrencyCondition,
  translate: (key: string) => string,
): string {
  return translate('Auto rule collection amount threshold')
    .replace('{amount}', entry.thresholdAmount)
    .replace('{symbol}', entry.thresholdSymbol);
}

export function buildRiskControlCurrencyConditionValueEntries(
  conditions: RiskControlCurrencyCondition[],
  translate: (key: string) => string,
): DetailItemValueEntry[] {
  return conditions.map((entry, index) => ({
    value: formatRiskControlCurrencyConditionThresholdLabel(entry, translate),
    valueLeading: entry.symbol,
    valueIcon: resolveDataListCryptoName(entry.symbol, entry.cryptoName),
    tag: entry.networkLabel?.trim() || undefined,
    tagFamily: 'system' as const,
    tagSystemType: 'stroke-subtle' as const,
    dashed: index < conditions.length - 1,
  }));
}

export function buildRiskControlExpandedCurrencyValueEntries(
  visibleConditions: RiskControlCurrencyCondition[],
  translate: (key: string) => string,
): DetailItemValueEntry[] {
  return buildRiskControlCurrencyConditionValueEntries(
    mergeRiskControlCurrencyConditions(visibleConditions),
    translate,
  );
}

export function buildRiskControlCurrencyConditionsItem(options: {
  itemKey: string;
  title: string;
  conditions: RiskControlCurrencyCondition[];
  hiddenCount: number;
  translate: (key: string) => string;
}): DetailItemData | null {
  const { itemKey, title, conditions, hiddenCount, translate } = options;
  if (conditions.length === 0) {
    return null;
  }

  const primary = conditions[0]!;
  const totalCount = conditions.length + hiddenCount;
  const valueEntries = buildRiskControlCurrencyConditionValueEntries(conditions, translate);
  const showExpandFooter = hiddenCount > 0;

  if (conditions.length === 1 && !showExpandFooter) {
    return {
      ...createDetailApplyItemRow('text', {
        key: itemKey,
        title,
        value: valueEntries[0]!.value,
        valueEntries,
      }),
      titleIcon: 'eds-coin-trading',
    };
  }

  if (conditions.length === 1 && showExpandFooter) {
    return {
      ...createDetailApplyItemRow('text', {
        key: itemKey,
        title,
        value: valueEntries[0]!.value,
        addressLayout: 'multi-collapsed',
        addressCount: totalCount,
        addressViewMoreLabel: translate('Expand All ({count})'),
        valueEntries,
      }),
      titleIcon: 'eds-coin-trading',
    };
  }

  return {
    ...createDetailApplyItemRow('text', {
      key: itemKey,
      title,
      value: formatRiskControlCurrencyConditionThresholdLabel(primary, translate),
      addressLayout: 'multi-expanded',
      addressCount: showExpandFooter ? totalCount : conditions.length,
      addressViewMoreLabel: showExpandFooter
        ? translate('Expand All ({count})')
        : undefined,
      valueEntries,
    }),
    titleIcon: 'eds-coin-trading',
  };
}
