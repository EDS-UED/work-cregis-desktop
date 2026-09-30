<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCrypto,
  EgListFieldHashLikeLine,
  EgTag,
  type CryptoName,
} from '@eds/desktop-components';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import styles from './PaymentEngineListFieldCallbackAmountTime.module.css';

const props = defineProps<{
  amount: string;
  symbol: string;
  cryptoName?: string;
  networkLabel?: string;
  datetime: string;
}>();

const resolvedCryptoName = computed((): CryptoName => {
  const explicit = String(props.cryptoName ?? '').trim();
  if (explicit) return explicit as CryptoName;
  return resolveCryptoNameFromSymbol(props.symbol) ?? 'eds-usdt-tether usd';
});

const amountPrimaryText = computed(() => {
  const formattedAmount = formatGroupedDecimalAmount(String(props.amount ?? '').trim());
  return props.symbol ? `${formattedAmount} ${props.symbol}` : formattedAmount;
});

const networkTagLabel = computed(() => String(props.networkLabel ?? '').trim());
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <div :class="styles.titleRow">
        <span :class="styles.cryptoInlineIcon">
          <EgCrypto :name="resolvedCryptoName" fit :label="symbol" />
        </span>
        <EgListFieldHashLikeLine
          :text="amountPrimaryText"
          variant="primary"
          tooltip-trigger="hover"
          :copy-on-row-hover="false"
        />
        <EgTag
          v-if="networkTagLabel"
          size="sm"
          system-type="stroke-subtle"
          truncate
        >
          {{ networkTagLabel }}
        </EgTag>
      </div>
      <EgListFieldHashLikeLine
        :text="datetime"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
