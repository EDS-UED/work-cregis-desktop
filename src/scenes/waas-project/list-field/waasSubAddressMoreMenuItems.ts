export type WaasSubAddressMoreMenuItem = {
  key: string;
  labelKey: string;
  symbolIcon: string;
  showCascader?: boolean;
};

export const WAAS_SUB_ADDRESS_MORE_MENU_PRIMARY: WaasSubAddressMoreMenuItem[] = [
  { key: 'receive', labelKey: 'Receive', symbolIcon: 'eds-arrow-download' },
  { key: 'copy-address', labelKey: 'Copy address', symbolIcon: 'eds-copy' },
  { key: 'refresh-funds', labelKey: 'Refresh Funds', symbolIcon: 'eds-arrow-refresh' },
  { key: 'resources', labelKey: 'Resources', symbolIcon: 'eds-energy', showCascader: true },
];

export const WAAS_SUB_ADDRESS_MORE_MENU_SECONDARY: WaasSubAddressMoreMenuItem[] = [
  {
    key: 'set-default-payment-address',
    labelKey: 'Set Default Payment Address',
    symbolIcon: 'eds-arrow-withdrawal',
  },
  {
    key: 'set-default-receiving-address',
    labelKey: 'Set Default Receiving Address',
    symbolIcon: 'eds-arrow-deposit',
  },
  {
    key: 'message-signature',
    labelKey: 'Message Signature',
    symbolIcon: 'eds-text-signed',
  },
];
