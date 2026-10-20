import { shallowRef } from 'vue';

/** PaymentEngineDataListPage · Shell 外 QA 通用态可调用的列表反馈 API。 */
export type PaymentEngineDataListShellApi = {
  setListEmpty: (empty: boolean) => void;
  setListIniting: (initing: boolean) => void;
  setListLoading: (loading: boolean) => void;
  showDangerToast: (message: string) => void;
};

export const paymentEngineDataListShellApiRegistry =
  shallowRef<PaymentEngineDataListShellApi | null>(null);

export function registerPaymentEngineDataListShellApi(
  api: PaymentEngineDataListShellApi | null,
) {
  paymentEngineDataListShellApiRegistry.value = api;
}
