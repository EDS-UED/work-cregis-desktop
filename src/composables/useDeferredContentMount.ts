import { onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * 进入列表页时模拟一次拉数据：先让「切换」落地，再在页面内部等数据。
 *
 * 原本点击到首帧之间主线程连续占用（满页 DataList 实测 217ms），导航高亮、模块菜单、
 * 表格行同帧出现，点击后没有任何反馈——用户在「切换」上等。拆开后当前帧只绘制壳层与
 * 页面骨架（工具栏 / 表头 / 分页器），行数据等模拟请求返回后再铺，等待发生在页面内部。
 *
 * 双 rAF 起步：第一个回调仍在本帧的渲染时机前，回调里再排一帧，第二个回调触发时上一帧
 * 已提交绘制。单个 rAF 做不到——它和本帧渲染在同一批次。之后才起计时器，保证「模拟耗时」
 * 不把切换反馈一起吞掉。
 *
 * 时长须高于 `EgDataList` 的 `initing` 内建 500ms 阈值，否则加载态只闪一瞬；取 800ms 时
 * 加载态实际可见约 300ms。
 */
export const SIMULATED_LIST_FETCH_MS = 800;

export function useDeferredContentMount(fetchMs: number = SIMULATED_LIST_FETCH_MS) {
  const contentReady = ref(false);
  let outerRaf = 0;
  let innerRaf = 0;
  let fetchTimer: ReturnType<typeof setTimeout> | undefined;

  onMounted(() => {
    outerRaf = requestAnimationFrame(() => {
      outerRaf = 0;
      innerRaf = requestAnimationFrame(() => {
        innerRaf = 0;
        fetchTimer = setTimeout(() => {
          fetchTimer = undefined;
          contentReady.value = true;
        }, fetchMs);
      });
    });
  });

  onBeforeUnmount(() => {
    if (outerRaf) cancelAnimationFrame(outerRaf);
    if (innerRaf) cancelAnimationFrame(innerRaf);
    if (fetchTimer !== undefined) clearTimeout(fetchTimer);
    outerRaf = 0;
    innerRaf = 0;
    fetchTimer = undefined;
  });

  function setContentReady(value: boolean) {
    if (outerRaf) {
      cancelAnimationFrame(outerRaf);
      outerRaf = 0;
    }
    if (innerRaf) {
      cancelAnimationFrame(innerRaf);
      innerRaf = 0;
    }
    if (fetchTimer !== undefined) {
      clearTimeout(fetchTimer);
      fetchTimer = undefined;
    }
    contentReady.value = value;
  }

  return { contentReady, setContentReady };
}
