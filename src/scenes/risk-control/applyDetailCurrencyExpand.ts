import type {
  DetailItemData,
  DetailItemValueEntry,
  DetailSectionData,
} from '@eds/desktop-components';

export function applyDetailCurrencyExpand(
  sections: DetailSectionData[],
  expandedKeys: ReadonlySet<string>,
  expandedValueEntriesByKey: ReadonlyMap<string, DetailItemValueEntry[]>,
): DetailSectionData[] {
  if (expandedKeys.size === 0) {
    return sections;
  }

  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (!item.key || !expandedKeys.has(item.key)) {
        return item;
      }

      const entries = expandedValueEntriesByKey.get(item.key);
      if (!entries?.length) {
        return item;
      }

      return expandCurrencyItem(item, entries);
    }),
  }));
}

function expandCurrencyItem(
  item: DetailItemData,
  entries: DetailItemValueEntry[],
): DetailItemData {
  return {
    ...item,
    addressLayout: 'multi-expanded',
    addressCount: entries.length,
    addressViewMoreLabel: undefined,
    valueEntries: entries.map((entry, index) => ({
      ...entry,
      dashed: index < entries.length - 1,
    })),
    value: entries[0]?.value ?? item.value,
  };
}
