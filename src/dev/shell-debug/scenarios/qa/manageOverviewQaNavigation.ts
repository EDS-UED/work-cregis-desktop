import { selectAppShellModuleMenuItem } from '@/app/appShellMenuNavigation';
import { UI_TEXT_ZH_CN } from '@/i18n/uiTextZhCN';
import { MANAGE_OVERVIEW_MENU_ITEM } from '@/scenes/manage/manageMenuData';

function readShellDebugAppLocale(): 'zh-CN' | 'zh-TW' | 'en' {
  const lang = document.documentElement.lang.trim();
  if (lang === 'zh-CN' || lang === 'zh-TW') return lang;
  return 'en';
}

function resolveMenuItemLabel(catalogKey: string): string {
  const locale = readShellDebugAppLocale();
  if (locale === 'zh-CN') {
    return UI_TEXT_ZH_CN[catalogKey as keyof typeof UI_TEXT_ZH_CN] ?? catalogKey;
  }
  return catalogKey;
}

function isManageModuleNavActive(preview: Element): boolean {
  const active = preview.querySelector(
    '.eds-nav-bar-module button[aria-current="page"], .eds-nav-bar-module a[aria-current="page"], .eds-nav-bar-module button[aria-pressed="true"], .eds-nav-bar-module a[aria-pressed="true"]',
  );
  const label = active?.getAttribute('aria-label')?.trim() ?? '';
  if (!label) return false;
  return label === 'Manage' || label === resolveMenuItemLabel('Manage');
}

function clickNavBarModule(catalogKey: string) {
  const preview = document.querySelector('.app-preview');
  if (!preview) return;

  const candidates = new Set(
    [catalogKey, resolveMenuItemLabel(catalogKey)].map((item) => item.replace(/\s+/g, ' ').trim()),
  );

  for (const button of preview.querySelectorAll('.eds-nav-bar-module button, .eds-nav-bar-module a')) {
    const aria = button.getAttribute('aria-label')?.replace(/\s+/g, ' ').trim();
    if (!aria || !candidates.has(aria)) continue;
    (button as HTMLElement).click();
    return;
  }
}

/**
 * Shell Debug QA：管理 → 总览。
 * 禁止点击 tier-2「团队账户」父级（已展开时再点会收起并恢复展开前页，常为团队订阅）。
 */
export function navigateToManageOverview() {
  const preview = document.querySelector('.app-preview');
  if (preview && !isManageModuleNavActive(preview)) {
    clickNavBarModule('Manage');
  }
  selectAppShellModuleMenuItem(MANAGE_OVERVIEW_MENU_ITEM);
}
