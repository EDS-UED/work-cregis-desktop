import { replaceShellDebugScenariosForPage } from '../registry';
import {
  applyTransactionRecordParallelOutDetailScenario,
  applyTransactionRecordParallelOutLinesScenario,
} from './transactionRecordScenarioActions';

export function registerTransactionRecordScenarioPack() {
  replaceShellDebugScenariosForPage('Report:Report', [
    {
      id: 'transaction-record-parallel-out-detail',
      pageKey: 'Report:Report',
      label: '并行转出详情（BTC）',
      description: '第 10 行并行转出 · BTC · 详情主页（含 8 笔 + 查看明细入口）。',
      apply: applyTransactionRecordParallelOutDetailScenario,
    },
    {
      id: 'transaction-record-parallel-out-lines',
      pageKey: 'Report:Report',
      label: '交易笔数明细',
      description: '并行转出 BTC · 直接进入交易笔数明细子页（EgDataList + 分页器）。',
      apply: applyTransactionRecordParallelOutLinesScenario,
    },
  ]);
}

registerTransactionRecordScenarioPack();
