import type { InjectionKey } from 'vue';

/** 业务页切换模块侧栏菜单（catalog 英文 label，如 `AML Query`）。 */
export type AppShellMenuNavigation = {
  selectModuleMenuItem: (catalogLabel: string) => void;
};

export const appShellMenuNavigationKey: InjectionKey<AppShellMenuNavigation> = Symbol(
  'appShellMenuNavigation',
);
