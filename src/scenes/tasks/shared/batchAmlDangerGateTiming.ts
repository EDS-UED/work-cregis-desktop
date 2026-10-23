import { BATCH_AML_SIMULATED_PREP_CLASS } from './batchAmlDangerGateChrome';

/** 与 EDS AnchoredPopover · PREP_LOADING_DELAY_MS 一致。 */
export const BATCH_AML_GATE_PREP_LOADING_MS = 500;

/** prep 转圈展示时长；AML 须在其后再开。 */
export const BATCH_AML_GATE_LOADING_VISIBLE_MS = 500;

export type BatchAmlDangerGatePrepKind =
  | 'label-popover-before-open'
  | 'direct-batch-action';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * 点击「通过/签名」后的 Loading 阶段：
 * - Popover beforeOpen：EDS 在 prep 500ms 后才出转圈，再等 500ms 开 AML。
 * - 直点（签名）：本地模拟同等 prep + 转圈，再开 AML。
 */
export async function waitForBatchAmlGateAfterPrepLoading(
  prepKind: BatchAmlDangerGatePrepKind,
  anchor?: HTMLElement | null,
): Promise<void> {
  await delay(BATCH_AML_GATE_PREP_LOADING_MS);

  if (prepKind === 'direct-batch-action' && anchor?.isConnected) {
    anchor.classList.add(BATCH_AML_SIMULATED_PREP_CLASS);
    try {
      await delay(BATCH_AML_GATE_LOADING_VISIBLE_MS);
    } finally {
      anchor.classList.remove(BATCH_AML_SIMULATED_PREP_CLASS);
    }
    return;
  }

  await delay(BATCH_AML_GATE_LOADING_VISIBLE_MS);
}
