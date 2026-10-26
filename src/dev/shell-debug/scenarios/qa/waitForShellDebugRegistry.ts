import type { ShallowRef } from 'vue';

/** Shell Debug QA：等待业务页挂载并注册 shallowRef API（overlay / flow）。 */
export async function waitForShellDebugRegistry<T>(
  registry: ShallowRef<T | null>,
  maxFrames = 120,
): Promise<T | null> {
  for (let frame = 0; frame < maxFrames; frame += 1) {
    if (registry.value) return registry.value;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
  return registry.value;
}
