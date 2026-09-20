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

/** 创建页返回目标：从空态或内容页进入，返回时还原。 */
export type WaasCreateReturnView = 'empty' | 'content';
