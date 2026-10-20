import { reactive } from 'vue';

export const PAYMENT_ENGINE_SETTINGS_TABS = [
  'Developer',
  'IP Whitelist',
  'Callback Setting',
  'Notification Setting',
  'Payment and Settlement',
  'Merchant Information',
  'Order Processing',
] as const;

export type PaymentEngineSettingsTab = (typeof PAYMENT_ENGINE_SETTINGS_TABS)[number];

export const CALLBACK_SETTING_TAB_INDEX = PAYMENT_ENGINE_SETTINGS_TABS.indexOf('Callback Setting');
export const NOTIFICATION_SETTING_TAB_INDEX = PAYMENT_ENGINE_SETTINGS_TABS.indexOf(
  'Notification Setting',
);

export const CALLBACK_ORDER_DOC_URL =
  'https://developers.cregis.com/en/reference/payment-engine-api/orderCallback/';
export const CALLBACK_WEBHOOK_DOC_URL =
  'https://developers.cregis.com/en/payment-engine-webhook-mechanism/';

export type CallbackUrlTestStatus = 'idle' | 'testing' | 'success' | 'invalid' | 'failed';

export type NotifyMember = {
  id: string;
  name: string;
  email: string;
  colorIndex: number;
};

export type NotifySettingId =
  | 'callback-error'
  | 'enable-disable-project'
  | 'reset-api-key'
  | 'payment-exception';

export type NotifySettingRow = {
  id: NotifySettingId;
  title: string;
  description?: string;
  enabled: boolean;
  members: NotifyMember[];
  extraCount?: number;
};

export const TEAM_NOTIFY_MEMBERS: NotifyMember[] = [
  { id: 'jojo', name: 'jojo', email: 'j*******@cregis.io', colorIndex: 5 },
  { id: 'minki', name: 'Minki', email: 'm*******@cregis.io', colorIndex: 0 },
  { id: 'adminnnnn', name: 'Adminnnnn', email: 'y********@gmail.com', colorIndex: 12 },
  { id: 'minki-yahoo', name: 'Minki-Yahoo', email: 'm********@yahoo.com', colorIndex: 2 },
];

export function notifyMembersFromIds(ids: readonly string[]): NotifyMember[] {
  const selected = new Set(ids);
  return TEAM_NOTIFY_MEMBERS.filter((member) => selected.has(member.id));
}

export function filterTeamNotifyMembers(query: string): NotifyMember[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return TEAM_NOTIFY_MEMBERS;
  return TEAM_NOTIFY_MEMBERS.filter((member) => member.name.toLowerCase().includes(needle));
}

export const paymentEngineSettingsState = reactive({
  tabIndex: CALLBACK_SETTING_TAB_INDEX,
  exceptionCallbackEnabled: false,
  exceptionCallbackUrl: '',
  callbackSkidOpen: false,
  notifySkidOpen: false,
  notifyEditRowId: null as NotifySettingId | null,
  disableCallbackOpen: false,
  googleVerifyOpen: false,
  pendingCallbackUrl: '',
  notifyRows: [
    {
      id: 'callback-error',
      title: 'Callback Error',
      description: 'System automatic callback failed',
      enabled: true,
      members: notifyMembersFromIds(['jojo']),
    },
    {
      id: 'enable-disable-project',
      title: 'Enable / Disable Project',
      description: 'When the project is enabled / disabled',
      enabled: true,
      members: notifyMembersFromIds(['jojo', 'minki']),
    },
    {
      id: 'reset-api-key',
      title: 'Reset API Key',
      description: 'When resetting the project API Key',
      enabled: false,
      members: notifyMembersFromIds(['jojo', 'minki']),
    },
    {
      id: 'payment-exception',
      title: 'Payment Exception Notification',
      enabled: false,
      members: notifyMembersFromIds(['jojo', 'minki']),
    },
  ] satisfies NotifySettingRow[],
});

export function isValidCallbackUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed.toLowerCase().startsWith('https://')) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}
