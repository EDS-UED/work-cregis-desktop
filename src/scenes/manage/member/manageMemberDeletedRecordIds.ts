import { shallowRef } from 'vue';

export const deletedMemberRecordIds = shallowRef<ReadonlySet<string>>(new Set());

export function markManageMemberRecordDeleted(recordId: string) {
  const next = new Set(deletedMemberRecordIds.value);
  next.add(recordId);
  deletedMemberRecordIds.value = next;
}

export function isManageMemberRecordDeleted(recordId: string): boolean {
  return deletedMemberRecordIds.value.has(recordId);
}
