export type TransactionRecordsExportScope = 'filtered' | 'all';

export type TransactionRecordsExportPresetId =
  | 'custom'
  | 'last-3-months'
  | 'last-6-months'
  | 'last-year';

export type TransactionRecordsExportHistoryStatus = 'loading' | 'ready';

export type TransactionRecordsExportHistoryItem = {
  id: string;
  title: string;
  /** Optional second line (e.g. monthly statement timezone). */
  subtitle?: string;
  operator: string;
  exportedAt: string;
  status?: TransactionRecordsExportHistoryStatus;
};

export const TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO =
  'Minki (m*******@cregis.io)';

export function formatExportHistoryTitle(startKey: string, endKey: string): string {
  const formatKey = (key: string) => key.trim().replaceAll('-', '/');
  return `测试团队 ${formatKey(startKey)}~${formatKey(endKey)}`;
}

export function formatExportHistoryTimestamp(now = new Date()): string {
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
}

export const TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_LABEL_KEYS = {
  'last-3-months': 'Last 3 Months',
  'last-6-months': 'Last 6 Months',
  'last-year': 'Last Year',
} as const;

export type TransactionRecordsExportQuickPresetId =
  keyof typeof TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_LABEL_KEYS;

export const TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_IDS: readonly TransactionRecordsExportQuickPresetId[] =
  ['last-3-months', 'last-6-months', 'last-year'];

export const TRANSACTION_RECORDS_EXPORT_HISTORY_DEMO: readonly TransactionRecordsExportHistoryItem[] =
  [
    {
      id: 'exp-1',
      title: '测试团队 2026/04/01~2026/09/30',
      operator: TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO,
      exportedAt: '2026-09-30 11:10:15',
      status: 'ready',
    },
    {
      id: 'exp-2',
      title: '测试团队 2025/10/01~2026/03/31',
      operator: TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO,
      exportedAt: '2026-04-01 09:22:08',
      status: 'ready',
    },
    {
      id: 'exp-3',
      title: '测试团队 2025/04/01~2025/09/30',
      operator: TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO,
      exportedAt: '2025-10-01 14:05:33',
      status: 'ready',
    },
    {
      id: 'exp-4',
      title: '测试团队 2024/10/01~2025/03/31',
      operator: 'T_tester (s*******@foxmail.com)',
      exportedAt: '2025-04-02 10:18:47',
      status: 'ready',
    },
  ];

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

export function formatExportDateRangeValue(startKey: string, endKey: string): string {
  return `${startKey},${endKey}`;
}

export function parseExportDateRangeValue(raw: string): { start: string; end: string } {
  const [start = '', end = ''] = raw.trim().split(',');
  return { start, end };
}

export function resolveExportPresetRange(
  presetId: TransactionRecordsExportQuickPresetId,
  now = new Date(),
): { start: string; end: string } {
  const endDate = startOfDay(now);
  const startDate =
    presetId === 'last-3-months'
      ? addMonths(endDate, -3)
      : presetId === 'last-6-months'
        ? addMonths(endDate, -6)
        : addMonths(endDate, -12);
  return {
    start: toDateKey(startDate),
    end: toDateKey(endDate),
  };
}

export function resolveDefaultExportDateRange(now = new Date()): {
  start: string;
  end: string;
} {
  const endDate = startOfDay(now);
  const startDate = addMonths(endDate, -2);
  return {
    start: toDateKey(startDate),
    end: toDateKey(endDate),
  };
}
