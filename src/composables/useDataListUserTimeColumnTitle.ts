import { computed, type ComputedRef } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatDataListTimeColumnTitle } from '@/scenes/shared/dataListTimeLabelKeys';
import { useAppUserTimezoneSelection } from '@/scenes/shared/appUserTimezoneSession';

/** 全局 DataList 时间列头：catalog 基词 + 个人时区 offset（随偏好设置联动）。 */
export function useDataListUserTimeColumnTitle(catalogBaseKey = 'Time'): ComputedRef<string> {
  const { ui, locale } = useAppI18n();
  const { offsetLabel, selectedIndex } = useAppUserTimezoneSelection();
  return computed(() => {
    void locale.value;
    void selectedIndex.value;
    return formatDataListTimeColumnTitle(ui, catalogBaseKey, offsetLabel.value);
  });
}
