import type { InspectPropertyItem } from './buildElementInspectInfo';
import type { EdsComponentInspect } from './resolveEdsComponentInspect';
import { canInspectAsText } from './buildTextInspect';
import { elementHasInspectableIdentity } from './inspectIdentity';

const DETAIL_APPLY_ITEM_KEEP = new Set([
  'Icon',
  'Tag',
  'Crypto',
  'Avatar',
  'Link',
  'Button',
  'IconButton',
  'IconButtonPro',
  'Text',
  'Tooltip',
  'TextOverflowTooltip',
  'ListFieldOverflowText',
]);

function readRowText(row: Element, classFragment: string): string {
  const node = row.querySelector(`[class*="${classFragment}"]`);
  return node?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

export function findDetailApplyItemRow(element: Element): Element | null {
  const row = element.closest('.eds-detail [class*="itemRow"]');
  return row instanceof HTMLElement ? row : null;
}

/** 点选节点是否应视为 Apply_Item 语义层（非内层 Icon/Tooltip 等）。 */
export function isDetailApplyItemRowLayerHit(element: Element): boolean {
  const row = findDetailApplyItemRow(element);
  if (!row || !row.contains(element)) return false;
  if (canInspectAsText(element)) return false;
  if (elementHasInspectableIdentity(element)) return false;
  return true;
}

export function shouldPromoteDetailApplyItemRow(
  element: Element,
  edsComponent: EdsComponentInspect | null,
): boolean {
  if (!isDetailApplyItemRowLayerHit(element)) return false;
  if (edsComponent && DETAIL_APPLY_ITEM_KEEP.has(edsComponent.displayName)) return false;

  const row = findDetailApplyItemRow(element);
  if (!row) return false;

  if (edsComponent?.rootElement && edsComponent.rootElement !== row && row.contains(edsComponent.rootElement)) {
    return false;
  }

  return true;
}

export function buildDetailApplyItemInspect(element: Element): EdsComponentInspect | null {
  const row = findDetailApplyItemRow(element);
  if (!row) return null;

  const title = readRowText(row, 'itemTitleText');
  const value = readRowText(row, 'itemValueText');
  const tagText = row.querySelector('.eds-tag')?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  const props: InspectPropertyItem[] = [
    {
      label: '标题',
      value: title || '—',
      token: null,
      copyLine: title ? `title="${title}"` : '',
    },
    {
      label: '值',
      value: value || '—',
      token: null,
      copyLine: value ? `value="${value}"` : '',
    },
  ];

  if (tagText) {
    props.push({
      label: '标签',
      value: tagText,
      token: null,
      copyLine: `tag="${tagText}"`,
    });
  }

  return {
    vueName: 'DetailApplyItem',
    displayName: 'Apply_Item',
    rootElement: row,
    props,
    usageSnippet: '<EgDetailApplyItem />',
  };
}
