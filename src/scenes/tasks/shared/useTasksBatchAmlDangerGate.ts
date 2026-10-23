import { nextTick, ref } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import {
  batchSelectionIncludesAmlDangerRow,
  resolveBatchRowIndexesFromDataListRows,
} from './batchTaskAmlDangerGate';
import {
  clearBatchAmlGateChromeAfterWait,
  resolveBatchAmlGateExceptAnchor,
  syncBatchAmlGateChromeWhileWaiting,
} from './batchAmlDangerGateChrome';
import { queryBatchBarActionByLabel } from './resolveBatchAmlDangerActionAnchor';

const BATCH_AML_DANGER_GATE_CANCELLED = 'batch-aml-danger-gate-cancelled';

export function isBatchAmlDangerGateCancelled(error: unknown): boolean {
  return error instanceof Error && error.message === BATCH_AML_DANGER_GATE_CANCELLED;
}

export function useTasksBatchAmlDangerGate(translate: (key: string) => string) {
  const dangerConfirmActivateToken = ref(0);
  const dangerConfirmHostVisible = ref(false);

  let pendingGate: { resolve: () => void; reject: (error: Error) => void } | null = null;

  function clearPendingGate(reject?: boolean) {
    if (!pendingGate) return;
    if (reject) {
      pendingGate.reject(new Error(BATCH_AML_DANGER_GATE_CANCELLED));
    }
    pendingGate = null;
  }

  function requestDangerAcknowledgement(
    rowIndexes: readonly number[],
    menuItem: string,
  ): Promise<void> {
    if (!batchSelectionIncludesAmlDangerRow(rowIndexes, menuItem, translate)) {
      return Promise.resolve();
    }

    clearPendingGate(true);

    lastGateMenuItem = menuItem;
    syncBatchAmlGateChromeWhileWaiting(menuItem, translate, true);

    const passLabel = translate('Pass');
    const signLabel = translate('Sign');
    const preferred = menuItem === 'Signing' ? signLabel : passLabel;
    const gateAnchor =
      resolveBatchAmlGateExceptAnchor() ?? queryBatchBarActionByLabel(preferred);
    closeAllAnchoredTooltips(
      gateAnchor ? { exceptAncestorsOf: gateAnchor } : undefined,
    );

    return new Promise((resolve, reject) => {
      pendingGate = { resolve, reject };
      dangerConfirmActivateToken.value += 1;
      dangerConfirmHostVisible.value = true;
    });
  }

  function requestDangerAcknowledgementForRows(
    rows: Array<Record<string, unknown> & { _index?: number }>,
    menuItem: string,
  ): Promise<void> {
    return requestDangerAcknowledgement(
      resolveBatchRowIndexesFromDataListRows(rows),
      menuItem,
    );
  }

  function releaseGateAfterAmlPopoverClosed(menuItem: string, translate: (key: string) => string) {
    const gate = pendingGate;
    pendingGate = null;
    dangerConfirmHostVisible.value = false;
    clearBatchAmlGateChromeAfterWait(menuItem, translate);
    gate?.resolve();
  }

  let lastGateMenuItem = 'Approval';

  /** AML EgConfirmPopover 须先 close，再 resolve beforeOpen，批处理备注 Popover 才能 openPanel。 */
  function onDangerConfirmAcknowledged(translate: (key: string) => string) {
    void nextTick().then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          releaseGateAfterAmlPopoverClosed(lastGateMenuItem, translate);
        });
      });
    });
  }

  function onDangerConfirmDismissed(translate: (key: string) => string) {
    if (!pendingGate) return;
    dangerConfirmHostVisible.value = false;
    clearBatchAmlGateChromeAfterWait(lastGateMenuItem, translate);
    clearPendingGate(true);
  }

  return {
    dangerConfirmActivateToken,
    dangerConfirmHostVisible,
    requestDangerAcknowledgementForRows,
    onDangerConfirmAcknowledged,
    onDangerConfirmDismissed,
  };
}
