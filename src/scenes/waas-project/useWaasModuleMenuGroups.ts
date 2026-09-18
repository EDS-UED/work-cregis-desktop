import { computed } from 'vue';
import type { ModuleMenuPresetGroup } from '@eds/desktop-components';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import { cregisWaasOrderModuleMenuGroups } from '@eds/desktop-components';
import { isWaasOrderModeProject } from './waasMenuData';

/**
 * WaaS 默认菜单由 EgCregisModuleMenu 按 title="WaaS" 从 EDS preset 解析；
 * 仅订单模式项目覆盖为 `cregisWaasOrderModuleMenuGroups`（含 Bulk Transfer Record，非 Payment Engine 的 Settlement Record）。
 */
export function useWaasModuleMenuGroups() {
  const { selectedProject } = useWaasProjectStore();

  return computed<ModuleMenuPresetGroup[] | undefined>(() => {
    if (isWaasOrderModeProject(selectedProject.value)) {
      return cregisWaasOrderModuleMenuGroups;
    }
    return undefined;
  });
}
