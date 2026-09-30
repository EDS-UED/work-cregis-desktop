import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import { resolvePaymentEngineRecordRowCount } from '@/scenes/payment-engine/paymentEngineOrderRecordData';
import { buildAddressBookRecordCurrencyFilterOptions } from './buildAddressBookRecordFilterOptions';
import {
  ADDRESS_BOOK_RECORD_FILTER_FIELD_LABEL_KEYS,
  type AddressBookRecordFilterFieldId,
} from './addressBookRecordFilterFieldLabelKeys';

const ADDRESS_BOOK_RECORD_FILTER_FIELD_IDS: readonly AddressBookRecordFilterFieldId[] = [
  'addressBookCurrency',
  'address',
  'addressAlias',
];

function filterLabel(
  translate: (key: string) => string,
  fieldId: AddressBookRecordFilterFieldId,
): string {
  return translate(ADDRESS_BOOK_RECORD_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  menuItem: string,
  rowCount: number,
): Record<AddressBookRecordFilterFieldId, EgFilterField> {
  return {
    addressBookCurrency: {
      id: 'addressBookCurrency',
      label: filterLabel(translate, 'addressBookCurrency'),
      kind: 'currency',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: buildAddressBookRecordCurrencyFilterOptions(menuItem, rowCount),
    },
    address: {
      id: 'address',
      label: filterLabel(translate, 'address'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    addressAlias: {
      id: 'addressAlias',
      label: filterLabel(translate, 'addressAlias'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export const ADDRESS_BOOK_RECORD_FILTER_OPERATORS: EgFilterOperator[] =
  DEFAULT_FILTER_OPERATORS;

export function buildAddressBookRecordFilterFields(
  menuItem: string,
  translate: (key: string) => string,
  rowCount?: number,
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? resolvePaymentEngineRecordRowCount(menuItem),
  );
  const catalog = buildFieldCatalog(translate, menuItem, sourceRowCount);
  return ADDRESS_BOOK_RECORD_FILTER_FIELD_IDS.map((fieldId) => catalog[fieldId]);
}
