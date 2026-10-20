import type { ModuleMenuPresetGroup } from '@eds/desktop-components';

/** EDS tier-2 分支父级 label → preset 中第一个 subitem 的原文 label。 */
export function resolveFirstSubitemForBranchLabel(
  groups: readonly ModuleMenuPresetGroup[] | undefined,
  branchLabel: string,
): string | null {
  if (!groups?.length) return null;

  for (const group of groups) {
    for (const item of group.items) {
      if (item.label !== branchLabel || !item.subitems?.length) continue;
      return item.subitems[0]?.label ?? null;
    }
  }

  return null;
}

export function isModuleMenuBranchParentLabel(
  groups: readonly ModuleMenuPresetGroup[] | undefined,
  label: string,
): boolean {
  return resolveFirstSubitemForBranchLabel(groups, label) !== null;
}
