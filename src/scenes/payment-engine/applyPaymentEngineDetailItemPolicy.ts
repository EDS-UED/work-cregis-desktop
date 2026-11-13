import type { DetailItemData, DetailSectionData } from '@eds/desktop-components';

function isPaymentEngineInitiatorItem(item: DetailItemData): boolean {
  const key = item.key ?? '';
  if (/initiat/i.test(key)) return true;
  return item.titleIcon === 'eds-arrow-launch-circle';
}

function isPaymentEngineReceiverItem(item: DetailItemData): boolean {
  const key = item.key ?? '';
  if (key.includes('receiver')) return true;
  return item.titleIcon === 'eds-arrow-down';
}

function isPaymentEngineFeeItem(item: DetailItemData): boolean {
  const key = item.key ?? '';
  if (key.includes('fee')) return true;
  return item.titleIcon === 'eds-usd-settlement';
}

/** 支付引擎详情：去掉 ShowCase 变体 preset 残留（设备信息、地址簿/AML、矿工费代付 tag）。 */
export function applyPaymentEngineDetailItemPolicy(item: DetailItemData): DetailItemData {
  const next: DetailItemData = { ...item };

  if (isPaymentEngineInitiatorItem(item)) {
    next.valueType = 'text';
    next.showValueSymbol = false;
    next.valueSymbolKind = undefined;
    next.valueSymbolAvatarName = undefined;
    next.valueSecondary = undefined;
    next.valueDeviceInfo = undefined;
  }

  if (isPaymentEngineReceiverItem(item)) {
    next.showValueAddressBook = false;
    next.showValueAmlSearch = false;
  }

  if (isPaymentEngineFeeItem(item)) {
    next.tag = '';
    delete next.tagFamily;
    delete next.tagStatus;
    delete next.tagSystemType;
  }

  return next;
}

export function applyPaymentEngineDetailSectionsPolicy(
  sections: DetailSectionData[],
): DetailSectionData[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map(applyPaymentEngineDetailItemPolicy),
  }));
}
