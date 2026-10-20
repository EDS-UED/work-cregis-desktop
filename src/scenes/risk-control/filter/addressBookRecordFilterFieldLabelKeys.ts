export const ADDRESS_BOOK_RECORD_FILTER_FIELD_LABEL_KEYS = {
  addressBookCurrency: 'Currency',
  address: 'Address',
  addressAlias: 'Address Alias',
} as const;

export type AddressBookRecordFilterFieldId =
  keyof typeof ADDRESS_BOOK_RECORD_FILTER_FIELD_LABEL_KEYS;
