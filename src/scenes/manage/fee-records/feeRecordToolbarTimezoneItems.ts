import type { FlotationMenuItemPreset } from '@eds/desktop-components';

function formatUtcOffsetLabel(offsetHour: number): string {
  const sign = offsetHour >= 0 ? '+' : '-';
  const abs = Math.abs(offsetHour);
  return `UTC${sign}${String(abs).padStart(2, '0')}:00`;
}

const FEE_RECORD_TOOLBAR_TIMEZONE_MIN_HOUR = 8;
const FEE_RECORD_TOOLBAR_TIMEZONE_MAX_HOUR = 20;

/** 费用记录 ToolBar · 时区 Flotation 选项（label 为展示值，禁止 ui()）。 */
export const FEE_RECORD_TOOLBAR_TIMEZONE_ITEMS: FlotationMenuItemPreset[] = Array.from(
  { length: FEE_RECORD_TOOLBAR_TIMEZONE_MAX_HOUR - FEE_RECORD_TOOLBAR_TIMEZONE_MIN_HOUR + 1 },
  (_, index) => {
    const offsetHour = FEE_RECORD_TOOLBAR_TIMEZONE_MIN_HOUR + index;
    return {
      label: formatUtcOffsetLabel(offsetHour),
      boxType: 'text',
      showTag: false,
    };
  },
);
