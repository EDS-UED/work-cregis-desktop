import { ref } from 'vue';

export type PreviewWindowMode = 'default' | 'minimum' | 'window';

export type PreviewWindowPreset = {
  width: number;
  height: number;
  label: string;
  sizeLabel: string;
};

export const PREVIEW_WINDOW_PRESETS: Record<PreviewWindowMode, PreviewWindowPreset> = {
  default: { width: 1280, height: 800, label: 'Default', sizeLabel: '1280px × 800px' },
  minimum: { width: 960, height: 720, label: 'Minimum', sizeLabel: '960px × 720px' },
  window: { width: 1136, height: 720, label: 'Window', sizeLabel: '1136px × 720px' },
};

export const PREVIEW_WINDOW_MODE_ORDER: readonly PreviewWindowMode[] = [
  'default',
  'minimum',
  'window',
];

export const PREVIEW_WINDOW_MAX = PREVIEW_WINDOW_PRESETS.default;
export const PREVIEW_WINDOW_MIN = PREVIEW_WINDOW_PRESETS.minimum;

const STORAGE_KEY = 'cregis-shell-debug-window-mode';
const SIZE_STORAGE_KEY = 'cregis-preview-window-size';

export const previewWindowMode = ref<PreviewWindowMode>('default');
export const previewWindowSize = ref({
  width: PREVIEW_WINDOW_MAX.width,
  height: PREVIEW_WINDOW_MAX.height,
});

function isPreviewWindowMode(value: string | null): value is PreviewWindowMode {
  return value === 'default' || value === 'minimum' || value === 'window';
}

function modeMatchingSize(width: number, height: number): PreviewWindowMode | null {
  const match = PREVIEW_WINDOW_MODE_ORDER.find((mode) => {
    const preset = PREVIEW_WINDOW_PRESETS[mode];
    return preset.width === width && preset.height === height;
  });
  return match ?? null;
}

export function clampPreviewWindowSize(width: number, height: number): { width: number; height: number } {
  const maxWidth =
    typeof window === 'undefined'
      ? PREVIEW_WINDOW_MAX.width
      : Math.min(PREVIEW_WINDOW_MAX.width, window.innerWidth);
  const maxHeight =
    typeof window === 'undefined'
      ? PREVIEW_WINDOW_MAX.height
      : Math.min(PREVIEW_WINDOW_MAX.height, window.innerHeight);
  const minWidth = Math.min(PREVIEW_WINDOW_MIN.width, maxWidth);
  const minHeight = Math.min(PREVIEW_WINDOW_MIN.height, maxHeight);
  return {
    width: Math.round(Math.min(maxWidth, Math.max(minWidth, width))),
    height: Math.round(Math.min(maxHeight, Math.max(minHeight, height))),
  };
}

function persist(mode: PreviewWindowMode, width: number, height: number) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, mode);
  sessionStorage.setItem(SIZE_STORAGE_KEY, JSON.stringify({ width, height }));
}

function writeCssVars(width: number, height: number, mode: PreviewWindowMode) {
  const root = document.documentElement;
  root.style.setProperty('--app-preview-width', `${width}px`);
  root.style.setProperty('--app-preview-height', `${height}px`);
  root.style.setProperty('--app-preview-min-width', `${PREVIEW_WINDOW_MIN.width}px`);
  root.style.setProperty('--app-preview-min-height', `${PREVIEW_WINDOW_MIN.height}px`);
  root.style.setProperty('--app-preview-max-width', `${PREVIEW_WINDOW_MAX.width}px`);
  root.style.setProperty('--app-preview-max-height', `${PREVIEW_WINDOW_MAX.height}px`);

  const preview = document.querySelector('.app-preview');
  if (preview instanceof HTMLElement) {
    preview.dataset.shellDebugWindowMode = mode;
  }
}

export function applyPreviewWindowSize(width: number, height: number) {
  const next = clampPreviewWindowSize(width, height);
  previewWindowSize.value = next;
  const matched = modeMatchingSize(next.width, next.height);
  if (matched) {
    previewWindowMode.value = matched;
  }
  writeCssVars(next.width, next.height, previewWindowMode.value);
  persist(previewWindowMode.value, next.width, next.height);
}

export function applyPreviewWindowMode(mode: PreviewWindowMode) {
  const preset = PREVIEW_WINDOW_PRESETS[mode];
  const next = clampPreviewWindowSize(preset.width, preset.height);
  previewWindowMode.value = mode;
  previewWindowSize.value = next;
  writeCssVars(next.width, next.height, mode);
  persist(mode, next.width, next.height);
}

function readStoredSize(): { width: number; height: number } | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(SIZE_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { width?: unknown; height?: unknown };
    if (typeof parsed.width === 'number' && typeof parsed.height === 'number') {
      return clampPreviewWindowSize(parsed.width, parsed.height);
    }
  } catch {
    return null;
  }
  return null;
}

function readStoredMode(): PreviewWindowMode {
  if (typeof window === 'undefined') return 'default';
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return isPreviewWindowMode(stored) ? stored : 'default';
}

export function initPreviewWindowMode() {
  if (typeof window === 'undefined') return;
  const storedSize = readStoredSize();
  if (storedSize) {
    previewWindowMode.value = readStoredMode();
    applyPreviewWindowSize(storedSize.width, storedSize.height);
    return;
  }
  applyPreviewWindowMode(readStoredMode());
}
