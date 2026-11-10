<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import {
  EgCrypto,
  EgIcon,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgFormSubmission,
  EgInput,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  AML_QUERY_NETWORK_MENU_MAX_HEIGHT,
} from '@/scenes/risk-control/riskControlAmlQueryOptions';
import {
  formatOverviewTransferEstimatedArrival,
  parseOverviewTransferAmountUsd,
  validateOverviewAccountTransferAmount,
} from './useManageOverviewAccountTransferFlow';
import {
  listOverviewAccountTransferTargets,
  OVERVIEW_ACCOUNT_TRANSFER_TEAM_AVAILABLE_USD,
  resolveOverviewAccountTransferDefaultTarget,
  type OverviewAccountTransferTargetKey,
} from './overviewAccountTransferSkidData';
import styles from './ManageOverviewAccountTransferSkidBody.module.css';

/** 划转 Skid 从/到账户触发器宽（相对当前 adaptive 宽约 +40px）。 */
const ACCOUNT_TRANSFER_ACCOUNT_TRIGGER_WIDTH = 251;

const props = defineProps<{
  gasProxyEnabled: boolean;
}>();

const amountRaw = ref('');
const submitAttempted = ref(false);
const selectedTargetKey = ref<OverviewAccountTransferTargetKey>(
  resolveOverviewAccountTransferDefaultTarget(props.gasProxyEnabled),
);

const { ui } = useAppI18n();

const targetOptions = computed(() => listOverviewAccountTransferTargets(props.gasProxyEnabled));

const selectedTarget = computed(
  () => targetOptions.value.find((item) => item.key === selectedTargetKey.value) ?? targetOptions.value[0],
);

watch(
  () => props.gasProxyEnabled,
  (enabled) => {
    selectedTargetKey.value = resolveOverviewAccountTransferDefaultTarget(enabled);
  },
);

const selectedNetworkLabel = computed(() =>
  selectedTarget.value ? ui(selectedTarget.value.titleKey) : '',
);

const amountValidation = computed(() => validateOverviewAccountTransferAmount(amountRaw.value));

const canSubmit = computed(
  () => amountValidation.value.ok && Boolean(selectedTarget.value),
);

const amountErrorText = computed(() =>
  (submitAttempted.value || amountRaw.value.trim()) && !amountValidation.value.ok
    ? ui(amountValidation.value.messageKey)
    : '',
);

const estimatedArrivalUnit = computed(() => selectedTarget.value?.key.toUpperCase() ?? 'ETH');

const estimatedArrivalText = computed(() => {
  const targetKey = selectedTarget.value?.key ?? 'eth';
  const parsed = parseOverviewTransferAmountUsd(amountRaw.value);
  if (parsed == null || parsed <= 0) {
    return `-- ${estimatedArrivalUnit.value}`;
  }
  return `${formatOverviewTransferEstimatedArrival(parsed, targetKey)} ${estimatedArrivalUnit.value}`;
});

function selectTarget(key: OverviewAccountTransferTargetKey, close: () => void) {
  selectedTargetKey.value = key;
  close();
}

function fillAllAmount() {
  amountRaw.value = String(OVERVIEW_ACCOUNT_TRANSFER_TEAM_AVAILABLE_USD);
}

const emit = defineEmits<{
  submit: [
    payload: {
      amountRaw: string;
      target: NonNullable<typeof selectedTarget.value>;
    },
  ];
  validityChange: [ok: boolean];
}>();

watchEffect(() => {
  emit('validityChange', canSubmit.value);
});

function trySubmit(): boolean {
  submitAttempted.value = true;
  if (!selectedTarget.value) return false;
  if (!amountValidation.value.ok) return false;
  emit('submit', { amountRaw: amountRaw.value, target: selectedTarget.value });
  return true;
}

function resetForm() {
  submitAttempted.value = false;
  amountRaw.value = '';
  selectedTargetKey.value = resolveOverviewAccountTransferDefaultTarget(props.gasProxyEnabled);
}

defineExpose({ trySubmit, resetForm });
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.accountTransferRow">
      <div :class="[styles.fieldRow, styles.accountTransferField]">
        <span :class="styles.accountTransferFieldLabel">{{ ui('Overview Account Transfer From Field') }}</span>
        <div :class="styles.accountTransferTriggerControl">
          <EgFlotationTrigger
            :class="styles.accountTransferFlotationTrigger"
            trigger-style="subtle"
            size="md"
            width-mode="fixed"
            :width="ACCOUNT_TRANSFER_ACCOUNT_TRIGGER_WIDTH"
            :label="ui('Team Account')"
            :expanded="false"
            disabled
          />
        </div>
      </div>

      <span :class="styles.accountTransferArrow" aria-hidden="true">
        <EgIcon name="eds-arrow-right" fit />
      </span>

      <div :class="[styles.fieldRow, styles.accountTransferField]">
        <span :class="styles.accountTransferFieldLabel">{{ ui('Overview Account Transfer To Field') }}</span>
        <div :class="styles.accountTransferTriggerControl">
          <EgFlotation
            :class="styles.accountTransferScopeFlotationHost"
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
                :key="selectedTargetKey"
                :class="styles.accountTransferFlotationTrigger"
                trigger-style="subtle"
                size="md"
                width-mode="fixed"
                :width="ACCOUNT_TRANSFER_ACCOUNT_TRIGGER_WIDTH"
                :label="selectedNetworkLabel"
                :expanded="expanded"
                show-symbol
              >
                <template v-if="selectedTarget" #symbol>
                  <span :class="styles.networkTriggerSymbol">
                    <EgCrypto :name="selectedTarget.cryptoName" size="md" fit />
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
                  v-for="account in targetOptions"
                  :key="account.key"
                  box-type="image-text"
                  :label="ui(account.titleKey)"
                  :symbol-icon="account.cryptoName"
                  :focused="selectedTargetKey === account.key"
                  @click="selectTarget(account.key, close)"
                />
              </EgFlotationMenu>
            </template>
          </EgFlotation>
        </div>
      </div>
    </div>

    <div :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('Overview Account Transfer Amount Field') }}</span>
      <EgInput
        v-model="amountRaw"
        :class="styles.amountInput"
        type="amount"
        show-max
        size="md"
        width-mode="full"
        unit="USD"
        :clearable="false"
        :max-label="ui('All')"
        @max="fillAllAmount"
      />
      <EgFormSubmission
        v-if="amountErrorText"
        type="danger"
        :show-link="false"
        :text="amountErrorText"
      />
    </div>

    <div :class="styles.fieldBlock">
      <div :class="styles.estimatedRow">
        <span :class="styles.estimatedLabel">{{ ui('Overview Account Transfer Estimated Arrival') }}</span>
        <span :class="styles.estimatedValue">{{ estimatedArrivalText }}</span>
      </div>
      <EgFormSubmission
        type="notes"
        :show-link="false"
        :text="ui('Overview Account Transfer Arrival Delay Hint')"
      />
    </div>
  </div>
</template>
