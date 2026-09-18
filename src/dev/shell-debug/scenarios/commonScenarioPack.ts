import { replaceShellDebugScenariosForPage } from '../registry';
import {
  applyEmptyPageScenario,
  applyInitingScenario,
  applyLoadingScenario,
} from './commonScenarioActions';

export function registerCommonScenarioPack() {
  replaceShellDebugScenariosForPage('*', [
    {
      id: 'qa-empty-page',
      pageKey: '*',
      label: '空页面',
      description: '列表切至无数据空态（ToolBar + Paginer 保留）；WaaS 模块切至「暂无项目」空态。',
      apply: applyEmptyPageScenario,
    },
    {
      id: 'qa-initing',
      pageKey: '*',
      label: '初始化',
      description: '列表首次加载、尚无数据（DataList initing）。超时时间 60s。',
      apply: applyInitingScenario,
    },
    {
      id: 'qa-loading',
      pageKey: '*',
      label: '加载中',
      description: '已有数据时重新拉取（DataList loading）。超时时间 60s。',
      apply: applyLoadingScenario,
    },
  ]);
}

registerCommonScenarioPack();
