export type MemberRecordFilterFieldId =
  | 'memberNickname'
  | 'memberEmail'
  | 'memberRole'
  | 'memberStatus'
  | 'memberJoinedTime';

export const MEMBER_RECORD_FILTER_FIELD_LABEL_KEYS: Record<MemberRecordFilterFieldId, string> = {
  memberNickname: 'Member',
  memberEmail: 'Email',
  memberRole: 'Role Name',
  memberStatus: 'Status',
  memberJoinedTime: 'Member Joined Time',
};
