/**
 * EgDataList 演示 / mock 数据统一规则（work.mdc §7.8）。
 * 各业务列表须消费本模块，禁止平行再造币种顺序或伪造地址 / 哈希。
 */

import {
  getPinnedAddressForRow,
  resolveSampleAddressForSymbol,
  resolveVerifiedTxHashForRow,
  sideAddressPoolIndex,
  type CryptoAddressFamily,
} from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import {
  buildAmountRowValues,
  type AmountRowValues,
} from '@/scenes/tasks/list-field/tasksListFieldAmountRowData';
import {
  buildCurrencyRowPresetCustomize,
  resolveCurrencyRowPreset,
  resolveCurrencySymbolForRow,
} from '@/scenes/tasks/list-field/tasksListFieldCurrencyRowData';
import {
  CURRENCY_ROW_PRESETS,
  FIXED_CURRENCY_PRESET_ROW_COUNT,
  type CurrencyRowPreset,
} from '@/scenes/tasks/list-field/tasksListFieldCurrencyRowPresets';

export {
  buildAmountRowValues,
  buildCurrencyRowPresetCustomize,
  CURRENCY_ROW_PRESETS,
  FIXED_CURRENCY_PRESET_ROW_COUNT,
  getPinnedAddressForRow,
  resolveCurrencyRowPreset,
  resolveCurrencySymbolForRow,
  resolveSampleAddressForSymbol,
  resolveVerifiedTxHashForRow,
  sideAddressPoolIndex,
};
export type { AmountRowValues, CryptoAddressFamily, CurrencyRowPreset };

/** 前 N 行按序展示模块状态全集，其后统一为完成类终态。 */
export function resolveShowcaseThenCompletedStatus<T extends string>(
  index: number,
  showcaseStatuses: readonly T[],
  completedStatus: T,
): T {
  return showcaseStatuses[index] ?? completedStatus;
}

/** 按 Tasks 首列 preset + 地址池生成演示钱包地址（链上真实样本）。 */
export function resolveDemoWalletAddress(
  rowIndex: number,
  preset: CurrencyRowPreset,
  side: 'from' | 'to' = 'from',
): string {
  if (side === 'from') {
    const pinned = getPinnedAddressForRow(rowIndex);
    if (pinned) return pinned;
  }

  const poolIndex = sideAddressPoolIndex(side, rowIndex + 1);
  return resolveSampleAddressForSymbol(preset.symbol, poolIndex, preset.addressFamily);
}

/** 按 rowIndex 生成 seeded 随机金额（前 8 行固定 preset，见 tasksListFieldAmountRowPresets）。 */
export function resolveDemoAmountRowValues(rowIndex: number): AmountRowValues {
  return buildAmountRowValues(rowIndex);
}

export function buildDemoHexRecordId(index: number, salt = 0): string {
  const suffix = (0x26883c600 + index + salt).toString(16).padStart(12, '0');
  return `897bfc89f49640cca5553ad${suffix}`;
}

/** 从 EgDataList 演示行 id 反推 0-based rowIndex（供 list-field customize 对齐 preset）。 */
export function resolveEgDataListDemoRowIndex(row: { id: string }): number {
  const bulkMatch = row.id.match(/^(?:BT|WP|PE)-(\d+)$/);
  if (bulkMatch) return Math.max(0, Number(bulkMatch[1]) - 88001);

  const refundMatch = row.id.match(/^RF-(\d+)$/);
  if (refundMatch) return Math.max(0, Number(refundMatch[1]) - 77001);

  const callbackMatch = row.id.match(/^CB-(\d+)$/);
  if (callbackMatch) return Math.max(0, Number(callbackMatch[1]) - 91001);

  const orderMatch = row.id.match(/^po1442856738070(\d+)$/);
  if (orderMatch) {
    const suffix = Number(orderMatch[1]);
    if (suffix >= 528) return suffix - 528;
  }

  const txMatch = row.id.match(/^tx-(\d+)$/);
  if (txMatch) return Math.max(0, Number(txMatch[1]) - 1);

  return 0;
}
