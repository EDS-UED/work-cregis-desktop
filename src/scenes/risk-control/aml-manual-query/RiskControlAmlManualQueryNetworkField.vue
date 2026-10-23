<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCrypto,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  type CryptoName,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  AML_QUERY_NETWORK_MENU_MAX_HEIGHT,
  AML_QUERY_NETWORK_OPTIONS,
  resolveAmlQueryNetworkCryptoName,
} from '@/scenes/risk-control/riskControlAmlQueryOptions';
import styles from './RiskControlAmlManualQueryFormPage.module.css';

const network = defineModel<string>({ required: true });

const { ui } = useAppI18n();

const selectedNetworkLabel = computed(() => network.value.trim());

const triggerCryptoName = computed((): CryptoName | null => {
  if (!selectedNetworkLabel.value) return null;
  return resolveAmlQueryNetworkCryptoName(selectedNetworkLabel.value);
});

const triggerLabel = computed(
  () => selectedNetworkLabel.value || ui('Please Select'),
);

function selectNetwork(nextNetwork: string, close: () => void) {
  network.value = nextNetwork;
  close();
}
</script>

<template>
  <EgFlotation
    :class="styles.scopeFlotationHost"
    placement="bottom"
    align="start"
    width-mode="trigger"
    :max-height="AML_QUERY_NETWORK_MENU_MAX_HEIGHT"
    :show-add="false"
    :show-menu-divider="false"
    :close-on-scroll="false"
    flip
  >
    <template #trigger="{ expanded }">
      <EgFlotationTrigger
        :key="selectedNetworkLabel || 'empty'"
        :class="styles.networkFlotationTrigger"
        trigger-style="subtle"
        size="md"
        width-mode="adaptive"
        :label="triggerLabel"
        :expanded="expanded"
        :show-symbol="Boolean(selectedNetworkLabel)"
      >
        <template v-if="selectedNetworkLabel && triggerCryptoName" #symbol>
          <span :class="styles.networkTriggerSymbol">
            <EgCrypto :name="triggerCryptoName" size="md" fit />
          </span>
        </template>
      </EgFlotationTrigger>
    </template>
    <template #content="{ menuWidth, menuWidthMode, close }">
      <EgFlotationMenu
        panel-radius="radius-md"
        :width-mode="menuWidthMode"
        :width="menuWidth"
        height-mode="adaptive"
        :max-height="AML_QUERY_NETWORK_MENU_MAX_HEIGHT"
        :show-add="false"
        :show-divider="false"
      >
        <EgFlotationMenuItem
          v-for="option in AML_QUERY_NETWORK_OPTIONS"
          :key="option"
          box-type="image-text"
          :label="option"
          :symbol-icon="resolveAmlQueryNetworkCryptoName(option)"
          :selected="network === option"
          @click="selectNetwork(option, close)"
        />
      </EgFlotationMenu>
    </template>
  </EgFlotation>
</template>
