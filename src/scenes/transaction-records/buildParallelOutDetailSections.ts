import {
  createDetailApplyItemRow,
  type DetailSectionData,
} from '@eds/desktop-components';
import type { TransactionRecordParallelOutDetailLine } from './transactionRecordParallelOutDetailTypes';

function buildParallelOutLineItems(
  line: TransactionRecordParallelOutDetailLine,
  translate: (key: string) => string,
) {
  return [
    {
      ...createDetailApplyItemRow('text', {
        key: `${line.id}-amount`,
        title: translate('Transaction Amount'),
        value: `${line.amount} ${line.symbol}`,
      }),
      titleIcon: 'eds-wallet' as const,
    },
    createDetailApplyItemRow('type', {
      key: `${line.id}-type`,
      title: translate('Transaction Type'),
      value: line.transactionType,
    }),
    createDetailApplyItemRow('sender', {
      key: `${line.id}-sender`,
      title: translate('Sender'),
      value: line.fromAddress,
      tag: line.fromAlias?.trim() ? line.fromAlias : '',
    }),
    createDetailApplyItemRow('receiver', {
      key: `${line.id}-receiver`,
      title: translate('Receiver'),
      value: line.toAddress,
      tag: '',
    }),
  ];
}

/** 交易笔数明细页：每笔一个可折叠分区（#1 / #2 …）。 */
export function buildParallelOutDetailSections(
  lines: readonly TransactionRecordParallelOutDetailLine[],
  translate: (key: string) => string,
): DetailSectionData[] {
  return lines.map((line, index) => ({
    key: line.id,
    title: `#${index + 1}`,
    showDivider: index < lines.length - 1,
    items: buildParallelOutLineItems(line, translate),
  }));
}
