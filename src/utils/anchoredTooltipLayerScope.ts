/**
 * click / hover 锚定浮层同屏：scope 推断与 outside-dismiss 豁免。
 */
import { BATCH_AML_GATE_PREVIEW_ATTR } from '@/scenes/tasks/shared/batchAmlDangerGateChrome';

/** EgAnchoredTooltip click trigger：aria-expanded + tabindex=0 同在 **trigger 节点**（禁止 ancestor closest 误伤 hover）。 */
export function isClickAnchoredTooltipOpenExceptNode(node: HTMLElement): boolean {
  const isClickTrigger = (el: HTMLElement) =>
    el.getAttribute('tabindex') === '0' && el.hasAttribute('aria-expanded');

  if (isClickTrigger(node)) {
    return true;
  }

  const parent = node.parentElement;
  if (parent instanceof HTMLElement && isClickTrigger(parent)) {
    return true;
  }

  if (node.hasAttribute('data-eds-trigger-metrics') && parent instanceof HTMLElement) {
    return isClickTrigger(parent);
  }

  return false;
}

/**
 * hover/focus `openNow` 的 except：在 overflow / hover trigger 内，且自身不是 click trigger。
 * 此类 closeAll 只关其它 hover，任意 click 浮层（批处理 Flotation、AML Popover 等）保留。
 */
export function isHoverAnchoredTooltipExceptNode(node: HTMLElement): boolean {
  if (isClickAnchoredTooltipOpenExceptNode(node)) {
    return false;
  }
  return Boolean(
    node.closest('.eds-hover-tooltip-trigger, .eds-text-overflow-tooltip-host')
    || node.querySelector('.eds-hover-tooltip-trigger, .eds-text-overflow-tooltip-host'),
  );
}

/** 指针正在 hover trigger 或已打开的 hover 浮层上（不含 click Popover）。 */
export function isPointerOverHoverAnchoredLayer(): boolean {
  if (
    document.querySelector(
      '.eds-hover-tooltip-trigger:hover, .eds-text-overflow-tooltip-host:hover, [data-eds-tooltip-open]:hover',
    )
  ) {
    return true;
  }
  const hoveredFloat = document.querySelector('[id^="eds-tooltip-v-"]:hover');
  if (!hoveredFloat) {
    return false;
  }
  return !hoveredFloat.querySelector('.eds-popover, [tabindex="0"][aria-expanded]');
}

export function isHoverLayerTriggerTarget(node: Node | null): boolean {
  if (!(node instanceof Element)) {
    return false;
  }
  return Boolean(
    node.closest('.eds-hover-tooltip-trigger, .eds-text-overflow-tooltip-host'),
  );
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

/**
 * click 浮层已打开时：hover 浮层的出现、以及指针落在 hover trigger / hover 浮层上，不得关掉 click 层。
 * AML gate 打开时列表区点选同样不 outside-dismiss。
 */
export function shouldSkipClickPopoverOutsideDismissForCoexistence(event: Event): boolean {
  if (event.type === 'scroll' && isPointerOverHoverAnchoredLayer()) {
    return true;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return false;
  }

  if (isHoverAnchoredTooltipInteractionTarget(target)) {
    return true;
  }

  if (isHoverLayerTriggerTarget(target)) {
    return true;
  }

  const preview = document.querySelector('.app-preview');
  if (!preview?.hasAttribute(BATCH_AML_GATE_PREVIEW_ATTR)) {
    return false;
  }

  if (target.closest('.eds-popover')) {
    return true;
  }

  if (target.closest('.eds-batch-bar')) {
    return false;
  }

  return Boolean(target.closest('.eds-data-list'));
}
