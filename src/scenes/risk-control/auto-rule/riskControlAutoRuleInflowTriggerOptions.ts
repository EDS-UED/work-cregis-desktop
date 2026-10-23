export type InflowTriggerTypeOption = {
  id: string;
  titleKey: string;
};

/** 收款触发类型（后续可增项；与 draft.withdrawalTypeKey / autoRuleScopeKey 对齐）。 */
export const INFLOW_TRIGGER_TYPE_OPTIONS: InflowTriggerTypeOption[] = [
  { id: 'screen-inflow-funds', titleKey: 'Screen inflow funds' },
];

export function isInflowTriggerTypeKey(key: string): boolean {
  return INFLOW_TRIGGER_TYPE_OPTIONS.some((option) => option.titleKey === key);
}
