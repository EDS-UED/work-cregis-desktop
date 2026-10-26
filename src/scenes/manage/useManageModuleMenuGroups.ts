import { computed } from 'vue';
import type { ModuleMenuPresetGroup } from '@eds/desktop-components';
import { getCregisModuleMenuGroups } from '@eds/desktop-components';

function remapManageMenuGroups(
  groups: readonly ModuleMenuPresetGroup[],
): ModuleMenuPresetGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.label !== 'Webhook' || !item.subitems?.length) {
        return item;
      }
      return {
        ...item,
        subitems: item.subitems.map((subitem) => {
          if (subitem.label === 'Webhook Config') {
            return { ...subitem, icon: 'eds-network-spark' };
          }
          return subitem;
        }),
      };
    }),
  }));
}

export function useManageModuleMenuGroups() {
  return computed<ModuleMenuPresetGroup[]>(() =>
    remapManageMenuGroups(getCregisModuleMenuGroups('Manage')),
  );
}
