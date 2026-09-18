<script setup lang="ts">
import { computed } from 'vue';
import TransactionRecordDetailPopup from './TransactionRecordDetailPopup.vue';
import type { TransactionRecordDetailFlowInstance } from './transactionRecordDetailFlowContext';

const props = defineProps<{
  flow: TransactionRecordDetailFlowInstance;
}>();

const detailOpen = computed({
  get: () => props.flow.detailOpen.value,
  set: (value: boolean) => {
    props.flow.detailOpen.value = value;
  },
});

const detailPage = computed({
  get: () => props.flow.detailPage.value,
  set: (value) => {
    props.flow.detailPage.value = value;
  },
});

const detailPopupMounted = computed(
  () => props.flow.detailOpen.value || props.flow.detailRow.value != null,
);

const detail = computed(() => props.flow.detailRow.value);
</script>

<template>
  <TransactionRecordDetailPopup
    v-if="detailPopupMounted"
    v-model:open="detailOpen"
    v-model:detail-page="detailPage"
    :detail="detail"
    @popup-closed="flow.onDetailPopupClosed()"
  />
</template>
