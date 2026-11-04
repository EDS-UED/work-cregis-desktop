import type { EgFilterFieldDropdownOption } from '@eds/desktop-components';
import { resolveDataListFilterOptionId } from '@/scenes/shared/dataListFilterOptionUtils';
import { FEE_RECORD_OPERATION_TYPE_KEYS } from '../feeRecordOperationTypes';
import type { FeeRecordAccountKey } from '../feeRecordTypes';

const FEE_RECORD_ACCOUNT_KEYS: readonly FeeRecordAccountKey[] = ['Team Account', 'Gas Account'];

export type FeeRecordFilterRowOptions = {
  operationTypeOptions: EgFilterFieldDropdownOption[];
  accountOptions: EgFilterFieldDropdownOption[];
};

export function buildFeeRecordFilterOptionsFromRows(
  translate: (catalogKey: string) => string,
): FeeRecordFilterRowOptions {
  return {
    operationTypeOptions: FEE_RECORD_OPERATION_TYPE_KEYS.map((key) => ({
      id: resolveDataListFilterOptionId('fee-op-type', key),
      label: translate(key),
    })),
    accountOptions: FEE_RECORD_ACCOUNT_KEYS.map((key) => ({
      id: resolveDataListFilterOptionId('fee-account', key),
      label: translate(key),
    })),
  };
}
