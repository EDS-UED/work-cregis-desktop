import {
  registerShellDebugScenarios,
  removeShellDebugScenariosByIds,
  replaceShellDebugScenariosForPage,
} from '../../../registry';

/** 已由 `TASKS_MINER_FEE_QA_SCENARIOS` 拆分替代；须显式移除以免 HMR 残留。 */
const DEPRECATED_TASKS_MINER_FEE_QA_SCENARIO_IDS = [
  'tasks-miner-fee-tron-abnormal',
  'tasks-miner-fee-tron-healthy',
] as const;
import {
  applyTaskAddressDetailsMultiSenderApprovalQa,
  applyTaskAddressDetailsMultiSenderSigningQa,
} from './actions';
import { TASKS_MINER_FEE_QA_SCENARIOS } from './minerFeeQaScenarios';
import { TASKS_APPROVAL_PAGE_KEY, TASKS_SIGNING_PAGE_KEY } from './pageKeys';

const ADDRESS_DETAILS_MULTI_SENDER_DESCRIPTION =
  '协作详情发送方「23 笔」：960×596 EgPopup + Address / Amount / Memo / Remark 标准 EgDataList 与分页。';

export function registerTasksQaPacks() {
  replaceShellDebugScenariosForPage(TASKS_APPROVAL_PAGE_KEY, [
    {
      id: 'tasks-address-details-multi-sender',
      pageKey: TASKS_APPROVAL_PAGE_KEY,
      label: '地址详情（多发送方）',
      description: ADDRESS_DETAILS_MULTI_SENDER_DESCRIPTION,
      apply: applyTaskAddressDetailsMultiSenderApprovalQa,
    },
  ]);

  removeShellDebugScenariosByIds([
    ...DEPRECATED_TASKS_MINER_FEE_QA_SCENARIO_IDS,
    ...TASKS_MINER_FEE_QA_SCENARIOS.map((scenario) => scenario.id),
  ]);

  /**
   * 待签名：`signingScenarioPack` 已注册单签/多签/批处理等场景；QA 仅追加，禁止 replace 覆盖。
   */
  registerShellDebugScenarios([
    {
      id: 'tasks-address-details-multi-sender',
      pageKey: TASKS_SIGNING_PAGE_KEY,
      label: '地址详情（多发送方）',
      description: ADDRESS_DETAILS_MULTI_SENDER_DESCRIPTION,
      apply: applyTaskAddressDetailsMultiSenderSigningQa,
    },
    ...TASKS_MINER_FEE_QA_SCENARIOS,
  ]);
}

registerTasksQaPacks();
