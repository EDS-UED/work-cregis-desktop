import { MAX_CURRENCY_SIDE_ADDRESSES, currencyAddressTagsEnabledKey } from './listFieldCurrencyShared';
import {
  CURRENCY_CUSTOM_TAG_DEFAULT_COUNT,
  CURRENCY_DEMO_ROW_TON_AML_TAG_INDEX,
  CURRENCY_DEMO_ROW_WITH_TAGS_INDEX,
  currencyAddressAmlListStatusTagOverrides,
  currencyAddressBlacklistTagOverrides,
  currencyAddressDangerTagOverrides,
  currencyAddressCustomTagOverrides,
  currencyTagItemKey,
  currencyTagShowKey,
} from './listFieldCurrencyTagCustomize';
import { DANGER_LABEL_KEY } from '../shared/hasBlacklistAddressTags';
import { TASK_ADDRESS_DETAILS_MOCK_ROW_COUNT } from '../shared/taskAddressDetailsPopup.constants';
import {
  resolveSampleAddressForSymbol,
  sideAddressPoolIndex,
} from './listFieldCryptoSampleAddresses';
import { resolveCurrencyRowPreset } from './tasksListFieldCurrencyRowData';
import {
  tasksDataListShowsAddressBlacklist,
  tasksDataListShowsAmlRiskListStatusDemo,
} from '../tasksDataListPageData';
import {
  TASK_AML_RISK_INTERCEPT_DEMO_ROW_INDEX,
  TASK_AML_RISK_INTERCEPT_STATUS_LABEL,
  TASK_AML_RISK_QUERY_DEMO_ROW_INDEX,
  TASK_AML_RISK_QUERY_STATUS_LABEL,
} from './tasksListFieldStatusRowData';

function seededFraction(seed: number): number {
  const x = Math.sin(seed * 9973) * 10000;
  return x - Math.floor(x);
}

/** 第 1 条（0-based index 0）：接收方地址别名。 */
export const CURRENCY_DEMO_ROW_FIRST_TO_ALIAS_INDEX = 0;

/** 第 20 条（0-based index 19）：接收方 20 地址。 */
export const CURRENCY_DEMO_ROW_MULTI_TO_ADDRESSES_INDEX = 19;
const CURRENCY_DEMO_ROW_MULTI_TO_ADDRESS_COUNT = MAX_CURRENCY_SIDE_ADDRESSES;

function buildDemoSideAddressOverrides(
  customize: Record<string, unknown>,
  prefix: 'from' | 'to',
  count: number,
  rowIndex: number,
): Record<string, unknown> {
  const symbol = String(customize.symbol ?? 'ZEC');
  const preset = resolveCurrencyRowPreset(rowIndex);
  const familyOverride = preset.addressFamily;

  const primaryKey = `${prefix}Address1`;
  const primary = String(customize[primaryKey] ?? '').trim();
  const used = new Set<string>(primary ? [primary] : []);
  const entries: Record<string, unknown> = {};

  const indexOrder = Array.from({ length: count - 1 }, (_, offset) => offset + 2);
  for (let i = indexOrder.length - 1; i > 0; i -= 1) {
    const j = Math.floor(seededFraction(rowIndex * 53 + i) * (i + 1));
    [indexOrder[i], indexOrder[j]] = [indexOrder[j], indexOrder[i]];
  }

  let cursor = 0;
  for (const addressIndex of indexOrder) {
    let poolIndex = sideAddressPoolIndex(prefix, addressIndex + rowIndex * 3);
    let address = resolveSampleAddressForSymbol(symbol, poolIndex, familyOverride);

    while (used.has(address) && cursor < count * 4) {
      cursor += 1;
      poolIndex = sideAddressPoolIndex(prefix, addressIndex + rowIndex * 3 + cursor * 7);
      address = resolveSampleAddressForSymbol(symbol, poolIndex, familyOverride);
    }

    used.add(address);
    if (addressIndex <= MAX_CURRENCY_SIDE_ADDRESSES) {
      entries[`${prefix}Address${addressIndex}`] = address;
    }
  }

  return entries;
}

/** 第 3 条演示行：发送方 / 接收方各 51 笔订单（与地址详情弹窗 mock 行数一致）；接收方 Blacklist + Danger + 4 自定义 Tag。 */
export function applyCurrencyDemoRowOverrides(
  customize: Record<string, unknown>,
  rowIndex: number,
  menuItem?: string,
): Record<string, unknown> {
  const showBlacklist = tasksDataListShowsAddressBlacklist(menuItem);

  if (rowIndex === CURRENCY_DEMO_ROW_FIRST_TO_ALIAS_INDEX) {
    return {
      ...customize,
      toAlias1: 'Alex Mah.',
    };
  }

  /** 第 2 条（TON）：接收方单地址 + AML 危险 tag（仅待审批 / 待签名）。 */
  if (rowIndex === CURRENCY_DEMO_ROW_TON_AML_TAG_INDEX) {
    if (!showBlacklist) return customize;

    return {
      ...customize,
      [currencyAddressTagsEnabledKey('from', 1)]: false,
      [currencyAddressTagsEnabledKey('to', 1)]: true,
      [currencyTagShowKey('to', 1, 'custom')]: false,
      ...currencyAddressDangerTagOverrides('to', 1, 1, true),
    };
  }

  /** 第 6 条（index 5）：列表 Status「待审批」+ 接收方「风控查询中」Tag（与详情 1:1）。 */
  if (
    rowIndex === TASK_AML_RISK_QUERY_DEMO_ROW_INDEX
    && tasksDataListShowsAmlRiskListStatusDemo(menuItem)
  ) {
    return {
      ...customize,
      [currencyAddressTagsEnabledKey('from', 1)]: false,
      ...currencyAddressAmlListStatusTagOverrides(
        'to',
        1,
        TASK_AML_RISK_QUERY_STATUS_LABEL,
        'aml-ready',
      ),
    };
  }

  /** 第 7 条（index 6）：列表 Status「待审批」+ 接收方「风险拦截」Tag（与详情 1:1）。 */
  if (
    rowIndex === TASK_AML_RISK_INTERCEPT_DEMO_ROW_INDEX
    && tasksDataListShowsAmlRiskListStatusDemo(menuItem)
  ) {
    return {
      ...customize,
      [currencyAddressTagsEnabledKey('from', 1)]: false,
      ...currencyAddressAmlListStatusTagOverrides(
        'to',
        1,
        TASK_AML_RISK_INTERCEPT_STATUS_LABEL,
        'aml-danger',
      ),
    };
  }

  if (rowIndex === CURRENCY_DEMO_ROW_WITH_TAGS_INDEX) {
    return {
      ...customize,
      fromAddressCount: '1',
      fromOrderCount: String(TASK_ADDRESS_DETAILS_MOCK_ROW_COUNT),
      toOrderCount: String(TASK_ADDRESS_DETAILS_MOCK_ROW_COUNT),
      fromAlias1: 'Mr. Wang',
      [currencyAddressTagsEnabledKey('from', 1)]: false,
      [currencyAddressTagsEnabledKey('to', 1)]: true,
      ...(showBlacklist ? currencyAddressBlacklistTagOverrides('to', 1, 1, true) : {}),
      ...currencyAddressCustomTagOverrides('to', 1, CURRENCY_CUSTOM_TAG_DEFAULT_COUNT, true),
      [currencyTagItemKey('to', 1, 'custom', 'Label', 1)]: DANGER_LABEL_KEY,
      [currencyTagItemKey('to', 1, 'custom', 'CustomStyle', 1)]: 'aml-danger',
    };
  }

  if (rowIndex === CURRENCY_DEMO_ROW_MULTI_TO_ADDRESSES_INDEX) {
    return {
      ...customize,
      toAddressCount: String(CURRENCY_DEMO_ROW_MULTI_TO_ADDRESS_COUNT),
      ...buildDemoSideAddressOverrides(
        customize,
        'to',
        CURRENCY_DEMO_ROW_MULTI_TO_ADDRESS_COUNT,
        rowIndex,
      ),
    };
  }

  return customize;
}
