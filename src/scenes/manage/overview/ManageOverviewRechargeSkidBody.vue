<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgButton,
  EgCrypto,
  EgFlotation,
  EgIcon,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgFormSubmission,
  type CryptoName,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import {
  AML_QUERY_NETWORK_MENU_MAX_HEIGHT,
  resolveAmlQueryNetworkCryptoName,
} from '@/scenes/risk-control/riskControlAmlQueryOptions';
import {
  OVERVIEW_GAS_RECHARGE_ACCOUNT_OPTIONS,
  OVERVIEW_GAS_RECHARGE_DEFAULT_ACCOUNT_KEY,
  OVERVIEW_RECHARGE_CURRENCY,
  OVERVIEW_RECHARGE_DEFAULT_NETWORK_KEY,
  OVERVIEW_RECHARGE_MINIMUM_DISPLAY,
  OVERVIEW_RECHARGE_NETWORK_OPTIONS,
  resolveOverviewGasRechargeDepositAddress,
  resolveOverviewRechargeDepositAddress,
  type OverviewGasRechargeAccountKey,
  type OverviewRechargeNetworkKey,
} from './overviewRechargeSkidData';
import styles from './ManageOverviewRechargeSkidBody.module.css';

export type OverviewRechargeSkidMode = 'team' | 'gas';

const props = withDefaults(
  defineProps<{
    mode?: OverviewRechargeSkidMode;
    gasAccountKey?: OverviewGasRechargeAccountKey;
  }>(),
  {
    mode: 'team',
    gasAccountKey: OVERVIEW_GAS_RECHARGE_DEFAULT_ACCOUNT_KEY,
  },
);

const { ui } = useAppI18n();
const { copied, copyValue } = useCopyableValue();

const isGasMode = computed(() => props.mode === 'gas');

const selectedTeamNetworkKey = ref<OverviewRechargeNetworkKey>(
  OVERVIEW_RECHARGE_DEFAULT_NETWORK_KEY,
);
const selectedGasAccountKey = ref<OverviewGasRechargeAccountKey>(
  OVERVIEW_GAS_RECHARGE_DEFAULT_ACCOUNT_KEY,
);

watch(
  () => [props.mode, props.gasAccountKey] as const,
  ([mode, gasKey]) => {
    if (mode === 'gas') {
      selectedGasAccountKey.value = gasKey ?? OVERVIEW_GAS_RECHARGE_DEFAULT_ACCOUNT_KEY;
      return;
    }
    selectedTeamNetworkKey.value = OVERVIEW_RECHARGE_DEFAULT_NETWORK_KEY;
  },
  { immediate: true },
);

const selectedTeamNetwork = computed(() =>
  OVERVIEW_RECHARGE_NETWORK_OPTIONS.find((item) => item.key === selectedTeamNetworkKey.value),
);

const selectedGasAccount = computed(() =>
  OVERVIEW_GAS_RECHARGE_ACCOUNT_OPTIONS.find(
    (item) => item.key === selectedGasAccountKey.value,
  ),
);

const selectedNetworkLabel = computed(() => {
  if (isGasMode.value) {
    const match = selectedGasAccount.value;
    return match ? ui(match.titleKey) : '';
  }
  const match = selectedTeamNetwork.value;
  return match ? ui(match.labelCatalog) : '';
});

const selectedNetworkCryptoName = computed((): CryptoName | null => {
  if (isGasMode.value) {
    return selectedGasAccount.value?.cryptoName ?? null;
  }
  const match = selectedTeamNetwork.value;
  if (!match) return null;
  return resolveAmlQueryNetworkCryptoName(match.amlNetworkLabel);
});

const selectionKey = computed(() =>
  isGasMode.value ? selectedGasAccountKey.value : selectedTeamNetworkKey.value,
);

const depositAddress = computed(() =>
  isGasMode.value
    ? resolveOverviewGasRechargeDepositAddress(selectedGasAccountKey.value)
    : resolveOverviewRechargeDepositAddress(selectedTeamNetworkKey.value),
);

function formatMinimumRechargeHint(amount: string) {
  return ui('Overview Recharge Minimum Hint').replace('{amount}', amount);
}

const teamMinimumHintText = computed(() =>
  formatMinimumRechargeHint(OVERVIEW_RECHARGE_MINIMUM_DISPLAY),
);

const gasNativeTokenHintText = computed(() => ui('Overview Gas Recharge Native Token Hint'));

const gasMinimumHintText = computed(() => {
  const amount = selectedGasAccount.value?.minimumDisplay ?? '';
  return formatMinimumRechargeHint(amount);
});

const addressCardHintText = computed(() =>
  isGasMode.value ? gasMinimumHintText.value : teamMinimumHintText.value,
);

function selectTeamNetwork(key: OverviewRechargeNetworkKey, close: () => void) {
  selectedTeamNetworkKey.value = key;
  close();
}

function selectGasAccount(key: OverviewGasRechargeAccountKey, close: () => void) {
  selectedGasAccountKey.value = key;
  close();
}

async function onCopyAddress(event?: MouseEvent) {
  const address = depositAddress.value.trim();
  if (!address) return;
  await copyValue(address, event);
}
</script>

<template>
  <div :class="styles.root">
    <div v-if="!isGasMode" :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('Overview Recharge Currency') }}</span>
      <EgFlotation
        :class="styles.scopeFlotationHost"
        placement="bottom"
        align="start"
        width-mode="trigger"
        :show-add="false"
        :show-menu-divider="false"
        :close-on-scroll="false"
        flip
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            :class="styles.networkFlotationTrigger"
            trigger-style="subtle"
            size="md"
            width-mode="adaptive"
            :label="OVERVIEW_RECHARGE_CURRENCY.symbol"
            :expanded="expanded"
            show-symbol
          >
            <template #symbol>
              <span :class="styles.networkTriggerSymbol">
                <EgCrypto :name="OVERVIEW_RECHARGE_CURRENCY.cryptoName" size="md" fit />
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
            :show-add="false"
            :show-divider="false"
          >
            <EgFlotationMenuItem
              box-type="image-text"
              :label="OVERVIEW_RECHARGE_CURRENCY.symbol"
              :symbol-icon="OVERVIEW_RECHARGE_CURRENCY.cryptoName"
              focused
              @click="close()"
            />
          </EgFlotationMenu>
        </template>
      </EgFlotation>
    </div>

    <div :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('Overview Recharge Network Field') }}</span>
      <div :class="styles.networkControlStack">
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
              :key="selectionKey"
              :class="styles.networkFlotationTrigger"
              trigger-style="subtle"
              size="md"
              width-mode="adaptive"
              :label="selectedNetworkLabel"
              :expanded="expanded"
              :show-symbol="Boolean(selectedNetworkCryptoName)"
            >
              <template v-if="selectedNetworkCryptoName" #symbol>
                <span :class="styles.networkTriggerSymbol">
                  <EgCrypto :name="selectedNetworkCryptoName" size="md" fit />
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
              <template v-if="isGasMode">
                <EgFlotationMenuItem
                  v-for="account in OVERVIEW_GAS_RECHARGE_ACCOUNT_OPTIONS"
                  :key="account.key"
                  box-type="image-text"
                  :label="ui(account.titleKey)"
                  :symbol-icon="account.cryptoName"
                  :focused="selectedGasAccountKey === account.key"
                  @click="selectGasAccount(account.key, close)"
                />
              </template>
              <template v-else>
                <EgFlotationMenuItem
                  v-for="network in OVERVIEW_RECHARGE_NETWORK_OPTIONS"
                  :key="network.key"
                  box-type="image-text"
                  :label="ui(network.labelCatalog)"
                  :symbol-icon="resolveAmlQueryNetworkCryptoName(network.amlNetworkLabel)"
                  :focused="selectedTeamNetworkKey === network.key"
                  @click="selectTeamNetwork(network.key, close)"
                />
              </template>
            </EgFlotationMenu>
          </template>
        </EgFlotation>
        <EgFormSubmission
          v-if="isGasMode"
          type="notes"
          :show-link="false"
          :text="gasNativeTokenHintText"
        />
      </div>
    </div>

    <div :class="styles.addressSection">
      <span :class="styles.fieldLabel">{{ ui('Overview Recharge Address') }}</span>
      <div :class="styles.addressCardGroup">
        <div :class="styles.addressCard">
          <div :class="styles.addressRow">
            <div :class="styles.qrHost" role="img" :aria-label="ui('Overview Recharge Qr Code')">
              <div :class="styles.qrCanvas">
                <span :class="styles.qrGraphic" aria-hidden="true">
                  <EgIcon name="eds-image-qr-code" fit />
                </span>
                <span :class="styles.qrCenterMark" aria-hidden="true">
                  <span :key="selectionKey" :class="styles.qrCenterSymbol">
                    <EgCrypto
                      v-if="selectedNetworkCryptoName"
                      :name="selectedNetworkCryptoName"
                      size="sm"
                      fit
                    />
                  </span>
                </span>
              </div>
            </div>

            <div :class="styles.addressMain">
              <p :class="styles.addressValue">{{ depositAddress }}</p>
              <EgButton
                :class="styles.copyButton"
                variant="solid"
                tone="decor"
                size="md"
                width-mode="adaptive"
                type="button"
                @click="onCopyAddress"
              >
                {{ copied ? ui('Copied') : ui('Copy') }}
              </EgButton>
            </div>
          </div>
        </div>

        <EgFormSubmission type="notes" :show-link="false" :text="addressCardHintText" />
      </div>
    </div>
  </div>
</template>
