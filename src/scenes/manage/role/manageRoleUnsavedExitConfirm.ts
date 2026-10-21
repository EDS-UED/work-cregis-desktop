import type { TooltipAlign, TooltipPlacement } from '@eds/desktop-components';

/** 顶栏关闭钮：与 MultiSignWaitingPanel 一致，bottom → 面板内「温馨提示」。 */
export const MANAGE_ROLE_UNSAVED_EXIT_AT_CLOSE = {
  boundarySelector: '.eds-popup',
  heightMode: 'adaptive' as const,
  placement: 'bottom' as TooltipPlacement,
  align: 'center' as TooltipAlign,
};

/** 底栏取消：向上展开，避免压住同行 decor「确定」。 */
export const MANAGE_ROLE_UNSAVED_EXIT_AT_TOOLBAR = {
  boundarySelector: '.eds-popup',
  heightMode: 'adaptive' as const,
  placement: 'top' as TooltipPlacement,
  align: 'center' as TooltipAlign,
};
