import {
  registerShellDebugScenarios,
  replaceShellDebugScenariosForPage,
} from '../../../registry';
import {
  applyTaskAddressDetailsMultiSenderApprovalQa,
  applyTaskAddressDetailsMultiSenderSigningQa,
} from './actions';
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
  ]);
}

registerTasksQaPacks();
