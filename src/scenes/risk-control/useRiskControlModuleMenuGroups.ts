import { computed } from 'vue';
import type { ModuleMenuPresetGroup } from '@eds/desktop-components';
import { getCregisModuleMenuGroups } from '@eds/desktop-components';

function remapRiskControlMenuGroups(
  groups: readonly ModuleMenuPresetGroup[],
): ModuleMenuPresetGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.label !== 'AML' || !item.subitems?.length) {
        return item;
      }
      return {
        ...item,
        subitems: item.subitems.map((subitem) => {
          if (subitem.label === 'Query Records') {
            return { ...subitem, icon: 'eds-text-search' };
          }
          if (subitem.label === 'Auto Rules') {
            return { ...subitem, icon: 'eds-text-logs-automation' };
          }
          return subitem;
        }),
      };
    }),
  }));
}

export function useRiskControlModuleMenuGroups() {
  return computed<ModuleMenuPresetGroup[]>(() =>
    remapRiskControlMenuGroups(getCregisModuleMenuGroups('Risk Control')),
  );
}
