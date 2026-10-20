import { ref } from 'vue';
import { copyToClipboard } from '@eds/desktop-components/utils/copyToClipboard';

const COPIED_RESET_MS = 2000;

export function useCopyableValue() {
  const copied = ref(false);
  let copiedResetTimer: ReturnType<typeof setTimeout> | undefined;

  async function copyValue(value: string, event?: MouseEvent): Promise<boolean> {
    event?.stopPropagation();
    event?.preventDefault();
    const copiedOk = await copyToClipboard(value);
    if (!copiedOk) return false;

    copied.value = true;
    if (copiedResetTimer) clearTimeout(copiedResetTimer);
    copiedResetTimer = setTimeout(() => {
      copied.value = false;
    }, COPIED_RESET_MS);
    return true;
  }

  return {
    copied,
    copyValue,
  };
}
