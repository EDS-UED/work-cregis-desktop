import {
  cregisModuleMenuBusinessTitles,
  cregisNavBarAppEntries,
  cregisNavBarModules,
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
  type CregisModuleMenuBusinessTitle,
} from '@eds/desktop-components';

export type { CregisModuleMenuBusinessTitle };
export { DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE };

/** Cregis：Nav 聚焦时不展示 Module Menu（Report / Marketplace / 应用入口）。 */
export const cregisNavLabelsWithoutModuleMenu = [
  'Report',
  'Marketplace',
  'UniChain',
  'MetaMask',
] as const;

const NAV_CHROME_LABEL_TO_MODULE_TITLE: Record<string, CregisModuleMenuBusinessTitle> = {
  Notice: 'Notifications',
  'User avatar': 'Account Settings',
};

/** Nav Bar 按钮 aria-label → Module Menu 业务模块名。 */
export function resolveNavChromeLabelToModuleMenuTitle(
  label: string,
): CregisModuleMenuBusinessTitle | null {
  const trimmed = label.trim();
  const mapped = NAV_CHROME_LABEL_TO_MODULE_TITLE[trimmed];
  if (mapped) return mapped;

  if ((cregisModuleMenuBusinessTitles as readonly string[]).includes(trimmed)) {
    return trimmed as CregisModuleMenuBusinessTitle;
  }

  return null;
}

export type NavBarClickState = {
  /** Module Menu / 主内容路由用英文 key。 */
  navLabel: string;
  moduleTitle: CregisModuleMenuBusinessTitle | null;
};

/**
 * Nav 模块点击：用 preset 英文 key 正向匹配，避免「交易记录」等重复译文
 * 被 resolveEnglishUiText 误解析为 Notifications 的 Transactions。
 */
export function resolveNavBarClickState(
  ariaLabel: string,
  translate: (key: string) => string,
): NavBarClickState | null {
  const trimmed = ariaLabel.trim();
  if (!trimmed) return null;

  const chromeMapped = NAV_CHROME_LABEL_TO_MODULE_TITLE[trimmed];
  if (chromeMapped) {
    return { navLabel: chromeMapped, moduleTitle: chromeMapped };
  }

  for (const entry of [...cregisNavBarModules, ...cregisNavBarAppEntries]) {
    const key = entry.label;
    if (trimmed !== key && trimmed !== translate(key)) continue;

    const moduleTitle = (cregisModuleMenuBusinessTitles as readonly string[]).includes(key)
      ? (key as CregisModuleMenuBusinessTitle)
      : null;
    return { navLabel: key, moduleTitle };
  }

  const moduleTitle = resolveNavChromeLabelToModuleMenuTitle(trimmed);
  if (moduleTitle) {
    return { navLabel: moduleTitle, moduleTitle };
  }

  return null;
}

export function navLabelShouldHideModuleMenu(label: string): boolean {
  return (cregisNavLabelsWithoutModuleMenu as readonly string[]).includes(label.trim());
}
