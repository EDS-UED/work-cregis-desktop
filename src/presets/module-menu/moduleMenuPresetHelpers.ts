import type { ModuleMenuPresetGroup } from '@eds/desktop-components';

/** 从 EDS 模块菜单 preset 提取可路由的叶子 label（含 tier-2 subitem）。 */
export function flattenModuleMenuPresetItemLabels(groups: readonly ModuleMenuPresetGroup[]): string[] {
  const labels: string[] = [];

  for (const group of groups) {
    for (const item of group.items) {
      if (item.subitems?.length) {
        for (const subitem of item.subitems) {
          labels.push(subitem.label);
        }
        continue;
      }
      labels.push(item.label);
    }
  }

  return labels;
}
