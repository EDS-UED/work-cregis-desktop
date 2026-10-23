import { shallowRef, type InjectionKey } from 'vue';

/** 业务页切换模块侧栏菜单（catalog 英文 label，如 `AML Query`）。 */
export type AppShellMenuNavigation = {
  selectModuleMenuItem: (catalogLabel: string) => void;
};

export const appShellMenuNavigationKey: InjectionKey<AppShellMenuNavigation> = Symbol(
  'appShellMenuNavigation',
);

/**
 * Popup / Teleport 与 RouterView 同级时 inject 拿不到 AppShell provide；
 * 由 AppShellView 注册，Overlay 内业务调用 `selectAppShellModuleMenuItem`。
 */
export const appShellMenuNavigationRegistry = shallowRef<AppShellMenuNavigation | null>(null);

export function selectAppShellModuleMenuItem(catalogLabel: string) {
  appShellMenuNavigationRegistry.value?.selectModuleMenuItem(catalogLabel);
}
