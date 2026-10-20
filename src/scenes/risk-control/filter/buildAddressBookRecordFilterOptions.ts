import type { EgFilterFieldCurrencyOption } from '@eds/desktop-components';
import { buildDataListCurrencyFilterOptionsFromRows } from '@/scenes/shared/buildDataListCurrencyFilterOptionsFromRows';
import { buildRiskControlRecordRows } from '@/scenes/risk-control/riskControlRecordData';
import { resolveRiskControlRecordMenuItem } from '@/scenes/risk-control/riskControlMenuData';

export function buildAddressBookRecordCurrencyFilterOptions(
  menuItem: string,
  rowCount: number,
): EgFilterFieldCurrencyOption[] {
  const resolvedMenuItem = resolveRiskControlRecordMenuItem(menuItem);
  const rows = buildRiskControlRecordRows(resolvedMenuItem, rowCount);
  return buildDataListCurrencyFilterOptionsFromRows(rows);
}
