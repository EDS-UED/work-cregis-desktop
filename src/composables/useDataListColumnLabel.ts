import { computed, type ComputedRef } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  formatDataListTimeColumnTitle,
} from '@/scenes/shared/dataListTimeLabelKeys';
import { useAppUserTimezoneSelection } from '@/scenes/shared/appUserTimezoneSession';
import { useTeamAccountTimezoneSelection } from '@/scenes/shared/teamAccountTimezoneSession';

export {
  dataListTimeCatalogBaseFromLabelKey,
  isDataListTimeCatalogKey,
  formatDataListTimeColumnTitle,
} from '@/scenes/shared/dataListTimeLabelKeys';

/** EgDataList 列头：时间/日期 catalog 追加个人/团队时区 offset。 */
export function useDataListColumnLabel(scope: 'user' | 'team' = 'user') {
  const { ui, locale } = useAppI18n();
  const userTz = useAppUserTimezoneSelection();
  const teamTz = useTeamAccountTimezoneSelection();

  const offsetLabel: ComputedRef<string> = computed(() =>
    scope === 'team' ? teamTz.offsetLabel.value : userTz.offsetLabel.value,
  );

  const timezoneRevision = computed(() =>
    scope === 'team' ? teamTz.selectedIndex.value : userTz.selectedIndex.value,
  );

  function dataListColumnLabel(labelKey: string | undefined | null): string {
    void locale.value;
    void timezoneRevision.value;
    if (labelKey == null || labelKey === '') return '';
    return formatDataListTimeColumnTitle(ui, labelKey, offsetLabel.value);
  }

  return {
    dataListColumnLabel,
    offsetLabel,
    timezoneRevision,
  };
}
