import { UI_TEXT_ZH_CN } from '@/i18n/uiTextZhCN';

type RiskControlQaSubmenuCatalogKey = 'Query Records' | 'Auto Rules';

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

function clickModuleMenuItemMatching(label: string) {
  const preview = document.querySelector('.app-preview');
  if (!preview) return;

  const normalizedTarget = label.replace(/\s+/g, ' ').trim();
  const items = preview.querySelectorAll('.eds-module-menu-item');
  for (const item of items) {
    const text = item.textContent?.replace(/\s+/g, ' ').trim();
    if (!text || text !== normalizedTarget) continue;
    (item as HTMLElement).click();
    return;
  }
}

/** Shell Debug QA：进入风控模块并聚焦 AML 子菜单（查询记录 / 自动规则）。 */
export function navigateToRiskControlAmlSubmenu(catalogKey: RiskControlQaSubmenuCatalogKey) {
  const riskModuleLabel = resolveMenuItemLabel('Risk Control');
  const amlBranchLabel = resolveMenuItemLabel('AML');
  const submenuLabel = resolveMenuItemLabel(catalogKey);

  clickModuleMenuItemMatching(riskModuleLabel);
  clickModuleMenuItemMatching(amlBranchLabel);
  clickModuleMenuItemMatching(submenuLabel);
}
