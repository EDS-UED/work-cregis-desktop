import type { AppLocale } from '@/composables/useAppLocale';
import { translateUiText } from '@/i18n/translateUiText';

export type AppMessageKey =
  | 'preference.language'
  | 'preference.theme'
  | 'preference.timezone'
  | 'preference.light'
  | 'preference.dark'
  | 'appShell.mainHint';

const MESSAGE_SOURCE_EN: Record<AppMessageKey, string> = {
  'preference.language': 'Language',
  'preference.theme': 'Theme',
  'preference.timezone': 'Timezone',
  'preference.light': 'Light',
  'preference.dark': 'Dark',
  'appShell.mainHint': 'Main content area',
};

export function translateAppMessage(locale: AppLocale, key: AppMessageKey): string {
  return translateUiText(locale, MESSAGE_SOURCE_EN[key]);
}
