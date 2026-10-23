import { shallowRef } from 'vue';
import { selectAppShellModuleMenuItem } from '@/app/appShellMenuNavigation';
import type { RiskControlBlacklistCreateDraft } from './riskControlBlacklistCreateTypes';

const pendingDraft = shallowRef<RiskControlBlacklistCreateDraft | null>(null);

/** AML 详情「新增黑名单」：切到黑名单列表并打开创建页（地址/网络预填）。 */
export function navigateToBlacklistCreateFromAml(draft: RiskControlBlacklistCreateDraft) {
  pendingDraft.value = draft;
  selectAppShellModuleMenuItem('Blacklist');
}

export function consumeRiskControlBlacklistCreateIntent(): RiskControlBlacklistCreateDraft | null {
  const draft = pendingDraft.value;
  pendingDraft.value = null;
  return draft;
}
