import { computed, ref, watch, type Ref } from 'vue';
import { resolveToolbarTimezoneOffsetLabel, TOOLBAR_TIMEZONE_ITEMS } from './toolbarTimezoneItems';

const STORAGE_KEY = 'cregis-user-timezone-index-v1';

function readStoredIndex(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw == null) return 0;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return 0;
  const max = TOOLBAR_TIMEZONE_ITEMS.length - 1;
  return Math.min(Math.max(parsed, 0), max);
}

const selectedIndex: Ref<number> = ref(readStoredIndex());

watch(
  selectedIndex,
  (index) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, String(index));
  },
  { flush: 'sync' },
);

/** 偏好设置 · 个人时区（全局 EgDataList 列头/展示基准）。 */
export function useAppUserTimezoneSelection() {
  const offsetLabel = computed(() => resolveToolbarTimezoneOffsetLabel(selectedIndex.value));
  return {
    selectedIndex,
    offsetLabel,
  };
}
