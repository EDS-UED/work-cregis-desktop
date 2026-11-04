import type { TooltipAlign, TooltipPlacement, TooltipWidthMode } from '@eds/desktop-components';

/**
 * 对齐 eds-desktop Showcase `filterDocCustomize.ts`（`filterCustomizeDefaults`）。
 * 无条件：456px；有条件：512px。
 */

export const APP_EG_FILTER_MAX_CONDITIONS = 20;

export const APP_EG_FILTER_PANEL_WIDTH_UNCONDITIONAL = 456;

export const APP_EG_FILTER_PANEL_WIDTH_CONDITIONAL = 512;

export type AppEgFilterLayoutMode = 'unconditional' | 'conditional';

export type AppEgFilterLayoutProps = {
  logicModeControl: boolean;
  operatorControl: boolean;
  width: number;
  widthMode: TooltipWidthMode;
};

export const appEgFilterLayoutDefaults: AppEgFilterLayoutProps = {
  logicModeControl: false,
  operatorControl: false,
  width: APP_EG_FILTER_PANEL_WIDTH_UNCONDITIONAL,
  widthMode: 'fixed',
};

export function resolveAppEgFilterLayout(
  mode: AppEgFilterLayoutMode = 'unconditional',
): AppEgFilterLayoutProps {
  if (mode === 'conditional') {
    return {
      logicModeControl: true,
      operatorControl: true,
      width: APP_EG_FILTER_PANEL_WIDTH_CONDITIONAL,
      widthMode: 'fixed',
    };
  }
  return { ...appEgFilterLayoutDefaults };
}

/** Showcase chrome + 桌面 `.app-preview` 锚定（不含 fields / translate）。 */
export const appEgFilterChromeDefaults = {
  showTriggerBadge: true,
  maxConditions: APP_EG_FILTER_MAX_CONDITIONS,
  placement: 'bottom' as TooltipPlacement,
  align: 'start' as TooltipAlign,
  valueAlign: 'end' as TooltipAlign,
  boundarySelector: '.app-preview',
  teleportTo: '.app-preview',
  addLabel: '添加条件',
} as const;

export function resolveAppEgFilterPresetBind(
  mode: AppEgFilterLayoutMode = 'unconditional',
): AppEgFilterLayoutProps & typeof appEgFilterChromeDefaults {
  return {
    ...appEgFilterChromeDefaults,
    ...resolveAppEgFilterLayout(mode),
  };
}
