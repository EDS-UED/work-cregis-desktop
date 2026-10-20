import { reactive, readonly } from 'vue';
import type { CregisModuleMenuBusinessTitle } from '@/presets/module-menu/businessModuleTitles';

export type AppShellNavigationTarget = {
  moduleTitle: CregisModuleMenuBusinessTitle;
  menuItem: string;
  navLabel?: string;
};

const state = reactive<{
  requestId: number;
  target: AppShellNavigationTarget | null;
}>({
  requestId: 0,
  target: null,
});

/** Navigate the AppShell module menu from nested scenes (e.g. Team Account detail). */
export function navigateAppShell(target: AppShellNavigationTarget) {
  state.target = target;
  state.requestId += 1;
}

export function useAppShellNavigation() {
  return {
    state: readonly(state),
  };
}
