import { nextTick } from 'vue';

/** 与 EgModuleMenu 聚焦对齐：按已翻译菜单文案点击对应 `button.eds-module-menu-item`。 */
export function syncModuleMenuItemFocus(displayLabel: string) {
  void nextTick(() => {
    const preview = document.querySelector('.app-preview');
    if (!preview) return;

    const target = displayLabel.trim();
    for (const button of preview.querySelectorAll('button.eds-module-menu-item')) {
      const labelEl = button.querySelector('[class*="itemLabel"]');
      if (labelEl?.textContent?.trim() !== target) continue;
      if (button instanceof HTMLButtonElement) {
        button.click();
      }
      return;
    }
  });
}
