export type ConditionFilterFieldOption = {
  key: string;
  labelKey: string;
};

export type ConditionFilterRow = {
  id: string;
  field: string;
  value: string;
};

let conditionSeq = 0;

export function createConditionFilterRow(field = '', value = ''): ConditionFilterRow {
  conditionSeq += 1;
  return { id: `filter-${conditionSeq}`, field, value };
}

export function defaultConditionFilterRows(fields: string[]): ConditionFilterRow[] {
  return fields.map((field) => createConditionFilterRow(field));
}

export function cloneConditionFilterRows(rows: ConditionFilterRow[]): ConditionFilterRow[] {
  return rows.map((row) => ({ ...row }));
}

export function filledConditionFilterRows(rows: ConditionFilterRow[]): ConditionFilterRow[] {
  return rows.filter((row) => row.value.trim().length > 0);
}
