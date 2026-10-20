<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCrypto,
  EgListFieldHashLikeLine,
  EgTag,
  type CryptoName,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import styles from './WaasListFieldTaskCurrencyId.module.css';

const props = defineProps<{
  customize: Record<string, unknown>;
  transactionCount: string;
  amount: string;
}>();

const { ui } = useAppI18n();

const symbol = computed(() => String(props.customize.symbol ?? '').trim());
const cryptoName = computed((): CryptoName => {
  const explicit = String(props.customize.cryptoName ?? '').trim();
  if (explicit) return explicit as CryptoName;
  return resolveCryptoNameFromSymbol(symbol.value || 'ZEC') ?? 'eds-zec-zcash';
});
const showNetwork = computed(() => Boolean(props.customize.showNetwork));
const networkLabel = computed(() => String(props.customize.networkLabel ?? '').trim());
const amountPrimaryText = computed(() => {
  const formattedAmount = formatGroupedDecimalAmount(String(props.amount ?? '').trim());
  return symbol.value ? `${formattedAmount} ${symbol.value}` : formattedAmount;
});
const transactionCountText = computed(
  () => `${props.transactionCount} ${ui('Signing transaction count unit')}`,
);
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
    <span class="hash-like-combo" :class="styles.hashLikeCombo">
      <div :class="styles.titleRow">
        <span :class="styles.cryptoInlineIcon">
          <EgCrypto :name="cryptoName" fit :label="symbol" />
        </span>
        <EgListFieldHashLikeLine
          :text="amountPrimaryText"
          variant="primary"
          tooltip-trigger="hover"
          :copy-on-row-hover="false"
        />
        <EgTag
          v-if="showNetwork && networkLabel"
          size="sm"
          system-type="stroke-subtle"
          truncate
        >
          {{ networkLabel }}
        </EgTag>
      </div>
      <EgListFieldHashLikeLine
        :text="transactionCountText"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
