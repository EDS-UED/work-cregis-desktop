export type ShellDebugLauncherPopoverId = 'model' | 'wnd' | 'qa';

const closers = new Map<ShellDebugLauncherPopoverId, () => void>();

/** EgAnchoredPopover 壳层启动器（Model / Wnd / QA）登记 close，便于 Dev 进入时互斥关闭。 */
export function registerShellDebugLauncherPopover(
  id: ShellDebugLauncherPopoverId,
  close: () => void,
): () => void {
  closers.set(id, close);
  return () => {
    if (closers.get(id) === close) {
      closers.delete(id);
    }
  };
}

/**
 * 打开某一壳层 Popover 前调用：关闭其它已登记的 Model / Wnd / QA。
 * 不调用 `closeAllAnchoredTooltips`（业务 click 浮层保持）。
 */
export function openShellDebugLauncherPopoverExclusive(
  opening: ShellDebugLauncherPopoverId,
): void {
  closeShellDebugLauncherPopovers(opening);
}

/** 关闭已登记的壳层 Popover；不触碰业务区 AnchoredTooltip / Popover。 */
export function closeShellDebugLauncherPopovers(
  except?: ShellDebugLauncherPopoverId,
): void {
  closers.forEach((close, id) => {
    if (id === except) return;
    close();
  });
}
