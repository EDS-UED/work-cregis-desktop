import { ref } from 'vue';
import {
  WAAS_SUB_ADDRESS_DEFAULT_SELECTION,
  type WaasSubAddressCurrencySelection,
} from './waasSubAddressCurrencyPickerData';

const selection = ref<WaasSubAddressCurrencySelection>({
  ...WAAS_SUB_ADDRESS_DEFAULT_SELECTION,
});

export function useWaasSubAddressCurrencySelection() {
  function setSelection(next: WaasSubAddressCurrencySelection) {
    selection.value = next;
  }

  return {
    selection,
    setSelection,
  };
}
