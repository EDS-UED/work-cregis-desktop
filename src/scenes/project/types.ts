export type WaasProjectDepositMode = 'sub-address' | 'order';

export type WaasProject = {
  id: string;
  name: string;
  depositEnabled: boolean;
  depositMode: WaasProjectDepositMode;
  payoutEnabled: boolean;
  payoutWalletId?: string;
};

export type ProjectShellView = 'empty' | 'create' | 'content';
