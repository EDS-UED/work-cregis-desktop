import { nextTick } from 'vue';
import { approvalFlowRegistry } from '@/scenes/tasks/approval/approvalFlowContext';
import { signingFlowRegistry } from '@/scenes/tasks/signing/signingFlowContext';
import { CURRENCY_DEMO_ROW_WITH_TAGS_INDEX } from '@/scenes/tasks/list-field/listFieldCurrencyTagCustomize';
import { MINER_FEE_QA_SIGNING_ROW } from '@/scenes/tasks/shared/minerFeeQaSigningRows';
import { resetShellDebugScenarioBaseline } from '../../signingScenarioActions';

async function openMultiSenderAddressDetailsFromFlow(
  openDetailForRow: (row: { id: number }) => void,
  openViewMore: (side: 'sender' | 'receiver') => void,
) {
  openDetailForRow({ id: CURRENCY_DEMO_ROW_WITH_TAGS_INDEX });
  await nextTick();
  openViewMore('sender');
}

async function openSigningDetailForMinerFeeQa(rowIndex: number) {
  resetShellDebugScenarioBaseline();
  await nextTick();

  const flow = signingFlowRegistry.value;
  if (!flow) return;

  flow.openDetailForRow({ id: rowIndex });
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

export async function applyTaskMinerFeeBitcoinNormalSigningQa() {
  await openSigningDetailForMinerFeeQa(MINER_FEE_QA_SIGNING_ROW.bitcoinNormal);
}

export async function applyTaskMinerFeeEvmNormalSigningQa() {
  await openSigningDetailForMinerFeeQa(MINER_FEE_QA_SIGNING_ROW.evmNormal);
}

export async function applyTaskMinerFeeEvmGasInsufficientSigningQa() {
  await openSigningDetailForMinerFeeQa(MINER_FEE_QA_SIGNING_ROW.evmGasBalanceInsufficient);
}

export async function applyTaskMinerFeeEvmAddressPaymentSigningQa() {
  await openSigningDetailForMinerFeeQa(MINER_FEE_QA_SIGNING_ROW.evmSponsoredPaymentDisabled);
}

export async function applyTaskMinerFeeTonNormalSigningQa() {
  await openSigningDetailForMinerFeeQa(MINER_FEE_QA_SIGNING_ROW.theOpenNetworkNormal);
}

export async function applyTaskMinerFeeTronNormalSigningQa() {
  await openSigningDetailForMinerFeeQa(MINER_FEE_QA_SIGNING_ROW.tronNormal);
}

export async function applyTaskMinerFeeTronInactiveRecipientSigningQa() {
  await openSigningDetailForMinerFeeQa(MINER_FEE_QA_SIGNING_ROW.tronRecipientInactive);
}

export async function applyTaskMinerFeeTronTeamBalanceInsufficientSigningQa() {
  await openSigningDetailForMinerFeeQa(MINER_FEE_QA_SIGNING_ROW.tronTeamBalanceInsufficient);
}

/** 待签名 · 多发送方地址详情。 */
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
