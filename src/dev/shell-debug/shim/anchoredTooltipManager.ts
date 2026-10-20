/**
 * Dev 替换 EDS `anchoredTooltipManager.ts`（vite alias）。
 * 须与本文件 ../eds-desktop/.../anchoredTooltipManager.ts 同步 register/计数 API；
 * closeAll 额外保留 Shell Debug QA / Model / Wnd Popover。
 */
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

export function closeAllAnchoredTooltips(options?: CloseAllAnchoredTooltipsOptions): void {
  const exceptNode = options?.exceptAncestorsOf ?? resolveShellDebugFloatExceptNode() ?? null;

  closeHandlers.forEach((entry) => {
    const host = entry.getHostElement?.() ?? null;

    if (isShellDebugLauncherTooltipHost(host)) {
      return;
    }

    if (exceptNode && host?.contains(exceptNode)) {
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
