import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { PAYMENT_ENGINE_RECORD_ROW_COUNT } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import {
  buildMemberRecordEmailFilterOptions,
  buildMemberRecordNicknameMemberFilterOptions,
  buildMemberRecordRoleFilterOptions,
  buildMemberRecordStatusFilterOptions,
} from './buildMemberRecordFilterOptions';
import {
  MEMBER_RECORD_FILTER_FIELD_LABEL_KEYS,
  type MemberRecordFilterFieldId,
} from './memberRecordFilterFieldLabelKeys';

const MEMBER_RECORD_FILTER_FIELD_IDS: readonly MemberRecordFilterFieldId[] = [
  'memberNickname',
  'memberEmail',
  'memberRole',
  'memberStatus',
  'memberJoinedTime',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: MemberRecordFilterFieldId,
): string {
  return translate(MEMBER_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowCount: number,
): Record<MemberRecordFilterFieldId, EgFilterField> {
  return {
    memberNickname: {
      id: 'memberNickname',
      label: filterLabel(translate, 'memberNickname'),
      kind: 'member',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      memberOptions: buildMemberRecordNicknameMemberFilterOptions(rowCount),
      showTypeTabs: false,
    },
    memberEmail: {
      id: 'memberEmail',
      label: filterLabel(translate, 'memberEmail'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildMemberRecordEmailFilterOptions(rowCount),
    },
    memberRole: {
      id: 'memberRole',
      label: filterLabel(translate, 'memberRole'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildMemberRecordRoleFilterOptions(rowCount),
    },
    memberStatus: {
      id: 'memberStatus',
      label: filterLabel(translate, 'memberStatus'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildMemberRecordStatusFilterOptions(translate),
    },
    memberJoinedTime: {
      id: 'memberJoinedTime',
      label: filterLabel(translate, 'memberJoinedTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
  };
}

export const MEMBER_RECORD_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;

export function buildMemberRecordFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? PAYMENT_ENGINE_RECORD_ROW_COUNT,
  );
  const catalog = buildFieldCatalog(translate, sourceRowCount);
  return MEMBER_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
