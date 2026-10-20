import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterFieldDropdownOption,
  type EgFilterLogicMode,
  type EgFilterOperator,
} from '@eds/desktop-components';
import {
  applyEgFilterConditions,
  hasActiveEgFilterConditions,
  type EgFilterRowSnapshot,
} from '@/scenes/shared/applyEgFilterConditions';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import {
  BALANCE_TX,
  TX_DISPLAY_TITLE_KEY,
  txDisplayTitleKey,
  type BalanceTx,
} from './teamAccountData';

const TYPE_OPTION_NS = 'team-account-type';
const OPERATOR_OPTION_NS = 'team-account-operator';

export type TeamAccountFilterFieldId =
  | 'operationType'
  | 'operator'
  | 'time'
  | 'txHash';

const TEAM_ACCOUNT_FILTER_FIELD_IDS: readonly TeamAccountFilterFieldId[] = [
  'operationType',
  'operator',
  'time',
  'txHash',
];

function uniqueDisplayTitleKeys(): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const titleKey of Object.values(TX_DISPLAY_TITLE_KEY)) {
    if (seen.has(titleKey)) continue;
    seen.add(titleKey);
    keys.push(titleKey);
  }
  return keys;
}

function buildOperationTypeOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  return uniqueDisplayTitleKeys().map((titleKey) => ({
    id: resolveDataListFilterOptionId(TYPE_OPTION_NS, titleKey),
    label: translate(titleKey),
  }));
}

function operatorIdKey(operator: string | undefined): string {
  const raw = (operator ?? '').trim();
  return !raw || raw === 'System' ? 'System' : raw;
}

function buildOperatorOptions(
  translate: (key: string) => string,
): EgFilterFieldDropdownOption[] {
  const seen = new Set<string>();
  const options: EgFilterFieldDropdownOption[] = [];
  for (const tx of BALANCE_TX) {
    const idKey = operatorIdKey(tx.operator);
    if (seen.has(idKey)) continue;
    seen.add(idKey);
    options.push({
      id: resolveDataListFilterOptionId(OPERATOR_OPTION_NS, idKey),
      label: idKey === 'System' ? translate('System') : idKey,
    });
  }
  return options;
}

export function buildTeamAccountFilterFields(
  translate: (key: string) => string,
): EgFilterField[] {
  const catalog: Record<TeamAccountFilterFieldId, EgFilterField> = {
    operationType: {
      id: 'operationType',
      label: translate('Operation Type'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildOperationTypeOptions(translate),
    },
    operator: {
      id: 'operator',
      label: translate('Operator'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: buildOperatorOptions(translate),
    },
    time: {
      id: 'time',
      label: translate('Time'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    txHash: {
      id: 'txHash',
      label: translate('Transaction Hash'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };

  return TEAM_ACCOUNT_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}

export const TEAM_ACCOUNT_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;

export function buildTeamAccountFilterRowSnapshot(tx: BalanceTx): EgFilterRowSnapshot {
  const titleKey = txDisplayTitleKey(tx.type);
  return {
    operationType: resolveDataListFilterOptionId(TYPE_OPTION_NS, titleKey),
    operator: resolveDataListFilterOptionId(OPERATOR_OPTION_NS, operatorIdKey(tx.operator)),
    time: tx.time,
    txHash: tx.txid ?? '',
  };
}

export function txMatchesEgFilterConditions(
  tx: BalanceTx,
  conditions: EgFilterCondition[],
  fields: EgFilterField[],
  logicMode: EgFilterLogicMode,
): boolean {
  if (!hasActiveEgFilterConditions(conditions)) return true;
  return applyEgFilterConditions({
    snapshot: buildTeamAccountFilterRowSnapshot(tx),
    conditions,
    fields,
    logicMode,
  });
}
