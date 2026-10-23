export type RiskControlBlacklistCreateDraft = {
  address: string;
  networkLabel: string;
  /** AML 查询记录编号（从详情带入时）。 */
  amlQueryRecordId?: string;
  /** 从 AML 查询记录详情跳转，展示自动填入地址相关说明。 */
  prefilledFromAmlQueryRecord?: boolean;
};

export function emptyRiskControlBlacklistCreateDraft(): RiskControlBlacklistCreateDraft {
  return {
    address: '',
    networkLabel: '',
  };
}
