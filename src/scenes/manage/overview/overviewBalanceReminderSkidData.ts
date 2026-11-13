export type OverviewBalanceReminderAmountKey = 'team' | 'eth' | 'bnb' | 'pol' | 'sol';

/** 未开通 Gas 时余额提醒不展示的多链 Gas 账户（与概览 `visibleGasAccounts` 一致）。 */
export const OVERVIEW_BALANCE_REMINDER_GAS_MULTICHAIN_KEYS = [
  'eth',
  'bnb',
  'pol',
  'sol',
] as const satisfies readonly OverviewBalanceReminderAmountKey[];

export type OverviewBalanceReminderAmountOption = {
  key: OverviewBalanceReminderAmountKey;
  titleKey: string;
  unit: string;
};

import { maskDisplayEmail } from '@/utils/maskDisplayEmail';

export type OverviewBalanceReminderRecipientOption = {
  id: string;
  avatarName: string;
  name: string;
  email: string;
};

export const OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS: readonly OverviewBalanceReminderAmountOption[] =
  [
    {
      key: 'team',
      titleKey: 'Team Account',
      unit: 'USD',
    },
    {
      key: 'eth',
      titleKey: 'ETH Gas Account',
      unit: 'ETH',
    },
    {
      key: 'bnb',
      titleKey: 'BNB Gas Account',
      unit: 'BNB',
    },
    {
      key: 'pol',
      titleKey: 'POL Gas Account',
      unit: 'POL',
    },
    {
      key: 'sol',
      titleKey: 'SOL Gas Account',
      unit: 'SOL',
    },
  ];

export function listOverviewBalanceReminderAmountOptions(
  gasProxyEnabled: boolean,
): readonly OverviewBalanceReminderAmountOption[] {
  if (gasProxyEnabled) {
    return OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS;
  }
  const hidden = new Set<string>(OVERVIEW_BALANCE_REMINDER_GAS_MULTICHAIN_KEYS);
  return OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS.filter((item) => !hidden.has(item.key));
}

/** 提醒对象列表默认展示人数（其余通过「展开全部」显示）。 */
export const OVERVIEW_BALANCE_REMINDER_RECIPIENT_DEFAULT_VISIBLE = 4;

/** email-display-seed */
const OVERVIEW_BALANCE_REMINDER_RECIPIENT_RAW = [
  { id: 'zhang-admin', avatarName: '张三', name: '张三（管理员）', email: 'zhangsan@cregis.com' },
  { id: 'li-finance', avatarName: '李四', name: '李四（财务）', email: 'lisi@cregis.com' },
  { id: 'wang-ops', avatarName: '王五', name: '王五（运营）', email: 'wangwu@cregis.com' },
  { id: 'zhao-dev', avatarName: '赵六', name: '赵六（开发）', email: 'zhaoliu@cregis.com' },
  { id: 'qian-audit', avatarName: '钱七', name: '钱七（审计）', email: 'qianqi@cregis.com' },
  { id: 'sun-compliance', avatarName: '孙八', name: '孙八（合规）', email: 'sunba@cregis.com' },
  { id: 'zhou-product', avatarName: '周九', name: '周九（产品）', email: 'zhoujiu@cregis.com' },
  { id: 'wu-support', avatarName: '吴十', name: '吴十（客服）', email: 'wushi@cregis.com' },
] as const;

export const OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS: readonly OverviewBalanceReminderRecipientOption[] =
  OVERVIEW_BALANCE_REMINDER_RECIPIENT_RAW.map((recipient) => ({
    ...recipient,
    email: maskDisplayEmail(recipient.email),
  }));

export type OverviewBalanceReminderFormState = {
  featureEnabled: boolean;
  amountByKey: Record<OverviewBalanceReminderAmountKey, boolean>;
  thresholdByKey: Record<OverviewBalanceReminderAmountKey, string>;
  recipientById: Record<string, boolean>;
};

function buildDefaultThresholdByKey(): Record<OverviewBalanceReminderAmountKey, string> {
  return {
    team: '',
    eth: '',
    bnb: '',
    pol: '',
    sol: '',
  };
}

function buildDefaultAmountSelection(): Record<
  OverviewBalanceReminderAmountKey,
  boolean
> {
  return {
    team: false,
    eth: false,
    bnb: false,
    pol: false,
    sol: false,
  };
}

function buildDefaultRecipientSelection(): Record<string, boolean> {
  return Object.fromEntries(
    OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS.map((item) => [item.id, false]),
  );
}

export function createOverviewBalanceReminderFormState(): OverviewBalanceReminderFormState {
  return {
    featureEnabled: false,
    amountByKey: buildDefaultAmountSelection(),
    thresholdByKey: buildDefaultThresholdByKey(),
    recipientById: buildDefaultRecipientSelection(),
  };
}

export function hasAnyBalanceReminderAmountSelected(
  amountByKey: Record<OverviewBalanceReminderAmountKey, boolean>,
): boolean {
  return OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS.some((item) => amountByKey[item.key]);
}

export function hasAnyBalanceReminderRecipientSelected(
  recipientById: Record<string, boolean>,
): boolean {
  return OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS.some(
    (item) => recipientById[item.id],
  );
}
