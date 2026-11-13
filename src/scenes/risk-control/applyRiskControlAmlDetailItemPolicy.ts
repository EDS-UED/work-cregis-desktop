import type { DetailItemData, DetailSectionData } from '@eds/desktop-components';

/**
 * AML 分支详情（查询记录 / 自动规则 / 日志）：仅隐藏行内「AML 筛查」；
 * 地址簿、设备信息等其它挂件保留。
 */
export function applyRiskControlAmlDetailItemPolicy(
  item: DetailItemData,
): DetailItemData {
  if (!item.showValueAmlSearch) {
    return item;
  }
  return {
    ...item,
    showValueAmlSearch: false,
  };
}

export function applyRiskControlAmlDetailSectionsPolicy(
  sections: DetailSectionData[],
): DetailSectionData[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map(applyRiskControlAmlDetailItemPolicy),
  }));
}
