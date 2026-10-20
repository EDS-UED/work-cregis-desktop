import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { formatWebhookCreatorDisplay } from '@/scenes/manage/webhook/webhookMockData';
import { MANAGE_ROLE_MENU_ITEM } from '../manageMenuData';

const ROLE_NAME_FIXED = [
  '超级管理员',
  '管理员',
  '财务',
  '普通成员',
] as const;

const ROLE_NAME_TEST_PREFIX = 'Test_';

const CREATOR_POOL = [
  { name: 'Alex Chen', email: 'alex.chen@cregis.com' },
  { name: 'Dana Wu', email: 'dana.wu@cregis.com' },
  { name: 'Treasury', email: 'treasury@cregis.com' },
  { name: 'Ops Team', email: 'ops@cregis.com' },
  { name: 'Ben', email: 'ben@cregis.com' },
  { name: 'Chris', email: 'chris@proton.me' },
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

function resolveRoleName(rowIndex: number): string {
  if (rowIndex < ROLE_NAME_FIXED.length) {
    return ROLE_NAME_FIXED[rowIndex]!;
  }
  const testIndex = rowIndex - ROLE_NAME_FIXED.length;
  const letter = String.fromCharCode(65 + (testIndex % 26));
  const cycle = Math.floor(testIndex / 26);
  if (cycle === 0) return `${ROLE_NAME_TEST_PREFIX}${letter}`;
  return `${ROLE_NAME_TEST_PREFIX}${letter}${cycle + 1}`;
}

function resolveCreator(rowIndex: number): (typeof CREATOR_POOL)[number] {
  return CREATOR_POOL[rowIndex % CREATOR_POOL.length]!;
}

function resolveCreatedAt(rowIndex: number): string {
  const day = 1 + (rowIndex % 28);
  const hour = 8 + Math.floor(seededFraction(rowIndex, 3) * 12);
  const minute = Math.floor(seededFraction(rowIndex, 5) * 60);
  const second = Math.floor(seededFraction(rowIndex, 7) * 60);
  return padRecordTime(day, hour, minute, second);
}

function buildRoleRow(rowIndex: number): PaymentEngineRecordRow {
  const roleName = resolveRoleName(rowIndex);
  const creator = resolveCreator(rowIndex);
  const createdAt = resolveCreatedAt(rowIndex);
  const id = `ROLE-${String(rowIndex + 1).padStart(4, '0')}`;

  return {
    id,
    merchantOrderId: id,
    status: 'success',
    createdAt,
    receivedAmount: '0',
    orderAmount: '0',
    orderSymbol: 'USDT',
    receivedSymbol: 'USDT',
    ruleName: roleName,
    logOperatorName: creator.name,
    webhookCreatorEmail: creator.email,
    webhookCreatorDisplay: formatWebhookCreatorDisplay(creator.name, creator.email),
  };
}

export function buildManageRoleRecordRows(menuItem: string, count: number): PaymentEngineRecordRow[] {
  if (menuItem !== MANAGE_ROLE_MENU_ITEM) return [];
  const safeCount = Math.max(0, count);
  return Array.from({ length: safeCount }, (_, index) => buildRoleRow(index));
}
