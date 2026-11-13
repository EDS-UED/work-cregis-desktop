import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { formatWebhookCreatorDisplay } from '@/scenes/manage/webhook/webhookMockData';
import { maskDisplayEmail } from '@/utils/maskDisplayEmail';
import { MANAGE_MEMBER_MENU_ITEM, MANAGE_ROLE_MENU_ITEM } from '../manageMenuData';
import { buildManageRoleRecordRows } from '../role/roleRecordData';
import { isManageMemberRecordDeleted } from './manageMemberDeletedRecordIds';
import type { ManageMemberStatusKey } from './manageMemberStatusLabels';

const MEMBER_NICKNAME_FIXED = [
  'Joe',
  'Alex Chen',
  'Dana Wu',
  'Treasury',
] as const;

/** email-display-seed — 出仓前经 maskDisplayEmail */
const MEMBER_EMAIL_FIXED = [
  'scofeild806@gmail.com',
  'alex.chen@cregis.com',
  'dana.wu@cregis.com',
  'treasury@cregis.com',
] as const;

const MEMBER_NICKNAME_POOL = [
  'Ben',
  'Chris',
  'Ops Team',
  'Morgan Lee',
  'Sam Rivera',
  'Jordan Park',
] as const;

/** email-display-seed */
const MEMBER_EMAIL_POOL = [
  'ben@cregis.com',
  'chris@proton.me',
  'ops@cregis.com',
  'morgan.lee@cregis.com',
  'sam.rivera@cregis.com',
  'jordan.park@cregis.com',
] as const;

function seededFraction(index: number, salt: number): number {
  const x = Math.sin((index + 1) * 9973 + salt * 7919) * 10000;
  return x - Math.floor(x);
}

function padRecordTime(baseDay: number, hour: number, minute: number, second: number): string {
  const day = String(baseDay).padStart(2, '0');
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const ss = String(second).padStart(2, '0');
  return `2025-10-${day} ${hh}:${mm}:${ss}`;
}

function resolveMemberNickname(rowIndex: number): string {
  if (rowIndex < MEMBER_NICKNAME_FIXED.length) {
    return MEMBER_NICKNAME_FIXED[rowIndex]!;
  }
  return MEMBER_NICKNAME_POOL[rowIndex % MEMBER_NICKNAME_POOL.length]!;
}

function resolveMemberEmail(rowIndex: number): string {
  if (rowIndex < MEMBER_EMAIL_FIXED.length) {
    return MEMBER_EMAIL_FIXED[rowIndex]!;
  }
  return MEMBER_EMAIL_POOL[rowIndex % MEMBER_EMAIL_POOL.length]!;
}

function resolveMemberStatusKey(rowIndex: number): ManageMemberStatusKey {
  if (rowIndex === 1) return 'pending-join';
  if (rowIndex === 2) return 'disabled';
  return 'normal';
}

function resolveJoinedAt(rowIndex: number): string {
  const day = 2 + (rowIndex % 27);
  const hour = 9 + Math.floor(seededFraction(rowIndex, 11) * 10);
  const minute = Math.floor(seededFraction(rowIndex, 13) * 60);
  const second = Math.floor(seededFraction(rowIndex, 17) * 60);
  return padRecordTime(day, hour, minute, second);
}

function buildMemberRow(rowIndex: number, roleRow: PaymentEngineRecordRow): PaymentEngineRecordRow {
  const nickname = resolveMemberNickname(rowIndex);
  const email = resolveMemberEmail(rowIndex);
  const joinedAt = resolveJoinedAt(rowIndex);
  const id = `MEMBER-${String(rowIndex + 1).padStart(4, '0')}`;

  return {
    id,
    merchantOrderId: id,
    status: 'success',
    createdAt: joinedAt,
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: roleRow.ruleName,
    manageMemberLinkedRoleId: roleRow.id,
    manageMemberStatusKey: resolveMemberStatusKey(rowIndex),
    manageMemberShowCreatorTag: rowIndex === 0,
    logOperatorName: nickname,
    webhookCreatorEmail: maskDisplayEmail(email),
    webhookCreatorDisplay: formatWebhookCreatorDisplay(nickname, email),
  };
}

export function resolveManageMemberLinkedRoleId(row: PaymentEngineRecordRow): string {
  return row.manageMemberLinkedRoleId?.trim() || row.id;
}

export function buildManageMemberRecordRows(menuItem: string, count: number): PaymentEngineRecordRow[] {
  if (menuItem !== MANAGE_MEMBER_MENU_ITEM) return [];
  const safeCount = Math.max(0, count);
  const roleRows = buildManageRoleRecordRows(MANAGE_ROLE_MENU_ITEM, safeCount);
  return Array.from({ length: safeCount }, (_, index) => {
    const roleRow = roleRows[index % Math.max(roleRows.length, 1)]!;
    return buildMemberRow(index, roleRow);
  }).filter((row) => !isManageMemberRecordDeleted(row.id));
}
