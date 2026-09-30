import type { EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import { buildDataListCurrencyFilterOptionsFromRows } from '../../shared/buildDataListCurrencyFilterOptionsFromRows';
import { buildWaasStandardRecordRows } from '../waasStandardRecordData';
import type { WaasSubAddressCurrencySelection } from '../waasSubAddressCurrencyPickerData';

/** 从 WaaS 列表 mock 行扫描币种列，生成 EgFilter 币种选项。 */
export function buildWaasDataListCurrencyFilterOptions(
  rowCount: number,
  menuItem: string,
  subAddressCurrency?: WaasSubAddressCurrencySelection,
): EgFilterFieldCurrencyOption[] {
  const safeRowCount = Math.max(0, rowCount);
  const rows = buildWaasStandardRecordRows(menuItem, safeRowCount, subAddressCurrency);
  return buildDataListCurrencyFilterOptionsFromRows(rows);
}
