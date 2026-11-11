import type { FlotationMenuItemPreset } from '@eds/desktop-components';

function formatUtcOffsetLabel(offsetHour: number): string {
  const sign = offsetHour >= 0 ? '+' : '-';
  const abs = Math.abs(offsetHour);
  return `UTC${sign}${String(abs).padStart(2, '0')}:00`;
}

const TOOLBAR_TIMEZONE_MIN_HOUR = 8;
const TOOLBAR_TIMEZONE_MAX_HOUR = 20;

/** ToolBar / 偏好 · 时区 Flotation 选项（label 为展示值，禁止 ui()）。 */
export const TOOLBAR_TIMEZONE_ITEMS: FlotationMenuItemPreset[] = Array.from(
  { length: TOOLBAR_TIMEZONE_MAX_HOUR - TOOLBAR_TIMEZONE_MIN_HOUR + 1 },
  (_, index) => {
    const offsetHour = TOOLBAR_TIMEZONE_MIN_HOUR + index;
    return {
      label: formatUtcOffsetLabel(offsetHour),
      boxType: 'text',
      showTag: false,
    };
  },
);

export function resolveToolbarTimezoneOffsetLabel(index: number): string {
  return TOOLBAR_TIMEZONE_ITEMS[index]?.label ?? 'UTC+08:00';
}
