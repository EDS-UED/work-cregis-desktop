import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import { resolveSampleAddressForSymbol } from '../list-field/listFieldCryptoSampleAddresses';
import { resolveCurrencyRowPreset } from '../list-field/tasksListFieldCurrencyRowData';
export type TaskAddressDetailsSide = 'sender' | 'receiver';

export type TaskAddressDetailsRow = {
  id: string;
  address: string;
  amount: string;
  memo: string;
  remark: string;
  /** 演示：第二行地址后展示 AML「危险」Tag。 */
  showAddressDangerTag: boolean;
};

type AddressOrderDetail = {
  senders: Array<{ alias?: string; address: string; amount?: string; memo?: string }>;
  receivers: Array<{ alias?: string; address: string; amount?: string; memo?: string }>;
  senderOrderCount?: number;
  receiverOrderCount?: number;
  amountCryptoSymbol?: string;
};

function seededFraction(seed: number): number {
  const x = Math.sin(seed * 9913) * 10000;
  return x - Math.floor(x);
}

function formatMockCryptoAmount(seed: number, symbol: string): string {
  const normalized = symbol.trim() || 'USDT';
  const whole = Math.floor(seededFraction(seed * 41) * 98_765) + 1;
  const fracDigits = normalized === 'USDT' ? 6 : 8;
  const fracCap = 10 ** fracDigits;
  const fracRaw = Math.floor(seededFraction(seed * 13 + 5) * fracCap);
  const fracTrimmed = String(fracRaw).padStart(fracDigits, '0').replace(/0+$/, '');
  const wholeDisplay = formatGroupedDecimalAmount(String(whole));
  const amountCore = fracTrimmed ? `${wholeDisplay}.${fracTrimmed}` : wholeDisplay;
  return `${amountCore} ${normalized}`;
}

function resolveOrderRowCount(detail: AddressOrderDetail, side: TaskAddressDetailsSide): number {
  const orderCount =
    side === 'sender' ? detail.senderOrderCount ?? 0 : detail.receiverOrderCount ?? 0;
  if (orderCount > 1) {
    return orderCount;
  }
  const entries = side === 'sender' ? detail.senders : detail.receivers;
  return Math.max(1, entries.length);
}

export function buildTaskAddressDetailsOrderRows(
  detail: AddressOrderDetail,
  side: TaskAddressDetailsSide,
): TaskAddressDetailsRow[] {
  const entries = side === 'sender' ? detail.senders : detail.receivers;
  const primary = entries[0];
  const symbol = detail.amountCryptoSymbol?.trim() || 'USDT';
  const preset = resolveCurrencyRowPreset(0);
  const rowCount = resolveOrderRowCount(detail, side);

  return Array.from({ length: rowCount }, (_, index) => {
    const seed = index + (side === 'sender' ? 11 : 29);
    const poolIndex = index * 17 + seed;
    const address =
      index === 0 && primary?.address
        ? primary.address
        : resolveSampleAddressForSymbol(symbol, poolIndex, preset.addressFamily);

    const amount =
      index === 0 && primary?.amount
        ? primary.amount
        : formatMockCryptoAmount(seed, symbol);

    const memo = index === 0 ? String(primary?.memo ?? '').trim() : '';
    const remark =
      index === 0 ? 'Task address details sample remark' : '';

    return {
      id: `${side}-${index}`,
      address,
      amount,
      memo,
      remark,
      showAddressDangerTag: index === 1,
    };
  });
}
