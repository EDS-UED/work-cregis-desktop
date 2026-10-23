import type { InjectionKey, Ref } from 'vue';

/** AML 详情 Popup 内 `detailHost` — 用于 Teleport 固定底部分页器。 */
export const riskControlAmlDetailHostKey: InjectionKey<Ref<HTMLElement | null>> =
  Symbol('riskControlAmlDetailHost');
