<script setup lang="ts">
import { computed } from 'vue';
import { EgCryptoTooltip } from '@eds/desktop-components';
import {
  buildWaasSubAddressCurrencyFilterOptions,
  buildWaasSubAddressCurrencyPickerValue,
  parseWaasSubAddressCurrencyPickerValue,
} from './buildWaasSubAddressCurrencyFilterOptions';
import { resolveWaasSubAddressCurrencyOption } from './waasSubAddressCurrencyPickerData';
import { useWaasSubAddressCurrencySelection } from './useWaasSubAddressCurrencySelection';
import styles from './WaasSubAddressCurrencyPicker.module.css';

const { selection, setSelection } = useWaasSubAddressCurrencySelection();

const currencyOptions = buildWaasSubAddressCurrencyFilterOptions();

const pickerValue = computed({
  get: () =>
    buildWaasSubAddressCurrencyPickerValue(
      selection.value.currencyKey,
      selection.value.networkKey,
    ),
  set: (raw: string) => {
    const { currencyKey, networkKey } = parseWaasSubAddressCurrencyPickerValue(raw);
    const option = resolveWaasSubAddressCurrencyOption(currencyKey);
    if (!option) return;

    const network = networkKey
      ? option.networks?.find((item) => item.key === networkKey)
      : undefined;

    setSelection({
      currencyKey: option.key,
      symbol: option.symbol,
      cryptoName: option.cryptoName,
      networkKey: network?.key ?? '',
      networkLabel: network?.label ?? '',
    });
  },
});
</script>

<template>
  <div :class="styles.root">
    <EgCryptoTooltip
      v-model="pickerValue"
      :class="styles.toolbarPicker"
      :currency-options="currencyOptions"
      trigger-style="text"
      trigger-width-mode="trigger"
      module-menu-title
      boundary-selector=".app-preview"
      cascade-placement="auto"
      picker-align="start"
      close-on-scroll
    />
  </div>
</template>
