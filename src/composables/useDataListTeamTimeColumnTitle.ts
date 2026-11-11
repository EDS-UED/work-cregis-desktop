import { computed, type ComputedRef } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatDataListTimeColumnTitle } from '@/scenes/shared/dataListTimeLabelKeys';
import { useTeamAccountTimezoneSelection } from '@/scenes/shared/teamAccountTimezoneSession';

/** 团队账户 · 概览时区 → 费用 / Gas 等列头（与个人偏好独立）。 */
export function useDataListTeamTimeColumnTitle(catalogBaseKey = 'Time'): ComputedRef<string> {
  const { ui, locale } = useAppI18n();
  const { offsetLabel, selectedIndex } = useTeamAccountTimezoneSelection();
  return computed(() => {
    void locale.value;
    void selectedIndex.value;
    return formatDataListTimeColumnTitle(ui, catalogBaseKey, offsetLabel.value);
  });
}
