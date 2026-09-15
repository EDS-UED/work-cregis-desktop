<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgButton,
  EgComboInput,
  EgComboPageButton,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgFormSubmission,
  EgIcon,
  EgInput,
  EgLayout,
  EgSwitch,
  EgToolBar,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import ProjectCreateModeCard from '@/scenes/project/components/ProjectCreateModeCard.vue';
import { useWaasProjectStore } from '@/scenes/project/waasProjectStore';
import type { WaasProjectDepositMode } from '@/scenes/project/types';
import styles from './WaasProjectCreatePage.module.css';

const { ui } = useAppI18n();
const { cancelCreateProject, createProject } = useWaasProjectStore();

const projectName = ref('');
const depositEnabled = ref(true);
const depositMode = ref<WaasProjectDepositMode>('sub-address');
const depositWalletId = ref('wallet-1');
const payoutEnabled = ref(true);
const payoutWalletIds = ref<string[]>(['wallet-1']);
const nameError = ref('');

const walletOptions = [
  { id: 'wallet-1', label: 'CregisFAT-2031 · Ethereum' },
  { id: 'wallet-2', label: 'CregisFAT-2032 · BNB Smart Chain' },
];

const depositWalletLabel = computed(() => {
  return walletOptions.find((option) => option.id === depositWalletId.value)?.label ?? '';
});

const payoutWalletLabel = computed(() => {
  if (payoutWalletIds.value.length === 0) return '';
  const labels = payoutWalletIds.value
    .map((id) => walletOptions.find((option) => option.id === id)?.label)
    .filter(Boolean);
  return labels.join(', ');
});

function onCancel() {
  cancelCreateProject();
}

function onConfirm() {
  const trimmed = projectName.value.trim();
  if (trimmed.length < 2) {
    nameError.value = ui('2-20 Characters');
    return;
  }
  nameError.value = '';
  createProject({
    name: trimmed,
    depositEnabled: depositEnabled.value,
    depositMode: depositMode.value,
    payoutEnabled: payoutEnabled.value,
    payoutWalletId: payoutWalletIds.value[0],
  });
}

function setPayoutWalletChecked(walletId: string, checked: boolean) {
  if (checked) {
    if (!payoutWalletIds.value.includes(walletId)) {
      payoutWalletIds.value = [...payoutWalletIds.value, walletId];
    }
    return;
  }
  payoutWalletIds.value = payoutWalletIds.value.filter((id) => id !== walletId);
}
</script>

<template>
  <div class="desktopTokens" :class="styles.page">
    <EgLayout type="empty" show-toolbar>
      <template #toolbar>
        <EgToolBar
          :title="ui('Create Project')"
          :show-back="true"
          :show-operation="false"
          @back="onCancel"
        />
      </template>

      <div :class="styles.scrollBody">
        <div :class="styles.formRow">
          <div :class="styles.formBlock">
            <div :class="styles.fieldItem">
              <EgComboInput :label="ui('Project Name')" feedback>
                <EgInput
                  v-model="projectName"
                  width-mode="full"
                  :placeholder="ui('Please Input')"
                />
                <template #feedback>
                  <EgFormSubmission
                    v-if="nameError"
                    type="danger"
                    :text="nameError"
                  />
                  <EgFormSubmission
                    v-else
                    type="success"
                    :text="ui('2-20 Characters')"
                  />
                </template>
              </EgComboInput>
            </div>

            <div :class="styles.fieldItem">
              <div :class="styles.toggleRow">
                <div :class="styles.toggleText">
                  <span :class="styles.toggleTitle">{{ ui('Deposit Method') }}</span>
                  <span :class="styles.toggleDescription">
                    {{ ui('Deposit method full description') }}
                  </span>
                </div>
                <EgSwitch v-model="depositEnabled" size="md" />
              </div>
              <div
                v-if="depositEnabled"
                role="radiogroup"
                :aria-label="ui('Deposit Method')"
                :class="styles.modeList"
              >
                <ProjectCreateModeCard
                  radio-name="deposit-mode"
                  radio-value="sub-address"
                  :title="ui('Sub-Address Mode')"
                  :description="ui('Sub-Address Mode description')"
                  :selected="depositMode === 'sub-address'"
                  @select="depositMode = 'sub-address'"
                >
                  <EgComboInput :label="ui('Deposit Wallet')">
                    <EgFlotation
                      placement="bottom"
                      align="start"
                      width-mode="adaptive"
                      :show-add="false"
                      :show-menu-divider="false"
                      close-on-scroll
                    >
                      <template #trigger="{ expanded }">
                        <EgFlotationTrigger
                          trigger-style="subtle"
                          size="lg"
                          width-mode="adaptive"
                          :label="depositWalletLabel || ui('Please Select')"
                          :expanded="expanded"
                        />
                      </template>
                      <template #content>
                        <EgFlotationMenu
                          panel-radius="radius-md"
                          width-mode="adaptive"
                          height-mode="adaptive"
                          :show-add="false"
                          :show-divider="false"
                        >
                          <EgFlotationMenuItem
                            v-for="option in walletOptions"
                            :key="option.id"
                            box-type="text"
                            :label="option.label"
                            :selected="depositWalletId === option.id"
                            @click="depositWalletId = option.id"
                          />
                        </EgFlotationMenu>
                      </template>
                    </EgFlotation>
                  </EgComboInput>
                </ProjectCreateModeCard>

                <ProjectCreateModeCard
                  radio-name="deposit-mode"
                  radio-value="order"
                  :title="ui('Order Mode')"
                  :description="ui('Order Mode description')"
                  :selected="depositMode === 'order'"
                  @select="depositMode = 'order'"
                >
                  <EgButton tone="decor" variant="outline" size="md" width-mode="full">
                    {{ ui('Upload Certificate') }}
                  </EgButton>
                </ProjectCreateModeCard>
              </div>
            </div>

            <div :class="styles.fieldItem">
              <div :class="styles.toggleRow">
                <div :class="styles.toggleText">
                  <span :class="styles.toggleTitle">{{ ui('Payout') }}</span>
                  <span :class="styles.toggleDescription">
                    {{ ui('Payout full description') }}
                  </span>
                </div>
                <EgSwitch v-model="payoutEnabled" size="md" />
              </div>
              <div v-if="payoutEnabled" :class="styles.payoutBody">
                <p :class="styles.policyWarning">
                  {{ ui('Payout policy warning') }}
                </p>
                <EgComboInput :label="ui('Set Payout Wallets (Multi-Select)')">
                  <EgFlotation
                    placement="bottom"
                    align="start"
                    width-mode="adaptive"
                    :show-add="false"
                    :show-menu-divider="false"
                    close-on-scroll
                  >
                    <template #trigger="{ expanded }">
                      <EgFlotationTrigger
                        trigger-style="subtle"
                        size="lg"
                        width-mode="adaptive"
                        :label="payoutWalletLabel || ui('Please Select')"
                        :expanded="expanded"
                      />
                    </template>
                    <template #content>
                      <EgFlotationMenu
                        panel-radius="radius-md"
                        width-mode="adaptive"
                        height-mode="adaptive"
                        :show-add="false"
                        :show-divider="false"
                      >
                        <EgFlotationMenuItem
                          v-for="option in walletOptions"
                          :key="option.id"
                          box-type="text"
                          :label="option.label"
                          :show-checkbox="true"
                          :checked="payoutWalletIds.includes(option.id)"
                          @update:checked="setPayoutWalletChecked(option.id, $event)"
                        />
                      </EgFlotationMenu>
                    </template>
                  </EgFlotation>
                </EgComboInput>
                <div :class="styles.infoRow">
                  <EgIcon name="eds-information-fill" size="sm" fit />
                  <p :class="styles.infoText">
                    {{ ui('Default payout address hint') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EgComboPageButton
        :confirm-label="ui('Create')"
        :cancel-label="ui('Cancel')"
        divider
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </EgLayout>
  </div>
</template>
