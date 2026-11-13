export type OverviewBillMonthOption = {
  id: string;
  label: string;
};

export type OverviewBillLanguageOption = {
  id: string;
  label: string;
};

export type OverviewBillHeaderOption = {
  id: string;
  labelKey: string;
};

export type OverviewBillGenerationRecord = {
  id: string;
  title: string;
  timezoneLabel: string;
  languageLabel: string;
  operatorName: string;
  operatorEmailMasked: string;
  generatedAt: string;
};

export const OVERVIEW_BILL_MONTH_OPTIONS: readonly OverviewBillMonthOption[] = [
  { id: '2025-02', label: 'Feb 2025' },
  { id: '2026-01', label: 'Jan 2026' },
  { id: '2025-12', label: 'Dec 2025' },
];

export const OVERVIEW_BILL_LANGUAGE_OPTIONS: readonly OverviewBillLanguageOption[] = [
  { id: 'en', label: 'English' },
  { id: 'zh-cn', label: '简体中文' },
];

export const OVERVIEW_BILL_HEADER_OPTIONS: readonly OverviewBillHeaderOption[] = [
  { id: 'team-name', labelKey: 'Overview Bill Header Use Team Name' },
];

export const OVERVIEW_BILL_GENERATION_RECORDS: readonly OverviewBillGenerationRecord[] = [
  {
    id: '2025-02',
    title: '2025年2月账单',
    timezoneLabel: 'UTC+8',
    languageLabel: 'English',
    operatorName: 'Minki',
    operatorEmailMasked: 'm******i@cregis.io',
    generatedAt: '2026-11-05 09:55:52',
  },
  {
    id: '2026-01',
    title: '2026年1月账单',
    timezoneLabel: 'UTC+8',
    languageLabel: 'English',
    operatorName: 'Minki',
    operatorEmailMasked: 'm******i@cregis.io',
    generatedAt: '2026-02-01 09:12:08',
  },
  {
    id: '2025-12',
    title: '2025年12月账单',
    timezoneLabel: 'UTC+8',
    languageLabel: 'English',
    operatorName: 'Minki',
    operatorEmailMasked: 'm******i@cregis.io',
    generatedAt: '2025-12-28 16:40:11',
  },
];
