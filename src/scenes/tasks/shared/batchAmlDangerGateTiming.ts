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
 * - 直点（签名）：EgDataList `batchLoadingKey` 已展示 eds-load，仅对齐时长，勿再叠 CSS ::after 转圈。
 */
export async function waitForBatchAmlGateAfterPrepLoading(
  prepKind: BatchAmlDangerGatePrepKind,
  _anchor?: HTMLElement | null,
): Promise<void> {
  await delay(BATCH_AML_GATE_PREP_LOADING_MS);
  await delay(BATCH_AML_GATE_LOADING_VISIBLE_MS);
  void prepKind;
}
