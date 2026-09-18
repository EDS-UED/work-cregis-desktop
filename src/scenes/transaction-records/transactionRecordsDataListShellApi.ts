import { shallowRef } from 'vue';

/** 交易记录列表 · Shell 外 QA 可调用的反馈 API。 */
export type TransactionRecordsDataListShellApi = {
  setListEmpty: (empty: boolean) => void;
  setListIniting: (initing: boolean) => void;
  setListLoading: (loading: boolean) => void;
  showDangerToast: (message: string) => void;
};

export const transactionRecordsDataListShellApiRegistry =
  shallowRef<TransactionRecordsDataListShellApi | null>(null);

export function registerTransactionRecordsDataListShellApi(
  api: TransactionRecordsDataListShellApi | null,
) {
  transactionRecordsDataListShellApiRegistry.value = api;
}
