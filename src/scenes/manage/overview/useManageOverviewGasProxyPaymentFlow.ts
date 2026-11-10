import { ref, type Ref } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import type { OverviewGasRechargeAccountKey } from './overviewRechargeSkidData';

const MOCK_TRADE_PASSWORD = '111111';

type GasProxyPaymentToggleContext = {
  canConfigureGasProxyPayment: Ref<boolean>;
  transactionPasswordSet: Ref<boolean>;
  gasProxyPaymentByKey: Ref<Record<string, boolean>>;
};

export function useManageOverviewGasProxyPaymentFlow(
  context: GasProxyPaymentToggleContext,
  options?: {
    verifyPurpose?: Ref<'gas-proxy' | 'account-transfer' | null>;
  },
) {
  const confirmDialogOpen = ref(false);
  const confirmEnabling = ref(true);
  const verifyOpen = ref(false);
  const noPermissionDialogOpen = ref(false);
  const setTransactionPasswordDialogOpen = ref(false);

  const pendingAccountKey = ref<OverviewGasRechargeAccountKey | null>(null);
  const pendingNext = ref(false);

  function clearPendingToggle() {
    pendingAccountKey.value = null;
  }

  function requestGasProxyPaymentToggle(
    accountKey: OverviewGasRechargeAccountKey,
    next: boolean,
    lockedOn?: boolean,
  ) {
    if (lockedOn) return;

    if (!context.canConfigureGasProxyPayment.value) {
      closeAllAnchoredTooltips();
      noPermissionDialogOpen.value = true;
      return;
    }

    if (next && !context.transactionPasswordSet.value) {
      closeAllAnchoredTooltips();
      setTransactionPasswordDialogOpen.value = true;
      return;
    }

    pendingAccountKey.value = accountKey;
    pendingNext.value = next;
    confirmEnabling.value = next;
    closeAllAnchoredTooltips();
    confirmDialogOpen.value = true;
  }

  function confirmToggleDialog() {
    confirmDialogOpen.value = false;
    if (options?.verifyPurpose) {
      options.verifyPurpose.value = 'gas-proxy';
    }
    verifyOpen.value = true;
  }

  function cancelToggleDialog() {
    confirmDialogOpen.value = false;
    clearPendingToggle();
  }

  function submitTradePassword(code: string): boolean {
    return code.trim() === MOCK_TRADE_PASSWORD;
  }

  function onVerifyClosed(accepted: boolean) {
    verifyOpen.value = false;
    const accountKey = pendingAccountKey.value;
    const next = pendingNext.value;
    clearPendingToggle();

    if (!accepted || !accountKey) return;

    context.gasProxyPaymentByKey.value = {
      ...context.gasProxyPaymentByKey.value,
      [accountKey]: next,
    };
    showAppEndFeedbackAfterOverlay();
  }

  return {
    confirmDialogOpen,
    confirmEnabling,
    verifyOpen,
    noPermissionDialogOpen,
    setTransactionPasswordDialogOpen,
    requestGasProxyPaymentToggle,
    confirmToggleDialog,
    cancelToggleDialog,
    submitTradePassword,
    onVerifyClosed,
  };
}
