import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import type { DetailProgressMemberDeviceInfo } from '@/scenes/tasks/shared/detailProgressMemberDeviceInfo.types';

export type RiskControlLogMemberDemo = {
  name: string;
  avatarName: string;
  emailMasked: string;
  deviceLabel: string;
  deviceInfo: DetailProgressMemberDeviceInfo;
  ipLocationLabel: string;
};

/** 非 Team API 日志详情 · Figma 固定操作人。 */
export const RISK_CONTROL_LOG_TRIGGER_MEMBER: RiskControlLogMemberDemo = {
  name: 'Alex Mah.',
  avatarName: 'Alex Mah',
  emailMasked: 't******z@gmail.com',
  deviceLabel: 'MacBook Pro (M79D144YL4)',
  deviceInfo: {
    deviceType: 'MacBook Pro',
    deviceId: 'M79D144YL4',
    ip: '192.168.1.230',
  },
  ipLocationLabel: 'Washington, D.C. 192.168.1.230',
};

/** Team API 日志详情 · 创建人 demo。 */
export const RISK_CONTROL_LOG_TEAM_API_MEMBER: RiskControlLogMemberDemo = {
  name: 'Ethan Davis',
  avatarName: 'Ethan Davis',
  emailMasked: 'e******s@gmail.com',
  deviceLabel: 'MacBook Pro (M79D144YL4)',
  deviceInfo: {
    deviceType: 'MacBook Pro',
    deviceId: 'M79D144YL4',
    ip: '192.168.1.230',
  },
  ipLocationLabel: 'Washington, D.C. 192.168.1.230',
};

/** 非 Team API · 命中策略清单 demo 策略名。 */
export const RISK_CONTROL_LOG_TRIGGER_STRATEGY_NAME = 'Doris Stodio';

function isTeamApiLog(row: PaymentEngineRecordRow): boolean {
  return (row.logTypeKey ?? '') === 'Team API';
}

function isTriggeredLogAction(logActionKey: string): boolean {
  return logActionKey.includes('triggered');
}

export function resolveRiskControlLogMemberDemo(
  row: PaymentEngineRecordRow,
): RiskControlLogMemberDemo {
  if (isTeamApiLog(row)) {
    return RISK_CONTROL_LOG_TEAM_API_MEMBER;
  }
  return RISK_CONTROL_LOG_TRIGGER_MEMBER;
}

export function resolveRiskControlLogStrategyNameForDetail(
  row: PaymentEngineRecordRow,
): string {
  if (isTeamApiLog(row)) {
    return row.logStrategyName?.trim() || RISK_CONTROL_LOG_TRIGGER_STRATEGY_NAME;
  }
  return RISK_CONTROL_LOG_TRIGGER_STRATEGY_NAME;
}

export function isRiskControlLogTriggeredAction(logActionKey: string | undefined): boolean {
  return isTriggeredLogAction(logActionKey ?? '');
}
