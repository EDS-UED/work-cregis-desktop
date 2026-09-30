<script setup lang="ts">
import { computed } from 'vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import { buildPaymentEngineOrderAmountCustomize } from '../paymentEngineListFieldCustomize';
import styles from './PaymentEngineListField.shared.module.css';

const props = defineProps<{
  receivedAmount: string;
  receivedSymbol: string;
  receivedCryptoName?: string;
  receivedFiat?: string;
  orderAmount: string;
  orderSymbol: string;
  orderCryptoName?: string;
  orderFiat?: string;
  networkLabel?: string;
  /** 订单金额法币行；结算记录传 false（独立 USDT 字段）。 */
  orderApproximateFiat?: boolean;
  columnMinWidth?: string;
  alignEnd?: boolean;
}>();

const hasReceivedAmount = computed(() => String(props.receivedAmount ?? '').trim().length > 0);

/** 列表 combo 列：有实收只展示实收；无实收（待支付/已取消/已过期）展示订单金额。 */
const showOrderAmount = computed(() => !hasReceivedAmount.value);

const receivedCustomize = computed(() =>
  buildPaymentEngineOrderAmountCustomize({
    cryptoAmount: props.receivedAmount,
    cryptoSymbol: props.receivedSymbol,
    cryptoName: props.receivedCryptoName,
    fiatAmount: props.receivedFiat,
    columnMinWidth: props.columnMinWidth,
    alignEnd: props.alignEnd,
  }),
);

const orderCustomize = computed(() =>
  buildPaymentEngineOrderAmountCustomize({
    cryptoAmount: props.orderAmount,
    cryptoSymbol: props.orderSymbol,
    cryptoName: props.orderCryptoName,
    fiatAmount: props.orderFiat,
    networkLabel: props.networkLabel,
    approximateFiat: props.orderApproximateFiat !== false,
    columnMinWidth: props.columnMinWidth,
    alignEnd: props.alignEnd,
  }),
);
</script>

<template>
  <div :class="[styles.host, alignEnd && styles.hostAlignEnd]">
    <TasksListFieldAmount
      v-if="hasReceivedAmount"
      :customize="receivedCustomize"
    />
    <TasksListFieldAmount
      v-if="showOrderAmount"
      :customize="orderCustomize"
    />
  </div>
</template>
