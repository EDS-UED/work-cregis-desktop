import { nextTick, type Ref } from 'vue';
import type { ModuleMenuPresetGroup } from '@eds/desktop-components';
import {
  isCatalogSubitemOfBranch,
  resolveFirstSubitemForBranchLabel,
} from './resolveModuleMenuBranchDefaultItem';
import {
  isModuleMenuBranchExpandedByCatalog,
  syncModuleMenuBranchSubitemFocus,
  syncModuleMenuItemFocus,
} from './syncModuleMenuItemFocus';

type ApplyCatalogSelection = (catalogLabel: string) => void;

/**
 * tier-2 分支父级点击：展开 → 记住当前页并进入第一个 subitem；收起 → 恢复展开前页面。
 * 须在 `item-select` 收到父级 catalog 后、EDS 已 toggle `expanded` 的同一 tick 之后调用（nextTick）。
 */
export function handleModuleMenuBranchParentSelect(options: {
  branchCatalogLabel: string;
  groups: readonly ModuleMenuPresetGroup[] | undefined;
  activeCatalog: Ref<string | null>;
  restoreBeforeExpandByBranch: Ref<Record<string, string>>;
  translate: (catalogLabel: string) => string;
  applyCatalogSelection: ApplyCatalogSelection;
}) {
  const {
    branchCatalogLabel,
    groups,
    activeCatalog,
    restoreBeforeExpandByBranch,
    translate,
    applyCatalogSelection,
  } = options;

  const firstSubitem = resolveFirstSubitemForBranchLabel(groups, branchCatalogLabel);
  if (!firstSubitem) return;

  void nextTick(() => {
    const expanded = isModuleMenuBranchExpandedByCatalog(branchCatalogLabel, translate);

    if (expanded) {
      const current = activeCatalog.value;
      if (
        current
        && !isCatalogSubitemOfBranch(groups, branchCatalogLabel, current)
      ) {
        restoreBeforeExpandByBranch.value = {
          ...restoreBeforeExpandByBranch.value,
          [branchCatalogLabel]: current,
        };
      }
      syncModuleMenuBranchSubitemFocus(
        branchCatalogLabel,
        firstSubitem,
        translate,
      );
      applyCatalogSelection(firstSubitem);
      return;
    }

    const restore = restoreBeforeExpandByBranch.value[branchCatalogLabel];
    if (!restore) return;

    const { [branchCatalogLabel]: _removed, ...rest } = restoreBeforeExpandByBranch.value;
    restoreBeforeExpandByBranch.value = rest;

    applyCatalogSelection(restore);
    syncModuleMenuItemFocus(translate(restore));
  });
}
