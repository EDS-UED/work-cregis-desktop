import {
  computed,
  reactive,
  ref,
  watch,
} from 'vue';
import { createDetailApplyItemRow } from '@eds/desktop-components';
import type {
  DataListItem,
  DetailSectionData,
  EgFilterCondition,
  EgFilterLogicMode,
  FlotationMenuItemPreset,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { hasActiveEgFilterConditions } from '@/scenes/shared/applyEgFilterConditions';
import type { TasksDataListSortOrder } from '@/scenes/tasks/tasksDataListSort';
import { useDataListPaginer } from '@/scenes/tasks/useDataListPaginer';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import {
  ALERT_MEMBERS,
  AVAILABLE_BALANCE,
  BALANCE_TX,
  TX_DETAIL_FIELDS,
  txDisplayTitleKey,
  billYearGroups as buildBillYearGroups,
  findBill,
  statementDoc,
  stmtCopy,
  stmtPageLabel,
  statementLangFromLocale,
  stmtMoney,
  billPeriod,
  type BalanceTx,
  type MonthlyBill,
  type StatementHeader,
  type StatementLang,
} from './teamAccountData';
import {
  buildTeamAccountFilterFields,
  txMatchesEgFilterConditions,
} from './teamAccountFilter';

export const yearItems: FlotationMenuItemPreset[] = [
  { label: '2026' },
  { label: '2025' },
  { label: '2024' },
];

const DEFAULT_ALERT_NOTIFY_IDS = new Set(['abc', 'a12']);

function memberFlagMap(isOn: (id: string) => boolean): Record<string, boolean> {
  return Object.fromEntries(ALERT_MEMBERS.map((member) => [member.id, isOn(member.id)]));
}

export const teamAccountState = reactive({
  billYear: 2026,
  billsExpanded: false,
  alertEnabled: false,
  alertThreshold: '',
  alertNotify: memberFlagMap((id) => DEFAULT_ALERT_NOTIFY_IDS.has(id)),
  statementTz: 'UTC+8',
  statementLang: 'English' as StatementLang,
  statementHeader: 'team' as StatementHeader,
  rechargeOpen: false,
  alertOpen: false,
  billSettingOpen: false,
  sendOpen: false,
  statementOpen: false,
  txDetailOpen: false,
  activeTxId: '',
  activeBillId: '',
  toast: '',
});

const draftThreshold = ref('');
const draftNotify = reactive(memberFlagMap((id) => DEFAULT_ALERT_NOTIFY_IDS.has(id)));
const draftTz = ref(teamAccountState.statementTz);
const draftLang = ref<StatementLang>(teamAccountState.statementLang);
const draftHeader = ref<StatementHeader>(teamAccountState.statementHeader);
const sendSelected = reactive(memberFlagMap(() => true));

let toastTimer = 0;

function showToast(message: string) {
  teamAccountState.toast = message;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    if (teamAccountState.toast === message) teamAccountState.toast = '';
  }, 2200);
}

export function useTeamAccountPage() {
  const { ui, locale } = useAppI18n();

  const tzItems: FlotationMenuItemPreset[] = [
    { label: 'UTC-12' },
    { label: 'UTC-8' },
    { label: 'UTC+0' },
    { label: 'UTC+8' },
    { label: 'UTC+9' },
  ];
  const langItems: FlotationMenuItemPreset[] = [
    { label: 'English' },
    { label: '简体中文' },
    { label: '繁體中文' },
  ];

  const filterConditions = ref<EgFilterCondition[]>([]);
  const filterLogicMode = ref<EgFilterLogicMode>('all');
  const filterFields = computed(() => buildTeamAccountFilterFields(ui));
  const activeSort = ref<{ key: 'time' | 'amount'; order: TasksDataListSortOrder } | null>(null);

  const filteredTx = computed(() =>
    BALANCE_TX.filter((tx) =>
      txMatchesEgFilterConditions(
        tx,
        filterConditions.value,
        filterFields.value,
        filterLogicMode.value,
      ),
    ),
  );
  const sortedTx = computed(() => {
    const sort = activeSort.value;
    const rows = filteredTx.value;
    if (!sort) return rows;
    const direction = sort.order === 'asc' ? 1 : -1;
    return [...rows].sort((left, right) => {
      const delta =
        sort.key === 'time'
          ? parseTxTime(left.time) - parseTxTime(right.time)
          : parseTxAmount(left.amount) - parseTxAmount(right.amount);
      return delta * direction;
    });
  });
  const timeSortOrder = computed(() =>
    activeSort.value?.key === 'time' ? activeSort.value.order : '',
  );
  const amountSortOrder = computed(() =>
    activeSort.value?.key === 'amount' ? activeSort.value.order : '',
  );
  const {
    settingsLevelIndex,
    settingsJumpValue,
    currentPage,
    totalRowCount,
    paginateItems,
    isManyPagination,
    manyPageItems,
    firstPagination,
    prevPagination,
    pagePagination,
    nextPagination,
    lastPagination,
    prevNavDisabled,
    nextNavDisabled,
    goFirstPage,
    goPrevPage,
    goNextPage,
    goLastPage,
    onManyPageItemClick,
    isManyPageSelected,
    onSettingsJump,
  } = useDataListPaginer(() => sortedTx.value.length);
  const pagedTx = computed(() => paginateItems(sortedTx.value));
  const txDataList = computed<DataListItem[]>(() =>
    pagedTx.value.map((tx) => ({
      id: tx.id,
      type: tx.type,
      time: tx.time,
      amount: tx.amount,
      dir: tx.dir,
    })),
  );

  watch(
    filterConditions,
    () => {
      if (hasActiveEgFilterConditions(filterConditions.value)) {
        goFirstPage();
      }
    },
    { deep: true },
  );

  const yearMenuItems = computed(() =>
    yearItems.map((item) => ({
      ...item,
      focused: Number(item.label) === teamAccountState.billYear,
    })),
  );
  const billYearGroups = computed(() =>
    buildBillYearGroups(teamAccountState.billYear, teamAccountState.billsExpanded),
  );
  const activeTx = computed(() => BALANCE_TX.find((tx) => tx.id === teamAccountState.activeTxId));
  const activeBill = computed(() => findBill(teamAccountState.activeBillId));
  const previewLang = computed(() => statementLangFromLocale(locale.value));
  const copy = computed(() => stmtCopy(previewLang.value));
  const doc = computed(() =>
    statementDoc(activeBill.value, {
      tz: teamAccountState.statementTz,
      header: teamAccountState.statementHeader,
      lang: previewLang.value,
    }),
  );
  const availableBalance = computed(() =>
    `$${formatGroupedDecimalAmount(AVAILABLE_BALANCE.replace(/[$,]/g, ''))}`,
  );

  const txSections = computed<DetailSectionData[]>(() => {
    const tx = activeTx.value;
    if (!tx) return [];
    return [{ items: txDetailItems(tx, ui) }];
  });

  function onTimeSort(order: TasksDataListSortOrder | null) {
    activeSort.value = order ? { key: 'time', order } : null;
    goFirstPage();
  }

  function onAmountSort(order: TasksDataListSortOrder | null) {
    activeSort.value = order ? { key: 'amount', order } : null;
    goFirstPage();
  }

  function exportTx() {
    showToast(ui('Export started'));
  }

  function openTx(tx: BalanceTx) {
    teamAccountState.activeTxId = tx.id;
    teamAccountState.txDetailOpen = true;
  }

  function setYear(year: number) {
    teamAccountState.billYear = year;
    teamAccountState.billsExpanded = year !== 2026;
  }

  function loadEarlier() {
    teamAccountState.billsExpanded = true;
  }

  function openAlert() {
    draftThreshold.value = sanitizeUsdThreshold(teamAccountState.alertThreshold);
    ALERT_MEMBERS.forEach((member) => {
      draftNotify[member.id] = Boolean(teamAccountState.alertNotify[member.id]);
    });
    teamAccountState.alertOpen = true;
  }

  function setDraftThreshold(value: string) {
    draftThreshold.value = sanitizeUsdThreshold(value);
  }

  function saveAlert() {
    teamAccountState.alertThreshold = sanitizeUsdThreshold(draftThreshold.value);
    ALERT_MEMBERS.forEach((member) => {
      teamAccountState.alertNotify[member.id] = Boolean(draftNotify[member.id]);
    });
    teamAccountState.alertOpen = false;
    showToast(ui('Balance alert settings saved'));
  }

  function openBillSetting() {
    draftTz.value = teamAccountState.statementTz;
    draftLang.value = teamAccountState.statementLang;
    draftHeader.value = teamAccountState.statementHeader;
    teamAccountState.billSettingOpen = true;
  }

  function saveBillSetting() {
    const prevTz = teamAccountState.statementTz;
    teamAccountState.statementTz = draftTz.value;
    teamAccountState.statementLang = draftLang.value;
    teamAccountState.statementHeader = draftHeader.value;
    if (prevTz !== teamAccountState.statementTz) {
      teamAccountState.billsExpanded = false;
      teamAccountState.billYear = 2026;
    }
    teamAccountState.billSettingOpen = false;
    showToast(ui('Statement settings saved'));
  }

  function openStatement(bill: MonthlyBill) {
    teamAccountState.activeBillId = bill.id;
    teamAccountState.statementOpen = true;
  }

  function openSend(bill: MonthlyBill) {
    teamAccountState.activeBillId = bill.id;
    ALERT_MEMBERS.forEach((member) => {
      sendSelected[member.id] = true;
    });
    teamAccountState.sendOpen = true;
  }

  function confirmSend() {
    teamAccountState.sendOpen = false;
    showToast(ui('Statements sent'));
  }

  function pageLabel(n: number) {
    return stmtPageLabel(copy.value, n, 2);
  }

  function printStatement() {
    document.body.classList.add('is-printing-statement');
    const done = () => document.body.classList.remove('is-printing-statement');
    window.addEventListener('afterprint', done, { once: true });
    window.print();
    showToast(ui('Statement download started'));
  }

  function billListTitle(bill: MonthlyBill) {
    const p = billPeriod(bill);
    const monthPart = locale.value === 'en' ? p.name : String(p.month);
    return ui('Statement for {month} {year}')
      .replace('{month}', monthPart)
      .replace('{year}', String(p.year));
  }

  function billListTitleCompact(bill: MonthlyBill) {
    const p = billPeriod(bill);
    if (locale.value === 'en') return `Statement for ${p.name.slice(0, 3)}...`;
    return ui('Statement for {month} {year}')
      .replace('{month}', 'x')
      .replace('{year}', 'xxxx');
  }

  function memberShortName(name: string) {
    return name.split(' (')[0];
  }

  function moneyCell(value: number | null, signed: boolean, cls: string) {
    if (value == null) return { text: '—', cls: 'stmtDash' };
    return { text: stmtMoney(value, signed), cls };
  }

  return {
    state: teamAccountState,
    filterConditions,
    filterLogicMode,
    filterFields,
    draftThreshold,
    setDraftThreshold,
    draftNotify,
    draftTz,
    draftLang,
    draftHeader,
    sendSelected,
    tzItems,
    langItems,
    filteredTx,
    pagedTx,
    txDataList,
    timeSortOrder,
    amountSortOrder,
    onTimeSort,
    onAmountSort,
    billYearGroups,
    yearMenuItems,
    settingsLevelIndex,
    settingsJumpValue,
    currentPage,
    totalRowCount,
    isManyPagination,
    manyPageItems,
    firstPagination,
    prevPagination,
    pagePagination,
    nextPagination,
    lastPagination,
    prevNavDisabled,
    nextNavDisabled,
    activeTx,
    activeBill,
    copy,
    previewLang,
    doc,
    availableBalance,
    txSections,
    exportTx,
    openTx,
    setYear,
    goFirstPage,
    goPrevPage,
    goNextPage,
    goLastPage,
    onManyPageItemClick,
    isManyPageSelected,
    onSettingsJump,
    loadEarlier,
    openAlert,
    saveAlert,
    openBillSetting,
    saveBillSetting,
    openStatement,
    openSend,
    confirmSend,
    pageLabel,
    printStatement,
    billListTitle,
    billListTitleCompact,
    memberShortName,
    moneyCell,
  };
}

export function sanitizeUsdThreshold(raw: string): string {
  const next = raw.replace(/[^\d.]/g, '');
  const dot = next.indexOf('.');
  if (dot === -1) return next;
  const whole = next.slice(0, dot);
  const fraction = next.slice(dot + 1).replace(/\./g, '').slice(0, 2);
  return `${whole}.${fraction}`;
}

function operatorDisplayName(operator: string): string {
  const trimmed = operator.trim();
  const paren = trimmed.indexOf(' (');
  return paren > 0 ? trimmed.slice(0, paren) : trimmed;
}

function parseTxTime(time: string): number {
  const parsed = Date.parse(time.trim().replace(/ {2}/g, ' ').replace(' ', 'T'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseTxAmount(amount: string): number {
  const trimmed = amount.trim();
  const sign = trimmed.startsWith('-') ? -1 : 1;
  const parsed = Number.parseFloat(trimmed.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? sign * parsed : 0;
}

function resolveOperatorDisplay(operator: string | undefined, ui: (key: string) => string): string {
  const raw = (operator ?? '').trim();
  if (!raw || raw === 'System') return ui('System');
  return raw;
}

function resolvePlanDisplay(tx: BalanceTx, ui: (key: string) => string): string {
  if (tx.type === 'AML Manual Query') {
    return ui('Manual query (address / tx hash)');
  }
  if (tx.type === 'AML Auto Query') {
    return ui('Automatic query (address / tx hash)');
  }
  return tx.plan ?? '';
}

function txDetailItems(tx: BalanceTx, ui: (key: string) => string) {
  const fields = TX_DETAIL_FIELDS[tx.type] ?? ['hash', 'time'];
  return fields.map((key) => {
    if (key === 'hash') {
      return createDetailApplyItemRow('txid', {
        title: ui('Transaction Hash'),
        value: tx.txid ?? '',
      });
    }
    if (key === 'time') {
      return createDetailApplyItemRow('time', {
        title: ui('Time'),
        value: tx.time.replace(/ {2}/g, ' '),
      });
    }
    if (key === 'plan') {
      return createDetailApplyItemRow('text', {
        title: ui('Plan'),
        value: resolvePlanDisplay(tx, ui),
      });
    }
    if (key === 'order') {
      return createDetailApplyItemRow('brand-number', {
        title: ui('Order ID'),
        value: tx.orderNo ?? '',
      });
    }
    if (key === 'operator') {
      const operator = resolveOperatorDisplay(tx.operator, ui);
      // Clear catalog demo email + device tooltip; name already includes email when present.
      return {
        ...createDetailApplyItemRow('initiated-by', {
          title: ui('Operator'),
          value: operator,
          valueSymbolAvatarName: operatorDisplayName(operator),
          valueSecondary: '',
        }),
        titleIcon: 'eds-user-pointer',
        valueDeviceInfo: undefined,
      };
    }
    if (key === 'provider') {
      return createDetailApplyItemRow('text', {
        title: ui('Service Provider'),
        value: tx.provider ?? '',
      });
    }
    if (key === 'batch') {
      return {
        ...createDetailApplyItemRow('brand-number', {
          key: 'batch-transfer-id',
          title: ui('Batch Transfer ID'),
          value: tx.batchTransferId ?? '',
        }),
        // Desktop forbids copy affordances; brand-number preset enables copy by default.
        showValueCopy: false,
      };
    }
    if (key === 'card') {
      return createDetailApplyItemRow('text', { title: ui('Crypto Card'), value: tx.card ?? '' });
    }
    return createDetailApplyItemRow('crypto', {
      title: ui('Applied Token'),
      value: tx.tokenSymbol || 'USDC',
      tag: tx.tokenNetwork || 'Bitcoin',
      valueSymbolCrypto: 'eds-usdc-usdcoin',
    });
  });
}
