import type { CryptoName } from '@eds/desktop-components';

export type ProjectSettingsCallbackTokenRow = {
  id: string;
  symbol: string;
  cryptoName: CryptoName;
  minAmount: string;
};

export const BTC_ADDRESS_FORMAT_OPTIONS = [
  { id: 'nested-segwit', labelKey: 'Nested SegWit' },
  { id: 'native-segwit', labelKey: 'Native SegWit' },
  { id: 'legacy', labelKey: 'Legacy' },
] as const;

export const CALLBACK_SETTINGS_DEMO_TOKENS: ProjectSettingsCallbackTokenRow[] = [
  {
    id: 'usdt',
    symbol: 'USDT',
    cryptoName: 'eds-usdt-tether usd',
    minAmount: '0.00001',
  },
  {
    id: 'ton',
    symbol: 'TON',
    cryptoName: 'eds-ton-toncoin',
    minAmount: '0.00001',
  },
  {
    id: 'aave',
    symbol: 'AAVE',
    cryptoName: 'eds-aave-aave',
    minAmount: '0.00001',
  },
  {
    id: 'mnt',
    symbol: 'MNT',
    cryptoName: 'eds-mnt-mantle',
    minAmount: '0.00001',
  },
  {
    id: 'bgb',
    symbol: 'BGB',
    cryptoName: 'eds-bgb-bitget token',
    minAmount: '0.00001',
  },
  {
    id: '1inch',
    symbol: '1INCH',
    cryptoName: 'eds-1inch-1inch network',
    minAmount: '0.00001',
  },
  {
    id: 'deep',
    symbol: 'DEEP',
    cryptoName: 'eds-deep-deepbook protocol',
    minAmount: '0.00001',
  },
];
