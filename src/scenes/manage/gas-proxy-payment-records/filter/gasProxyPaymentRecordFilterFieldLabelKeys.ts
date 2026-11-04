/** Gas 代付 EgFilter 字段 i18n labelKey 真源。 */
export const GAS_PROXY_PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS = {
  gasProxyCurrency: 'Token',
  gasProxyTransactionType: 'Gas Proxy Transaction Type',
  gasProxyTxHash: 'Transaction hash',
  gasProxyDeductedAccount: 'Deducted Account',
  gasProxyTransactionTime: 'Time',
} as const;

export type GasProxyPaymentRecordFilterFieldId =
  keyof typeof GAS_PROXY_PAYMENT_RECORD_FILTER_FIELD_LABEL_KEYS;

export const GAS_PROXY_PAYMENT_RECORD_FILTER_FIELD_IDS: readonly GasProxyPaymentRecordFilterFieldId[] =
  [
    'gasProxyCurrency',
    'gasProxyTransactionType',
    'gasProxyTxHash',
    'gasProxyDeductedAccount',
    'gasProxyTransactionTime',
  ];
