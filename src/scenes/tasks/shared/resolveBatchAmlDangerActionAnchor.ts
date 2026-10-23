const BATCH_BAR_ACTION_ITEM_SELECTOR = '.eds-batch-bar-action-item';

function normalizeActionLabel(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function queryActiveDataListBatchBar(): HTMLElement | null {
  const preview = document.querySelector('.app-preview');
  if (!preview) return null;

  for (const list of preview.querySelectorAll('.eds-data-list')) {
    const bar = list.querySelector('.eds-batch-bar');
    if (!(bar instanceof HTMLElement)) continue;

    const operationBar = bar.closest('[class*="operationBar"]');
    if (operationBar instanceof HTMLElement) {
      const style = getComputedStyle(operationBar);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
    }

    return bar;
  }

  const fallback = preview.querySelector('.eds-data-list .eds-batch-bar');
  return fallback instanceof HTMLElement ? fallback : null;
}

export function queryBatchBarActionByLabel(
  actionLabel: string,
): HTMLElement | null {
  const bar = queryActiveDataListBatchBar();
  if (!bar) return null;

  const normalizedTarget = normalizeActionLabel(actionLabel);
  for (const button of bar.querySelectorAll(BATCH_BAR_ACTION_ITEM_SELECTOR)) {
    const label = normalizeActionLabel(button.textContent ?? '');
    if (label === normalizedTarget) {
      return button as HTMLElement;
    }
  }

  return null;
}

/** 批处理底栏「通过 / 签名」按钮（EgBatchBarActionItem text）。 */
export function resolveBatchPassSignActionButton(
  target: EventTarget | null,
  passLabel: string,
  signLabel: string,
): HTMLElement | null {
  if (!(target instanceof Element)) return null;

  const actionItem = target.closest(BATCH_BAR_ACTION_ITEM_SELECTOR);
  if (!actionItem || !actionItem.closest('.eds-batch-bar')) {
    return null;
  }

  const label = normalizeActionLabel(actionItem.textContent ?? '');
  if (label !== passLabel && label !== signLabel) {
    return null;
  }

  return actionItem as HTMLElement;
}

/** 程序化打开二次确认前兜底：在 .app-preview 内按文案查找底栏按钮。 */
export function queryBatchBarPassSignActionButton(
  passLabel: string,
  signLabel: string,
): HTMLElement | null {
  return (
    queryBatchBarActionByLabel(passLabel)
    ?? queryBatchBarActionByLabel(signLabel)
  );
}

export function resolveBatchPassSignAnchorForMenu(
  menuUsesSignLabel: boolean,
  passLabel: string,
  signLabel: string,
): HTMLElement | null {
  const preferred = menuUsesSignLabel ? signLabel : passLabel;
  return queryBatchBarActionByLabel(preferred);
}

export function resolveBatchAmlDangerConfirmAnchor(
  pointerAnchor: HTMLElement | null | undefined,
  passLabel: string,
  signLabel: string,
): HTMLElement | null {
  if (pointerAnchor?.isConnected) {
    return pointerAnchor;
  }
  return queryBatchBarPassSignActionButton(passLabel, signLabel);
}

/** EgConfirmPopover 挂载点：与 BatchBarLabelPopover 同处 batch glass / tooltip-panel。 */
export function queryBatchBarPopoverMountTarget(): HTMLElement | null {
  const bar = queryActiveDataListBatchBar();
  if (!bar) return null;

  const panel = bar.querySelector('.eds-tooltip-panel');
  if (panel instanceof HTMLElement) {
    return panel;
  }

  const glass = bar.querySelector('.eds-batch-bar-glass, .effect-flotation-box');
  if (glass instanceof HTMLElement) {
    return glass;
  }

  return bar;
}
