import { computed } from 'vue';
import type { ModuleMenuPresetGroup } from '@eds/desktop-components';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import {
  cregisWaasModuleMenuGroups,
  cregisWaasOrderModuleMenuGroups,
} from '@eds/desktop-components';
import { isWaasOrderModeProject } from './waasMenuData';

function remapStandardWaasMenuGroups(
  groups: readonly ModuleMenuPresetGroup[],
): ModuleMenuPresetGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.label !== 'Collection Record' || !item.subitems?.length) {
        return item;
      }
      return {
        ...item,
        subitems: item.subitems.map((subitem) => {
          if (subitem.label === 'History') {
            return { ...subitem, label: 'Collection History' };
          }
          if (subitem.label === 'Processing') {
            return { ...subitem, label: 'Collection Processing' };
          }
          return subitem;
        }),
      };
    }),
  }));
}

/**
 * WaaS 默认菜单由 EgCregisModuleMenu 按 title="WaaS" 从 EDS preset 解析；
 * 仅订单模式项目覆盖为 `cregisWaasOrderModuleMenuGroups`（含 Bulk Transfer Record，非 Payment Engine 的 Settlement Record）。
 * 标准模式将归集记录子菜单 History / Processing 映射为 `Collection History` / `Collection Processing`，与交易记录区分。
 */
export function useWaasModuleMenuGroups() {
  const { selectedProject } = useWaasProjectStore();

  return computed<ModuleMenuPresetGroup[] | undefined>(() => {
    if (isWaasOrderModeProject(selectedProject.value)) {
      return cregisWaasOrderModuleMenuGroups;
    }
    return remapStandardWaasMenuGroups(cregisWaasModuleMenuGroups);
  });
}
