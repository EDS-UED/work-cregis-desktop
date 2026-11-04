import type { EgFilterRowSnapshot } from '@/scenes/shared/applyEgFilterConditions';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveManageMemberStatusKey } from '@/scenes/manage/member/manageMemberStatusLabels';
import {
  resolveMemberRecordEmailFilterId,
  resolveMemberRecordNicknameFilterId,
  resolveMemberRecordRoleFilterId,
  resolveMemberRecordStatusFilterId,
} from './buildMemberRecordFilterOptions';

export function buildMemberRecordFilterRowSnapshot(
  _rowIndex: number,
  row: PaymentEngineRecordRow,
): EgFilterRowSnapshot {
  const statusKey = resolveManageMemberStatusKey(row.manageMemberStatusKey);
  return {
    memberNickname: resolveMemberRecordNicknameFilterId(row.logOperatorName),
    memberEmail: resolveMemberRecordEmailFilterId(row.webhookCreatorEmail),
    memberRole: resolveMemberRecordRoleFilterId(row.ruleName),
    memberStatus: resolveMemberRecordStatusFilterId(statusKey),
    memberJoinedTime: row.createdAt,
  };
}
