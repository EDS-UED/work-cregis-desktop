import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { PAYMENT_ENGINE_RECORD_ROW_COUNT } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { buildRoleRecordCreatorFilterOptions } from './buildRoleRecordCreatorFilterOptions';
import { buildRoleRecordNameFilterOptions } from './buildRoleRecordFilterOptions';
import {
  ROLE_RECORD_FILTER_FIELD_LABEL_KEYS,
  type RoleRecordFilterFieldId,
} from './roleRecordFilterFieldLabelKeys';

const ROLE_RECORD_FILTER_FIELD_IDS: readonly RoleRecordFilterFieldId[] = [
  'roleName',
  'roleCreator',
  'roleCreatedTime',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: RoleRecordFilterFieldId,
): string {
  return translate(ROLE_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowCount: number,
): Record<RoleRecordFilterFieldId, EgFilterField> {
  return {
    roleName: {
      id: 'roleName',
      label: filterLabel(translate, 'roleName'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildRoleRecordNameFilterOptions(rowCount),
    },
    roleCreator: {
      id: 'roleCreator',
      label: filterLabel(translate, 'roleCreator'),
      kind: 'member',
      selectionMode: 'single',
      showTypeTabs: false,
      placeholder: FILTER_SELECT_PLACEHOLDER,
      memberOptions: buildRoleRecordCreatorFilterOptions(rowCount),
    },
    roleCreatedTime: {
      id: 'roleCreatedTime',
      label: filterLabel(translate, 'roleCreatedTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
  };
}

export const ROLE_RECORD_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;

export function buildRoleRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? PAYMENT_ENGINE_RECORD_ROW_COUNT,
  );
  const catalog = buildFieldCatalog(translate, sourceRowCount);
  return ROLE_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
