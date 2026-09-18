import { computed, ref } from 'vue';
import { cregisModuleMenuTitleFlotationItems } from '@eds/desktop-components';

/** 支付引擎项目浮层与 EDS `cregisModuleMenuTitleFlotationItems` 对齐；仅跟踪选中索引。 */
const selectedFlotationIndex = ref(0);

export function usePaymentEngineProjectStore() {
  const titleFlotationItems = computed(() => cregisModuleMenuTitleFlotationItems);
  const titleFlotationSelectedIndex = computed(() => selectedFlotationIndex.value);

  function selectProjectByFlotationIndex(index: number) {
    if (index < 0 || index >= cregisModuleMenuTitleFlotationItems.length) return;
    selectedFlotationIndex.value = index;
  }

  return {
    titleFlotationItems,
    titleFlotationSelectedIndex,
    selectProjectByFlotationIndex,
  };
}
