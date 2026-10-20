export type ProjectSettingsReceivingTransferOption = {
  id: string;
  label: string;
};

export type ProjectSettingsReceivingTransferNetworkRow = {
  id: string;
  networkLabel: string;
  walletId: string | null;
  addressId: string | null;
};

export type ProjectSettingsReceivingTransferTokenGroup = {
  id: string;
  symbol: string;
  cryptoName: string;
  multichain: boolean;
  networks: ProjectSettingsReceivingTransferNetworkRow[];
};

export const RECEIVING_TRANSFER_WALLET_OPTIONS: ProjectSettingsReceivingTransferOption[] = [
  { id: 'test_single_1', label: 'test_single_1' },
  { id: 'cregis_fat_2031', label: 'CregisFAT-2031' },
];

export const RECEIVING_TRANSFER_ADDRESS_OPTIONS: ProjectSettingsReceivingTransferOption[] = [
  {
    id: 'tron-main',
    label: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
  },
  {
    id: 'tron-shasta',
    label: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBg',
  },
];

export const RECEIVING_TRANSFER_DEMO_GROUPS: ProjectSettingsReceivingTransferTokenGroup[] = [
  {
    id: 'usdt',
    symbol: 'USDT',
    cryptoName: 'eds-usdt-tether',
    multichain: true,
    networks: [
      {
        id: 'tron',
        networkLabel: 'TRON',
        walletId: 'test_single_1',
        addressId: 'tron-main',
      },
      {
        id: 'tron-shasta',
        networkLabel: 'TRON#Shasta',
        walletId: 'test_single_1',
        addressId: 'tron-shasta',
      },
    ],
  },
  {
    id: 'trx',
    symbol: 'TRX',
    cryptoName: 'eds-trx-tron',
    multichain: false,
    networks: [
      {
        id: 'trx-shasta',
        networkLabel: 'TRON#Shasta',
        walletId: null,
        addressId: null,
      },
    ],
  },
];

export function resolveReceivingTransferOptionLabel(
  options: ProjectSettingsReceivingTransferOption[],
  id: string | null,
): string | null {
  if (!id) return null;
  return options.find((option) => option.id === id)?.label ?? null;
}
