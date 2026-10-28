import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

type PopoverAlign = 'center' | 'end';

const BOUNDARY_MARGIN = 8;
const TRIGGER_GAP_PX = 8;

export function useDevInspectPanelPosition(
  triggerRootRef: Ref<HTMLElement | null>,
  align: Ref<PopoverAlign>,
  panelWidth: number,
) {
  const panelStyle = ref<Record<string, string>>({ visibility: 'hidden' });

  const sync = () => {
    const metrics = triggerRootRef.value?.querySelector('[data-eds-trigger-metrics]');
    if (!(metrics instanceof HTMLElement)) {
      panelStyle.value = { visibility: 'hidden' };
      return;
    }

    const rect = metrics.getBoundingClientRect();
    const endAlignedLeft = rect.right - panelWidth;
    const centerLeft = rect.left + (rect.width - panelWidth) / 2;
    let left = align.value === 'end' ? endAlignedLeft : centerLeft;

    const maxLeft = window.innerWidth - panelWidth - BOUNDARY_MARGIN;
    left = Math.max(BOUNDARY_MARGIN, Math.min(left, maxLeft));

    const bottom = Math.max(BOUNDARY_MARGIN, window.innerHeight - rect.top + TRIGGER_GAP_PX);

    panelStyle.value = {
      position: 'fixed',
      left: `${left}px`,
      bottom: `${bottom}px`,
      width: `${panelWidth}px`,
      zIndex: '10050',
      visibility: 'visible',
      pointerEvents: 'auto',
    };
  };

  onMounted(() => {
    sync();
    window.addEventListener('resize', sync, { passive: true });
    window.addEventListener('scroll', sync, { capture: true, passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', sync);
    window.removeEventListener('scroll', sync, true);
  });

  watch(align, sync);

  return { panelStyle, syncPanelPosition: sync };
}
