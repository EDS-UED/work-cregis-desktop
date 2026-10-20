/**
 * Cregis Desktop — Engineering Files (Desktop) shell + module screens
 * Apply_NavBar 72px + Apply_Module Menu 240px + page patterns (refresh / empty / no-permission)
 */

import { EDS_ICONS } from './eds-icons.js';

const state = {
  module: 'manage',
  walletId: 'w1',
  mainTab: 'tokens',
  tasksView: 'signing',
  paymentView: 'record',
  riskView: 'policy',
  manageView: 'balance',
  refreshState: 'idle', // idle | loading | done
  billYear: 2026,
  billsExpanded: false,
  yearMenu: false,
  filterMenu: false,
  filterTypes: null,
  txPage: 1,
  alertEnabled: false,
  alertThreshold: '',
  alertNotify: { abc: true, a12: true, op: false },
  statementTz: 'UTC+8',
  statementLang: 'English',
  statementHeader: 'team',
};

const NAV = [
  { id: 'wallet', label: 'Wallet', eds: 'Wallet' },
  { id: 'tasks', label: 'Tasks', eds: 'Tasks' },
  { id: 'waas', label: 'WaaS', eds: 'WaaS' },
  { id: 'payment', label: 'Payment Engine', eds: 'Payment Engine' },
  { id: 'report', label: 'Report', eds: 'Report' },
  { id: 'risk', label: 'Risk Control', eds: 'Risk Control' },
  { id: 'manage', label: 'Manage', eds: 'Manage' },
  { id: 'market', label: 'Marketplace', eds: 'Marketplace' },
  { id: 'cspn', label: 'CSPN', branded: true },
];

function edsIcon(name, filled = false) {
  const set = EDS_ICONS[name];
  if (!set?.length) return '';
  return set[filled && set[1] ? 1 : 0] || set[0] || '';
}

function edsMenuIcon(name) {
  return `<span class="menu-link__icon"><img src="./assets/eds/menu/${name}.svg" alt="" width="16" height="16"></span>`;
}

const WALLETS = [
  { id: 'w1', name: '1234', sign: 'Single-Sign', mpc: true, balance: '$ 22.06' },
  { id: 'w2', name: 'test single', sign: 'Single-Sign', mpc: true, balance: '$ 0' },
  { id: 'w3', name: 'testing', sign: 'Multi-Sign', mpc: true, balance: '$ 71.51' },
];

const TOKENS = [
  { id: 'usdt', symbol: 'USDT', name: 'Tether USD', icon: 'usdt', amount: '19.9999', usd: '≈ $ 19.99', available: '19.9999', processing: '0', collectible: '0', multichain: true },
  { id: 'trx', symbol: 'TRX', name: 'TRON', icon: 'trx', amount: '10', usd: '≈ $ 2.07', available: '10', processing: '0', collectible: '0', multichain: false },
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', icon: 'usdc', amount: '0', usd: '≈ $ 0', available: '0', processing: '0', collectible: '0', multichain: true },
  { id: 'tbnb', symbol: 'TBNB', name: 'BNB Smart Chain', icon: 'tbnb', amount: '0', usd: '≈ $ 0', available: '0', processing: '0', collectible: '0', multichain: false },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: 'eth', amount: '0', usd: '≈ $ 0', available: '0', processing: '0', collectible: '0', multichain: true },
  { id: 'matic', symbol: 'MATIC', name: 'Polygon', icon: 'matic', amount: '0', usd: '≈ $ 0', available: '0', processing: '0', collectible: '0', multichain: false },
  { id: 'uni', symbol: 'UNI', name: 'Uniswap', icon: 'uni', amount: '0', usd: '≈ $ 0', available: '0', processing: '0', collectible: '0', multichain: false },
];

const SIGNING = [
  { id: 's1', user: 'jojo', sign: 'Single-Sign', icon: 'usdt', alert: true, desc: 'Apply for 【 TEjHJQ...S3Yp6Y 】 pay 1 USDT-TRC20#Shasta', time: '2026-07-28 15:08:21' },
  { id: 's2', user: 'Minki', sign: 'Multi-Sign', icon: 'trx', alert: false, desc: 'Apply for 【 TXk9mQ...a2Fx7K 】 pay 10 TRX#Nile', time: '2026-07-28 14:22:05' },
  { id: 's3', user: 'jojo', sign: 'Single-Sign', icon: 'usdt', alert: true, desc: 'Apply for 【 0x8894...7D7955 】 pay 0.5 USDT-ERC20', time: '2026-07-28 11:40:18' },
  { id: 's4', user: 'System', sign: 'Multi-Sign', icon: 'trx', alert: false, desc: 'Apply for 【 TEjHJQ...S3Yp6Y 】 pay 2 TRX#Shasta', time: '2026-07-27 19:03:44' },
  { id: 's5', user: 'Minki', sign: 'Single-Sign', icon: 'usdt', alert: false, desc: 'Apply for 【 TXk9mQ...a2Fx7K 】 pay 3 USDT-TRC20#Shasta', time: '2026-07-27 09:15:02' },
  { id: 's6', user: 'jojo', sign: 'Multi-Sign', icon: 'usdt', alert: true, desc: 'Apply for 【 0x8335...A02913 】 pay 12 USDT-BEP20', time: '2026-07-26 16:48:33' },
  { id: 's7', user: 'Dana', sign: 'Single-Sign', icon: 'trx', alert: false, desc: 'Apply for 【 TEjHJQ...S3Yp6Y 】 pay 1 TRX#Shasta', time: '2026-07-26 08:01:11' },
];

const TX_RECORDS = [
  { date: '2026-07-28', time: '15:06:15', token: 'USDT-TRC2...', network: 'TRON#...', path: '123 -> TEjH...Yp6Y', icon: 'usdt', txid: '2f0c...91ce', wallet: '1234', type: 'Manual Wallet Sent', dir: 'Sent', amount: '0.0001', usd: '$ 0' },
  { date: '2026-07-28', time: '14:22:05', token: 'TRX', network: 'TRON#...', path: 'testing -> TXk9...Fx7K', icon: 'trx', txid: 'a91b...22aa', wallet: 'testing', type: 'Standard Receive', dir: 'Received', amount: '10', usd: '$ 2.07' },
  { date: '2026-07-27', time: '19:03:44', token: 'USDT-TRC2...', network: 'TRON#...', path: '1234 -> TEjH...Yp6Y', icon: 'usdt', txid: '77ef...11b0', wallet: '1234', type: 'Manual Wallet Sent', dir: 'Sent', amount: '1', usd: '$ 1.00' },
  { date: '2026-07-27', time: '09:15:02', token: 'USDT-TRC2...', network: 'TRON#...', path: 'TEjH...Yp6Y -> 1234', icon: 'usdt', txid: 'c0de...88f1', wallet: '1234', type: 'Standard Receive', dir: 'Received', amount: '5', usd: '$ 5.00' },
  { date: '2026-07-26', time: '16:48:33', token: 'TRX', network: 'TRON#...', path: 'testing -> TXk9...Fx7K', icon: 'trx', txid: 'b12a...0091', wallet: 'testing', type: 'Manual Wallet Sent', dir: 'Sent', amount: '2', usd: '$ 0.41' },
  { date: '2026-07-26', time: '08:01:11', token: 'USDT-TRC2...', network: 'TRON#...', path: '123 -> TEjH...Yp6Y', icon: 'usdt', txid: 'd4e5...77ac', wallet: '1234', type: 'Standard Receive', dir: 'Received', amount: '0.33', usd: '$ 0.33' },
  { date: '2026-07-25', time: '21:12:09', token: 'TRX', network: 'TRON#...', path: 'testing -> TXk9...Fx7K', icon: 'trx', txid: 'e901...55bb', wallet: 'testing', type: 'Manual Wallet Sent', dir: 'Sent', amount: '1', usd: '$ 0.21' },
  { date: '2026-07-25', time: '11:40:18', token: 'USDT-TRC2...', network: 'TRON#...', path: '1234 -> TEjH...Yp6Y', icon: 'usdt', txid: 'f0a1...33cd', wallet: '1234', type: 'Manual Wallet Sent', dir: 'Sent', amount: '0.5', usd: '$ 0.50' },
  { date: '2026-07-24', time: '17:03:00', token: 'USDT-TRC2...', network: 'TRON#...', path: 'TEjH...Yp6Y -> 1234', icon: 'usdt', txid: '1122...aabb', wallet: '1234', type: 'Standard Receive', dir: 'Received', amount: '8', usd: '$ 8.00' },
  { date: '2026-07-24', time: '09:50:00', token: 'TRX', network: 'TRON#...', path: 'testing -> TXk9...Fx7K', icon: 'trx', txid: '3344...ccdd', wallet: 'testing', type: 'Manual Wallet Sent', dir: 'Sent', amount: '3', usd: '$ 0.62' },
  { date: '2026-07-23', time: '15:22:41', token: 'USDT-TRC2...', network: 'TRON#...', path: '123 -> TEjH...Yp6Y', icon: 'usdt', txid: '5566...eeff', wallet: '1234', type: 'Standard Receive', dir: 'Received', amount: '2.5', usd: '$ 2.50' },
  { date: '2026-07-23', time: '10:08:17', token: 'TRX', network: 'TRON#...', path: 'testing -> TXk9...Fx7K', icon: 'trx', txid: '7788...0011', wallet: 'testing', type: 'Manual Wallet Sent', dir: 'Sent', amount: '0.1', usd: '$ 0.02' },
];

const PAYMENTS = [
  { order: '0x9a2f8c1d4e7b6035a891c2f0d6e4b178...', pid: 'po146821903', amount: '10 USD', status: 'Paid_partial', crypto: '7.0 USDT-TRC20#Shasta', txid: '2f0c91ceab11...', time: '2026-07-29 11:36:41' },
  { order: '0x11aa22bb33cc44dd55ee66ff77889900...', pid: 'po146821910', amount: '16.25 USD', status: 'Paid', crypto: '16.25 USDT-TRC20#Shasta', txid: 'a91b22aa0091...', time: '2026-07-29 10:12:08' },
];

const POLICIES = [
  { id: 'p1', name: '测试主用项目', enabled: true, code: 'PO1453113962233856', priority: 1, type: 'API Payout' },
  { id: 'p2', name: 'An测试', enabled: false, code: 'PO1453113962233861', priority: 2, type: 'Manual Transfer' },
  { id: 'p3', name: 'Treasury Guard', enabled: false, code: 'PO1453113962233870', priority: 3, type: 'API Payout' },
  { id: 'p4', name: 'Hot Wallet Cap', enabled: false, code: 'PO1453113962233882', priority: 4, type: 'Manual Transfer' },
  { id: 'p5', name: 'AML Review Gate', enabled: false, code: 'PO1453113962233895', priority: 5, type: 'API Payout' },
  { id: 'p6', name: 'Night Window Block', enabled: false, code: 'PO1453113962233901', priority: 6, type: 'Manual Transfer' },
];

const MANAGE_MENU = [
  { id: 'subscription', label: 'Team Subscription', icon: 'diamond' },
  { id: 'balance', label: 'Team Account Balance', icon: 'usd' },
  { id: 'orders', label: 'Order Management', icon: 'orders' },
  { id: 'member', label: 'Member', icon: 'member' },
  { id: 'role', label: 'Role', icon: 'role' },
  { id: 'security', label: 'Team Security', icon: 'security' },
  { id: 'api', label: 'API Manage', icon: 'api' },
];

const OP_SAM = 'Sam (Sa*****@cregis.io)';
const DEMO_TIME = '2031-12-23  10:23:00';
const DEMO_HASH = '60bfe69ce24d82dd7795722130666a4cfa34f1308120cfffdcb2a70bf295ba39';
const DEMO_ORDER = 'ORD-20311223-8821';

const TX_TYPES = [
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
  'Tron Activation Fee',
  'Tron Energy Fee',
  'Tron Bandwidth Fee',
  'AML Query',
  'Card Issuance Fee',
  'Card Transfer',
  'Card Replacement Fee',
];

const TX_DETAIL_FIELDS = {
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
  'AML Query': ['plan', 'provider', 'order', 'operator', 'time'],
  'Card Issuance Fee': ['card', 'order', 'time'],
  'Card Transfer': ['card', 'order', 'time'],
  'Card Replacement Fee': ['card', 'order', 'time'],
  'Over-limit Service Fee': ['order', 'hash', 'operator', 'time'],
  'Token Listing Application Fee': ['token', 'order', 'operator', 'time'],
  'Token Listing Rejection Refund': ['token', 'order', 'time'],
  'Custom Solution': ['plan', 'order', 'time'],
};

const BALANCE_TX = [
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
  { id: 't12', type: 'AML Query', dir: 'out', amount: '-$12.00', time: '2027-06-14  11:40:18', operator: OP_SAM, plan: 'Manual query (address / tx hash)', provider: 'Chainalysis', orderNo: 'AML-889477D7' },
  { id: 't13', type: 'Card Issuance Fee', dir: 'out', amount: '-$20.00', time: DEMO_TIME, card: 'Visa ·•• 4421', orderNo: 'CARD-ISS-4421' },
  { id: 't14', type: 'Card Transfer', dir: 'out', amount: '-$5.00', time: '2027-03-12  14:22:05', card: 'Visa ·•• 4421', orderNo: 'CARD-TRF-4421' },
  { id: 't15', type: 'Card Replacement Fee', dir: 'out', amount: '-$15.00', time: '2027-03-01  09:15:02', card: 'Visa ·•• 8830', orderNo: 'CARD-REP-8830' },
  { id: 't16', type: 'Over-limit Service Fee', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, operator: OP_SAM, orderNo: 'FEE-146821903', txid: DEMO_HASH },
  { id: 't17', type: 'Token Listing Application Fee', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, operator: OP_SAM, orderNo: DEMO_ORDER, tokenSymbol: 'USDC', tokenNetwork: 'Bitcoin' },
  { id: 't18', type: 'Token Listing Rejection Refund', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, orderNo: DEMO_ORDER, tokenSymbol: 'USDC', tokenNetwork: 'Bitcoin' },
  { id: 't19', type: 'Custom Solution', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, plan: 'Pro → Enterprise', orderNo: 'CUS-20311223' },
];

if (!state.filterTypes) state.filterTypes = [...TX_TYPES];

const MONTHLY_BILLS = {
  2026: [
    { id: 'b26-01', title: 'Bill for 2026 Jan', month: 'January, 2026', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b26-02', title: 'Bill for 2026 Feb', month: 'February, 2026', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b26-03', title: 'Bill for 2026 Mar', month: 'March, 2026', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b26-04', title: 'Bill for 2026 Apr', month: 'April, 2026', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b26-05', title: 'Bill for 2026 May', month: 'May, 2026', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b26-06', title: 'Bill for 2026 Jun', month: 'June, 2026', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b26-07', title: 'Bill for 2026 Jul', month: 'July, 2026', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b26-08', title: 'Bill for 2026 Aug', month: 'August, 2026', meta: 'UTC+8· Date Generated:2026-05-01' },
  ],
  2025: [
    { id: 'b25-01', title: 'Bill for 2025 Jan', month: 'January, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-02', title: 'Bill for 2025 Feb', month: 'February, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-03', title: 'Bill for 2025 Mar', month: 'March, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-04', title: 'Bill for 2025 Apr', month: 'April, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-05', title: 'Bill for 2025 May', month: 'May, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-06', title: 'Bill for 2025 Jun', month: 'June, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-07', title: 'Bill for 2025 Jul', month: 'July, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-08', title: 'Bill for 2025 Aug', month: 'August, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-09', title: 'Bill for 2025 Sep', month: 'September, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-10', title: 'Bill for 2025 Oct', month: 'October, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-11', title: 'Bill for 2025 Nov', month: 'November, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
    { id: 'b25-12', title: 'Bill for 2025 Dec', month: 'December, 2025', meta: 'UTC+8· Date Generated:2026-05-01' },
  ],
};

const ALERT_MEMBERS = [
  { id: 'abc', name: 'ABC (Admin)', email: 'abc@cregis.io' },
  { id: 'a12', name: 'A12 (Admin)', email: 'a12@cregis.io' },
  { id: 'op', name: '456 (Operation)', email: 'ops@cregis.io' },
];

const STATEMENT_TZ = ['UTC-12', 'UTC-8', 'UTC+0', 'UTC+8', 'UTC+9'];
const STATEMENT_LANG = ['English', '简体中文', '繁體中文'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const STATEMENT_COPY = {
  English: {
    docTitle: 'Monthly Statement',
    docKicker: 'Account Statement',
    client: 'Client Information',
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
    colType: 'Type',
    colIn: 'Credit',
    colOut: 'Debit',
    colBal: 'Balance',
    total: 'Period Total',
    disclaimer: 'DISCLAIMER',
    download: 'Download PDF',
    close: 'Close',
    notes: [
      {
        title: 'Data Basis & Timezone',
        body: 'This statement is generated by the Cregis system based on the user\'s configured "Accounting Timezone". All transaction record timestamps are presented in this timezone ({tz}).',
      },
      {
        title: 'Pricing Unit & Asset Conversion',
        body: 'All amounts in this statement are denominated in USD. Team top-ups are recorded on a "stablecoin basis": 1 USDT is treated as 1 USD for ledgering purposes. Cregis does not provide fiat currency exchange services. The user acknowledges and agrees that Cregis does not assume FX fluctuation risk between cryptocurrencies and fiat currencies, and is not responsible for the market value stability of decentralized assets.',
      },
      {
        title: 'Service Fees & Charges',
        body: 'All fees listed in this statement (including but not limited to team subscription fees and AML compliance screening fees) are charged in accordance with the Cregis service agreement. Once an AML screening is triggered and recorded as completed, the associated fee is irreversible and will not be refunded or offset regardless of the screening result.',
      },
      {
        title: 'Legal Effect & Dispute Handling',
        body: 'This statement is a transaction summary generated from existing system data and is provided for internal corporate reconciliation only. It does not constitute an audit report, tax filing evidence, or any legally binding financial certificate. If you dispute any content, please contact Cregis support within 30 days from the statement generation date; failure to submit a written dispute within this period will be deemed as confirmation and acceptance of the entire statement.',
      },
      {
        title: 'Blockchain Disclaimer',
        body: 'Due to the decentralized nature of blockchain networks, uncontrollable factors such as network congestion, node delays, or consensus mechanism adjustments may occur. Cregis is not responsible for transaction time deviations or data synchronization delays caused by such factors. For on-chain asset transfers, the final outcome shall be subject to the original data shown on the relevant blockchain explorer.',
      },
      {
        title: 'Confidentiality & Data Security',
        body: 'This statement contains sensitive corporate financial data and is highly confidential. Cregis is only responsible for sending it to the secure email addresses designated by the user. Cregis shall not be liable for any data leakage or damages caused by improper access control on the user side, mailbox compromise, or unauthorized forwarding.',
      },
    ],
  },
  简体中文: {
    docTitle: '月度账单',
    docKicker: '账户账单',
    client: '客户信息',
    teamName: '团队名称',
    teamId: '团队编号',
    period: '账单周期',
    billInfo: '账单信息',
    generated: '生成时间',
    timezone: '账务时区',
    currency: '结算币种',
    topup: '充值合计',
    spend: '消费合计',
    ending: '期末结余',
    details: '交易明细',
    colDate: '日期',
    colType: '类型',
    colIn: '收入',
    colOut: '支出',
    colBal: '结余',
    total: '本期合计',
    disclaimer: '免责声明',
    download: '下载 PDF',
    close: '关闭',
    notes: [
      {
        title: '数据基准与时区',
        body: '本账单由 Cregis 系统依据用户配置的「账务时区」自动生成。所有交易记录时间戳均按该时区（{tz}）展示。',
      },
      {
        title: '计价单位与资产折算',
        body: '本账单全部金额以 USD 计价。团队充值按「稳定币平价」入账：1 USDT 记为 1 USD。Cregis 不提供法币兑换服务。用户知悉并同意，Cregis 不承担加密资产与法币之间的汇率波动风险，亦不对去中心化资产的市值稳定性负责。',
      },
      {
        title: '服务费用与扣费',
        body: '本账单所列费用（包括但不限于团队订阅费、AML 合规筛查费）均按 Cregis 服务协议收取。AML 筛查一经触发并记录为完成，相关费用不可撤销，不论筛查结果如何均不予退款或抵扣。',
      },
      {
        title: '法律效力与异议处理',
        body: '本账单系根据系统既有数据生成的交易汇总，仅供企业内部对账参考，不构成审计报告、报税凭证或任何具法律约束力的财务证明。如对内容有异议，请自账单生成日起 30 日内联系 Cregis 支持；逾期未提交书面异议，视为确认并接受本账单全部内容。',
      },
      {
        title: '区块链免责',
        body: '因区块链网络去中心化特性，可能出现网络拥堵、节点延迟或共识机制调整等不可控因素。Cregis 不对因此导致的交易时间偏差或数据同步延迟承担责任。链上资产转移最终结果以相应区块链浏览器原始数据为准。',
      },
      {
        title: '保密与数据安全',
        body: '本账单含企业敏感财务数据，属高度机密。Cregis 仅负责发送至用户指定的安全邮箱。因用户侧访问控制不当、邮箱被盗或擅自转发造成的数据泄露或损失，Cregis 不承担责任。',
      },
    ],
  },
  繁體中文: {
    docTitle: '月度賬單',
    docKicker: '賬戶賬單',
    client: '客戶資訊',
    teamName: '團隊名稱',
    teamId: '團隊編號',
    period: '賬單週期',
    billInfo: '賬單資訊',
    generated: '生成時間',
    timezone: '帳務時區',
    currency: '結算幣種',
    topup: '充值合計',
    spend: '消費合計',
    ending: '期末結餘',
    details: '交易明細',
    colDate: '日期',
    colType: '類型',
    colIn: '收入',
    colOut: '支出',
    colBal: '結餘',
    total: '本期合計',
    disclaimer: '免責聲明',
    download: '下載 PDF',
    close: '關閉',
    notes: [
      {
        title: '數據基準與時區',
        body: '本賬單由 Cregis 系統依據用戶配置的「帳務時區」自動生成。所有交易記錄時間戳均按該時區（{tz}）展示。',
      },
      {
        title: '計價單位與資產折算',
        body: '本賬單全部金額以 USD 計價。團隊充值按「穩定幣平價」入賬：1 USDT 記為 1 USD。Cregis 不提供法幣兌換服務。用戶知悉並同意，Cregis 不承擔加密資產與法幣之間的匯率波動風險，亦不對去中心化資產的市值穩定性負責。',
      },
      {
        title: '服務費用與扣費',
        body: '本賬單所列費用（包括但不限於團隊訂閱費、AML 合規篩查費）均按 Cregis 服務協議收取。AML 篩查一經觸發並記錄為完成，相關費用不可撤銷，不論篩查結果如何均不予退款或抵扣。',
      },
      {
        title: '法律效力與異議處理',
        body: '本賬單係根據系統既有數據生成的交易彙總，僅供企業內部對賬參考，不構成審計報告、報稅憑證或任何具法律約束力的財務證明。如對內容有異議，請自賬單生成日起 30 日內聯繫 Cregis 支援；逾期未提交書面異議，視為確認並接受本賬單全部內容。',
      },
      {
        title: '區塊鏈免責',
        body: '因區塊鏈網絡去中心化特性，可能出現網絡擁堵、節點延遲或共識機制調整等不可控因素。Cregis 不對因此導致的交易時間偏差或數據同步延遲承擔責任。鏈上資產轉移最終結果以相應區塊鏈瀏覽器原始數據為準。',
      },
      {
        title: '保密與數據安全',
        body: '本賬單含企業敏感財務數據，屬高度機密。Cregis 僅負責發送至用戶指定的安全郵箱。因用戶側訪問控制不當、郵箱被盜或擅自轉發造成的數據洩露或損失，Cregis 不承擔責任。',
      },
    ],
  },
};

const STMT_TYPE = {
  recharge: { English: 'Recharge', 简体中文: '充值', 繁體中文: '充值', kind: 'in' },
  tron: { English: 'Tron Energy', 简体中文: 'Tron 能量费', 繁體中文: 'Tron 能量費', kind: 'out' },
  renew: { English: 'Subscription Renewal', 简体中文: '团队版本续费', 繁體中文: '團隊版本續費', kind: 'out' },
  aml: { English: 'AML Check', 简体中文: 'AML 查询', 繁體中文: 'AML 查詢', kind: 'out' },
  upgrade: { English: 'Plan Upgrade', 简体中文: '团队版本升级', 繁體中文: '團隊版本升級', kind: 'out' },
};

const STMT_APR_LINES = [
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

function stmtCopy() {
  return STATEMENT_COPY[state.statementLang] || STATEMENT_COPY.English;
}

function stmtMoney(n, signed = false) {
  if (n == null) return '—';
  const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (!signed) return `$${abs}`;
  const sign = n > 0 ? '+' : n < 0 ? '-' : '';
  return `${sign} $${abs}`;
}

function billPeriod(bill) {
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

function statementDoc(bill) {
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
  const teamName = state.statementHeader === 'kyb' ? 'Acme Technology Co., Ltd.' : 'Acme Technology Co.';
  return {
    period: p.short,
    generated: bill?.id?.startsWith('b26-') ? '2026-05-01 00:00:00' : gen,
    tz: state.statementTz,
    teamName,
    teamId: 'TEAM-20250318-0042',
    recharge: 50000,
    spend: 12450.8,
    ending: rows[rows.length - 1].bal,
    rows,
    printed: p.month === 4 && p.year === 2026 ? '2026/5/12 上午10:30' : gen.replace(/-/g, '/').slice(0, 16),
  };
}

const ICONS = {
  wallet: `<svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 8h15" stroke="currentColor" stroke-width="1.4"/><circle cx="13.5" cy="12" r="1.1" fill="currentColor"/></svg>`,
  tasks: `<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="5.5" r="2" stroke="currentColor" stroke-width="1.4"/><circle cx="5.5" cy="14" r="2" stroke="currentColor" stroke-width="1.4"/><circle cx="14.5" cy="14" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M10 7.5v2.2L6.8 12.2M10 9.7l3.2 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  waas: `<svg viewBox="0 0 20 20" fill="none"><path d="M4 7.5 10 4l6 3.5v7L10 18 4 14.5v-7Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M10 10v8M4 7.5l6 3.5 6-3.5" stroke="currentColor" stroke-width="1.4"/></svg>`,
  payment: `<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4"/><path d="M10 6.5v7M7.8 8.2c.5-.7 1.3-1.1 2.2-1.1 1.4 0 2.2.8 2.2 1.8S11.4 10.5 10 10.5s-2.2.6-2.2 1.6.9 1.8 2.2 1.8c.9 0 1.6-.4 2.1-1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  report: `<svg viewBox="0 0 20 20" fill="none"><path d="M6 15V10M10 15V7M14 15v-4M17 16H3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5 4h8l3 3v9a1.5 1.5 0 01-1.5 1.5h-9.5A1.5 1.5 0 014 16V5.5A1.5 1.5 0 015.5 4" stroke="currentColor" stroke-width="1.4"/></svg>`,
  risk: `<svg viewBox="0 0 20 20" fill="none"><path d="M10 3.5 16 7v4.5c0 3-2.5 5.2-6 6-3.5-.8-6-3-6-6V7l6-3.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  manage: `<svg viewBox="0 0 20 20" fill="none"><path d="M4 7h12M4 10h12M4 13h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/></svg>`,
  market: `<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1.2" stroke="currentColor" stroke-width="1.4"/><rect x="11" y="3" width="6" height="6" rx="1.2" stroke="currentColor" stroke-width="1.4"/><rect x="3" y="11" width="6" height="6" rx="1.2" stroke="currentColor" stroke-width="1.4"/><rect x="11" y="11" width="6" height="6" rx="1.2" stroke="currentColor" stroke-width="1.4"/></svg>`,
  plus: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  approval: `<svg viewBox="0 0 20 20" fill="none"><path d="M4 12.5V7.5l6-3 6 3v5l-6 3-6-3Z" stroke="currentColor" stroke-width="1.4"/><path d="M10 8v7" stroke="currentColor" stroke-width="1.4"/></svg>`,
  signing: `<svg viewBox="0 0 20 20" fill="none"><path d="M4 15.5h5M12.5 4.5l3 3L8 15H5v-3l7.5-7.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  approved: `<svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5l2.5 2.5L9 8.5M8 13l2 2 5.5-7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  signed: `<svg viewBox="0 0 20 20" fill="none"><path d="M10 3.5 16 7v4.5c0 3-2.5 5.2-6 6-3.5-.8-6-3-6-6V7l6-3.5Z" stroke="currentColor" stroke-width="1.4"/><path d="M7.5 10.2 9.2 12l3.5-3.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  records: `<svg viewBox="0 0 20 20" fill="none"><path d="M5 5.5h10M5 10h10M5 14.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  sent: `<svg viewBox="0 0 20 20" fill="none"><path d="M4 10l12-6-4 12-2.5-4.5L4 10Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  policy: `<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10" r="2.2" stroke="currentColor" stroke-width="1.4"/><path d="M10 3.5v2.2M10 14.3v2.2M3.5 10h2.2M14.3 10h2.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  automation: `<svg viewBox="0 0 20 20" fill="none"><path d="M4.5 10a5.5 5.5 0 019.2-4M15.5 10a5.5 5.5 0 01-9.2 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M13.5 3.8v3h-3M6.5 16.2v-3h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  aml: `<svg viewBox="0 0 20 20" fill="none"><path d="M10 3.5 16 7v4.5c0 3-2.5 5.2-6 6-3.5-.8-6-3-6-6V7l6-3.5Z" stroke="currentColor" stroke-width="1.4"/><path d="M7.8 10.2h4.4M10 8v4.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  logs: `<svg viewBox="0 0 20 20" fill="none"><rect x="4" y="3.5" width="12" height="13" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  whitelist: `<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="M7.2 10.2 9 12l3.8-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  blacklist: `<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  diamond: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2.5 13.5 8 8 13.5 2.5 8 8 2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  usd: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M8 4.5v7M6.2 6.2c.4-.6 1-.9 1.8-.9 1.1 0 1.8.6 1.8 1.4S9.1 8.2 8 8.2 6.2 8.7 6.2 9.5 7 11 8 11c.7 0 1.3-.3 1.7-.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  orders: `<svg viewBox="0 0 16 16" fill="none"><path d="M4 4.5h8M4 8h8M4 11.5h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" stroke-width="1.3"/></svg>`,
  member: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.2" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 13c.6-2.2 2.3-3.5 4.5-3.5s3.9 1.3 4.5 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  role: `<svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2" stroke="currentColor" stroke-width="1.3"/><circle cx="11" cy="7.5" r="1.6" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 13c.5-1.8 1.9-2.8 3.5-2.8M8.5 13c.4-1.4 1.5-2.2 2.7-2.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  security: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2.5 13 5v3.2c0 2.5-2.1 4.4-5 5-2.9-.6-5-2.5-5-5V5l5-2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  api: `<svg viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 8h5M8 5.5v5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  notice: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 3.2c2.4 0 4.3 1.9 4.3 4.2v2.1l1 1.4H2.7l1-1.4V7.4C3.7 5.1 5.6 3.2 8 3.2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.8 12.2a1.2 1.2 0 002.4 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  recharge: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v6M5.5 8H10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  filter: `<svg viewBox="0 0 16 16" fill="none"><path d="M2.5 4h11L9.5 8.8v3.2L6.5 13.5V8.8L2.5 4Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  download: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2.5v8M8 10.5 5.2 7.7M8 10.5l2.8-2.8M3 13h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  share: `<svg viewBox="0 0 16 16" fill="none"><circle cx="12" cy="4" r="1.6" stroke="currentColor" stroke-width="1.2"/><circle cx="4" cy="8" r="1.6" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="1.6" stroke="currentColor" stroke-width="1.2"/><path d="M5.5 7.2 10.5 4.8M5.5 8.8l5 3.2" stroke="currentColor" stroke-width="1.2"/></svg>`,
  gear: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke="currentColor" stroke-width="1.3"/><path d="M8 2.5v1.4M8 12.1v1.4M2.5 8h1.4M12.1 8h1.4M4.1 4.1l1 1M10.9 10.9l1 1M11.9 4.1l-1 1M5.1 10.9l-1 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  arrowIn: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M8 12.5 4.5 9M8 12.5 11.5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowOut: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 12.5v-9M8 3.5 4.5 7M8 3.5 11.5 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevron: `<svg viewBox="0 0 12 12" fill="none"><path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  calendar: `<svg viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  user: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.2" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 13c.6-2.2 2.3-3.5 4.5-3.5s3.9 1.3 4.5 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  hash: `<svg viewBox="0 0 16 16" fill="none"><path d="M6.5 3 5 13M11.5 3 10 13M3 6.5h10.5M2.5 10h10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  closeFill: `<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#d7462d"/><path d="M7.2 7.2l5.6 5.6M12.8 7.2l-5.6 5.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function activeWallet() {
  return WALLETS.find((w) => w.id === state.walletId) || WALLETS[0];
}

function renderNav() {
  $('#nav-list').innerHTML = NAV.map((n) => {
    const active = state.module === n.id;
    if (n.branded) {
      return `
    <div class="nav__rule" aria-hidden="true"></div>
    <button class="nav__item nav__item--cspn${active ? ' is-active' : ''}" type="button" data-module="${n.id}" title="${n.label}">
      <span class="nav__icon">
        <span class="nav__cspn">
          <img class="nav__cspn-bg" src="./assets/eds/nav/cspn-bg.svg" width="20" height="20" alt="">
          <img class="nav__cspn-mark" src="./assets/eds/nav/cspn-mark.svg" width="17" height="13" alt="">
        </span>
      </span>
      <span class="nav__label nav__label--nowrap">${n.label}</span>
    </button>`;
    }
    return `
    <button class="nav__item${active ? ' is-active' : ''}" type="button" data-module="${n.id}" title="${n.label}">
      <span class="nav__icon">${edsIcon(n.eds, active)}</span>
      <span class="nav__label${n.id === 'market' ? ' nav__label--tight' : ''}">${n.label}</span>
    </button>`;
  }).join('');

  const notice = $('#nav-notice');
  const support = $('#nav-support');
  const lock = $('#nav-lock');
  if (notice) notice.innerHTML = edsIcon('Notice');
  if (support) support.innerHTML = edsIcon('Earphone');
  if (lock) lock.innerHTML = edsIcon('Lock');
}

function renderSidebar() {
  const head = $('#sidebar-head');
  const body = $('#sidebar-body');
  const fullpage = state.module === 'report' || state.module === 'waas' || state.module === 'market' || state.module === 'cspn';
  $('#app').classList.toggle('is-fullpage', fullpage);

  if (state.module === 'wallet') {
    head.innerHTML = `
      <h1 class="sidebar__title">Wallet</h1>
      <button class="sidebar__add" type="button" data-action="invite" aria-label="Add">${ICONS.plus}</button>`;
    body.innerHTML = WALLETS.map(
      (w) => `
      <button class="wallet-card${w.id === state.walletId ? ' is-active' : ''}" type="button" data-wallet="${w.id}">
        <div class="wallet-card__top">
          <span class="wallet-card__name">${w.name}</span>
          <span class="wallet-card__balance">${w.balance}</span>
        </div>
        <div class="wallet-card__meta">
          <span class="chip">${w.sign}</span>
          ${w.mpc ? '<span class="chip chip--ok">MPC Shard</span>' : ''}
        </div>
      </button>`
    ).join('');
    return;
  }

  if (state.module === 'tasks') {
    head.innerHTML = `<h1 class="sidebar__title">Tasks</h1>`;
    body.innerHTML = `
      <div class="sidebar__section">To Do</div>
      <button class="menu-link${state.tasksView === 'approval' ? ' is-active' : ''}" type="button" data-tasks="approval"><span class="menu-link__icon">${ICONS.approval}</span><span class="menu-link__text">Approval</span></button>
      <button class="menu-link${state.tasksView === 'signing' ? ' is-active' : ''}" type="button" data-tasks="signing"><span class="menu-link__icon">${ICONS.signing}</span><span class="menu-link__text">Signing</span> <span class="menu-link__badge">7</span></button>
      <div class="sidebar__section">Completed</div>
      <button class="menu-link${state.tasksView === 'approved' ? ' is-active' : ''}" type="button" data-tasks="approved"><span class="menu-link__icon">${ICONS.approved}</span><span class="menu-link__text">Approved</span></button>
      <button class="menu-link${state.tasksView === 'signed' ? ' is-active' : ''}" type="button" data-tasks="signed"><span class="menu-link__icon">${ICONS.signed}</span><span class="menu-link__text">Signed</span></button>
      <div class="sidebar__spacer"></div>
      <button class="menu-link${state.tasksView === 'all' ? ' is-active' : ''}" type="button" data-tasks="all"><span class="menu-link__icon">${ICONS.records}</span><span class="menu-link__text">All Records</span></button>
      <button class="menu-link${state.tasksView === 'sent' ? ' is-active' : ''}" type="button" data-tasks="sent"><span class="menu-link__icon">${ICONS.sent}</span><span class="menu-link__text">Sent Request</span> <span class="menu-link__badge">5</span></button>`;
    return;
  }

  if (state.module === 'payment') {
    head.innerHTML = `
      <div class="sidebar-project">
        <span class="sidebar-project__name">Doris Studio ▾</span>
        <span class="sidebar-project__dots"><span class="dot dot--bad"></span></span>
      </div>`;
    body.innerHTML = `
      <button class="menu-link${state.paymentView === 'record' ? ' is-active' : ''}" type="button" data-payment="record"><span class="menu-link__text">Payment Record</span></button>
      <button class="menu-link${state.paymentView === 'settlement' ? ' is-active' : ''}" type="button" data-payment="settlement"><span class="menu-link__text">Settlement Record</span></button>
      <button class="menu-link${state.paymentView === 'exception' ? ' is-active' : ''}" type="button" data-payment="exception"><span class="menu-link__text">Payment Exception Record</span> <span class="menu-link__dot"></span></button>
      <button class="menu-link${state.paymentView === 'callback' ? ' is-active' : ''}" type="button" data-payment="callback"><span class="menu-link__text">Callback Record</span> <span class="menu-link__dot"></span></button>
      <div class="sidebar__spacer"></div>
      <button class="menu-link${state.paymentView === 'settings' ? ' is-active' : ''}" type="button" data-payment="settings"><span class="menu-link__text">Settings</span></button>`;
    return;
  }

  if (state.module === 'risk') {
    head.innerHTML = `<h1 class="sidebar__title">Risk Control</h1>`;
    body.innerHTML = `
      <button class="menu-link${state.riskView === 'policy' ? ' is-active' : ''}" type="button" data-risk="policy"><span class="menu-link__icon">${ICONS.policy}</span><span class="menu-link__text">Policy Settings</span></button>
      <button class="menu-link${state.riskView === 'automation' ? ' is-active' : ''}" type="button" data-risk="automation"><span class="menu-link__icon">${ICONS.automation}</span><span class="menu-link__text">Automation</span></button>
      <button class="menu-link${state.riskView === 'aml' ? ' is-active' : ''}" type="button" data-risk="aml"><span class="menu-link__icon">${ICONS.aml}</span><span class="menu-link__text">AML</span></button>
      <button class="menu-link${state.riskView === 'logs' ? ' is-active' : ''}" type="button" data-risk="logs"><span class="menu-link__icon">${ICONS.logs}</span><span class="menu-link__text">Logs</span></button>
      <div class="sidebar__section">Address Book</div>
      <button class="menu-link${state.riskView === 'whitelist' ? ' is-active' : ''}" type="button" data-risk="whitelist"><span class="menu-link__icon">${ICONS.whitelist}</span><span class="menu-link__text">Whitelist</span></button>
      <button class="menu-link${state.riskView === 'blacklist' ? ' is-active' : ''}" type="button" data-risk="blacklist"><span class="menu-link__icon">${ICONS.blacklist}</span><span class="menu-link__text">Blacklist</span></button>`;
    return;
  }

  if (state.module === 'manage') {
    head.innerHTML = `<h1 class="sidebar__title">Manage</h1>`;
    const groups = [
      ['subscription', 'balance', 'orders'],
      ['member', 'role'],
      ['security', 'api'],
    ];
    body.innerHTML = groups
      .map(
        (ids, i) => `
      <div class="sidebar__group${i ? ' sidebar__group--spaced' : ''}">
        ${ids
          .map((id) => {
            const item = MANAGE_MENU.find((m) => m.id === id);
            return `<button class="menu-link${state.manageView === id ? ' is-active' : ''}" type="button" data-manage="${id}">${edsMenuIcon(item.icon)}<span class="menu-link__text">${item.label}</span></button>`;
          })
          .join('')}
      </div>`
      )
      .join('');
    return;
  }

  head.innerHTML = `<h1 class="sidebar__title">${NAV.find((n) => n.id === state.module)?.label || ''}</h1>`;
  body.innerHTML = `<div class="placeholder" style="min-height:120px;font-size:13px">No submenu</div>`;
}

function renderWallet() {
  const w = activeWallet();
  return `
    <div class="page-body--padded">
    <section class="wallet-hero">
      <div>
        <p class="wallet-hero__balance">${w.balance}</p>
        <p class="wallet-hero__label">Total Assets</p>
      </div>
      <div class="actions">
        <div class="action">
          <button class="action__btn" type="button" data-action="send"><svg viewBox="0 0 20 20" fill="none"><path d="M10 15V5M10 5l-4 4M10 5l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <span class="action__label">Send</span>
        </div>
        <div class="action">
          <button class="action__btn" type="button" data-action="receive"><svg viewBox="0 0 20 20" fill="none"><path d="M10 5v10M10 15l-4-4M10 15l4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <span class="action__label">Receive</span>
        </div>
        <div class="action">
          <button class="action__btn" type="button" data-action="receive"><svg viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 8.5h14" stroke="currentColor" stroke-width="1.5"/><circle cx="13.5" cy="12" r="1.2" fill="currentColor"/></svg></button>
          <span class="action__label">Address</span>
        </div>
      </div>
    </section>
    <div class="tabs">
      <button class="tab${state.mainTab === 'tokens' ? ' is-active' : ''}" type="button" data-main-tab="tokens">Tokens</button>
      <button class="tab${state.mainTab === 'transactions' ? ' is-active' : ''}" type="button" data-main-tab="transactions">Transactions</button>
    </div>
    ${
      state.mainTab === 'transactions'
        ? `<div class="placeholder">No transactions</div>`
        : `<div class="token-list">${TOKENS.map(
            (t) => `
          <div class="token-row">
            <div class="token-row__left">
              <span class="token-icon token-icon--${t.icon}">${t.symbol.slice(0, 1)}</span>
              <div>
                <div class="token-row__title">
                  <span class="token-row__symbol">${t.symbol}</span>
                  ${t.multichain ? '<span class="badge">Multichain</span>' : ''}
                </div>
                <p class="token-row__name">${t.name}</p>
                <p class="token-row__stats">${t.available} Available | ${t.processing} Processing | ${t.collectible} Collectible</p>
              </div>
            </div>
            <div class="token-row__right">
              <div class="token-row__amount">${t.amount}</div>
              <div class="token-row__usd">${t.usd}</div>
            </div>
          </div>`
          ).join('')}</div>`
    }
    </div>`;
}

function renderTasks() {
  if (state.tasksView !== 'signing') {
    return `
      <div class="page-head"><h1 class="page-head__title">${state.tasksView[0].toUpperCase() + state.tasksView.slice(1)}</h1></div>
      <div class="placeholder">No records</div>`;
  }
  return `
    <div class="filters-row">
      <label class="search">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 10.5 13.5 13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        <input placeholder="Sender, Receiver" />
      </label>
      <label class="date-field">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        <input placeholder="Start Time - End Time" />
      </label>
      <div class="page-tools">
        <button class="tool-btn" type="button" aria-label="Filter"><svg viewBox="0 0 20 20" fill="none"><path d="M3 5h14l-5 6v4l-4 2v-6L3 5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg></button>
        <button class="tool-btn" type="button" aria-label="Sort"><svg viewBox="0 0 20 20" fill="none"><path d="M4 6h8M4 10h10M4 14h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>
        <button class="tool-btn" type="button" aria-label="Refresh"><svg viewBox="0 0 20 20" fill="none"><path d="M4.5 10a5.5 5.5 0 019.4-3.7M15.5 10a5.5 5.5 0 01-9.4 3.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M14 3.5v3h-3M6 16.5v-3h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
    </div>
    <div class="task-list">
      ${SIGNING.map(
        (t) => `
        <div class="task-row">
          <div class="task-row__icon task-row__icon--${t.icon}">
            ${t.icon === 'usdt' ? '₮' : 'T'}
            ${t.alert ? '<span class="task-row__alert"></span>' : ''}
          </div>
          <div class="task-row__body">
            <div class="task-row__top">${t.user} <span class="badge">${t.sign}</span></div>
            <p class="task-row__desc">${t.desc}</p>
            <p class="task-row__time">${t.time}</p>
          </div>
          <button class="task-row__action" type="button" aria-label="Sign">${ICONS.signing}</button>
        </div>`
      ).join('')}
    </div>`;
}

function toolbarTools(extra = '') {
  return `
    <div class="page-toolbar__tools">
      <button class="tool-stack" type="button"><span class="tool-stack__icon">${ICONS.filter}</span><span class="tool-stack__label">Filter</span></button>
      <button class="tool-stack" type="button" data-action="refresh"><span class="tool-stack__icon">${ICONS.automation}</span><span class="tool-stack__label">Refresh</span></button>
      <button class="tool-stack" type="button"><span class="tool-stack__icon">${ICONS.download}</span><span class="tool-stack__label">Export</span></button>
      ${extra}
    </div>`;
}

function feedbackBar() {
  if (state.refreshState === 'loading') {
    return `<div class="page-feedback"><span class="page-feedback__spin" aria-hidden="true"></span></div>`;
  }
  if (state.refreshState === 'done') {
    return `<div class="page-feedback"><span class="page-feedback__ok" aria-hidden="true">✓</span>已刷新</div>`;
  }
  return '';
}

function emptyState(label = 'No data') {
  return `
    <div class="empty-state">
      <div class="empty-state__icon"><img src="./assets/eds/empty-no-data.svg" width="35" height="35" alt="" /></div>
      <p class="empty-state__text">${label}</p>
    </div>`;
}

function permState() {
  return `
    <div class="perm-state">
      <div class="perm-state__icon"><img src="./assets/eds/perm-lock.png" width="56" height="56" alt="" /></div>
      <h2 class="perm-state__title">无操作权限</h2>
      <p class="perm-state__desc">请联系管理员前往管理-成員/角色添加团队API管理可查看并处理团队API</p>
    </div>`;
}

function pagePager(total = 0) {
  return `
    <div class="page-pager">
      <div class="pager">
        <button class="pager__btn" type="button" disabled>«</button>
        <button class="pager__btn" type="button" disabled>‹</button>
        <button class="pager__btn is-active" type="button">1</button>
        <button class="pager__btn" type="button">›</button>
        <button class="pager__btn" type="button">»</button>
        <span class="pager__meta">Total ${total} Results ▾</span>
      </div>
    </div>`;
}

function renderReport() {
  return `
    <section class="page-shell">
      <header class="page-toolbar">
        <h1 class="page-toolbar__title">Order Record</h1>
        ${toolbarTools()}
      </header>
      ${feedbackBar()}
      <div class="page-body page-body--padded">
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th style="width:14%">Transaction Time</th>
                <th style="width:24%">Token | Address</th>
                <th style="width:12%">TxID</th>
                <th style="width:10%">Wallet</th>
                <th style="width:16%">Transaction Type</th>
                <th style="width:12%">Sent/Received</th>
                <th class="is-right" style="width:12%">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${TX_RECORDS.map(
                (r) => `
                <tr>
                  <td><div class="cell-stack"><span>${r.date}</span><span class="cell-muted">${r.time}</span></div></td>
                  <td>
                    <div class="cell-token">
                      <span class="token-icon token-icon--${r.icon}" style="width:28px;height:28px;font-size:10px">${r.icon === 'usdt' ? 'U' : 'T'}</span>
                      <div>
                        <div class="cell-token__meta"><strong>${r.token}</strong><span class="badge">${r.network}</span></div>
                        <div class="cell-muted">${r.path}</div>
                      </div>
                    </div>
                  </td>
                  <td class="cell-muted">${r.txid}</td>
                  <td>${r.wallet}</td>
                  <td>${r.type}</td>
                  <td>${r.dir}</td>
                  <td class="is-right"><div class="cell-stack"><strong>${r.amount}</strong><span class="cell-muted">${r.usd}</span></div></td>
                </tr>`
              ).join('')}
            </tbody>
          </table>
        </div>
      </div>
      ${pagePager(12)}
    </section>`;
}

function renderPayment() {
  if (state.paymentView === 'settlement') {
    return `
      <section class="page-shell">
        <header class="page-toolbar">
          <h1 class="page-toolbar__title">Settlement Record</h1>
          ${toolbarTools()}
        </header>
        <div class="page-body">
          <div class="table-wrap" style="border:none;border-radius:0">
            <table class="table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Creation Time ↕</th>
                  <th>Bulk Transfer ID</th>
                  <th class="is-right">Amount ↕</th>
                </tr>
              </thead>
            </table>
          </div>
          ${emptyState('No data')}
        </div>
        ${pagePager(0)}
      </section>`;
  }

  if (state.paymentView !== 'record') {
    return `
      <section class="page-shell">
        <header class="page-toolbar"><h1 class="page-toolbar__title">${state.paymentView}</h1></header>
        <div class="page-body">${emptyState('No data')}</div>
        ${pagePager(0)}
      </section>`;
  }

  return `
    <section class="page-shell">
      <header class="page-toolbar">
        <h1 class="page-toolbar__title">Payment Record</h1>
        ${toolbarTools()}
      </header>
      <div class="page-body page-body--padded">
        <div class="filters-row">
          <label class="search" style="max-width:420px;flex:1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 10.5 13.5 13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            <input placeholder="Order number, Payment number, TxID..." />
          </label>
          <div class="filter-labels">
            <button type="button">Token ↕</button>
            <button type="button">Filter ↕</button>
            <button type="button">Time ↕</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th style="width:38%">Order number | Payment ID</th>
                <th style="width:32%">order amount | Amount Received</th>
                <th style="width:30%">TxID | Creation Time</th>
              </tr>
            </thead>
            <tbody>
              ${PAYMENTS.map(
                (p) => `
                <tr>
                  <td><div class="cell-stack"><span>${p.order}</span><span class="cell-muted">${p.pid}</span></div></td>
                  <td>
                    <div class="cell-stack">
                      <div class="cell-token__meta"><strong>${p.amount}</strong>
                        <span class="tag ${p.status === 'Paid' ? 'tag--ok' : 'tag--warn'}">${p.status}</span>
                      </div>
                      <span class="cell-muted">${p.crypto}</span>
                    </div>
                  </td>
                  <td><div class="cell-stack"><span class="cell-muted">${p.txid}</span><span class="cell-muted">${p.time}</span></div></td>
                </tr>`
              ).join('')}
            </tbody>
          </table>
        </div>
        <div class="summary-bar">
          <span>Total count of completed payments <strong>1</strong></span>
          <span>Total payment amount <strong>$26.25</strong></span>
        </div>
      </div>
    </section>`;
}

function renderRisk() {
  const titles = {
    policy: 'Policy Settings',
    automation: 'Automation',
    aml: 'AML',
    logs: 'Logs',
    whitelist: 'Whitelist',
    blacklist: 'Blacklist',
  };
  if (state.riskView !== 'policy') {
    return `
      <div class="page-head"><h1 class="page-head__title">${titles[state.riskView] || 'Risk Control'}</h1></div>
      <div class="placeholder">No records</div>`;
  }
  return `
    <div class="risk-toolbar">
      <button class="tool-btn" type="button" data-action="invite" aria-label="Add">${ICONS.plus}</button>
      <div class="page-tools">
        <button class="tool-btn" type="button" aria-label="Search"><svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5" stroke="currentColor" stroke-width="1.4"/><path d="M13 13l3.5 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>
        <button class="tool-btn" type="button" aria-label="Filter"><svg viewBox="0 0 20 20" fill="none"><path d="M4 6h12M6 10h8M8 14h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>
      </div>
    </div>
    <div class="policy-list">
      ${POLICIES.map(
        (p) => `
        <div class="policy-card">
          <div class="policy-card__body">
            <div class="policy-card__top">
              <span class="policy-card__name">${p.name}</span>
              <span class="tag ${p.enabled ? 'tag--ok' : 'tag--muted'}">${p.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div class="policy-card__id">${p.code}</div>
            <div class="policy-card__meta">Priority: ${p.priority} | Policy Type: ${p.type}</div>
          </div>
          <button class="toggle${p.enabled ? ' is-on' : ''}" type="button" data-policy-toggle="${p.id}" aria-pressed="${p.enabled}" aria-label="Toggle ${p.name}"></button>
        </div>`
      ).join('')}
    </div>`;
}

function filteredTx() {
  return BALANCE_TX.filter((tx) => state.filterTypes.includes(tx.type));
}

function billList() {
  const primary = MONTHLY_BILLS[state.billYear] || [];
  if (state.billYear === 2026 && state.billsExpanded) {
    return [...primary, { yearBar: 2025 }, ...MONTHLY_BILLS[2025]];
  }
  return primary;
}

function billRowHtml(b) {
  if (b.yearBar) {
    return `<div class="bills-year-bar">${b.yearBar}</div>`;
  }
  return `
    <div class="bill-row">
      <button class="bill-row__main" type="button" data-action="download-bill" data-bill="${b.id}">
        <p class="bill-row__title">${b.title}</p>
        <p class="bill-row__meta">${state.statementTz}· Date Generated:2026-05-01</p>
      </button>
      <div class="bill-row__actions">
        <button type="button" data-action="download-bill" data-bill="${b.id}" aria-label="Download">${ICONS.download}</button>
        <button type="button" data-action="send-bill" data-bill="${b.id}" aria-label="Send statement">${ICONS.share}</button>
      </div>
    </div>`;
}

function renderManage() {
  if (state.manageView === 'api') {
    return `
      <section class="page-shell">
        <header class="page-toolbar">
          <h1 class="page-toolbar__title">API Manage</h1>
          ${toolbarTools()}
        </header>
        <div class="page-body">
          <div class="table-wrap" style="border:none;border-radius:0">
            <table class="table">
              <thead>
                <tr>
                  <th>API Name / Key</th>
                  <th>Permissions</th>
                  <th>Initiator</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
            </table>
          </div>
          ${permState()}
        </div>
        ${pagePager(0)}
      </section>`;
  }

  if (state.manageView !== 'balance') {
    const title = MANAGE_MENU.find((m) => m.id === state.manageView)?.label || 'Manage';
    return `
      <section class="page-shell">
        <header class="page-toolbar"><h1 class="page-toolbar__title">${title}</h1></header>
        <div class="page-body">${emptyState('No data')}</div>
        ${pagePager(0)}
      </section>`;
  }

  const rows = filteredTx();
  const bills = billList();
  const filterCount = state.filterTypes.length;

  return `
    <section class="balance-page page-body--padded">
      <header class="balance-hero">
        <div>
          <p class="balance-hero__label">Available Balance (USD)</p>
          <p class="balance-hero__amount">$999,910,983.35</p>
        </div>
        <div class="balance-hero__actions">
          <button class="btn-pill btn-pill--outline" type="button" data-action="balance-alert">${ICONS.notice} Balance Alert</button>
          <button class="btn-pill btn-pill--brand" type="button" data-action="recharge">${ICONS.recharge} Recharge</button>
        </div>
      </header>

      <div class="balance-stats">
        <article class="balance-stat">
          <p class="balance-stat__label">Expenses This Month</p>
          <p class="balance-stat__value">$999,910,983.35</p>
        </article>
        <article class="balance-stat">
          <p class="balance-stat__label">Expenses Last Month</p>
          <p class="balance-stat__value">$999,910,983.35</p>
        </article>
      </div>

      <div class="balance-panels">
        <section class="balance-panel balance-panel--tx">
          <div class="balance-panel__head">
            <h2 class="balance-panel__title">Transaction Details</h2>
            <div class="balance-panel__tools">
              <div class="tool-pop">
                <button class="tool-stack${state.filterMenu ? ' is-on' : ''}" type="button" data-action="toggle-filter">
                  <span class="tool-stack__icon">${ICONS.filter}${filterCount ? `<span class="tool-stack__badge">${filterCount}</span>` : ''}</span>
                  <span class="tool-stack__label">Filter</span>
                </button>
                ${
                  state.filterMenu
                    ? `<div class="filter-pop" data-keep-filter>
                        <p class="filter-pop__title">Type</p>
                        <div class="filter-pop__list">
                        ${TX_TYPES.map(
                          (t) => fieldSelect({
                            name: t,
                            extra: `data-filter-type="${t}"`,
                            checked: state.filterTypes.includes(t),
                          })
                        ).join('')}
                        </div>
                        <div class="filter-pop__foot">
                          <button type="button" data-action="filter-reset">Reset</button>
                          <button type="button" class="is-brand" data-action="filter-apply">Apply</button>
                        </div>
                      </div>`
                    : ''
                }
              </div>
              <button class="tool-stack" type="button" data-action="export-tx">
                <span class="tool-stack__icon">${ICONS.download}</span>
                <span class="tool-stack__label">Export</span>
              </button>
            </div>
          </div>
          <div class="balance-table">
            <div class="balance-table__head">
              <span>Time <span class="sort-hint">↕</span></span>
              <span class="is-right">Amount <span class="sort-hint">↕</span></span>
            </div>
            <div class="balance-table__body">
              ${
                rows.length
                  ? rows
                      .map(
                        (tx) => `
                <button class="balance-row" type="button" data-action="tx-detail" data-tx="${tx.id}">
                  <div class="balance-row__left">
                    <span class="balance-row__icon balance-row__icon--${tx.dir}">${tx.dir === 'in' ? ICONS.arrowIn : ICONS.arrowOut}</span>
                    <span class="balance-row__type">${tx.type}</span>
                  </div>
                  <div class="balance-row__right">
                    <strong>${tx.amount}</strong>
                    <span>${tx.time}</span>
                  </div>
                </button>`
                      )
                      .join('')
                  : `<div class="balance-empty">${emptyState('No matching records')}</div>`
              }
            </div>
          </div>
          <div class="balance-pager">
            <div class="pager">
              <button class="pager__btn" type="button" disabled>«</button>
              <button class="pager__btn" type="button" disabled>‹</button>
              <button class="pager__btn is-active" type="button">1</button>
              <button class="pager__btn" type="button" disabled>›</button>
              <button class="pager__btn" type="button" disabled>»</button>
              <span class="pager__meta">Total ${rows.length} Results ▾</span>
            </div>
          </div>
        </section>

        <section class="balance-panel balance-panel--bills">
          <div class="balance-panel__head balance-panel__head--bills">
            <div class="bills-title-row">
              <h2 class="balance-panel__title balance-panel__title--sm">Monthly Statement</h2>
              <div class="tool-pop">
                <button class="year-chip" type="button" data-action="toggle-year">${state.billYear} ${ICONS.chevron}</button>
                ${
                  state.yearMenu
                    ? `<div class="year-pop" data-keep-year>
                        <button type="button" data-action="set-year" data-year="2026">2026</button>
                        <button type="button" data-action="set-year" data-year="2025">2025</button>
                        <button type="button" data-action="set-year" data-year="2024">2024</button>
                      </div>`
                    : ''
                }
              </div>
            </div>
            <button class="tool-stack" type="button" data-action="bill-setting">
              <span class="tool-stack__icon">${ICONS.gear}</span>
              <span class="tool-stack__label">Setting</span>
            </button>
          </div>
          <div class="bills-year-bar">${state.billYear}</div>
          <div class="bills-list">
            ${bills.map(billRowHtml).join('')}
            ${
              state.billYear === 2026 && !state.billsExpanded
                ? `<button class="bills-earlier" type="button" data-action="earlier-bills">View earlier statements</button>`
                : `<p class="bills-end">All historical records loaded</p>`
            }
          </div>
        </section>
      </div>
    </section>`;
}

function renderMain() {
  if (state.module === 'wallet') return renderWallet();
  if (state.module === 'tasks') return renderTasks();
  if (state.module === 'report') return renderReport();
  if (state.module === 'payment') return renderPayment();
  if (state.module === 'risk') return renderRisk();
  if (state.module === 'manage') return renderManage();
  const title = NAV.find((n) => n.id === state.module)?.label || '';
  return `<div class="page-head"><h1 class="page-head__title">${title}</h1></div><div class="placeholder">Coming soon</div>`;
}

function showToast(message) {
  let el = $('#toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('is-on'), 2200);
}

const RECHARGE_ADDR = 'TCogAdKNMyU2P4HA4aiuj7ZqyZPzE2Hx2r';

function fieldSelect({ type = 'checkbox', name, note = '', extra = '', checked = false }) {
  return `
    <label class="field-select${note ? ' field-select--stack' : ''}">
      <span class="field-select__box${type === 'radio' ? ' is-radio' : ''}">
        <input type="${type}" ${extra} ${checked ? 'checked' : ''} />
      </span>
      <span class="field-select__title">
        <span class="field-select__text">${name}</span>
        ${note ? `<span class="field-select__note">${note}</span>` : ''}
      </span>
    </label>`;
}

function modalRecharge() {
  return `
    <div class="recharge">
      <header class="recharge__head">
        <h2 class="recharge__title">Recharge USDT-TRC20#Shasta</h2>
        <span class="recharge__swap" aria-hidden="true">
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M6 2.2 8.4 4.7H3.6L6 2.2Z" fill="#fff"/>
            <path d="M6 9.8 3.6 7.3h4.8L6 9.8Z" fill="#fff"/>
          </svg>
        </span>
      </header>
      <div class="recharge__body">
        <div class="recharge__qr">
          <i class="recharge__corner recharge__corner--tl"></i>
          <i class="recharge__corner recharge__corner--tr"></i>
          <i class="recharge__corner recharge__corner--bl"></i>
          <i class="recharge__corner recharge__corner--br"></i>
          <img src="./assets/eds/popup/recharge-qr.svg" width="168" height="168" alt="">
        </div>
        <p class="recharge__addr">${RECHARGE_ADDR}</p>
        <p class="recharge__note">A single recharge cannot be less than 0.01USDT-TRC20#Shasta, otherwise it will not be credited to your account.</p>
      </div>
      <div class="recharge__actions">
        <button class="recharge__btn recharge__btn--primary" type="button" data-action="copy-addr">Copy address</button>
        <button class="recharge__btn recharge__btn--ghost" type="button" data-action="close-modal">Cancel</button>
      </div>
    </div>`;
}

function reminderFooter(primary, primaryAction) {
  return `
    <div class="reminder__foot">
      <button class="btn-text" type="button" data-action="close-modal">Cancel</button>
      <button class="btn-decor" type="button" data-action="${primaryAction}">${primary}</button>
    </div>`;
}

function modalAlert() {
  return `
    <div class="reminder">
      <h2 class="reminder__title">Balance Alert Settings</h2>
      <div class="reminder__body">
        <div class="switch-row">
          <div>
            <p class="switch-row__label">Enable Balance Alert</p>
            <p class="switch-row__hint">Designated members will be notified when the balance falls below the threshold.</p>
          </div>
          <button class="switch${state.alertEnabled ? ' is-on' : ''}" type="button" data-action="toggle-alert" aria-pressed="${state.alertEnabled}"></button>
        </div>
        <label class="field-block">
          <span>Alert Threshold (USD)</span>
          <input id="alert-threshold" placeholder="Input" value="${state.alertThreshold}" />
        </label>
        <div class="field-block">
          <span>Notify To</span>
          <div class="select-box">
            ${ALERT_MEMBERS.map((m) =>
              fieldSelect({
                name: m.name,
                extra: `data-alert-member="${m.id}"`,
                checked: state.alertNotify[m.id],
              })
            ).join('')}
          </div>
        </div>
        <div class="field-block">
          <span>Notification Channels</span>
          <p class="field-hint">Supports in-app notifications, app push notifications, and email alerts.</p>
        </div>
      </div>
      ${reminderFooter('Save', 'save-alert')}
    </div>`;
}

function detailGlyph(name) {
  return `<span class="detail__glyph"><img src="./assets/eds/popup/${name}.svg" width="16" height="16" alt=""></span>`;
}

function detailCopyBtn(value, toast) {
  return `<button class="detail__copy" type="button" data-action="copy-field" data-copy="${value}" data-toast="${toast}" aria-label="Copy">
    <img src="./assets/eds/popup/copy.svg" width="12" height="12" alt="">
  </button>`;
}

function detailRow(icon, label, valueHtml, copy, toast) {
  return `
    <div class="detail__row">
      <span class="detail__label">${detailGlyph(icon)}${label}</span>
      <span class="detail__value">${valueHtml}${copy ? detailCopyBtn(copy, toast) : ''}</span>
    </div>`;
}

function detailTokenValue(tx) {
  return `<span class="detail__token">
    <span class="detail__coin">
      <img class="detail__coin-bg" src="./assets/eds/popup/usdc.svg" width="20" height="20" alt="">
      <img class="detail__coin-mark" src="./assets/eds/popup/usdc-mark.svg" alt="">
    </span>
    <span>${tx.tokenSymbol || 'USDC'}</span>
    <span class="detail__chip">${tx.tokenNetwork || 'Bitcoin'}</span>
  </span>`;
}

function modalTx(tx) {
  const time = tx.time.replace(/ {2}/g, ' ');
  const fields = TX_DETAIL_FIELDS[tx.type] || ['hash', 'time'];
  const rows = fields
    .map((key) => {
      if (key === 'hash') return detailRow('hashtag', 'Transaction Hash', tx.txid, tx.txid, 'Transaction hash copied');
      if (key === 'time') return detailRow('calendar', 'Time', time);
      if (key === 'plan') return detailRow('list-bullet', 'Plan', tx.plan);
      if (key === 'order') return detailRow('list-bullet', 'Order ID', tx.orderNo, tx.orderNo, 'Order ID copied');
      if (key === 'operator') return detailRow('user', 'Operator', tx.operator);
      if (key === 'provider') return detailRow('list-bullet', 'Provider', tx.provider);
      if (key === 'card') return detailRow('list-bullet', 'Crypto Card', tx.card);
      if (key === 'token') return detailRow('coin-trading', 'Applied Token', detailTokenValue(tx));
      return '';
    })
    .join('');
  return `
    <div class="detail">
      <div class="detail__sticky">
        <button class="detail__close" type="button" data-action="close-modal" aria-label="Close">
          <span class="detail__close-icon"><img src="./assets/eds/popup/close-circle-fill.svg" width="20" height="20" alt=""></span>
        </button>
      </div>
      <header class="detail__head">
        <p class="detail__kicker">${tx.type}</p>
        <p class="detail__amount">${tx.amount}</p>
      </header>
      <div class="detail__rule"></div>
      <div class="detail__list">${rows}</div>
    </div>`;
}

function modalBillSetting() {
  return `
    <div class="reminder">
      <h2 class="reminder__title">Team Monthly Statements Settings</h2>
      <p class="reminder__lead">Team monthly statements will be generated at the beginning of each month based on this time zone and language. Underlying system records remain unaffected.</p>
      <div class="reminder__body">
        <label class="field-block">
          <span>Financial Time Zone</span>
          <span class="field-trigger">
            <select id="stmt-tz">${STATEMENT_TZ.map((z) => `<option ${z === state.statementTz ? 'selected' : ''}>${z}</option>`).join('')}</select>
            <span class="field-trigger__arrow"><img src="./assets/eds/control/arrow-down-mini-ios.svg" width="12" height="7" alt=""></span>
          </span>
        </label>
        <label class="field-block">
          <span>Statement Language</span>
          <span class="field-trigger">
            <select id="stmt-lang">${STATEMENT_LANG.map((z) => `<option ${z === state.statementLang ? 'selected' : ''}>${z}</option>`).join('')}</select>
            <span class="field-trigger__arrow"><img src="./assets/eds/control/arrow-down-mini-ios.svg" width="12" height="7" alt=""></span>
          </span>
        </label>
        <div class="field-block">
          <span>Invoice Header</span>
          <div class="select-box">
            ${fieldSelect({
              type: 'radio',
              name: 'Use Team Name',
              note: 'Acme Technology Co.',
              extra: 'name="invoice-header" value="team"',
              checked: state.statementHeader === 'team',
            })}
            ${fieldSelect({
              type: 'radio',
              name: 'Use KYB Name',
              note: 'Acme Technology Co., Ltd.',
              extra: 'name="invoice-header" value="kyb"',
              checked: state.statementHeader === 'kyb',
            })}
          </div>
        </div>
      </div>
      ${reminderFooter('Save', 'save-bill-setting')}
    </div>`;
}

function stmtTypeBadge(type, t) {
  if (!type) return '—';
  const meta = STMT_TYPE[type];
  const label = meta?.[state.statementLang] || meta?.English || type;
  const kind = meta?.kind === 'in' ? 'in' : 'out';
  return `<span class="stmt-badge stmt-badge--${kind}">${label}</span>`;
}

function stmtDiscItems(notes, start, tz) {
  return notes
    .map(
      (n, i) =>
        `<p class="stmt-disc__item"><b>${start + i}. ${n.title}.</b> ${n.body.replace('{tz}', tz)}</p>`
    )
    .join('');
}

function modalStatement(bill) {
  const t = stmtCopy();
  const doc = statementDoc(bill);
  const lang = state.statementLang === 'English' ? 'en' : 'zh';
  const dash = (v, signed, cls) =>
    v == null ? '<span class="stmt-dash">—</span>' : `<span class="${cls}">${stmtMoney(v, signed)}</span>`;
  const kv = (label, value) => `
    <div class="stmt-kv">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>`;
  const rows = doc.rows
    .map(
      (row) => `
        <tr>
          <td>${row.time}</td>
          <td>${stmtTypeBadge(row.type, t)}</td>
          <td class="stmt-num">${dash(row.inn, true, 'stmt-in')}</td>
          <td class="stmt-num">${dash(row.out != null ? -row.out : null, true, 'stmt-out')}</td>
          <td class="stmt-num">${stmtMoney(row.bal)}</td>
        </tr>`
    )
    .join('');
  const running = `Cregis - ${doc.period}`;
  const pageFoot = (page, total = 2) => `
    <footer class="stmt-foot">
      <span>Cregis © ${doc.period.slice(-4)}. All rights reserved.</span>
      <span>${doc.teamId} · ${doc.period} · ${doc.tz}</span>
      <span>Page ${page} of ${total}</span>
    </footer>`;

  return `
    <div class="stmt-viewer" lang="${lang}">
      <div class="stmt-viewer__bar">
        <p class="stmt-viewer__title">${t.docTitle} · ${doc.period}</p>
        <div class="stmt-viewer__actions">
          <button class="btn-text" type="button" data-action="close-modal">${t.close}</button>
          <button class="btn-decor" type="button" data-action="print-statement">${t.download}</button>
        </div>
      </div>
      <div class="stmt-print">
        <article class="stmt-page">
          <p class="stmt-run">${running}</p>
          <header class="stmt-head">
            <div class="stmt-logo">
              <span class="stmt-logo__c" aria-hidden="true"></span>
              <span class="stmt-logo__word">CREGIS</span>
            </div>
            <div class="stmt-head__title">
              <h1>${t.docTitle}</h1>
              <p>${t.docKicker}</p>
            </div>
          </header>
          <div class="stmt-rule"></div>
          <div class="stmt-info">
            <section class="stmt-card">
              <h2>${t.client}</h2>
              ${kv(t.teamName, doc.teamName)}
              ${kv(t.teamId, doc.teamId)}
              ${kv(t.period, doc.period)}
            </section>
            <section class="stmt-card">
              <h2>${t.billInfo}</h2>
              ${kv(t.generated, doc.generated)}
              ${kv(t.timezone, doc.tz)}
              ${kv(t.currency, 'USD')}
            </section>
          </div>
          <div class="stmt-stats">
            <div class="stmt-stat stmt-stat--in">
              <span>${t.topup}</span>
              <strong class="stmt-in">${stmtMoney(doc.recharge, true)}</strong>
            </div>
            <div class="stmt-stat">
              <span>${t.spend}</span>
              <strong>${stmtMoney(-doc.spend, true)}</strong>
            </div>
            <div class="stmt-stat">
              <span>${t.ending}</span>
              <strong>${stmtMoney(doc.ending)}</strong>
            </div>
          </div>
          <section class="stmt-ledger">
            <h2 class="stmt-section"><i></i>${t.details}</h2>
            <div class="stmt-table-wrap">
              <p class="stmt-watermark">CREGIS</p>
              <table class="stmt-table">
                <thead>
                  <tr>
                    <th>${t.colDate}</th>
                    <th>${t.colType}</th>
                    <th class="stmt-num">${t.colIn}</th>
                    <th class="stmt-num">${t.colOut}</th>
                    <th class="stmt-num">${t.colBal}</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="2">${t.total}</td>
                    <td class="stmt-num stmt-in">${stmtMoney(doc.recharge, true)}</td>
                    <td class="stmt-num">${stmtMoney(-doc.spend, true)}</td>
                    <td class="stmt-num">${stmtMoney(doc.ending)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
          <section class="stmt-disc">
            <h2 class="stmt-disc__title">${t.disclaimer}</h2>
            ${stmtDiscItems(t.notes.slice(0, 1), 1, doc.tz)}
          </section>
          ${pageFoot(1)}
        </article>
        <article class="stmt-page stmt-page--notes">
          <p class="stmt-run">${running}</p>
          <section class="stmt-disc stmt-disc--cont">
            ${stmtDiscItems(t.notes.slice(1), 2, doc.tz)}
          </section>
          ${pageFoot(2)}
        </article>
      </div>
    </div>`;
}

function modalSendBill(bill) {
  return `
    <div class="reminder">
      <h2 class="reminder__title">Send Statements</h2>
      <p class="reminder__lead">Statements will be sent to team members' emails as PDF attachments (Statement for ${bill?.month || 'Month, Year'} · ${state.statementTz}).</p>
      <div class="reminder__body">
        <div class="field-block">
          <span>Select Recipients</span>
          <div class="select-box">
            ${ALERT_MEMBERS.map((m) =>
              fieldSelect({
                name: m.name.split(' (')[0],
                note: m.email,
                extra: `data-send-member="${m.id}"`,
                checked: true,
              })
            ).join('')}
          </div>
        </div>
      </div>
      ${reminderFooter('Send', 'confirm-send-bill')}
    </div>`;
}

function openModal(html, variant = 'reminder') {
  const overlay = $('#overlay');
  const modal = $('#modal');
  overlay.hidden = false;
  overlay.dataset.variant = variant;
  modal.className = `modal modal--${variant}`;
  $('#modal-close').hidden = variant !== 'sheet';
  $('#modal-body').innerHTML = html;
}
function closeModal() {
  $('#overlay').hidden = true;
  $('#modal-body').innerHTML = '';
}

function render() {
  try {
    renderNav();
    renderSidebar();
    $('#content').innerHTML = renderMain();
  } catch (err) {
    console.error('[desktop render]', err);
    const el = $('#content');
    if (el) el.innerHTML = `<div class="placeholder">Render error: ${String(err.message || err)}</div>`;
  }
}

document.addEventListener('click', (e) => {
  const mod = e.target.closest('[data-module]');
  if (mod) {
    state.module = mod.dataset.module;
    if (state.module === 'tasks') state.tasksView = 'signing';
    if (state.module === 'payment') state.paymentView = 'record';
    if (state.module === 'risk') state.riskView = 'policy';
    if (state.module === 'manage') state.manageView = 'balance';
    if (state.module === 'wallet') state.mainTab = 'tokens';
    render();
    return;
  }
  const wallet = e.target.closest('[data-wallet]');
  if (wallet) {
    state.walletId = wallet.dataset.wallet;
    render();
    return;
  }
  const tab = e.target.closest('[data-main-tab]');
  if (tab) {
    state.mainTab = tab.dataset.mainTab;
    render();
    return;
  }
  const tasks = e.target.closest('[data-tasks]');
  if (tasks) {
    state.tasksView = tasks.dataset.tasks;
    render();
    return;
  }
  const payment = e.target.closest('[data-payment]');
  if (payment) {
    state.paymentView = payment.dataset.payment;
    render();
    return;
  }
  const risk = e.target.closest('[data-risk]');
  if (risk) {
    state.riskView = risk.dataset.risk;
    render();
    return;
  }
  const manage = e.target.closest('[data-manage]');
  if (manage) {
    state.manageView = manage.dataset.manage;
    render();
    return;
  }
  const policyToggle = e.target.closest('[data-policy-toggle]');
  if (policyToggle) {
    const item = POLICIES.find((p) => p.id === policyToggle.dataset.policyToggle);
    if (item) {
      item.enabled = !item.enabled;
      render();
    }
    return;
  }
  const action = e.target.closest('[data-action]');
  if (action) {
    const a = action.dataset.action;
    if (a === 'receive' || a === 'send') {
      openModal(`
        <h2 class="modal__title">${a === 'send' ? 'Send' : 'Receive'}</h2>
        <p class="modal__desc">${activeWallet().name} · ${a === 'send' ? 'transfer assets' : 'scan to deposit'}</p>
        <div class="field"><label>Asset</label><select><option>USDT</option><option>TRX</option></select></div>
        ${a === 'send' ? '<div class="field"><label>Amount</label><input placeholder="0.00" /></div>' : ''}
        <div class="modal__footer">
          <button class="btn btn--ghost" type="button" data-action="close-modal">Close</button>
          <button class="btn btn--brand" type="button" data-action="close-modal">Continue</button>
        </div>`, 'sheet');
      return;
    }
    if (a === 'refresh') {
      state.refreshState = 'loading';
      render();
      setTimeout(() => {
        state.refreshState = 'done';
        render();
        setTimeout(() => {
          state.refreshState = 'idle';
          render();
        }, 1600);
      }, 900);
      return;
    }
    if (a === 'recharge') {
      openModal(modalRecharge(), 'recharge');
      return;
    }
    if (a === 'balance-alert') {
      openModal(modalAlert());
      return;
    }
    if (a === 'toggle-alert') {
      state.alertEnabled = !state.alertEnabled;
      openModal(modalAlert());
      return;
    }
    if (a === 'save-alert') {
      state.alertThreshold = $('#alert-threshold')?.value || '';
      $$('[data-alert-member]').forEach((el) => {
        state.alertNotify[el.dataset.alertMember] = el.checked;
      });
      closeModal();
      showToast('Balance alert settings saved');
      return;
    }
    if (a === 'copy-addr') {
      navigator.clipboard?.writeText(RECHARGE_ADDR);
      showToast('Deposit address copied');
      return;
    }
    if (a === 'copy-field' || a === 'copy-txid') {
      navigator.clipboard?.writeText(action.dataset.copy || '');
      showToast(action.dataset.toast || 'Copied');
      return;
    }
    if (a === 'toggle-filter') {
      state.filterMenu = !state.filterMenu;
      state.yearMenu = false;
      render();
      return;
    }
    if (a === 'filter-reset') {
      state.filterTypes = [...TX_TYPES];
      render();
      return;
    }
    if (a === 'filter-apply') {
      state.filterTypes = $$('[data-filter-type]:checked').map((el) => el.dataset.filterType);
      state.filterMenu = false;
      render();
      showToast('Filters updated');
      return;
    }
    if (a === 'export-tx') {
      showToast('Export started · CSV');
      return;
    }
    if (a === 'tx-detail') {
      const tx = BALANCE_TX.find((t) => t.id === action.dataset.tx);
      if (tx) openModal(modalTx(tx), 'detail');
      return;
    }
    if (a === 'toggle-year') {
      state.yearMenu = !state.yearMenu;
      state.filterMenu = false;
      render();
      return;
    }
    if (a === 'set-year') {
      const year = Number(action.dataset.year);
      state.yearMenu = false;
      if (year === 2024) {
        showToast('Generating historical statements for 2024…');
        return;
      }
      state.billYear = year;
      state.billsExpanded = year !== 2026;
      render();
      if (year === 2025) showToast('Historical statements generated');
      return;
    }
    if (a === 'earlier-bills') {
      state.billsExpanded = true;
      render();
      showToast('Historical statements generated');
      return;
    }
    if (a === 'bill-setting') {
      openModal(modalBillSetting());
      return;
    }
    if (a === 'save-bill-setting') {
      const prevTz = state.statementTz;
      state.statementTz = $('#stmt-tz')?.value || state.statementTz;
      state.statementLang = $('#stmt-lang')?.value || state.statementLang;
      state.statementHeader = $('[name="invoice-header"]:checked')?.value || 'team';
      if (prevTz !== state.statementTz) {
        state.billsExpanded = false;
        state.billYear = 2026;
      }
      closeModal();
      render();
      showToast('Statement settings saved');
      return;
    }
    if (a === 'download-bill') {
      const bill = Object.values(MONTHLY_BILLS).flat().find((b) => b.id === action.dataset.bill);
      if (bill) openModal(modalStatement(bill), 'statement');
      return;
    }
    if (a === 'print-statement') {
      document.body.classList.add('is-printing-statement');
      const done = () => document.body.classList.remove('is-printing-statement');
      window.addEventListener('afterprint', done, { once: true });
      window.print();
      showToast('Statement download started');
      return;
    }
    if (a === 'send-bill') {
      const bill = Object.values(MONTHLY_BILLS).flat().find((b) => b.id === action.dataset.bill);
      openModal(modalSendBill(bill));
      return;
    }
    if (a === 'confirm-send-bill') {
      closeModal();
      showToast('Statements sent');
      return;
    }
    if (a === 'invite') {
      openModal(`
        <h2 class="modal__title">Create wallet</h2>
        <p class="modal__desc">Add a new wallet to this team.</p>
        <div class="field"><label>Name</label><input placeholder="Wallet name" /></div>
        <div class="modal__footer">
          <button class="btn btn--ghost" type="button" data-action="close-modal">Cancel</button>
          <button class="btn btn--brand" type="button" data-action="close-modal">Create</button>
        </div>`, 'sheet');
      return;
    }
    if (a === 'close-modal') return closeModal();
  }
  if (!e.target.closest('[data-keep-filter]') && state.filterMenu) {
    state.filterMenu = false;
    render();
    return;
  }
  if (!e.target.closest('[data-keep-year]') && state.yearMenu) {
    state.yearMenu = false;
    render();
    return;
  }
  if (e.target === $('#overlay')) closeModal();
});

$('#modal-close').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

render();
