/**
 * click / hover 锚定浮层同屏：须 **始终** 包装 document capture outside-dismiss（不仅 Shell Debug）。
 * 与 installShellDebugFloatLayerGuard 共用同一 patch，避免重复注册。
 */
import { installShellDebugFloatLayerGuard } from '@/dev/shell-debug/installShellDebugFloatLayerGuard';

let coexistGuardRequested = false;

export function installAnchoredTooltipCoexistGuard(): void {
  if (coexistGuardRequested) {
    return;
  }
  coexistGuardRequested = true;
  installShellDebugFloatLayerGuard();
}
