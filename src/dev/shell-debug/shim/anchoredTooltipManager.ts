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
  isClickAnchoredTooltipOpenExceptNode,
  isHoverAnchoredTooltipExceptNode,
} from '@/utils/anchoredTooltipLayerScope';
import {
  resolveShellDebugFloatExceptNode,
} from '../shellDebugPopoverExcept';
import { developerInspectActive } from '../inspect/developerInspectSession';
import { isShellDebugUiInteractionPending } from '../shellDebugFloatInteraction';
import { SHELL_DEBUG_FLOAT_CONTENT_MARKERS, isShellDebugUiElement } from '../shellDebugUiScope';

type AnchoredTooltipCloseEntry = {
  close: () => void;
  dismissOnBarInteract: boolean;
  getHostElement?: () => HTMLElement | null;
};

const closeHandlers = new Set<AnchoredTooltipCloseEntry>();

let openClickAnchoredTooltipCount = 0;

export type CloseAllAnchoredTooltipsOptions = {
  exceptAncestorsOf?: HTMLElement | null;
  /**
   * true：同时关闭 hover/focus 类（`dismissOnBarInteract`）。
   * 默认 false：仅关闭 click 类，与 hover 同屏（§1.4）。
   */
  includeHoverLayers?: boolean;
};

type CloseAllLayerScope = 'click-only' | 'hover-only' | 'all';

function inferCloseAllLayerScope(options?: CloseAllAnchoredTooltipsOptions): CloseAllLayerScope {
  if (options?.includeHoverLayers) {
    return 'all';
  }
  const except = options?.exceptAncestorsOf;
  if (!(except instanceof HTMLElement)) {
    return 'click-only';
  }
  if (isHoverAnchoredTooltipExceptNode(except)) {
    return 'hover-only';
  }
  if (isClickAnchoredTooltipOpenExceptNode(except)) {
    return 'click-only';
  }
  /*
   * hover/focus `openNow` 的 except 为无 tabindex 的 trigger；须只互斥其它 hover，
   * 保留 AML 确认 Popover 等 click 会话。
   */
  return 'hover-only';
}

function shouldCloseAnchoredTooltipEntry(
  entry: AnchoredTooltipCloseEntry,
  scope: CloseAllLayerScope,
): boolean {
  if (scope === 'all') {
    return true;
  }
  if (scope === 'click-only') {
    return !entry.dismissOnBarInteract;
  }
  return entry.dismissOnBarInteract;
}

function isShellDebugLauncherTooltipHost(host: HTMLElement | null | undefined): boolean {
  if (!host) return false;
  if (host.matches('[data-dev-inspect-teleport-host]') || host.querySelector('[data-dev-inspect-teleport-host]')) {
    return true;
  }
  return Boolean(host.querySelector(SHELL_DEBUG_FLOAT_CONTENT_MARKERS));
}

/** `.app-preview` 内或 teleport 到 body 的业务 AnchoredTooltip / Flotation / Popover 宿主。 */
function isBusinessAppAnchoredTooltipHost(host: HTMLElement | null | undefined): boolean {
  if (!host?.isConnected) return false;
  if (isShellDebugLauncherTooltipHost(host)) return false;
  if (isShellDebugUiElement(host)) return false;

  const preview = document.querySelector('.app-preview');
  if (preview?.contains(host)) return true;

  if (!host.matches('[id^="eds-tooltip-v-"]')) return false;
  if (host.querySelector(SHELL_DEBUG_FLOAT_CONTENT_MARKERS)) return false;
  return Boolean(
    host.querySelector('.eds-popover, .eds-flotation-menu, .glassMicroFloatHostActive'),
  );
}

/**
 * 壳层 QA/Model/Wnd 开 Popover 时 closeAll 须保留业务浮层（与 §1.4 预览区互斥不同轴）。
 */
function shouldPreserveBusinessWhenShellFloatCoexists(
  host: HTMLElement | null,
  explicitExcept: HTMLElement | null,
): boolean {
  if (!isBusinessAppAnchoredTooltipHost(host)) return false;
  if (explicitExcept instanceof HTMLElement && isShellDebugUiElement(explicitExcept)) {
    return true;
  }
  return false;
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

function shouldPreserveBusinessAnchoredTooltipClose(
  entry: AnchoredTooltipCloseEntry,
  host: HTMLElement | null,
  explicitExcept?: HTMLElement | null,
): boolean {
  if (isShellDebugLauncherTooltipHost(host)) {
    return false;
  }
  if (entry.dismissOnBarInteract) {
    return false;
  }
  if (developerInspectActive.value || isShellDebugUiInteractionPending()) {
    return true;
  }
  /*
   * Dev 外层 hover EgTooltip 打开时会 closeAll(except 壳内 trigger)，须保留业务 click Popover（批处理等）。
   */
  if (explicitExcept instanceof HTMLElement && isShellDebugUiElement(explicitExcept)) {
    return true;
  }
  return false;
}

function invokeAnchoredTooltipClose(
  entry: AnchoredTooltipCloseEntry,
  explicitExcept?: HTMLElement | null,
): void {
  const host = entry.getHostElement?.() ?? null;
  if (
    developerInspectActive.value
    && isShellDebugLauncherTooltipHost(host)
  ) {
    return;
  }
  if (shouldPreserveBusinessAnchoredTooltipClose(entry, host, explicitExcept)) {
    return;
  }
  entry.close();
}

export function registerAnchoredTooltipClose(
  handler: () => void,
  options?: { dismissOnBarInteract?: boolean; getHostElement?: () => HTMLElement | null },
): () => void {
  const entry: AnchoredTooltipCloseEntry = {
    close: () => {
      const host = options?.getHostElement?.() ?? null;
      if (
        developerInspectActive.value
        && isShellDebugLauncherTooltipHost(host)
      ) {
        return;
      }
      handler();
    },
    dismissOnBarInteract: options?.dismissOnBarInteract ?? true,
    getHostElement: options?.getHostElement,
  };
  closeHandlers.add(entry);
  return () => {
    closeHandlers.delete(entry);
  };
}

export function closeAllAnchoredTooltips(options?: CloseAllAnchoredTooltipsOptions): void {
  const explicitExcept = options?.exceptAncestorsOf ?? null;
  const closeScope = inferCloseAllLayerScope(options);
  const shellDebugExcept = resolveShellDebugFloatExceptNode();
  const batchAmlExcept = resolveBatchAmlGateExceptAnchor();

  closeHandlers.forEach((entry) => {
    if (!shouldCloseAnchoredTooltipEntry(entry, closeScope)) {
      return;
    }

    const host = entry.getHostElement?.() ?? null;

    if (isShellDebugLauncherTooltipHost(host)) {
      return;
    }

    if (
      hostContainsExceptNode(host, explicitExcept)
      || hostContainsExceptNode(host, shellDebugExcept)
      || hostContainsExceptNode(host, batchAmlExcept)
      || shouldPreserveBatchLabelPopoverDuringAmlGate(entry, batchAmlExcept)
      || shouldPreserveBusinessWhenShellFloatCoexists(host, explicitExcept)
      || shouldPreserveBusinessAnchoredTooltipClose(entry, host, explicitExcept)
    ) {
      return;
    }

    invokeAnchoredTooltipClose(entry, explicitExcept);
  });
}

export function closeBarBlockingAnchoredTooltips(): void {
  if (developerInspectActive.value || isShellDebugUiInteractionPending()) {
    return;
  }

  closeHandlers.forEach((entry) => {
    if (!entry.dismissOnBarInteract) {
      return;
    }
    invokeAnchoredTooltipClose(entry);
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
