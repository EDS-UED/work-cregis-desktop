export type OverviewBalanceReminderAmountKey = 'team' | 'eth' | 'bnb' | 'pol' | 'sol';

export type OverviewBalanceReminderAmountOption = {
  key: OverviewBalanceReminderAmountKey;
  titleKey: string;
  amountDisplay: string;
};

export type OverviewBalanceReminderRecipientOption = {
  id: string;
  displayName: string;
};

/** Mock：团队是否已在线上开启余额提醒（影响提醒金额默认勾选）。 */
export const MOCK_TEAM_ALREADY_HAS_BALANCE_REMINDER = true;

export const OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS: readonly OverviewBalanceReminderAmountOption[] =
  [
    {
      key: 'team',
      titleKey: 'Team Account',
      amountDisplay: '$128,430.52',
    },
    {
      key: 'eth',
      titleKey: 'ETH Gas Account',
      amountDisplay: '12.4821 ETH',
    },
    {
      key: 'bnb',
      titleKey: 'BNB Gas Account',
      amountDisplay: '86.245 BNB',
    },
    {
      key: 'pol',
      titleKey: 'POL Gas Account',
      amountDisplay: '42,680.00 POL',
    },
    {
      key: 'sol',
      titleKey: 'SOL Gas Account',
      amountDisplay: '1,286.40 SOL',
    },
  ];

export const OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS: readonly OverviewBalanceReminderRecipientOption[] =
  [
    { id: 'zhang-admin', displayName: '张三（管理员）' },
    { id: 'li-finance', displayName: '李四（财务）' },
  ];

export type OverviewBalanceReminderFormState = {
  featureEnabled: boolean;
  amountByKey: Record<OverviewBalanceReminderAmountKey, boolean>;
  recipientById: Record<string, boolean>;
};

function buildDefaultAmountSelection(
  teamAlreadyHasReminder: boolean,
): Record<OverviewBalanceReminderAmountKey, boolean> {
  return {
    team: teamAlreadyHasReminder,
    eth: false,
    bnb: false,
    pol: false,
    sol: false,
  };
}

function buildDefaultRecipientSelection(): Record<string, boolean> {
  return Object.fromEntries(
    OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS.map((item) => [item.id, true]),
  );
}

export function createOverviewBalanceReminderFormState(options?: {
  teamAlreadyHasReminder?: boolean;
}): OverviewBalanceReminderFormState {
  const teamAlreadyHasReminder =
    options?.teamAlreadyHasReminder ?? MOCK_TEAM_ALREADY_HAS_BALANCE_REMINDER;
  return {
    featureEnabled: true,
    amountByKey: buildDefaultAmountSelection(teamAlreadyHasReminder),
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
