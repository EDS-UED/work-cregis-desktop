<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCrypto,
  EgLinkButton,
  EgListFieldOverflowText,
  EgTag,
  type CryptoName,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import amountStyles from '@/scenes/tasks/list-field/TasksListFieldAmount.module.css';

const props = defineProps<{
  cryptoAmount: string;
  cryptoSymbol: string;
  cryptoName?: string;
  fiatAmount?: string;
  networkLabel?: string;
  actionLabelKey?: string;
  alignEnd?: boolean;
  showCryptoIcon?: boolean;
  /** 默认 true（≈ 法币估值）；结算记录等独立法币字段传 false。 */
  approximateFiat?: boolean;
  /** 网络 Tag 挂载行；结算记录法币列用 secondary。 */
  networkLabelPlacement?: 'primary' | 'secondary';
}>();

const { ui } = useAppI18n();

const hasPrimaryAmount = computed(() => String(props.cryptoAmount ?? '').trim().length > 0);
const primaryText = computed(() => {
  if (!hasPrimaryAmount.value) return '';
  return `${props.cryptoAmount} ${props.cryptoSymbol}`;
});
const secondaryText = computed(() => {
  const fiat = String(props.fiatAmount ?? '').trim();
  if (!fiat) return '';
  if (props.approximateFiat === false) {
    return fiat;
  }
  return fiat.startsWith('≈') ? fiat : `≈ ${fiat}`;
});
const resolvedCryptoName = computed((): CryptoName => {
  const explicit = String(props.cryptoName ?? '').trim();
  if (explicit) return explicit as CryptoName;
  return resolveCryptoNameFromSymbol(props.cryptoSymbol) ?? 'eds-usdt-tether usd';
});
const showAmountCryptoIcon = computed(() => props.showCryptoIcon !== false);
const primaryNetworkLabel = computed(() => {
  const label = String(props.networkLabel ?? '').trim();
  if (!label || props.networkLabelPlacement === 'secondary') return '';
  return label;
});
const secondaryNetworkLabel = computed(() => {
  const label = String(props.networkLabel ?? '').trim();
  if (!label || props.networkLabelPlacement !== 'secondary') return '';
  return label;
});

const cellMinWidthStyle = computed(() => ({
  width: '100%',
  maxWidth: '100%',
  minWidth: '0',
}));
</script>

<template>
  <div
    v-if="hasPrimaryAmount"
    class="list-field-amount"
    :class="[amountStyles.amountPreview, alignEnd && amountStyles.amountPreviewAlignEnd]"
    :style="cellMinWidthStyle"
  >
    <div :class="amountStyles.amountPrimaryRow">
      <EgCrypto
        v-if="showAmountCryptoIcon"
        :name="resolvedCryptoName"
        fit
        :class="amountStyles.amountCryptoIcon"
        :label="cryptoSymbol"
      />
      <EgListFieldOverflowText :text="primaryText" variant="primary" tabular />
      <EgTag
        v-if="primaryNetworkLabel"
        size="sm"
        system-type="stroke-subtle"
        truncate
      >
        {{ primaryNetworkLabel }}
      </EgTag>
    </div>
    <EgLinkButton
      v-if="actionLabelKey"
      tone="brand"
      size="sm"
      href="#"
      @click.prevent
    >
      {{ ui(actionLabelKey) }}
    </EgLinkButton>
    <div
      v-else-if="secondaryText"
      :class="amountStyles.amountSecondaryRow"
    >
      <EgListFieldOverflowText
        :text="secondaryText"
        variant="secondary"
        tabular
      />
      <EgTag
        v-if="secondaryNetworkLabel"
        size="sm"
        system-type="stroke-subtle"
        truncate
      >
        {{ secondaryNetworkLabel }}
      </EgTag>
    </div>
  </div>
</template>
