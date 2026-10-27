import { nextTick } from 'vue';

function findMenuItemButtonByDisplayLabel(
  root: ParentNode,
  displayLabel: string,
): HTMLButtonElement | null {
  const target = displayLabel.trim();
  for (const button of root.querySelectorAll('button.eds-module-menu-item')) {
    const labelEl = button.querySelector('[class*="itemLabel"]');
    if (labelEl?.textContent?.trim() !== target) continue;
    if (button instanceof HTMLButtonElement) {
      return button;
    }
  }
  return null;
}

/** 与 EgModuleMenu 聚焦对齐：按已翻译菜单文案点击对应 `button.eds-module-menu-item`。 */
export function syncModuleMenuItemFocus(displayLabel: string) {
  void nextTick(() => {
    const preview = document.querySelector('.app-preview');
    if (!preview) return;

    const button = findMenuItemButtonByDisplayLabel(preview, displayLabel);
    button?.click();
  });
}

/**
 * tier-2 分支展开后聚焦子项（避免与同级其它「历史记录」等重复译文项冲突）。
 * @param branchCatalogLabel 父级英文 catalog（如 Collection Record）
 * @param subitemCatalogLabel 子项英文 catalog（如 Collection History）
 */
/** EgModuleMenu tier-2 父级在点击后的 `aria-expanded`（EDS 已先 toggle）。 */
export function isModuleMenuBranchExpandedByCatalog(
  branchCatalogLabel: string,
  translate: (catalogLabel: string) => string,
  root: ParentNode | null = document.querySelector('.app-preview'),
): boolean {
  if (!root) return false;

  const branchDisplay = translate(branchCatalogLabel).trim();

  for (const branch of root.querySelectorAll('[class*="itemBranch"]')) {
    const parentButton = branch.querySelector(':scope > button.eds-module-menu-item');
    if (!(parentButton instanceof HTMLButtonElement)) continue;

    const parentLabel = parentButton
      .querySelector('[class*="itemLabel"]')
      ?.textContent?.trim();
    if (parentLabel !== branchDisplay) continue;

    return parentButton.getAttribute('aria-expanded') === 'true';
  }

  return false;
}

export function syncModuleMenuBranchSubitemFocus(
  branchCatalogLabel: string,
  subitemCatalogLabel: string,
  translate: (catalogLabel: string) => string,
) {
  void nextTick(() => {
    const preview = document.querySelector('.app-preview');
    if (!preview) return;

    const branchDisplay = translate(branchCatalogLabel).trim();
    const subitemDisplay = translate(subitemCatalogLabel).trim();

    for (const branch of preview.querySelectorAll('[class*="itemBranch"]')) {
      const parentButton = branch.querySelector(':scope > button.eds-module-menu-item');
      if (!(parentButton instanceof HTMLButtonElement)) continue;

      const parentLabel = parentButton
        .querySelector('[class*="itemLabel"]')
        ?.textContent?.trim();
      if (parentLabel !== branchDisplay) continue;

      const subList = branch.querySelector('[class*="itemSubList"]');
      if (!subList) continue;

      const subButton = findMenuItemButtonByDisplayLabel(subList, subitemDisplay);
      if (subButton) {
        subButton.click();
        return;
      }
    }

    syncModuleMenuItemFocus(subitemDisplay);
  });
}
