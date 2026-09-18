import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { transactionRecordDetailFlowRegistry } from '@/scenes/transaction-records/transactionRecordDetailFlowContext';
import { transactionRecordsDataListShellApiRegistry } from '@/scenes/transaction-records/transactionRecordsDataListShellApi';
import { clearQaLoadingTimeout } from './commonScenarioActions';

export function resetTransactionRecordScenarioBaseline() {
  clearQaLoadingTimeout();
  closeAllAnchoredTooltips();

  const flow = transactionRecordDetailFlowRegistry.value;
  if (flow) {
    flow.detailOpen.value = false;
    flow.resetDetailNavigation();
  }

  const api = transactionRecordsDataListShellApiRegistry.value;
  api?.setListEmpty(false);
  api?.setListIniting(false);
  api?.setListLoading(false);
}

/** 并行转出（BTC）详情主页。 */
export function applyTransactionRecordParallelOutDetailScenario() {
  resetTransactionRecordScenarioBaseline();
  transactionRecordDetailFlowRegistry.value?.openParallelOutBtcDetailDemo('summary');
}

/** 并行转出（BTC）交易笔数明细子页。 */
export function applyTransactionRecordParallelOutLinesScenario() {
  resetTransactionRecordScenarioBaseline();
  transactionRecordDetailFlowRegistry.value?.openParallelOutBtcDetailDemo(
    'parallel-out-lines',
  );
}
