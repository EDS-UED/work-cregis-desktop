import type { DetailItemData, DetailSectionData } from '@eds/desktop-components';

const TRANSACTION_RECORD_MEMBER_DEVICE_INFO = {
  deviceType: 'MacOS(v3.6.0)',
  deviceId: 'AXSMJSAXJQ',
  ip: '192.168.2.1',
};

function isTransactionRecordAddressItem(item: DetailItemData): boolean {
  const key = item.key ?? '';
  if (
    key.includes('address')
    || key.includes('receiver')
    || key === 'payment-address'
    || key === 'receiving-address'
  ) {
    return true;
  }
  return item.titleIcon === 'eds-arrow-down' || item.titleIcon === 'eds-arrow-up';
}

function isTransactionRecordPersonItem(item: DetailItemData): boolean {
  const key = item.key ?? '';
  if (key === 'initiator' || key === 'signer') return true;
  return item.titleIcon === 'eds-arrow-launch-circle' || item.titleIcon === 'eds-signature-pen';
}

function parsePersonDisplayValue(value: string): { name: string; email?: string } {
  const match = value.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { name: match[1]!.trim(), email: match[2]!.trim() };
  }
  return { name: value.trim() };
}

/** 交易记录详情：地址行隐藏地址簿/AML；发起方/签名人仅保留设备信息（无地址簿/AML）。 */
export function applyTransactionRecordDetailItemPolicy(
  item: DetailItemData,
): DetailItemData {
  const next: DetailItemData = { ...item };

  if (isTransactionRecordAddressItem(item)) {
    next.showValueAddressBook = false;
    next.showValueAmlSearch = false;
  }

  if (isTransactionRecordPersonItem(item)) {
    const { name, email } = parsePersonDisplayValue(String(item.value ?? ''));
    next.value = name;
    if (email) {
      next.valueSecondary = email;
    } else {
      delete next.valueSecondary;
    }
    next.valueType = 'user';
    next.valueSymbolAvatarName = name;
    next.showValueSymbol = true;
    next.valueSymbolKind = 'avatar';
    next.valueDeviceInfo = { ...TRANSACTION_RECORD_MEMBER_DEVICE_INFO };
    next.showValueAddressBook = false;
    next.showValueAmlSearch = false;
  }

  return next;
}

export function applyTransactionRecordDetailSectionsPolicy(
  sections: DetailSectionData[],
): DetailSectionData[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map(applyTransactionRecordDetailItemPolicy),
  }));
}
