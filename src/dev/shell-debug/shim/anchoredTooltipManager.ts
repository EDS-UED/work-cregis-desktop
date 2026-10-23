/**
 * Dev 替换 EDS `anchoredTooltipManager.ts`（vite alias）。
 * 须与本文件 ../eds-desktop/.../anchoredTooltipManager.ts 同步 register/计数 API；
 * closeAll 额外保留 Shell Debug QA / Model / Wnd Popover。
 */
import {
  BATCH_AML_GATE_PREVIEW_ATTR,
  resolveBatchAmlGateExceptAnchor,
} from '@/scenes/tasks/shared/batchAmlDangerGateChrome';
import {
  resolveShellDebugFloatExceptNode,
} from '../shellDebugPopoverExcept';
import { SHELL_DEBUG_FLOAT_CONTENT_MARKERS } from '../shellDebugUiScope';

type AnchoredTooltipCloseEntry = {
  close: () => void;
  dismissOnBarInteract: boolean;
  getHostElement?: () => HTMLElement | null;
};

const closeHandlers = new Set<AnchoredTooltipCloseEntry>();

let openClickAnchoredTooltipCount = 0;

export type CloseAllAnchoredTooltipsOptions = {
  exceptAncestorsOf?: HTMLElement | null;
};

export function registerAnchoredTooltipClose(
  handler: () => void,
  options?: { dismissOnBarInteract?: boolean; getHostElement?: () => HTMLElement | null },
): () => void {
  const entry: AnchoredTooltipCloseEntry = {
    close: handler,
    dismissOnBarInteract: options?.dismissOnBarInteract ?? true,
    getHostElement: options?.getHostElement,
  };
  closeHandlers.add(entry);
  return () => {
    closeHandlers.delete(entry);
  };
}

function isShellDebugLauncherTooltipHost(host: HTMLElement | null | undefined): boolean {
  if (!host) return false;
  return Boolean(host.querySelector(SHELL_DEBUG_FLOAT_CONTENT_MARKERS));
}

function hostContainsExceptNode(
  host: HTMLElement | null,
  exceptNode: HTMLElement | null | undefined,
): boolean {
  if (!host || !exceptNode) return false;
  return host.contains(exceptNode);
}

/** BatchBarLabelPopover：float host 不含 trigger，prep 阶段须保留 click 会话。 */
function shouldPreserveBatchLabelPopoverDuringAmlGate(
  entry: AnchoredTooltipCloseEntry,
  batchExcept: HTMLElement | null,
): boolean {
  if (!batchExcept?.isConnected || !batchExcept.closest('.eds-batch-bar-action-item')) {
    return false;
  }
  const preview = document.querySelector('.app-preview');
  if (!preview?.hasAttribute(BATCH_AML_GATE_PREVIEW_ATTR)) {
    return false;
  }
  if (entry.dismissOnBarInteract) {
    return false;
  }
  const host = entry.getHostElement?.() ?? null;
  if (!host) {
    return true;
  }
  if (host.querySelector('.eds-popover') && preview.contains(host)) {
    return true;
  }
  return false;
}

export function closeAllAnchoredTooltips(options?: CloseAllAnchoredTooltipsOptions): void {
  const explicitExcept = options?.exceptAncestorsOf ?? null;
  const shellDebugExcept = resolveShellDebugFloatExceptNode();
  const batchAmlExcept = resolveBatchAmlGateExceptAnchor();

  closeHandlers.forEach((entry) => {
    const host = entry.getHostElement?.() ?? null;

    if (isShellDebugLauncherTooltipHost(host)) {
      return;
    }

    if (
      hostContainsExceptNode(host, explicitExcept)
      || hostContainsExceptNode(host, shellDebugExcept)
      || hostContainsExceptNode(host, batchAmlExcept)
      || shouldPreserveBatchLabelPopoverDuringAmlGate(entry, batchAmlExcept)
    ) {
      return;
    }

    entry.close();
  });
}

export function closeBarBlockingAnchoredTooltips(): void {
  closeHandlers.forEach((entry) => {
    if (entry.dismissOnBarInteract) {
      entry.close();
    }
  });
}

export function hasOpenClickAnchoredTooltip(): boolean {
  return openClickAnchoredTooltipCount > 0;
}

export function setClickAnchoredTooltipOpen(open: boolean): void {
  if (open) {
    openClickAnchoredTooltipCount += 1;
    return;
  }
  openClickAnchoredTooltipCount = Math.max(0, openClickAnchoredTooltipCount - 1);
}
