import { replaceShellDebugScenariosForPage } from '../registry';
import { createWaasOrderModeBusinessScenario } from './waasScenarioPack';
import { applyWaasBulkTransferDetailScenario } from './waasBulkTransferScenarioActions';

export function registerWaasBulkTransferScenarioPack() {
  replaceShellDebugScenariosForPage('WaaS:Bulk Transfer Record', [
    createWaasOrderModeBusinessScenario('WaaS:Bulk Transfer Record'),
    {
      id: 'waas-bulk-transfer-record-detail-motion',
      pageKey: 'WaaS:Bulk Transfer Record',
      label: '详情 · motion-page 进详情',
      description:
        '打开第 1 行批量转账记录整页详情（右滑入）；点 ToolBar 返回应反向滑出。',
      apply: applyWaasBulkTransferDetailScenario,
    },
  ]);
}

registerWaasBulkTransferScenarioPack();
