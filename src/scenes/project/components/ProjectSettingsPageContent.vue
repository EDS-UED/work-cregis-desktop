<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgAvatar,
  EgButton,
  EgColorfulTag,
  EgComboPageButton,
  EgDivider,
  EgIcon,
  EgIconButton,
  EgLayout,
  EgLinkButton,
  EgSwitch,
  EgTabs,
  EgTag,
  EgToolBar,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import ProjectSettingsItem from '@/scenes/project/components/ProjectSettingsItem.vue';
import ProjectSettingsSection from '@/scenes/project/components/ProjectSettingsSection.vue';
import sharedStyles from '@/scenes/waas-project/settings/waasSettings.shared.module.css';
import styles from '@/scenes/waas-project/WaasProjectSettingsPage.module.css';

const props = defineProps<{
  projectName: string;
}>();

const { ui } = useAppI18n();

const tabIndex = ref(0);
const projectEnabled = ref(false);

const tabLabels = computed(() => [
  ui('Developer'),
  ui('IP Whitelist'),
  ui('Notification'),
  ui('Receiving and Transfer'),
  ui('Merchant information'),
]);

const notificationGroups = computed(() => [
  {
    title: ui('Payment Notification'),
    members: ['Nathan', 'Olivia Parker', 'Ethan Brooks', 'Sophia Lee', 'Liam Carter'],
  },
  {
    title: ui('Callback Notification'),
    members: ['Nathan', 'Olivia Parker'],
  },
  {
    title: ui('Order Notification'),
    members: [] as string[],
  },
  {
    title: ui('Refund Notification'),
    members: [] as string[],
  },
]);
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
          <EgDivider :class="sharedStyles.tabsDivider" type="module" direction="horizontal" />
        </div>

        <div :class="styles.scrollBody">
          <div class="desktopTokens" :class="styles.content">
            <div v-if="tabIndex === 0" :class="sharedStyles.tabPanel">
              <ProjectSettingsSection :title="ui('Project Information')">
                <ProjectSettingsItem
                  :label="ui('Project Name')"
                  :value="props.projectName"
                  show-value-copy
                >
                  <template #actions>
                    <EgButton tone="decor" variant="solid" size="sm">
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

              <EgDivider :class="sharedStyles.sectionDivider" type="module" direction="horizontal" />

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
                    <EgButton tone="subtle" variant="text" size="sm" :class="sharedStyles.checkAction">
                      {{ ui('Check') }}
                    </EgButton>
                    <EgButton tone="decor" variant="solid" size="sm">
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

              <EgDivider :class="sharedStyles.sectionDivider" type="module" direction="horizontal" />

              <ProjectSettingsSection :title="ui('Interface Type')" interface-heading>
                <template #action>
                  <EgButton tone="decor" variant="solid" size="sm">
                    {{ ui('Edit') }}
                  </EgButton>
                </template>
                <div :class="sharedStyles.interfaceBody">
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
                      <EgDivider type="module" direction="horizontal" />
                      <div :class="sharedStyles.policyWalletBlock">
                        <span :class="sharedStyles.policyWalletLabel">{{ ui('Payment wallet') }}</span>
                        <div :class="sharedStyles.policyWalletRow">
                          <span :class="sharedStyles.policyValue">CregisFAT-2031</span>
                          <EgColorfulTag colorful-style="apricot" size="sm">
                            {{ ui('Default Payout') }}
                          </EgColorfulTag>
                          <EgDivider type="module" direction="vertical" />
                          <span :class="sharedStyles.policyValueMuted">ID: 1234567890</span>
                        </div>
                        <div :class="sharedStyles.policyWalletRow">
                          <span :class="sharedStyles.policyValue">CregisFAT-2031</span>
                          <EgColorfulTag colorful-style="grass" size="sm">
                            {{ ui('Default Payment') }}
                          </EgColorfulTag>
                          <EgDivider type="module" direction="vertical" />
                          <span :class="sharedStyles.policyValueMuted">ID: 1234567890</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ProjectSettingsSection>
            </div>

          <div v-else-if="tabIndex === 1" :class="sharedStyles.tabPanel">
            <div :class="sharedStyles.emptyState">
              <EgIcon name="eds-business-7" size="lg" />
              <div :class="sharedStyles.emptyTextBlock">
                <span :class="sharedStyles.emptyTitle">{{ ui('No data') }}</span>
                <span :class="sharedStyles.emptyDescription">
                  {{ ui('API whitelist empty description') }}
                </span>
              </div>
              <EgButton tone="decor" variant="outline" size="sm">
                {{ ui('Add IP') }}
              </EgButton>
            </div>
          </div>

          <div v-else-if="tabIndex === 2" :class="sharedStyles.tabPanel">
            <div
              v-for="group in notificationGroups"
              :key="group.title"
              :class="sharedStyles.notifyGroup"
            >
              <ProjectSettingsItem :label="group.title" />
              <div v-if="group.members.length > 0" :class="sharedStyles.notifyMembers">
                <span
                  v-for="member in group.members"
                  :key="member"
                  :class="sharedStyles.notifyMemberChip"
                >
                  <EgAvatar :name="member" size="xs" />
                  <span :class="sharedStyles.notifyMemberName">{{ member }}</span>
                </span>
                <EgIconButton
                  :class="sharedStyles.notifyMoreButton"
                  shape="rectangular"
                  size="sm"
                  :label="ui('Add Member')"
                >
                  <EgIcon name="eds-add" size="sm" />
                </EgIconButton>
              </div>
            </div>
          </div>

          <div v-else-if="tabIndex === 3" :class="sharedStyles.tabPanel">
            <h4 :class="sharedStyles.collectionHeading">{{ ui('Receiving Currency') }}</h4>
            <div :class="sharedStyles.collectionPlaceholder">
              <EgTag system-type="stroke-subtle" size="sm">USDT</EgTag>
              <EgTag system-type="stroke-subtle" size="sm">USDC</EgTag>
              <EgTag system-type="stroke-subtle" size="sm">ETH</EgTag>
            </div>
          </div>

            <div v-else :class="sharedStyles.tabPanel">
              <ProjectSettingsItem
                :label="ui('Checkout Page Settings (Optional)')"
                :value="props.projectName"
                interactive
              />
              <div :class="sharedStyles.merchantLogoRow">
                <span :class="sharedStyles.merchantLogoLabel">{{ ui('Merchant Logo') }}</span>
                <EgAvatar name="M" size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <EgComboPageButton
        v-if="tabIndex === 4"
        :confirm-label="ui('Save')"
        :cancel-label="ui('Cancel')"
        divider
      />
    </EgLayout>
  </div>
</template>
