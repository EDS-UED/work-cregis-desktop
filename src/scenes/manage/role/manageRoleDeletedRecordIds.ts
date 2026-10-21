import { ref } from 'vue';

/** 会话内已删除角色 id（mock 列表过滤 · 供列表 computed 订阅）。 */
export const deletedRoleRecordIds = ref<ReadonlySet<string>>(new Set());

export function markManageRoleRecordDeleted(recordId: string) {
  const next = new Set(deletedRoleRecordIds.value);
  next.add(recordId);
  deletedRoleRecordIds.value = next;
}

export function isManageRoleRecordDeleted(recordId: string): boolean {
  return deletedRoleRecordIds.value.has(recordId);
}
