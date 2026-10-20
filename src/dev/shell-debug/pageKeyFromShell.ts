import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import { isChineseLocale, type AppLocale } from '@/composables/useAppLocale';
import { useAppI18n } from '@/composables/useAppI18n';
import { UI_TEXT_ZH_CN } from '@/i18n/uiTextZhCN';
import { UI_TEXT_ZH_TW } from '@/i18n/uiTextZhTW';
import {
  DEFAULT_PAYMENT_ENGINE_MENU_ITEM,
  PAYMENT_ENGINE_RECORD_MENU_ITEMS,
  PAYMENT_ENGINE_SETTINGS_MENU_ITEM,
} from '@/scenes/payment-engine/paymentEngineMenuData';
import {
  DEFAULT_WAAS_MENU_ITEM,
  WAAS_ORDER_MODE_MENU_ITEMS,
  WAAS_SETTINGS_MENU_ITEM,
} from '@/scenes/waas-project/waasMenuData';
import {
  isTasksDataListMenuItem,
  normalizeTasksMenuLabel,
  resolveTasksDataListMenuItem,
  type TasksDataListMenuItemLabel,
} from '@/scenes/tasks/tasksDataListPageData';

export type ShellPageKey = `${string}:${string}`;

function readAppLocale(): AppLocale {
  const lang = document.documentElement.lang.trim();
  if (lang === 'zh-CN' || lang === 'zh-TW') return lang;
  return 'en';
}

/** 模块菜单文案去掉末尾计数角标（如「待签名99+99+」→「待签名」）。 */
export function normalizeModuleMenuLabel(raw: string): string {
  return normalizeTasksMenuLabel(raw);
}

function resolveTasksMenuItemLabel(raw: string): TasksDataListMenuItemLabel | null {
  return resolveTasksDataListMenuItem(raw, readAppLocale());
}

function readFocusedModuleMenuItem(preview: Element): Element | null {
  const focused = preview.querySelector(
    '.eds-module-menu-item[class*="itemFocused"], .eds-module-menu-item[aria-pressed="true"]',
  );
  return focused instanceof Element ? focused : null;
}

function readFocusedModuleMenuLabel(preview: Element): string | null {
  const focused = readFocusedModuleMenuItem(preview);
  if (!focused) {
    return null;
  }

  const labelEl = focused.querySelector('[class*="itemLabel"]');
  const labelText = labelEl?.textContent?.replace(/\s+/g, ' ').trim();
  if (labelText) {
    return labelText;
  }

  const text = focused.textContent?.replace(/\s+/g, ' ').trim();
  return text ? normalizeModuleMenuLabel(text) : null;
}

function readDataListToolbarTitle(preview: Element): string | null {
  const titleEl = preview.querySelector('.eds-tool-bar-title p, .eds-tool-bar-title');
  const text = titleEl?.textContent?.replace(/\s+/g, ' ').trim();
  return text ? normalizeModuleMenuLabel(text) : null;
}

function isReportModuleLabel(raw: string): boolean {
  const normalized = normalizeModuleMenuLabel(raw);
  return normalized === 'Report' || normalized === '交易记录' || normalized === '交易記錄';
}

function readActiveNavModuleLabel(preview: Element): string | null {
  const activeNav = preview.querySelector(
    '.eds-nav-bar-module button[aria-current="page"], .eds-nav-bar-module a[aria-current="page"]',
  );
  const activeLabel = activeNav?.getAttribute('aria-label')?.trim();
  if (activeLabel) {
    return activeLabel;
  }

  // EgNavBar 路由态用 aria-current；聚焦态用 aria-pressed（业务切模块时常见仅 pressed）。
  const focusedNav = preview.querySelector(
    '.eds-nav-bar-module button[aria-pressed="true"], .eds-nav-bar-module a[aria-pressed="true"]',
  );
  const focusedLabel = focusedNav?.getAttribute('aria-label')?.trim();
  return focusedLabel || null;
}

function isPaymentEngineNavLabel(raw: string | null): boolean {
  if (!raw) return false;
  const normalized = normalizeModuleMenuLabel(raw);
  return normalized === 'Payment Engine' || normalized === '支付引擎';
}

function isWaasNavLabel(raw: string | null): boolean {
  if (!raw) return false;
  const normalized = normalizeModuleMenuLabel(raw);
  return normalized === 'WaaS' || normalized === 'WaaS项目' || normalized === 'WaaS項目';
}

function readModuleMenuCrumbText(preview: Element): string {
  const crumb = preview.querySelector('.eds-module-menu [class*="crumb"]');
  return crumb?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function isOrderModeModuleMenu(preview: Element): boolean {
  const crumb = readModuleMenuCrumbText(preview);
  return (
    crumb.includes('批量转账记录')
    || crumb.includes('批量轉賬記錄')
    || crumb.includes('Bulk Transfer Record')
  );
}

function resolveEnglishCatalogMenuItem(
  raw: string,
  locale: AppLocale,
  catalogKeys: readonly string[],
): string {
  const normalized = normalizeModuleMenuLabel(raw);
  const direct = catalogKeys.find((item) => item === normalized);
  if (direct) return direct;

  for (const item of catalogKeys) {
    const zhCn = UI_TEXT_ZH_CN[item];
    if (typeof zhCn === 'string' && normalizeModuleMenuLabel(zhCn) === normalized) {
      return item;
    }
    if (locale === 'zh-TW') {
      const zhTw = UI_TEXT_ZH_TW[item];
      if (typeof zhTw === 'string' && normalizeModuleMenuLabel(zhTw) === normalized) {
        return item;
      }
    }
  }

  return normalized;
}

const PAYMENT_ENGINE_MENU_ITEM_KEYS = [
  ...PAYMENT_ENGINE_RECORD_MENU_ITEMS,
  PAYMENT_ENGINE_SETTINGS_MENU_ITEM,
] as const;

const WAAS_MENU_ITEM_KEYS = [
  DEFAULT_WAAS_MENU_ITEM,
  ...WAAS_ORDER_MODE_MENU_ITEMS,
  WAAS_SETTINGS_MENU_ITEM,
] as const;

function resolvePaymentEngineMenuItemLabel(preview: Element): string | null {
  const locale = readAppLocale();
  const menuLabel = readFocusedModuleMenuLabel(preview);
  if (menuLabel) {
    return resolveEnglishCatalogMenuItem(menuLabel, locale, PAYMENT_ENGINE_MENU_ITEM_KEYS);
  }

  const toolbarTitle = readDataListToolbarTitle(preview);
  if (!toolbarTitle) return null;
  return resolveEnglishCatalogMenuItem(toolbarTitle, locale, PAYMENT_ENGINE_MENU_ITEM_KEYS);
}

function resolveAmbiguousOrderRecordLabel(
  raw: string,
  locale: AppLocale,
  preview: Element,
): string | null {
  const normalized = normalizeModuleMenuLabel(raw);
  const orderRecordZhCn = UI_TEXT_ZH_CN['Order Record'];
  const orderRecordZhTw = UI_TEXT_ZH_TW['Order Record'];
  const paymentRecordZhCn = UI_TEXT_ZH_CN['Payment Record'];
  const paymentRecordZhTw = UI_TEXT_ZH_TW['Payment Record'];

  if (
    normalized === 'Order Record'
    || normalized === orderRecordZhCn
    || normalized === orderRecordZhTw
    || normalized === paymentRecordZhCn
    || normalized === paymentRecordZhTw
  ) {
    return isOrderModeModuleMenu(preview) ? 'Order Record' : DEFAULT_WAAS_MENU_ITEM;
  }

  return null;
}

function resolveWaasMenuItemLabel(preview: Element): string | null {
  const locale = readAppLocale();
  const menuLabel = readFocusedModuleMenuLabel(preview);
  if (menuLabel) {
    const ambiguous = resolveAmbiguousOrderRecordLabel(menuLabel, locale, preview);
    if (ambiguous) return ambiguous;
    return resolveEnglishCatalogMenuItem(menuLabel, locale, WAAS_MENU_ITEM_KEYS);
  }

  const toolbarTitle = readDataListToolbarTitle(preview);
  if (!toolbarTitle) return null;
  const ambiguous = resolveAmbiguousOrderRecordLabel(toolbarTitle, locale, preview);
  if (ambiguous) return ambiguous;
  return resolveEnglishCatalogMenuItem(toolbarTitle, locale, WAAS_MENU_ITEM_KEYS);
}

function resolvePaymentEnginePageKeyFromPreview(preview: Element): ShellPageKey | null {
  if (!isPaymentEngineNavLabel(readActiveNavModuleLabel(preview))) {
    return null;
  }

  const menuItem = resolvePaymentEngineMenuItemLabel(preview);
  return `Payment Engine:${menuItem ?? DEFAULT_PAYMENT_ENGINE_MENU_ITEM}`;
}

function resolveWaasPageKeyFromPreview(preview: Element): ShellPageKey | null {
  if (!isWaasNavLabel(readActiveNavModuleLabel(preview))) {
    return null;
  }

  const menuItem = resolveWaasMenuItemLabel(preview);
  if (!menuItem) {
    return isOrderModeModuleMenu(preview)
      ? 'WaaS:Order Record'
      : `WaaS:${DEFAULT_WAAS_MENU_ITEM}`;
  }

  return `WaaS:${menuItem}`;
}

function resolveReportPageKeyFromPreview(preview: Element): ShellPageKey | null {
  const toolbarTitle = readDataListToolbarTitle(preview);
  if (toolbarTitle && isReportModuleLabel(toolbarTitle)) {
    return 'Report:Report';
  }

  const menuLabel = readFocusedModuleMenuLabel(preview);
  if (menuLabel && isReportModuleLabel(menuLabel)) {
    return 'Report:Report';
  }

  return null;
}

function resolveTasksPageKeyFromPreview(preview: Element): ShellPageKey {
  const reportPageKey = resolveReportPageKeyFromPreview(preview);
  if (reportPageKey) {
    return reportPageKey;
  }

  const menuLabel = readFocusedModuleMenuLabel(preview);
  if (menuLabel) {
    const item = resolveTasksMenuItemLabel(menuLabel);
    if (item) {
      return `Tasks:${item}`;
    }
  }

  const toolbarTitle = readDataListToolbarTitle(preview);
  if (toolbarTitle) {
    const item = resolveTasksMenuItemLabel(toolbarTitle);
    if (item) {
      return `Tasks:${item}`;
    }
  }

  return 'Tasks:unknown';
}

export function resolvePageKeyFromDom(): ShellPageKey {
  const preview = document.querySelector('.app-preview');
  if (!preview) {
    return 'unknown:unknown';
  }

  const waasPageKey = resolveWaasPageKeyFromPreview(preview);
  if (waasPageKey) {
    return waasPageKey;
  }

  const paymentEnginePageKey = resolvePaymentEnginePageKeyFromPreview(preview);
  if (paymentEnginePageKey) {
    return paymentEnginePageKey;
  }

  if (preview.querySelector('.eds-data-list')) {
    return resolveTasksPageKeyFromPreview(preview);
  }

  const menuLabel = readFocusedModuleMenuLabel(preview);
  if (menuLabel?.toLowerCase().includes('preference') || menuLabel?.includes('偏好')) {
    return 'Account Settings:Preference';
  }

  return 'App:Shell';
}

export function readShellPageDisplayLabelFromDom(): string | null {
  const preview = document.querySelector('.app-preview');
  if (!preview) {
    return null;
  }

  const menuLabel = readFocusedModuleMenuLabel(preview);
  if (menuLabel) {
    return normalizeModuleMenuLabel(menuLabel);
  }

  const toolbarTitle = readDataListToolbarTitle(preview);
  return toolbarTitle ? normalizeModuleMenuLabel(toolbarTitle) : null;
}

export function resolveShellPageDisplayName(
  pageKey: ShellPageKey,
  ui: (key: string) => string,
): string {
  const [module, page] = pageKey.split(':');

  if (module === 'Tasks' && isTasksDataListMenuItem(page)) {
    return ui(page);
  }

  if (pageKey === 'Report:Report') {
    return ui('Report');
  }

  if (module === 'Payment Engine' || module === 'WaaS') {
    return ui(page);
  }

  if (pageKey === 'Account Settings:Preference') {
    return ui('Preference');
  }

  if (pageKey === 'App:Shell') {
    return ui('Tasks');
  }

  if (module === 'Tasks' && page === 'unknown') {
    return isChineseLocale(readAppLocale()) ? '未知页面' : 'Unknown page';
  }

  if (pageKey === 'unknown:unknown') {
    return isChineseLocale(readAppLocale()) ? '未知页面' : 'Unknown page';
  }

  return isChineseLocale(readAppLocale()) ? '未知页面' : 'Unknown page';
}

export function useShellPageKey(): Ref<ShellPageKey> {
  const pageKey = ref<ShellPageKey>(resolvePageKeyFromDom());
  let observer: MutationObserver | undefined;

  function sync() {
    pageKey.value = resolvePageKeyFromDom();
  }

  onMounted(() => {
    sync();
    observer = new MutationObserver(sync);
    const preview = document.querySelector('.app-preview');
    if (preview) {
      observer.observe(preview, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-current', 'aria-pressed'],
      });
    }
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
  });

  return pageKey;
}

export function useShellPageContext() {
  const pageKey = useShellPageKey();
  const { ui } = useAppI18n();

  const pageDisplayName = computed(() => {
    const key = pageKey.value;
    if (key !== 'Tasks:unknown' && key !== 'unknown:unknown') {
      return resolveShellPageDisplayName(key, ui);
    }

    const fromDom = readShellPageDisplayLabelFromDom();
    if (fromDom) {
      const item = resolveTasksMenuItemLabel(fromDom);
      if (item) {
        return ui(item);
      }
      return fromDom;
    }

    return resolveShellPageDisplayName(key, ui);
  });

  const effectivePageKey = computed((): ShellPageKey => {
    const key = pageKey.value;
    if (key !== 'Tasks:unknown') {
      return key;
    }

    const fromDom = readShellPageDisplayLabelFromDom();
    if (fromDom) {
      const item = resolveTasksMenuItemLabel(fromDom);
      if (item) {
        return `Tasks:${item}`;
      }
    }

    return key;
  });

  return {
    pageKey,
    effectivePageKey,
    pageDisplayName,
  };
}
