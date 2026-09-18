<script setup lang="ts">
import PaymentEngineListFieldAmount from './PaymentEngineListFieldAmount.vue';
import styles from './PaymentEngineListField.shared.module.css';

defineProps<{
  receivedAmount: string;
  receivedSymbol: string;
  receivedFiat?: string;
  orderAmount: string;
  orderSymbol: string;
  orderCryptoName?: string;
  orderFiat?: string;
  networkLabel?: string;
  /** 订单金额法币行；结算记录传 false（独立 USDT 字段）。 */
  orderApproximateFiat?: boolean;
}>();
</script>

<template>
  <div :class="[styles.host, styles.hostAlignEnd]">
    <PaymentEngineListFieldAmount
      :crypto-amount="receivedAmount"
      :crypto-symbol="receivedSymbol"
      :fiat-amount="receivedFiat"
      align-end
    />
    <PaymentEngineListFieldAmount
      :crypto-amount="orderAmount"
      :crypto-symbol="orderSymbol"
      :crypto-name="orderCryptoName"
      :fiat-amount="orderFiat"
      :network-label="networkLabel"
      :approximate-fiat="orderApproximateFiat !== false"
      align-end
    />
  </div>
</template>
