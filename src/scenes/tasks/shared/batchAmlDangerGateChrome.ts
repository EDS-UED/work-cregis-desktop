import { ref } from 'vue';
import { queryBatchBarActionByLabel } from './resolveBatchAmlDangerActionAnchor';

/** 底栏「通过 / 签名」AML 等待态：与 BatchBar actionTextActive 一致，非 beforeOpen loading。 */
export const BATCH_AML_ANCHOR_PRESSED_CLASS = 'batchAmlDangerAnchorPressed';

/** 直点批处理钮（无 Popover beforeOpen）时模拟 EDS prep Loading。 */
export const BATCH_AML_SIMULATED_PREP_CLASS = 'batchAmlDangerSimulatedPrep';

export const BATCH_AML_GATE_PREVIEW_ATTR = 'data-tasks-batch-aml-gate-open';

/** 直点「签名」等无 Popover beforeOpen 时标记底栏锚点，供 global CSS 点按态。 */
export const BATCH_AML_GATE_ANCHOR_ATTR = 'data-tasks-batch-aml-gate-anchor';

/** closeAllAnchoredTooltips 须保留批处理底栏「通过/签名」Popover 会话（shim 读取）。 */
let batchAmlGateExceptAnchorEl: HTMLElement | null = null;

/**
 * AML 已出现时 beforeOpen 仍未 resolve；须暂停 AnchoredPopover prepDeferredLoading，
 * 否则批处理「通过/签名」钮会一直转圈。须 reactive revision 驱动 shim computed 重算。
 */
let batchAmlGateSuspendsAnchoredPopoverPrepLoading = false;

export const batchAmlGateAnchoredPrepSuspendRevision = ref(0);

type PrepDeferredLoadingClear = () => void;

const prepDeferredLoadingClearers = new Set<PrepDeferredLoadingClear>();

export function registerAnchoredPopoverPrepDeferredLoadingClear(clear: PrepDeferredLoadingClear) {
  prepDeferredLoadingClearers.add(clear);
  return () => {
    prepDeferredLoadingClearers.delete(clear);
  };
}

export function clearAllAnchoredPopoverPrepDeferredLoading() {
  for (const clear of prepDeferredLoadingClearers) {
    clear();
  }
}

export function setBatchAmlGateSuspendsAnchoredPopoverPrepLoading(suspend: boolean) {
  if (batchAmlGateSuspendsAnchoredPopoverPrepLoading === suspend) {
    if (suspend) {
      clearAllAnchoredPopoverPrepDeferredLoading();
    }
    return;
  }
  batchAmlGateSuspendsAnchoredPopoverPrepLoading = suspend;
  batchAmlGateAnchoredPrepSuspendRevision.value += 1;
  if (suspend) {
    clearAllAnchoredPopoverPrepDeferredLoading();
  }
}

export function isBatchAmlGateSuspendingAnchoredPopoverPrepLoading(): boolean {
  return batchAmlGateSuspendsAnchoredPopoverPrepLoading;
}

export function setBatchAmlGateExceptAnchor(el: HTMLElement | null) {
  batchAmlGateExceptAnchorEl = el;
}

export function resolveBatchAmlGateExceptAnchor(): HTMLElement | null {
  return batchAmlGateExceptAnchorEl?.isConnected ? batchAmlGateExceptAnchorEl : null;
}

export function setBatchAmlGatePreviewOpen(open: boolean) {
  const preview = document.querySelector('.app-preview');
  if (!preview) return;
  if (open) {
    preview.setAttribute(BATCH_AML_GATE_PREVIEW_ATTR, '');
  } else {
    preview.removeAttribute(BATCH_AML_GATE_PREVIEW_ATTR);
  }
}

export function syncBatchAmlAnchorPressed(
  pressed: boolean,
  anchor: HTMLElement | null | undefined,
) {
  if (!anchor?.isConnected) return;
  anchor.classList.toggle(BATCH_AML_ANCHOR_PRESSED_CLASS, pressed);
}

export function clearBatchAmlAnchorPressed(anchor: HTMLElement | null | undefined) {
  syncBatchAmlAnchorPressed(false, anchor);
}

/** AML gate 等待态：同步开 preview attr + 底栏按钮 pressed（勿等 Vue watch 一帧，避免 beforeOpen loading 先闪现）。 */
export function syncBatchAmlGateChromeWhileWaiting(
  menuItem: string,
  translate: (key: string) => string,
  open: boolean,
  anchorHint?: HTMLElement | null,
) {
  setBatchAmlGatePreviewOpen(open);
  setBatchAmlGateSuspendsAnchoredPopoverPrepLoading(open);
  if (!open) return;

  const passLabel = translate('Pass');
  const signLabel = translate('Sign');
  const preferred = menuItem === 'Signing' ? signLabel : passLabel;
  const anchor =
    (anchorHint?.isConnected ? anchorHint : null)
    ?? queryBatchBarActionByLabel(preferred);
  syncBatchAmlAnchorPressed(true, anchor);
  if (anchor?.isConnected) {
    anchor.setAttribute(BATCH_AML_GATE_ANCHOR_ATTR, '');
  }
  setBatchAmlGateExceptAnchor(anchor);
}

export function clearBatchAmlGateChromeAfterWait(
  menuItem: string,
  translate: (key: string) => string,
) {
  setBatchAmlGatePreviewOpen(false);
  setBatchAmlGateSuspendsAnchoredPopoverPrepLoading(false);
  const passLabel = translate('Pass');
  const signLabel = translate('Sign');
  const preferred = menuItem === 'Signing' ? signLabel : passLabel;
  const anchor = queryBatchBarActionByLabel(preferred);
  clearBatchAmlAnchorPressed(anchor);
  if (anchor?.isConnected) {
    anchor.removeAttribute(BATCH_AML_GATE_ANCHOR_ATTR);
  }
  setBatchAmlGateExceptAnchor(null);
}
