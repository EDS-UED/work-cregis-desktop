import type { CryptoAddressSideTags } from '@eds/desktop-components';
import {
  RECEIVER_BLACKLIST_FEEDBACK_UI_KEY,
  addressEntriesIncludeAddressRisk,
  addressEntryHasBlacklist,
} from './hasBlacklistAddressTags';

/** L0 · 协作任务 AML 拦截 mock 契约（真 API 字段对齐前由地址 Tag 推导）。 */
export type DetailTaskAmlInterceptLevel = 'none' | 'danger' | 'blacklist';

export type DetailTaskAmlInterceptState = {
  level: DetailTaskAmlInterceptLevel;
  /** L2：签名/通过前须 EgDialog 确认（替换按钮硬禁用）。 */
  requiresSignAckBeforePass: boolean;
  alertTitleKey: string;
  alertMessageKey: string;
};

export type DetailTaskAmlAddressEntry = {
  tags?: string[];
  addressTags?: CryptoAddressSideTags;
};

/**
 * 待签名列表演示行（0-based rowIndex，见 tasksListFieldCurrencyDemoRow）：
 * - 1：TON + 接收方黑名单 Tag
 * - 2：接收方黑名单 + 多自定义 Tag
 */
export const DETAIL_TASK_AML_INTERCEPT_DEMO_SIGNING_ROW_INDICES = [1, 2] as const;

const NONE_STATE: DetailTaskAmlInterceptState = {
  level: 'none',
  requiresSignAckBeforePass: false,
  alertTitleKey: '',
  alertMessageKey: '',
};

function resolveLevel(
  receivers: readonly DetailTaskAmlAddressEntry[],
  translate?: (key: string) => string,
): DetailTaskAmlInterceptLevel {
  if (receivers.some((entry) => addressEntryHasBlacklist(entry, translate))) {
    return 'blacklist';
  }
  if (addressEntriesIncludeAddressRisk(receivers, translate)) {
    return 'danger';
  }
  return 'none';
}

export function resolveDetailTaskAmlInterceptFromReceivers(
  receivers: readonly DetailTaskAmlAddressEntry[],
  translate?: (key: string) => string,
): DetailTaskAmlInterceptState {
  const level = resolveLevel(receivers, translate);
  if (level === 'none') {
    return NONE_STATE;
  }

  if (level === 'blacklist') {
    return {
      level,
      requiresSignAckBeforePass: true,
      alertTitleKey: 'Blacklisted Address',
      alertMessageKey: RECEIVER_BLACKLIST_FEEDBACK_UI_KEY,
    };
  }

  return {
    level: 'danger',
    requiresSignAckBeforePass: true,
    alertTitleKey: 'Task AML dangerous address confirm title',
    alertMessageKey: 'Task AML dangerous address confirm message',
  };
}

export type DetailTaskAmlPassInterceptKind = 'none' | 'danger-popover' | 'blacklist-dialog';

export function resolveDetailTaskAmlPassInterceptKind(
  intercept: DetailTaskAmlInterceptState,
  acknowledgedForCurrentDetail: boolean,
): DetailTaskAmlPassInterceptKind {
  if (!intercept.requiresSignAckBeforePass || acknowledgedForCurrentDetail) {
    return 'none';
  }
  if (intercept.level === 'danger') return 'danger-popover';
  return 'blacklist-dialog';
}
