<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgAvatar,
  EgButton,
  EgComboPageButton,
  EgDivider,
  EgIcon,
  EgLayout,
  EgLinkButton,
  EgMotionLayoutContent,
  EgSwitch,
  EgTabs,
  EgToolBar,
  useMotionLayoutContentSwitch,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { WaasProjectDepositMode } from '@/scenes/project/types';
import ProjectSettingsItem from '@/scenes/project/components/ProjectSettingsItem.vue';
import ProjectSettingsCallbackPanel from '@/scenes/project/components/ProjectSettingsCallbackPanel.vue';
import ProjectSettingsIpWhitelistPanel from '@/scenes/project/components/ProjectSettingsIpWhitelistPanel.vue';
import ProjectSettingsMerchantActionFooter from '@/scenes/project/components/ProjectSettingsMerchantActionFooter.vue';
import ProjectSettingsMerchantPanel from '@/scenes/project/components/ProjectSettingsMerchantPanel.vue';
import ProjectSettingsNotificationPanel from '@/scenes/project/components/ProjectSettingsNotificationPanel.vue';
import ProjectSettingsReceivingTransferPanel from '@/scenes/project/components/ProjectSettingsReceivingTransferPanel.vue';
import ProjectSettingsPolicyWalletRow from '@/scenes/project/components/ProjectSettingsPolicyWalletRow.vue';
import ProjectSettingsSection from '@/scenes/project/components/ProjectSettingsSection.vue';
import sharedStyles from '@/scenes/waas-project/settings/waasSettings.shared.module.css';
import styles from '@/scenes/waas-project/WaasProjectSettingsPage.module.css';

export type ProjectSettingsTabPreset = 'waas' | 'waas-order' | 'payment-engine';

const WAAS_TAB_KEYS = [
  'developer',
  'ip-whitelist',
  'callback-settings',
  'notification',
] as const;

const WAAS_ORDER_TAB_KEYS = [
  'developer',
  'ip-whitelist',
  'callback-settings',
  'notification',
  'receiving-transfer',
  'merchant',
] as const;

const PAYMENT_ENGINE_TAB_KEYS = [
  'developer',
  'ip-whitelist',
  'notification',
  'payment-currency-settlement',
  'merchant',
  'order-processing',
] as const;

type ProjectSettingsTabKey =
  | (typeof WAAS_TAB_KEYS)[number]
  | (typeof WAAS_ORDER_TAB_KEYS)[number]
  | (typeof PAYMENT_ENGINE_TAB_KEYS)[number];

function resolveTabKeys(preset: ProjectSettingsTabPreset) {
  if (preset === 'waas') return WAAS_TAB_KEYS;
  if (preset === 'waas-order') return WAAS_ORDER_TAB_KEYS;
  return PAYMENT_ENGINE_TAB_KEYS;
}

const props = withDefaults(
  defineProps<{
    projectName: string;
    tabPreset?: ProjectSettingsTabPreset;
    depositMode?: WaasProjectDepositMode;
    /** QA: pass true to preview the IP whitelist empty state. */
    ipWhitelistEmpty?: boolean;
  }>(),
  {
    tabPreset: 'payment-engine',
    ipWhitelistEmpty: false,
  },
);

const { ui } = useAppI18n();

const showGenerateSubAddressInterface = computed(
  () => props.depositMode === 'sub-address',
);

const tabIndex = ref(0);
const displayedTabIndex = ref(0);
const scrollBodyRef = ref<HTMLElement | null>(null);
const projectEnabled = ref(false);

const {
  contentExiting,
  contentEntering,
  switchContent,
} = useMotionLayoutContentSwitch();

watch(tabIndex, (next, prev) => {
  if (next === prev) return;
  switchContent(() => {
    displayedTabIndex.value = next;
  });
  scrollBodyRef.value?.scrollTo({ top: 0, behavior: 'instant' });
});

watch(
  () => props.tabPreset,
  () => {
    tabIndex.value = 0;
    displayedTabIndex.value = 0;
  },
);

const tabLabels = computed(() => {
  if (props.tabPreset === 'waas') {
    return [
      ui('Developer'),
      ui('IP Whitelist'),
      ui('Callback Settings'),
      ui('Notification Settings'),
    ];
  }

  if (props.tabPreset === 'waas-order') {
    return [
      ui('Developer'),
      ui('IP Whitelist'),
      ui('Callback Settings'),
      ui('Notification Settings'),
      ui('Receiving and Transfer'),
      ui('Merchant information'),
    ];
  }

  return [
    ui('Developer'),
    ui('IP Whitelist'),
    ui('Notification Settings'),
    ui('Payment Currency and Settlement'),
    ui('Merchant information'),
    ui('Order Processing'),
  ];
});

const activeTabKey = computed<ProjectSettingsTabKey>(() => {
  const keys = resolveTabKeys(props.tabPreset);
  return keys[displayedTabIndex.value] ?? keys[0];
});

const showDeveloperTab = computed(() => activeTabKey.value === 'developer');

const showComboPageButton = computed(() => {
  if (props.tabPreset === 'payment-engine') {
    return activeTabKey.value === 'payment-currency-settlement';
  }
  if (props.tabPreset === 'waas-order') {
    return activeTabKey.value === 'receiving-transfer';
  }
  return false;
});

const showMerchantActionFooter = computed(
  () => activeTabKey.value === 'merchant',
);

const comboPageConfirmLabel = computed(() =>
  ui(
    activeTabKey.value === 'payment-currency-settlement'
    || activeTabKey.value === 'receiving-transfer'
      ? 'Confirm'
      : 'Save',
  ),
);

</script>

<template>
  <div :class="styles.page">
    <EgLayout type="empty" show-toolbar>
      <template #toolbar>
        <EgToolBar :title="ui('Settings')" :show-operation="false" />
      </template>

      <div :class="styles.pageColumn">
        <div class="desktopTokens" :class="styles.tabsHeader">
          <div :class="sharedStyles.tabsBlock">
            <EgTabs v-model="tabIndex" :labels="tabLabels" horizontal-gap="xl" vertical-gap="md" />
          </div>
          <div :class="sharedStyles.tabsDividerWrap">
            <EgDivider type="page" direction="horizontal" />
          </div>
        </div>

        <div ref="scrollBodyRef" :class="styles.scrollBody">
          <div class="desktopTokens" :class="styles.content">
            <EgMotionLayoutContent
              :content-exiting="contentExiting"
              :content-entering="contentEntering"
            >
              <div v-if="showDeveloperTab" :class="sharedStyles.tabPanel">
              <ProjectSettingsSection :title="ui('Project Information')">
                <ProjectSettingsItem
                  :label="ui('Project Name')"
                  :value="props.projectName"
                  show-value-copy
                >
                  <template #actions>
                    <EgButton tone="decor" variant="solid" size="md">
                      {{ ui('Edit') }}
                    </EgButton>
                  </template>
                </ProjectSettingsItem>

                <ProjectSettingsItem
                  :label="ui('Creation Time')"
                  value="2031-10-23  12:22:54"
                  show-value-copy
                />

                <ProjectSettingsItem :label="ui('Creator')">
                  <template #value>
                    <span :class="sharedStyles.creatorCluster">
                      <EgAvatar name="N" size="xs" />
                      <span :class="sharedStyles.creatorText">
                        Binance. Hot Wallet_4 (binance@x.com)
                      </span>
                    </span>
                  </template>
                </ProjectSettingsItem>

                <ProjectSettingsItem :label="ui('Project Status')">
                  <template #value>
                    <span :class="sharedStyles.statusValue">
                      <span
                        :class="[
                          sharedStyles.statusDot,
                          projectEnabled ? sharedStyles.statusDotEnabled : sharedStyles.statusDotDisabled,
                        ]"
                        aria-hidden="true"
                      />
                      {{ projectEnabled ? ui('Enable') : ui('Disabled') }}
                    </span>
                  </template>
                  <template #actions>
                    <EgSwitch v-model="projectEnabled" size="md" />
                  </template>
                </ProjectSettingsItem>
              </ProjectSettingsSection>

              <div :class="sharedStyles.sectionDividerWrap">
                <EgDivider type="page" direction="horizontal" />
              </div>

              <ProjectSettingsSection :title="ui('Developer Center')">
                <ProjectSettingsItem
                  :label="ui('Project ID')"
                  value="Cregis1234567890"
                  show-value-copy
                />
                <ProjectSettingsItem :label="ui('API Key')">
                  <template #value>
                    <span :class="sharedStyles.maskedValue">****************************</span>
                  </template>
                  <template #actions>
                    <EgButton tone="subtle" variant="text" size="md" :class="sharedStyles.checkAction">
                      {{ ui('Check') }}
                    </EgButton>
                    <EgButton tone="decor" variant="solid" size="md">
                      {{ ui('Reset') }}
                    </EgButton>
                  </template>
                </ProjectSettingsItem>
                <ProjectSettingsItem
                  :label="ui('Gateway Server')"
                  value="https://t-hrqwjnzi.cregis.dev"
                />
                <div :class="sharedStyles.apiDocRow">
                  <EgLinkButton :class="sharedStyles.linkRow" tone="brand" size="md" href="#">
                    {{ ui('API document') }}
                    <EgIcon
                      :class="sharedStyles.linkIcon"
                      name="eds-arrow-right-mini-ios"
                      size="sm"
                    />
                  </EgLinkButton>
                </div>
              </ProjectSettingsSection>

              <div :class="sharedStyles.sectionDividerWrap">
                <EgDivider type="page" direction="horizontal" />
              </div>

              <ProjectSettingsSection :title="ui('Interface Type')" interface-heading>
                <template #action>
                  <EgButton tone="decor" variant="solid" size="md">
                    {{ ui('Edit') }}
                  </EgButton>
                </template>
                <div :class="sharedStyles.interfaceBody">
                  <div
                    v-if="showGenerateSubAddressInterface"
                    :class="sharedStyles.interfaceTypeItem"
                  >
                    <div :class="sharedStyles.interfaceMenu">
                      <span :class="sharedStyles.interfaceMenuTitle">
                        {{ ui('Generate Sub-Address') }}
                      </span>
                      <span :class="sharedStyles.interfaceMenuDescription">
                        {{ ui('Generate Sub-Address full description') }}
                      </span>
                    </div>
                    <div :class="sharedStyles.policyCard">
                      <span :class="sharedStyles.policyBid" aria-hidden="true" />
                      <div :class="sharedStyles.policyBody">
                        <div :class="sharedStyles.policyRow">
                          <span :class="sharedStyles.policyLabel">{{ ui('Wallet') }}</span>
                          <span :class="sharedStyles.policyValue">CregisFAT-2031</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div :class="sharedStyles.interfaceTypeItem">
                    <div :class="sharedStyles.interfaceMenu">
                      <span :class="sharedStyles.interfaceMenuTitle">{{ ui('Payout') }}</span>
                      <span :class="sharedStyles.interfaceMenuDescription">
                        {{ ui('Payout full description') }}
                      </span>
                    </div>
                    <div :class="sharedStyles.policyCard">
                      <span :class="sharedStyles.policyBid" aria-hidden="true" />
                      <div :class="sharedStyles.policyBody">
                        <div :class="sharedStyles.policyRow">
                          <span :class="sharedStyles.policyLabel">{{ ui('Policy') }}</span>
                          <span :class="sharedStyles.policyValue">Opus ESG Investment</span>
                        </div>
                        <div :class="sharedStyles.policyInnerDivider">
                          <EgDivider type="page" direction="horizontal" />
                        </div>
                        <div :class="sharedStyles.policyWalletBlock">
                          <span :class="sharedStyles.policyWalletLabel">{{ ui('Payment wallet') }}</span>
                          <ProjectSettingsPolicyWalletRow
                            wallet-name="CregisFAT-2031"
                            tag-key="Default Payout"
                            tag-style="apricot"
                            copy-value="1234567890"
                          />
                          <ProjectSettingsPolicyWalletRow
                            wallet-name="CregisFAT-2031"
                            tag-key="Default Payment"
                            tag-style="grass"
                            copy-value="1234567890"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ProjectSettingsSection>
            </div>

            <div v-else-if="activeTabKey === 'ip-whitelist'" :class="sharedStyles.tabPanel">
              <ProjectSettingsIpWhitelistPanel :empty="props.ipWhitelistEmpty" />
            </div>

            <div v-else-if="activeTabKey === 'callback-settings'" :class="sharedStyles.tabPanel">
              <ProjectSettingsCallbackPanel />
            </div>

            <div v-else-if="activeTabKey === 'notification'" :class="sharedStyles.tabPanel">
              <ProjectSettingsNotificationPanel :tab-preset="tabPreset" />
            </div>

            <div
              v-else-if="
                activeTabKey === 'payment-currency-settlement'
                || activeTabKey === 'receiving-transfer'
              "
              :class="sharedStyles.tabPanel"
            >
              <ProjectSettingsReceivingTransferPanel />
            </div>

            <div v-else-if="activeTabKey === 'merchant'" :class="sharedStyles.tabPanel">
              <ProjectSettingsMerchantPanel />
            </div>

            <div v-else-if="activeTabKey === 'order-processing'" :class="sharedStyles.tabPanel">
              <ProjectSettingsSection :title="ui('Order Processing')">
                <ProjectSettingsItem
                  :label="ui('Order Processing')"
                  :value="ui('Please Select')"
                  interactive
                />
              </ProjectSettingsSection>
            </div>
            </EgMotionLayoutContent>
          </div>
        </div>
      </div>

      <ProjectSettingsMerchantActionFooter v-if="showMerchantActionFooter" />

      <EgComboPageButton
        v-if="showComboPageButton"
        :confirm-label="comboPageConfirmLabel"
        :cancel-label="ui('Cancel')"
        divider
      />
    </EgLayout>
  </div>
</template>
