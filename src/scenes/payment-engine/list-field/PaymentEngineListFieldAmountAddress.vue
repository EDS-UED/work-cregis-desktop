<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import {
  buildBulkTransferAmountAddressCustomize,
  buildPaymentExceptionAmountAddressCustomize,
  buildWalletPayoutAmountAddressCustomize,
} from '../paymentEngineListFieldCustomize';

const props = defineProps<{
  menuItem: string;
  row: PaymentEngineRecordRow;
  columnMinWidth?: string;
}>();

const customize = computed(() => {
  const columnMinWidth = props.columnMinWidth ?? '';

  if (props.menuItem === 'Payment Exception Record') {
    return buildPaymentExceptionAmountAddressCustomize(props.row, columnMinWidth);
  }
  if (props.menuItem === 'Wallet Payout') {
    return buildWalletPayoutAmountAddressCustomize(props.row, columnMinWidth);
  }
  return buildBulkTransferAmountAddressCustomize(props.row, columnMinWidth);
});
</script>

<template>
  <TasksListFieldAmount :customize="customize" />
</template>
