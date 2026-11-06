import type { OverviewBalanceReminderFormState } from './overviewBalanceReminderSkidData';
import {
  OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS,
  OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS,
} from './overviewBalanceReminderSkidData';

export function cloneOverviewBalanceReminderFormState(
  state: OverviewBalanceReminderFormState,
): OverviewBalanceReminderFormState {
  return {
    featureEnabled: state.featureEnabled,
    amountByKey: { ...state.amountByKey },
    thresholdByKey: { ...state.thresholdByKey },
    recipientById: { ...state.recipientById },
  };
}

/** 提醒金额 + 提醒对象（不含顶部开关）。 */
export function overviewBalanceReminderReminderSettingsEqual(
  a: OverviewBalanceReminderFormState,
  b: OverviewBalanceReminderFormState,
): boolean {
  for (const { key } of OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS) {
    if (a.amountByKey[key] !== b.amountByKey[key]) return false;
    if (a.thresholdByKey[key] !== b.thresholdByKey[key]) return false;
  }

  for (const { id } of OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS) {
    if (a.recipientById[id] !== b.recipientById[id]) return false;
  }

  return true;
}

export function overviewBalanceReminderFormsEqual(
  a: OverviewBalanceReminderFormState,
  b: OverviewBalanceReminderFormState,
): boolean {
  if (a.featureEnabled !== b.featureEnabled) return false;
  return overviewBalanceReminderReminderSettingsEqual(a, b);
}
