export const AML_QUERY_TYPE_OPTIONS = [
  { id: 'address', labelKey: 'Address Query' },
  { id: 'transaction-hash', labelKey: 'Transaction Hash Query' },
] as const;

export type AmlQueryTypeId = (typeof AML_QUERY_TYPE_OPTIONS)[number]['id'];

export const AML_QUERY_NETWORK_OPTIONS = [
  'Bitcoin',
  'Tron',
  'Base',
  'BNB Smart Chain',
  'Ethereum Mainnet',
] as const;

export const AML_QUERY_PROVIDER_OPTIONS = [
  { id: 'elliptic', label: 'Elliptic', mark: 'E' },
  { id: 'regtank', label: 'Regtank', mark: 'R' },
] as const;

export type AmlQueryProviderId = (typeof AML_QUERY_PROVIDER_OPTIONS)[number]['id'];

export const AML_QUERY_FEE_DISPLAY = '1 USD';
