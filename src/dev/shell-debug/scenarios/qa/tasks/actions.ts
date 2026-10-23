import { nextTick } from 'vue';
import { approvalFlowRegistry } from '@/scenes/tasks/approval/approvalFlowContext';
import { signingFlowRegistry } from '@/scenes/tasks/signing/signingFlowContext';
import { CURRENCY_DEMO_ROW_WITH_TAGS_INDEX } from '@/scenes/tasks/list-field/listFieldCurrencyTagCustomize';
import { resetShellDebugScenarioBaseline } from '../../signingScenarioActions';

async function openMultiSenderAddressDetailsFromFlow(
  openDetailForRow: (row: { id: number }) => void,
  openViewMore: (side: 'sender' | 'receiver') => void,
) {
  openDetailForRow({ id: CURRENCY_DEMO_ROW_WITH_TAGS_INDEX });
  await nextTick();
  openViewMore('sender');
}

/** 待审批 · 第 3 条（23 笔发送方）→ 地址详情 EgPopup + EgDataList。 */
export async function applyTaskAddressDetailsMultiSenderApprovalQa() {
  resetShellDebugScenarioBaseline();
  await nextTick();

  const flow = approvalFlowRegistry.value;
  if (!flow) return;

  await openMultiSenderAddressDetailsFromFlow(
    (row) => flow.openDetailForRow(row),
    (side) => flow.openViewMore(side),
  );
}

/** 待签名 · 同上（多发送方地址详情）。 */
export async function applyTaskAddressDetailsMultiSenderSigningQa() {
  resetShellDebugScenarioBaseline();
  await nextTick();

  const flow = signingFlowRegistry.value;
  if (!flow) return;

  await openMultiSenderAddressDetailsFromFlow(
    (row) => flow.openDetailForRow(row),
    (side) => flow.openViewMore(side),
  );
}
