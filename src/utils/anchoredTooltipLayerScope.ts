/**
 * click / hover 锚定浮层同屏：scope 推断与 outside-dismiss 豁免。
 */

export function isClickAnchoredTooltipOpenExceptNode(node: HTMLElement): boolean {
  if (node.getAttribute('tabindex') === '0' && node.hasAttribute('aria-expanded')) {
    return true;
  }
  return node.closest('[tabindex="0"][aria-expanded]') instanceof HTMLElement;
}

/** pointer 落在 hover/focus 浮层上时，click Popover 的 outside-dismiss 须跳过。 */
export function isHoverAnchoredTooltipInteractionTarget(node: Node | null): boolean {
  if (!(node instanceof Element)) {
    return false;
  }

  if (node.closest('.eds-crypto-address-tooltip-menu, .eds-flotation-menu, .eds-flotation')) {
    return true;
  }

  const tooltipHost = node.closest('[id^="eds-tooltip-v-"]');
  if (!tooltipHost) {
    return false;
  }

  if (tooltipHost.querySelector('[tabindex="0"][aria-expanded]')) {
    return false;
  }

  if (node.closest('.eds-popover')) {
    return false;
  }

  if (tooltipHost.querySelector('[data-eds-tooltip-open]')) {
    return true;
  }

  return Boolean(
    node.closest('.effect-flotation-box, .glassMicroFloatHost, .eds-tooltip-panel'),
  );
}
