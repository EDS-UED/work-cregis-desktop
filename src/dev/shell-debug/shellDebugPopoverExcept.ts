import { SHELL_DEBUG_FLOAT_CONTENT_MARKERS } from './shellDebugUiScope';

/** QA TestScenarioMode 根节点；closeAll 时保留所在 AnchoredTooltip 宿主。 */
let qaPopoverExceptRoot: HTMLElement | null = null;

/** ShellDebugLauncherAnchored 内容区（QA / Model / Wnd 共用）。 */
let launcherPopoverExceptRoot: HTMLElement | null = null;

export function registerShellDebugQaPopoverExceptRoot(root: HTMLElement | null): void {
  qaPopoverExceptRoot = root;
}

export function unregisterShellDebugQaPopoverExceptRoot(): void {
  qaPopoverExceptRoot = null;
}

export function registerShellDebugLauncherPopoverExceptRoot(root: HTMLElement | null): void {
  launcherPopoverExceptRoot = root;
}

export function unregisterShellDebugLauncherPopoverExceptRoot(): void {
  launcherPopoverExceptRoot = null;
}

/**
 * closeAll 的 exceptAncestorsOf：须落在「待保留」Popover 的 floating 宿主内部。
 * 全局 querySelector 可能命中其它已卸载/隐藏的壳层节点，导致 QA 被误关。
 */
export function resolveShellDebugFloatExceptNode(): HTMLElement | null {
  if (launcherPopoverExceptRoot && document.contains(launcherPopoverExceptRoot)) {
    return launcherPopoverExceptRoot;
  }

  if (qaPopoverExceptRoot && document.contains(qaPopoverExceptRoot)) {
    return qaPopoverExceptRoot;
  }

  const markerSelectors = SHELL_DEBUG_FLOAT_CONTENT_MARKERS.split(',')
    .map((selector) => selector.trim())
    .filter(Boolean);

  for (const host of document.querySelectorAll('[id^="eds-tooltip-v-"]')) {
    if (!(host instanceof HTMLElement)) continue;
    if (!host.querySelector('.glassMicroFloatHostActive')) continue;

    for (const selector of markerSelectors) {
      const node = host.querySelector(selector);
      if (node instanceof HTMLElement) {
        return node;
      }
    }
  }

  for (const selector of markerSelectors) {
    const node = document.querySelector(selector);
    if (node instanceof HTMLElement) {
      return node;
    }
  }

  return null;
}
