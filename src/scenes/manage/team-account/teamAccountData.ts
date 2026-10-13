import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';

export type TxDir = 'in' | 'out';
export type TxField =
  | 'hash'
  | 'time'
  | 'plan'
  | 'order'
  | 'operator'
  | 'provider'
  | 'card'
  | 'token'
  | 'batch';
export type StatementLang = 'English' | '简体中文' | '繁體中文';
export type StatementHeader = 'team' | 'kyb';

export type BalanceTx = {
  id: string;
  type: string;
  dir: TxDir;
  amount: string;
  time: string;
  operator?: string;
  txid?: string;
  plan?: string;
  orderNo?: string;
  provider?: string;
  card?: string;
  tokenSymbol?: string;
  tokenNetwork?: string;
  batchTransferId?: string;
};

export type MonthlyBill = {
  id: string;
  title: string;
  month: string;
  meta: string;
};

export type AlertMember = { id: string; name: string; email: string; disabled?: boolean };

export type StatementNote = { title: string; body: string };

export type StatementCopy = {
  docTitle: string;
  docKicker: string;
  client: string;
  teamName: string;
  teamId: string;
  period: string;
  billInfo: string;
  generated: string;
  timezone: string;
  currency: string;
  topup: string;
  spend: string;
  ending: string;
  details: string;
  colDate: string;
  colType: string;
  colIn: string;
  colOut: string;
  colBal: string;
  total: string;
  disclaimer: string;
  download: string;
  close: string;
  rights: string;
  pageOf: string;
  notes: StatementNote[];
};

export type StmtTypeMeta = {
  English: string;
  简体中文: string;
  繁體中文: string;
  kind: TxDir;
};

export type StmtLine = { d: string; type: string | null; inn: number | null; out: number | null };


export const OP_SAM = 'Sam (Sa*****@cregis.io)';
export const DEMO_TIME = '2031-12-23  10:23:00';
export const DEMO_HASH = '60bfe69ce24d82dd7795722130666a4cfa34f1308120cfffdcb2a70bf295ba39';
export const DEMO_ORDER = 'ORD-20311223-8821';
export const RECHARGE_ADDR = 'TCogAdKNMyU2P4HA4aiuj7ZqyZPzE2Hx2r';
export const RECHARGE_NETWORKS = ['USDT-TRC20#Shasta', 'USDT-BEP20#Testnet'] as const;
export const AVAILABLE_BALANCE = '$999,910,983.35';

/** Internal type keys that exist on the client (docx §6 客户端存在=是). */
export const TX_TYPES = [
  'Recharge',
  'System Recharge',
  'System Refund',
  'Team Subscription Upgrade',
  'Team Subscription Renewal',
  'Benefits Renewal',
  'Benefits Upgrade',
  'Automation Feature Activation',
  'Benefits Expansion',
  'Token Listing Application Fee',
  'Token Listing Rejection Refund',
  'Over-limit Service Fee',
  'Custom Solution',
  'Custom Solution - Other',
  'Tron Activation Fee',
  'Tron Energy Fee',
  'Tron Bandwidth Fee',
  'AML Manual Query',
  'AML Auto Query',
  'Acquiring Service Fee',
  'Card Issuance Fee',
  'Card Transfer',
  'Card Replacement Fee',
];

/**
 * Client display title catalog key (docx §6 客户端展示类型 / §8 操作类型).
 * Multiple internal types may share one display title (e.g. AML Manual/Auto → AML Query).
 */
export const TX_DISPLAY_TITLE_KEY: Record<string, string> = {
  Recharge: 'Recharge',
  'System Recharge': 'System Recharge',
  'System Refund': 'System Refund',
  'Team Subscription Upgrade': 'Team Subscription Upgrade',
  'Team Subscription Renewal': 'Team Subscription Renewal',
  'Benefits Renewal': 'Benefits Renewal',
  'Benefits Upgrade': 'Benefits Upgrade',
  'Automation Feature Activation': 'Automation Feature Activation',
  'Benefits Expansion': 'Benefits Expansion',
  'Token Listing Application Fee': 'Token Listing Application Fee',
  'Token Listing Rejection Refund': 'Token Listing Rejection Refund',
  'Over-limit Service Fee': 'Over-limit Service Fee',
  'Custom Solution': 'Custom Solution',
  'Custom Solution - Other': 'Custom Solution',
  'Tron Activation Fee': 'Tron Activation Fee',
  'Tron Energy Fee': 'Tron Energy Fee',
  'Tron Bandwidth Fee': 'Tron Bandwidth Fee',
  'AML Manual Query': 'AML Query',
  'AML Auto Query': 'AML Query',
  'Acquiring Service Fee': 'Acquiring Service Fee',
  'Card Issuance Fee': 'Card Issuance Fee',
  'Card Transfer': 'Card Transfer',
  'Card Replacement Fee': 'Card Replacement Fee',
};

export function txDisplayTitleKey(type: string): string {
  return TX_DISPLAY_TITLE_KEY[type] ?? type;
}

/** Detail fields from docx §6 客户端额外需展示的字段. */
export const TX_DETAIL_FIELDS: Record<string, TxField[]> = {
  Recharge: ['hash', 'time'],
  'System Recharge': ['time'],
  'System Refund': ['time'],
  'Team Subscription Upgrade': ['plan', 'order', 'operator', 'time'],
  'Team Subscription Renewal': ['plan', 'order', 'operator', 'time'],
  'Benefits Renewal': ['plan', 'order', 'operator', 'time'],
  'Benefits Upgrade': ['plan', 'order', 'operator', 'time'],
  'Automation Feature Activation': ['plan', 'order', 'operator', 'time'],
  'Benefits Expansion': ['plan', 'order', 'operator', 'time'],
  'Tron Activation Fee': ['order', 'hash', 'operator', 'time'],
  'Tron Energy Fee': ['order', 'hash', 'operator', 'time'],
  'Tron Bandwidth Fee': ['order', 'hash', 'operator', 'time'],
  'AML Manual Query': ['plan', 'provider', 'order', 'operator', 'time'],
  'AML Auto Query': ['plan', 'provider', 'order', 'operator', 'time'],
  'Acquiring Service Fee': ['plan', 'batch', 'operator', 'time'],
  'Card Issuance Fee': ['card', 'order', 'time'],
  'Card Transfer': ['card', 'order', 'time'],
  'Card Replacement Fee': ['card', 'order', 'time'],
  'Over-limit Service Fee': ['order', 'hash', 'operator', 'time'],
  'Token Listing Application Fee': ['token', 'order', 'operator', 'time'],
  'Token Listing Rejection Refund': ['token', 'order', 'time'],
  'Custom Solution': ['plan', 'order', 'time'],
  'Custom Solution - Other': ['plan', 'order', 'time'],
};

const BALANCE_TX_SEED: BalanceTx[] = [
  { id: 't1', type: 'Recharge', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, operator: OP_SAM, txid: DEMO_HASH },
  { id: 't2', type: 'System Recharge', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, operator: 'System' },
  { id: 't2b', type: 'System Refund', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, operator: 'System' },
  { id: 't3', type: 'Team Subscription Upgrade', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, operator: OP_SAM, plan: 'Pro → Enterprise', orderNo: DEMO_ORDER },
  { id: 't4', type: 'Team Subscription Renewal', dir: 'out', amount: '-$1,299.00', time: '2027-07-01  00:00:00', operator: 'System', plan: 'Enterprise · Annual', orderNo: 'SUB-20270701' },
  { id: 't5', type: 'Benefits Renewal', dir: 'out', amount: '-$480.00', time: '2027-06-01  00:00:00', operator: 'System', plan: 'AML Pack · 12 months', orderNo: 'BNF-20270601' },
  { id: 't6', type: 'Benefits Upgrade', dir: 'out', amount: '-$2,400.00', time: '2027-05-18  09:11:02', operator: OP_SAM, plan: 'Standard → Premium', orderNo: 'BNF-20270518' },
  { id: 't7', type: 'Automation Feature Activation', dir: 'out', amount: '-$199.00', time: '2027-05-02  16:40:11', operator: OP_SAM, plan: 'Payment automation', orderNo: 'AUTO-20270502' },
  { id: 't8', type: 'Benefits Expansion', dir: 'out', amount: '-$800.00', time: '2027-04-21  08:01:11', operator: OP_SAM, plan: 'Member seats ×50', orderNo: 'EXP-20270421' },
  { id: 't9', type: 'Tron Activation Fee', dir: 'out', amount: '-$12.00', time: DEMO_TIME, operator: OP_SAM, orderNo: 'TRON-ACT-8821', txid: DEMO_HASH },
  { id: 't10', type: 'Tron Energy Fee', dir: 'out', amount: '-$8.50', time: '2027-04-10  11:22:00', operator: OP_SAM, orderNo: 'TRON-ENG-4410', txid: 'a91b22aa0091c8ef7795722130666a4c' },
  { id: 't11', type: 'Tron Bandwidth Fee', dir: 'out', amount: '-$3.20', time: '2027-04-09  10:08:17', operator: OP_SAM, orderNo: 'TRON-BW-4409', txid: 'c0de88f177acb12a009155bb1122aabb' },
  { id: 't12', type: 'AML Manual Query', dir: 'out', amount: '-$12.00', time: '2027-06-14  11:40:18', operator: OP_SAM, provider: 'Chainalysis', orderNo: 'AML-889477D7' },
  { id: 't12b', type: 'AML Auto Query', dir: 'out', amount: '-$6.00', time: '2027-06-13  09:12:00', operator: 'System', provider: 'Chainalysis', orderNo: 'AML-AUTO-7712' },
  { id: 't12e', type: 'Acquiring Service Fee', dir: 'out', amount: '-$45.00', time: '2027-06-10  10:00:00', operator: 'System', plan: 'Acquiring settlement', batchTransferId: 'BATCH-TRF-20270610', orderNo: 'ACQ-20270610' },
  { id: 't13', type: 'Card Issuance Fee', dir: 'out', amount: '-$20.00', time: DEMO_TIME, card: 'Visa ·•• 4421', orderNo: 'CARD-ISS-4421' },
  { id: 't14', type: 'Card Transfer', dir: 'out', amount: '-$5.00', time: '2027-03-12  14:22:05', card: 'Visa ·•• 4421', orderNo: 'CARD-TRF-4421' },
  { id: 't15', type: 'Card Replacement Fee', dir: 'out', amount: '-$15.00', time: '2027-03-01  09:15:02', card: 'Visa ·•• 8830', orderNo: 'CARD-REP-8830' },
  { id: 't16', type: 'Over-limit Service Fee', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, operator: OP_SAM, orderNo: 'FEE-146821903', txid: DEMO_HASH },
  { id: 't17', type: 'Token Listing Application Fee', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, operator: OP_SAM, orderNo: DEMO_ORDER, tokenSymbol: 'USDC', tokenNetwork: 'Bitcoin' },
  { id: 't18', type: 'Token Listing Rejection Refund', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, orderNo: DEMO_ORDER, tokenSymbol: 'USDC', tokenNetwork: 'Bitcoin' },
  { id: 't19', type: 'Custom Solution', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, plan: 'Pro → Enterprise', orderNo: 'CUS-20311223' },
  { id: 't20', type: 'Custom Solution - Other', dir: 'out', amount: '-$9,800.00', time: '2027-02-18  12:30:00', plan: 'Customized solution', orderNo: 'CUS-OTH-20311223' },
];

const TX_DEMO_TOTAL = 56;
const TX_DEMO_AMOUNTS = [5, 8.5, 12, 15, 20, 199, 480, 800, 1299, 2400, 20000];

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatTxAmount(dir: TxDir, value: number): string {
  return `${dir === 'in' ? '+' : '-'}$${formatGroupedDecimalAmount(value.toFixed(2))}`;
}

function cloneDemoTx(base: BalanceTx, index: number): BalanceTx {
  const seq = BALANCE_TX_SEED.length + index + 1;
  const date = new Date(Date.UTC(2027, 1, 28));
  date.setUTCDate(date.getUTCDate() - (index + 1));
  const time = `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}  ${pad2(8 + (index % 10))}:${pad2((index * 7) % 60)}:${pad2((index * 13) % 60)}`;
  return {
    ...base,
    id: `t${seq}`,
    time,
    amount: formatTxAmount(base.dir, TX_DEMO_AMOUNTS[index % TX_DEMO_AMOUNTS.length]),
    orderNo: base.orderNo ? `${base.orderNo}-${seq}` : undefined,
    txid: base.txid ? `${base.txid.slice(0, 24)}${seq.toString(16).padStart(8, '0')}` : undefined,
  };
}

export const BALANCE_TX: BalanceTx[] = [
  ...BALANCE_TX_SEED,
  ...Array.from({ length: TX_DEMO_TOTAL - BALANCE_TX_SEED.length }, (_, index) =>
    cloneDemoTx(BALANCE_TX_SEED[index % BALANCE_TX_SEED.length], index),
  ),
];

export const MONTHLY_BILLS: Record<number, MonthlyBill[]> = {
  2026: [
    { id: 'b26-01', title: 'Bill for 2026 Jan', month: 'January, 2026', meta: 'UTC+8' },
    { id: 'b26-02', title: 'Bill for 2026 Feb', month: 'February, 2026', meta: 'UTC+8' },
    { id: 'b26-03', title: 'Bill for 2026 Mar', month: 'March, 2026', meta: 'UTC+8' },
    { id: 'b26-04', title: 'Bill for 2026 Apr', month: 'April, 2026', meta: 'UTC+8' },
    { id: 'b26-05', title: 'Bill for 2026 May', month: 'May, 2026', meta: 'UTC+8' },
    { id: 'b26-06', title: 'Bill for 2026 Jun', month: 'June, 2026', meta: 'UTC+8' },
    { id: 'b26-07', title: 'Bill for 2026 Jul', month: 'July, 2026', meta: 'UTC+8' },
    { id: 'b26-08', title: 'Bill for 2026 Aug', month: 'August, 2026', meta: 'UTC+8' },
    { id: 'b26-09', title: 'Bill for 2026 Sep', month: 'September, 2026', meta: 'UTC+8' },
    { id: 'b26-10', title: 'Bill for 2026 Oct', month: 'October, 2026', meta: 'UTC+8' },
    { id: 'b26-11', title: 'Bill for 2026 Nov', month: 'November, 2026', meta: 'UTC+8' },
    { id: 'b26-12', title: 'Bill for 2026 Dec', month: 'December, 2026', meta: 'UTC+8' },
  ],
  2025: [
    { id: 'b25-01', title: 'Bill for 2025 Jan', month: 'January, 2025', meta: 'UTC+8' },
    { id: 'b25-02', title: 'Bill for 2025 Feb', month: 'February, 2025', meta: 'UTC+8' },
    { id: 'b25-03', title: 'Bill for 2025 Mar', month: 'March, 2025', meta: 'UTC+8' },
    { id: 'b25-04', title: 'Bill for 2025 Apr', month: 'April, 2025', meta: 'UTC+8' },
    { id: 'b25-05', title: 'Bill for 2025 May', month: 'May, 2025', meta: 'UTC+8' },
    { id: 'b25-06', title: 'Bill for 2025 Jun', month: 'June, 2025', meta: 'UTC+8' },
    { id: 'b25-07', title: 'Bill for 2025 Jul', month: 'July, 2025', meta: 'UTC+8' },
    { id: 'b25-08', title: 'Bill for 2025 Aug', month: 'August, 2025', meta: 'UTC+8' },
    { id: 'b25-09', title: 'Bill for 2025 Sep', month: 'September, 2025', meta: 'UTC+8' },
    { id: 'b25-10', title: 'Bill for 2025 Oct', month: 'October, 2025', meta: 'UTC+8' },
    { id: 'b25-11', title: 'Bill for 2025 Nov', month: 'November, 2025', meta: 'UTC+8' },
    { id: 'b25-12', title: 'Bill for 2025 Dec', month: 'December, 2025', meta: 'UTC+8' },
  ],
};

export const ALERT_NOTIFY_VISIBLE_COUNT = 4;

export const ALERT_MEMBERS: AlertMember[] = [
  { id: 'abc', name: 'ABC (Admin)', email: 'abc@cregis.io' },
  { id: 'a12', name: 'A12 (Admin)', email: 'a12@cregis.io' },
  { id: 'op', name: '456 (Operation)', email: 'ops@cregis.io' },
  { id: 'def', name: 'DEF (Finance)', email: 'def@cregis.io' },
  { id: 'g78', name: 'G78 (Viewer)', email: 'g78@cregis.io' },
  { id: 'hk9', name: 'HK9 (Operation)', email: 'hk9@cregis.io' },
  { id: 'lin', name: 'Lin (Admin)', email: 'lin@cregis.io' },
];

export const STATEMENT_TZ = ['UTC-12', 'UTC-8', 'UTC+0', 'UTC+8', 'UTC+9'];
export const STATEMENT_LANG: StatementLang[] = ['English', '简体中文', '繁體中文'];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const STATEMENT_DISCLAIMER_EN =
  'This monthly account statement is generated by Cregis\' system based on the user\'s configured "Accounting Timezone", which shall be conclusive and final in all respects. The usage is calculated on a calendar month basis. Should you wish to dispute any usage or charges herein, please provide us with proofs and details within 7 days from the date of issue, otherwise request to verify usage or dispute charges will not be accepted.\n\nAll the services and products offered are provided in accordance with the Cregis\' Standard Terms and Conditions as amended and published on our App and/or official website from time to time without prior notice.\n\nYou are deemed to accept and comply with the Cregis\' Standard Terms and Conditions when you subscribe to or use any of our services or products.';

const STATEMENT_DISCLAIMER_ZH_CN =
  '本月度账单由 Cregis 系统根据用户设定之“财务时区”自动生成，该时区应被视为最终且具决定性的依据。使用量按自然月计算。如您对本账单中的任何使用量或费用有异议，请于账单出具之日起 7 日内提供相关证明及详情，否则我们将不接受任何核实用量或争议费用的请求。\n\n我们提供的所有服务与产品，均依据 Cregis 标准条款与条件提供，该等条款与条件可能不时修订并在我们的 App 及/或官方网站上发布，恕不另行通知。\n\n当您订阅或使用我们的任何服务或产品时，即视为您已接受并同意遵守 Cregis 标准条款与条件。';

const STATEMENT_DISCLAIMER_ZH_TW =
  '本月度賬單由 Cregis 系統根據用戶設定之「財務時區」自動生成，該時區應被視為最終且具決定性的依據。使用量按自然月計算。如您對本賬單中的任何使用量或費用有異議，請於賬單出具之日起 7 日內提供相關證明及詳情，否則我們將不接受任何核實用量或爭議費用的請求。\n\n我們提供的所有服務與產品，均依據 Cregis 標準條款與條件提供，該等條款與條件可能不時修訂並在我們的 App 及/或官方網站上發布，恕不另行通知。\n\n當您訂閱或使用我們的任何服務或產品時，即視為您已接受並同意遵守 Cregis 標準條款與條件。';

export const STATEMENT_COPY: Record<StatementLang, StatementCopy> = {
  English: {
    docTitle: 'Monthly Statement',
    docKicker: 'Account Statement',
    client: 'Customer Information',
    teamName: 'Team Name',
    teamId: 'Team ID',
    period: 'Statement Period',
    billInfo: 'Statement Information',
    generated: 'Generated At',
    timezone: 'Accounting Timezone',
    currency: 'Currency',
    topup: 'Total Recharges',
    spend: 'Total Consumption',
    ending: 'Closing Balance',
    details: 'Transaction Details',
    colDate: 'Date',
    colType: 'Operation Type',
    colIn: 'Credit',
    colOut: 'Debit',
    colBal: 'Balance',
    total: 'Period Total',
    disclaimer: 'DISCLAIMER',
    download: 'Download PDF',
    close: 'Close',
    rights: 'All rights reserved.',
    pageOf: 'Page {n} of {total}',
    notes: STATEMENT_DISCLAIMER_EN.split('\n\n').map((body) => ({ title: '', body })),
  },
  简体中文: {
    docTitle: '月度账单',
    docKicker: '账单',
    client: '客户信息',
    teamName: '团队名称',
    teamId: '团队编号',
    period: '账单周期',
    billInfo: '账单信息',
    generated: '生成时间',
    timezone: '财务时区',
    currency: '结算币种',
    topup: '本期充值',
    spend: '本期消费',
    ending: '期末结余',
    details: '交易明细',
    colDate: '日期',
    colType: '操作类型',
    colIn: '充值',
    colOut: '消费',
    colBal: '结余',
    total: '本期合计',
    disclaimer: '免责声明',
    download: '下载 PDF',
    close: '关闭',
    rights: '版权所有。',
    pageOf: '第 {n} 页，共 {total} 页',
    notes: STATEMENT_DISCLAIMER_ZH_CN.split('\n\n').map((body) => ({ title: '', body })),
  },
  繁體中文: {
    docTitle: '月度賬單',
    docKicker: '賬單',
    client: '客戶資訊',
    teamName: '團隊名稱',
    teamId: '團隊編號',
    period: '賬單週期',
    billInfo: '賬單資訊',
    generated: '生成時間',
    timezone: '財務時區',
    currency: '結算幣種',
    topup: '本期充值',
    spend: '本期消費',
    ending: '期末結餘',
    details: '交易明細',
    colDate: '日期',
    colType: '操作類型',
    colIn: '充值',
    colOut: '消費',
    colBal: '結餘',
    total: '本期合計',
    disclaimer: '免責聲明',
    download: '下載 PDF',
    close: '關閉',
    rights: '版權所有。',
    pageOf: '第 {n} 頁，共 {total} 頁',
    notes: STATEMENT_DISCLAIMER_ZH_TW.split('\n\n').map((body) => ({ title: '', body })),
  },
};

export const STMT_TYPE: Record<string, StmtTypeMeta> = {
  recharge: { English: 'Recharge', 简体中文: '充值', 繁體中文: '充值', kind: 'in' },
  tron: { English: 'Tron Energy Fee', 简体中文: 'Tron 能量费', 繁體中文: 'Tron 能量費', kind: 'out' },
  renew: { English: 'Team Subscription Renewal', 简体中文: '团队版本续费', 繁體中文: '團隊版本續費', kind: 'out' },
  aml: { English: 'AML Query', 简体中文: 'AML查询', 繁體中文: 'AML 查詢', kind: 'out' },
  upgrade: { English: 'Team Subscription Upgrade', 简体中文: '团队版本升级', 繁體中文: '團隊版本升級', kind: 'out' },
};

export const STMT_APR_LINES: StmtLine[] = [
  { d: '01 00:00:00', type: null, inn: null, out: null },
  { d: '02 09:15:22', type: 'recharge', inn: 10000, out: null },
  { d: '05 14:30:00', type: 'tron', inn: null, out: 2340.5 },
  { d: '08 11:22:18', type: 'renew', inn: null, out: 500 },
  { d: '10 08:45:33', type: 'aml', inn: null, out: 125 },
  { d: '12 16:00:00', type: 'recharge', inn: 20000, out: null },
  { d: '14 10:18:47', type: 'tron', inn: null, out: 1890.3 },
  { d: '15 17:06:09', type: 'tron', inn: null, out: 904.87 },
  { d: '18 13:22:00', type: 'recharge', inn: 20000, out: null },
  { d: '20 09:10:55', type: 'upgrade', inn: null, out: 3200 },
  { d: '22 14:45:30', type: 'aml', inn: null, out: 250 },
  { d: '25 11:30:00', type: 'tron', inn: null, out: 1542.13 },
  { d: '28 16:55:22', type: 'renew', inn: null, out: 1698 },
];

export type BillListItem = MonthlyBill | { yearBar: number };

export type BillYearGroup = {
  year: number;
  bills: MonthlyBill[];
};

export function isYearBar(item: BillListItem): item is { yearBar: number } {
  return 'yearBar' in item;
}

export function billList(year: number, expanded: boolean): BillListItem[] {
  const primary = MONTHLY_BILLS[year] ?? [];
  if (year === 2026 && expanded) {
    return [...primary, { yearBar: 2025 }, ...(MONTHLY_BILLS[2025] ?? [])];
  }
  return primary;
}

export function billYearGroups(year: number, expanded: boolean): BillYearGroup[] {
  const groups: BillYearGroup[] = [{ year, bills: [...(MONTHLY_BILLS[year] ?? [])] }];
  if (year === 2026 && expanded) {
    groups.push({ year: 2025, bills: [...(MONTHLY_BILLS[2025] ?? [])] });
  }
  return groups;
}

export function findBill(id: string): MonthlyBill | undefined {
  return Object.values(MONTHLY_BILLS).flat().find((bill) => bill.id === id);
}

export function statementLangFromLocale(locale: string): StatementLang {
  if (locale === 'zh-CN') return '简体中文';
  if (locale === 'zh-TW') return '繁體中文';
  return 'English';
}

export function stmtCopy(lang: StatementLang): StatementCopy {
  return STATEMENT_COPY[lang] ?? STATEMENT_COPY.English;
}

export function stmtPeriodLabel(bill: MonthlyBill | undefined, lang: StatementLang): string {
  const p = billPeriod(bill);
  if (lang === 'English') return p.short;
  return `${p.year}年${p.month}月`;
}

export function stmtPageLabel(copy: StatementCopy, n: number, total: number): string {
  return copy.pageOf.replace('{n}', String(n)).replace('{total}', String(total));
}

export function stmtMoney(n: number | null | undefined, signed = false): string {
  if (n == null) return '—';
  const abs = formatGroupedDecimalAmount(Math.abs(n).toFixed(2));
  if (!signed) return `$${abs}`;
  const sign = n > 0 ? '+' : n < 0 ? '-' : '';
  return `${sign} $${abs}`;
}

export function billPeriod(bill?: MonthlyBill) {
  const [name, yearStr] = (bill?.month || 'April, 2026').split(', ');
  const month = Math.max(1, MONTH_NAMES.indexOf(name) + 1);
  const year = Number(yearStr) || 2026;
  return {
    year,
    month,
    name,
    short: `${MONTH_SHORT[month - 1]} ${year}`,
    pad: String(month).padStart(2, '0'),
  };
}

export type StatementDocRow = {
  time: string;
  type: string | null;
  inn: number | null;
  out: number | null;
  bal: number;
};

export type StatementDoc = {
  period: string;
  year: number;
  generated: string;
  tz: string;
  teamName: string;
  teamId: string;
  recharge: number;
  spend: number;
  ending: number;
  rows: StatementDocRow[];
  printed: string;
};

export function statementDoc(
  bill: MonthlyBill | undefined,
  options: { tz: string; header: StatementHeader; lang: StatementLang },
): StatementDoc {
  const p = billPeriod(bill);
  const opening = 999873434.15;
  let bal = opening;
  const rows = STMT_APR_LINES.map((line, i) => {
    if (i === 0) return { time: `${p.year}-${p.pad}-${line.d}`, type: null, inn: null, out: null, bal: opening };
    if (line.inn) bal += line.inn;
    if (line.out) bal -= line.out;
    return { time: `${p.year}-${p.pad}-${line.d}`, type: line.type, inn: line.inn, out: line.out, bal };
  });
  const nextMonth = p.month === 12 ? { y: p.year + 1, m: 1 } : { y: p.year, m: p.month + 1 };
  const gen = `${nextMonth.y}-${String(nextMonth.m).padStart(2, '0')}-01 00:00:00`;
  const teamName = options.header === 'kyb' ? 'Acme Technology Co., Ltd.' : 'Acme Technology Co.';
  return {
    period: stmtPeriodLabel(bill, options.lang),
    year: p.year,
    generated: bill?.id?.startsWith('b26-') ? '2026-05-01 00:00:00' : gen,
    tz: options.tz,
    teamName,
    teamId: 'TEAM-20250318-0042',
    recharge: 50000,
    spend: 12450.8,
    ending: rows[rows.length - 1].bal,
    rows,
    printed: p.month === 4 && p.year === 2026 ? '2026/5/12 上午10:30' : gen.replace(/-/g, '/').slice(0, 16),
  };
}

export function stmtTypeLabel(type: string | null, lang: StatementLang): { label: string; kind: TxDir } | null {
  if (!type) return null;
  const meta = STMT_TYPE[type];
  if (!meta) return { label: type, kind: 'out' };
  return { label: meta[lang] || meta.English, kind: meta.kind };
}
