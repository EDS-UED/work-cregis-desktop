<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgButton,
  EgCrypto,
  EgDivider,
  EgFlotation,
  EgSearchInput,
  EgSwitch,
  type CryptoName,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  BTC_ADDRESS_FORMAT_OPTIONS,
  CALLBACK_SETTINGS_DEMO_TOKENS,
} from '@/scenes/project/components/projectSettingsCallbackDemo';
import styles from './ProjectSettingsCallbackPanel.module.css';

const { ui } = useAppI18n();

const payoutExternalVerification = ref(false);
const btcAddressFormatId = ref<(typeof BTC_ADDRESS_FORMAT_OPTIONS)[number]['id']>('nested-segwit');
const searchQuery = ref('');

const btcAddressFormatLabel = computed(() => {
  const option = BTC_ADDRESS_FORMAT_OPTIONS.find((item) => item.id === btcAddressFormatId.value);
  return option ? ui(option.labelKey) : ui('Nested SegWit');
});

const btcFormatMenuItems = computed(() =>
  BTC_ADDRESS_FORMAT_OPTIONS.map((option) => ({
    label: ui(option.labelKey),
    boxType: 'text' as const,
  })),
);

const btcSelectedIndex = computed(() =>
  Math.max(
    0,
    BTC_ADDRESS_FORMAT_OPTIONS.findIndex((option) => option.id === btcAddressFormatId.value),
  ),
);

function onBtcFormatItemClick(_item: unknown, index: number) {
  const option = BTC_ADDRESS_FORMAT_OPTIONS[index];
  if (option) btcAddressFormatId.value = option.id;
}

const filteredTokens = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return CALLBACK_SETTINGS_DEMO_TOKENS;
  return CALLBACK_SETTINGS_DEMO_TOKENS.filter((token) =>
    token.symbol.toLowerCase().includes(query),
  );
});

function thresholdHint(symbol: string, minAmount: string) {
  return ui('Callback minimum amount threshold hint')
    .replace('{amount}', minAmount)
    .replace('{symbol}', symbol);
}
</script>

<template>
  <div :class="styles.panel">
    <div :class="styles.generalGroup">
      <div :class="styles.generalRowShell">
        <div :class="styles.generalRow">
          <span :class="styles.generalTitle">{{ ui('Batch update callback URLs') }}</span>
          <div :class="styles.generalActions">
            <EgButton tone="decor" variant="solid" size="md">
              {{ ui('Edit') }}
            </EgButton>
          </div>
        </div>
      </div>

      <div :class="styles.generalRowShell">
        <div :class="styles.generalRow">
          <span :class="styles.generalTitle">{{ ui('Default format of BTC address') }}</span>
          <div :class="styles.generalActions">
            <EgFlotation
              placement="bottom"
              align="end"
              width-mode="trigger"
              trigger-style="subtle"
              trigger-size="sm"
              :trigger-label="btcAddressFormatLabel"
              :items="btcFormatMenuItems"
              :selected-index="btcSelectedIndex"
              :show-add="false"
              :show-menu-divider="false"
              close-on-scroll
              @item-click="onBtcFormatItemClick"
            />
          </div>
        </div>
      </div>

      <div :class="styles.generalRowShell">
        <div :class="styles.generalRow">
          <span :class="styles.generalTitle">{{ ui('Payout External Verification') }}</span>
          <div :class="styles.generalActions">
            <EgSwitch v-model="payoutExternalVerification" size="md" />
          </div>
        </div>
      </div>
    </div>

    <div :class="styles.sectionDividerWrap">
      <EgDivider type="page" direction="horizontal" />
    </div>

    <div :class="styles.minimumGroup">
      <div :class="styles.minimumHeader">
        <div :class="styles.minimumCopy">
          <span :class="styles.minimumTitle">{{ ui('Minimum Callback Amount Settings') }}</span>
          <span :class="styles.minimumDescription">
            {{ ui('Minimum callback amount settings description') }}
          </span>
        </div>
        <div :class="styles.searchWrap">
          <EgSearchInput
            v-model="searchQuery"
            :placeholder="ui('Token name')"
            width-mode="full"
          />
        </div>
      </div>

      <div
        v-for="token in filteredTokens"
        :key="token.id"
        :class="styles.tokenRowShell"
      >
        <div :class="styles.tokenRow">
          <div :class="styles.tokenMeta">
            <span :class="styles.cryptoIcon">
              <EgCrypto :name="token.cryptoName as CryptoName" size="md" fit />
            </span>
            <div :class="styles.tokenCopy">
              <span :class="styles.tokenSymbol">{{ token.symbol }}</span>
              <span :class="styles.tokenHint">
                {{ thresholdHint(token.symbol, token.minAmount) }}
              </span>
            </div>
          </div>
          <div :class="styles.tokenActions">
            <EgButton tone="subtle" variant="solid" size="md">
              {{ ui('Edit') }}
            </EgButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
