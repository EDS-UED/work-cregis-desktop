export type TeamSubscriptionButtonSpec = {
  labelKey: string;
  variant: 'outline' | 'solid';
  tone: 'decor' | 'subtle';
  size: 'xs' | 'sm' | 'md';
};

export type TeamSubscriptionRowSpec = {
  id: string;
  labelKey: string;
  primaryValue: string;
  primaryBrand?: boolean;
  metaLine?: string;
  metaDanger?: boolean;
  badgeLabelKey?: string;
  badgeColorfulStyle?: 'apricot' | 'rose';
  progressPercent?: number;
  progressShowBubble?: boolean;
  actions?: TeamSubscriptionButtonSpec[];
  infoHintKey?: string;
};

export type TeamSubscriptionSectionSpec = {
  id: string;
  titleKey: string;
  walletAside?: {
    labelKey: 'Wallet Address';
    value: string;
    infoHintKey: string;
  };
  rows: TeamSubscriptionRowSpec[];
};

export const TEAM_SUBSCRIPTION_PLAN = {
  planNameKey: 'Team Subscription Business Plan',
  expiresDate: '2027-10-23',
  expiresInDays: 7,
} as const;

export const TEAM_SUBSCRIPTION_SECTIONS: TeamSubscriptionSectionSpec[] = [
  {
    id: 'wallet',
    titleKey: 'Wallet',
    walletAside: {
      labelKey: 'Wallet Address',
      value: '99个',
      infoHintKey: 'Team Subscription Wallet Address Hint',
    },
    rows: [
      {
        id: 'single-sign',
        labelKey: 'Team Subscription Single Sign Wallets',
        primaryValue: '0 / 10',
        primaryBrand: true,
        actions: [
          { labelKey: 'Benefits Capacity Expansion', variant: 'outline', tone: 'decor', size: 'xs' },
        ],
      },
      {
        id: 'multi-sign',
        labelKey: 'Team Subscription Multi Sign Wallets',
        primaryValue: '3 / 5',
        primaryBrand: true,
        actions: [
          { labelKey: 'Benefits Capacity Expansion', variant: 'outline', tone: 'decor', size: 'xs' },
        ],
      },
      {
        id: 'listing',
        labelKey: 'Team Subscription Listing Applications',
        primaryValue: '0 / 5',
        primaryBrand: true,
        actions: [
          { labelKey: 'Team Subscription Record Action', variant: 'outline', tone: 'decor', size: 'xs' },
          { labelKey: 'Team Subscription Apply Action', variant: 'outline', tone: 'decor', size: 'xs' },
        ],
      },
      {
        id: 'tron-normal',
        labelKey: 'Team Subscription Tron Energy Normal Transfer',
        primaryValue: '5 折',
      },
    ],
  },
  {
    id: 'project',
    titleKey: 'Team Subscription Project Section',
    rows: [
      {
        id: 'api-address',
        labelKey: 'Team Subscription Api Address Quota',
        primaryValue: '1,300 / 2,000个',
        metaLine: '2026-10-23 到期',
        metaDanger: true,
        badgeLabelKey: 'Team Subscription Benefit Expired',
        badgeColorfulStyle: 'rose',
        progressPercent: 65,
        progressShowBubble: true,
        actions: [
          { labelKey: 'Renewal', variant: 'outline', tone: 'decor', size: 'xs' },
          { labelKey: 'Upgrade', variant: 'solid', tone: 'decor', size: 'xs' },
        ],
      },
      {
        id: 'api-tx',
        labelKey: 'Team Subscription Api Transaction Quota',
        primaryValue: '5,600 / 100,000个',
      },
      {
        id: 'tron-collection',
        labelKey: 'Team Subscription Tron Energy Collection',
        primaryValue: '6 折',
      },
    ],
  },
  {
    id: 'risk',
    titleKey: 'Team Subscription Risk Section',
    rows: [
      {
        id: 'aml-quota',
        labelKey: 'Team Subscription Aml Remaining Queries',
        primaryValue: '500次',
        metaLine: '2027-10-23 到期',
        infoHintKey: 'Team Subscription Aml Quota Hint',
        actions: [
          { labelKey: 'Team Subscription Details Action', variant: 'outline', tone: 'decor', size: 'xs' },
        ],
      },
      {
        id: 'aml-discount',
        labelKey: 'Team Subscription Aml Query Discount',
        primaryValue: '6 折',
      },
      {
        id: 'strategy',
        labelKey: 'Team Subscription Strategy Quota',
        primaryValue: '7 / 10个',
        primaryBrand: true,
      },
    ],
  },
  {
    id: 'platform',
    titleKey: 'Team Subscription Platform Section',
    rows: [
      {
        id: 'members',
        labelKey: 'Team Subscription Team Members Quota',
        primaryValue: '5 / 10人',
        primaryBrand: true,
      },
      {
        id: 'withdrawal',
        labelKey: 'Team Subscription Monthly Withdrawal Limit',
        primaryValue: '$1,000,000',
        metaLine: '2027-10-23 到期',
        infoHintKey: 'Team Subscription Withdrawal Limit Hint',
        actions: [
          { labelKey: 'Benefits Capacity Expansion', variant: 'outline', tone: 'decor', size: 'xs' },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    titleKey: 'Team Subscription Advanced Section',
    rows: [
      {
        id: 'cards',
        labelKey: 'Team Subscription Crypto Cards Quota',
        primaryValue: '5 / 20张',
        primaryBrand: true,
      },
      {
        id: 'auto-sign',
        labelKey: 'Team Subscription Auto Collection Signing',
        primaryValue: 'Team Subscription Activated',
        metaLine: '2027-10-23 到期',
        actions: [
          { labelKey: 'Renewal', variant: 'outline', tone: 'decor', size: 'xs' },
        ],
      },
    ],
  },
];
