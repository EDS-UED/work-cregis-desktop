<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCrypto,
  EgListFieldHashLikeLine,
  EgTag,
  type CryptoName,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import styles from './RiskControlListFieldAddressBookCurrency.module.css';

const props = defineProps<{
  customize: Record<string, unknown>;
}>();

const symbol = computed(() => String(props.customize.symbol ?? '').trim());
const cryptoName = computed((): CryptoName => {
  const explicit = String(props.customize.cryptoName ?? '').trim();
  if (explicit) return explicit as CryptoName;
  return resolveCryptoNameFromSymbol(symbol.value || 'ZEC') ?? 'eds-zec-zcash';
});
const showNetwork = computed(() => Boolean(props.customize.showNetwork));
const networkLabel = computed(() => String(props.customize.networkLabel ?? '').trim());
</script>

<template>
  <div class="desktopTokens list-field-general-structure" :class="styles.host">
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
  </div>
</template>
