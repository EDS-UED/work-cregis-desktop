import { shallowRef } from 'vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

const roleEnabledOverrides = shallowRef<Readonly<Record<string, boolean>>>({});

export function resolveManageRoleRecordEnabled(row: PaymentEngineRecordRow): boolean {
  const override = roleEnabledOverrides.value[row.id];
  if (override !== undefined) return override;
  return Boolean(row.ruleEnabled);
}

export function setManageRoleRecordEnabled(recordId: string, enabled: boolean) {
  roleEnabledOverrides.value = {
    ...roleEnabledOverrides.value,
    [recordId]: enabled,
  };
}

export function manageRoleRecordEnabledRevision(): typeof roleEnabledOverrides.value {
  return roleEnabledOverrides.value;
}
