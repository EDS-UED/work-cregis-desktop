import { queryBatchBarActionByLabel } from './resolveBatchAmlDangerActionAnchor';

/** 底栏「通过 / 签名」AML 等待态：与 BatchBar actionTextActive 一致，非 beforeOpen loading。 */
export const BATCH_AML_ANCHOR_PRESSED_CLASS = 'batchAmlDangerAnchorPressed';

export const BATCH_AML_GATE_PREVIEW_ATTR = 'data-tasks-batch-aml-gate-open';

/** closeAllAnchoredTooltips 须保留批处理底栏「通过/签名」Popover 会话（shim 读取）。 */
let batchAmlGateExceptAnchorEl: HTMLElement | null = null;

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
) {
  setBatchAmlGatePreviewOpen(open);
  if (!open) return;

  const passLabel = translate('Pass');
  const signLabel = translate('Sign');
  const preferred = menuItem === 'Signing' ? signLabel : passLabel;
  const anchor = queryBatchBarActionByLabel(preferred);
  syncBatchAmlAnchorPressed(true, anchor);
  setBatchAmlGateExceptAnchor(anchor);
}

export function clearBatchAmlGateChromeAfterWait(
  menuItem: string,
  translate: (key: string) => string,
) {
  setBatchAmlGatePreviewOpen(false);
  const passLabel = translate('Pass');
  const signLabel = translate('Sign');
  const preferred = menuItem === 'Signing' ? signLabel : passLabel;
  const anchor = queryBatchBarActionByLabel(preferred);
  clearBatchAmlAnchorPressed(anchor);
  setBatchAmlGateExceptAnchor(null);
}
