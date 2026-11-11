import { computed, ref, watch, type Ref } from 'vue';
import { resolveToolbarTimezoneOffsetLabel, TOOLBAR_TIMEZONE_ITEMS } from './toolbarTimezoneItems';

const STORAGE_KEY = 'cregis-team-account-timezone-index-v1';

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

/** 团队账户 · 费用记录 / Gas 代付记录 / 概览时区设置（团队统一标准）。 */
export function useTeamAccountTimezoneSelection() {
  const offsetLabel = computed(() => resolveToolbarTimezoneOffsetLabel(selectedIndex.value));
  return {
    selectedIndex,
    offsetLabel,
  };
}
