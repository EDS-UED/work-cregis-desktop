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
import {
  type BatchAmlDangerGatePrepKind,
  waitForBatchAmlGateAfterPrepLoading,
} from './batchAmlDangerGateTiming';

const BATCH_AML_DANGER_GATE_CANCELLED = 'batch-aml-danger-gate-cancelled';

export function isBatchAmlDangerGateCancelled(error: unknown): boolean {
  return error instanceof Error && error.message === BATCH_AML_DANGER_GATE_CANCELLED;
}

export function useTasksBatchAmlDangerGate(
  translate: (key: string) => string,
  resolvePassSignAnchor?: () => HTMLElement | null,
) {
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

  async function requestDangerAcknowledgement(
    rowIndexes: readonly number[],
    menuItem: string,
    prepKind: BatchAmlDangerGatePrepKind,
    prepAnchor?: HTMLElement | null,
  ): Promise<void> {
    if (!batchSelectionIncludesAmlDangerRow(rowIndexes, menuItem, translate)) {
      return;
    }

    clearPendingGate(true);

    lastGateMenuItem = menuItem;

    /** 先走完批处理钮 Loading（prep 500ms + 转圈 500ms），再开 AML → 备注 Popover。 */
    await waitForBatchAmlGateAfterPrepLoading(
      prepKind,
      prepAnchor ?? resolvePassSignAnchor?.() ?? null,
    );

    syncBatchAmlGateChromeWhileWaiting(
      menuItem,
      translate,
      true,
      resolvePassSignAnchor?.() ?? null,
    );

    const passLabel = translate('Pass');
    const signLabel = translate('Sign');
    const preferred = menuItem === 'Signing' ? signLabel : passLabel;
    const gateAnchor =
      resolveBatchAmlGateExceptAnchor() ?? queryBatchBarActionByLabel(preferred);
    closeAllAnchoredTooltips(
      gateAnchor ? { exceptAncestorsOf: gateAnchor } : undefined,
    );

    await new Promise<void>((resolve, reject) => {
      pendingGate = { resolve, reject };
      dangerConfirmActivateToken.value += 1;
      dangerConfirmHostVisible.value = true;
    });
  }

  function requestDangerAcknowledgementForRows(
    rows: Array<Record<string, unknown> & { _index?: number }>,
    menuItem: string,
    prepKind: BatchAmlDangerGatePrepKind = 'label-popover-before-open',
    prepAnchor?: HTMLElement | null,
  ): Promise<void> {
    return requestDangerAcknowledgement(
      resolveBatchRowIndexesFromDataListRows(rows),
      menuItem,
      prepKind,
      prepAnchor,
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
