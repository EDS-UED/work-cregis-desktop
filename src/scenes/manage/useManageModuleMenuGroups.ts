import { computed } from 'vue';
import type { ModuleMenuPresetGroup } from '@eds/desktop-components';
import { getCregisModuleMenuGroups } from '@eds/desktop-components';

export function useManageModuleMenuGroups() {
  return computed<ModuleMenuPresetGroup[]>(() => getCregisModuleMenuGroups('Manage'));
}
