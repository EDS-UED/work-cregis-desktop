<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCrypto,
  EgListFieldHashLikeLine,
  EgTag,
  type CryptoName,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import styles from './WaasListFieldCollectionCurrencyRange.module.css';

const props = defineProps<{
  customize: Record<string, unknown>;
  amountRangeKey: string;
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
const amountRangeText = computed(() =>
  props.amountRangeKey === 'Unlimited' ? ui('Unlimited') : props.amountRangeKey,
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
          :text="symbol"
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
        :text="amountRangeText"
        variant="secondary"
        tooltip-trigger="hover"
        :copy-on-row-hover="false"
      />
    </span>
  </div>
</template>
