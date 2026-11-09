<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  EgButton,
  EgCrypto,
  EgDivider,
  EgIcon,
  EgIconButton,
  EgFlotation,
  EgIconProButton,
  EgLayout,
  EgFieldOvfTooltip,
  EgFormSubmission,
  EgOdometer,
  EgSkid,
  EgSwitch,
  EgToolBar,
  closeAllAnchoredTooltips,
} from '@eds/desktop-components';
import { showAppEndFeedback } from '@/composables/appEndFeedback';
import ManageOverviewBalanceReminderSkidAction from './ManageOverviewBalanceReminderSkidAction.vue';
import ManageOverviewBalanceReminderSkidBody from './ManageOverviewBalanceReminderSkidBody.vue';
import ManageOverviewGenerateBillFlotationMenu from './ManageOverviewGenerateBillFlotationMenu.vue';
import ManageOverviewRechargeSkidBody from './ManageOverviewRechargeSkidBody.vue';
import {
  OVERVIEW_GENERATE_BILL_FLOTATION_MAX_HEIGHT,
  OVERVIEW_GENERATE_BILL_FLOTATION_WIDTH,
} from './manageOverviewGenerateBill.constants';
import type { OverviewGasRechargeAccountKey } from './overviewRechargeSkidData';
import { useManageOverviewBalanceReminderForm } from './useManageOverviewBalanceReminderForm';
import { registerManageOverviewOverlay } from './manageOverviewOverlayContext';
import { useManageOverviewGasProxyPaymentFlow } from './useManageOverviewGasProxyPaymentFlow';
import { useAppI18n } from '@/composables/useAppI18n';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import styles from './ManageOverviewPage.module.css';
import {
  manageOverviewQaApiRegistry,
  type ManageOverviewQaSnapshot,
} from './manageOverviewQaApi';

type GasAccountOverviewItem = {
  key: OverviewGasRechargeAccountKey;
  symbol: string;
  cryptoName: string;
  titleKey: string;
  descriptionKey: string;
  balance: string;
  sharedWithTeam?: boolean;
  insufficient?: boolean;
  gasProxyPaymentLockedOn?: boolean;
};

const TOTAL_BALANCE_DISPLAY = '$425,682.77';
const BALANCE_MASK = '************';
const SUMMARY_AMOUNT_MASK = '********';
const GAS_BALANCE_MASK = '********';

const { ui } = useAppI18n();

const gasProxyEnabled = ref(true);
const gasProxyPaymentByKey = ref<Record<string, boolean>>({
  trx: true,
  eth: false,
  bnb: true,
  pol: false,
  sol: false,
});
/** 「矿工费代付配置」操作权限 · 控制 Gas 账户行内开关。 */
const canConfigureGasProxyPayment = ref(true);
/** Mock：是否已设置交易密码（未设置时开启代付引导先设置）。 */
const transactionPasswordSet = ref(true);
const balanceAmountVisible = ref(true);
type OverviewRechargeSkidTarget = 'team' | 'gas';
type OverviewSkidKind = 'recharge' | 'balance-reminder';

const overviewSkidOpen = ref(false);
const overviewSkidKind = ref<OverviewSkidKind>('recharge');
const rechargeSkidTarget = ref<OverviewRechargeSkidTarget>('team');
const rechargeGasAccountKey = ref<OverviewGasRechargeAccountKey>('trx');

const overviewSkidTitleKey = computed(() => {
  if (overviewSkidKind.value === 'balance-reminder') {
    return 'Overview Balance Reminder Settings';
  }
  return rechargeSkidTarget.value === 'team'
    ? 'Overview Team Account Recharge'
    : 'Overview Gas Account Recharge';
});

const overviewSkidShowsSave = computed(() => overviewSkidKind.value === 'balance-reminder');

const {
  form: balanceReminderForm,
  saveEnabled: balanceReminderSaveEnabled,
  persistSave: persistBalanceReminderSave,
} = useManageOverviewBalanceReminderForm();

const balanceReminderSkidContentRevision = ref(0);
watch(
  balanceReminderForm,
  () => {
    balanceReminderSkidContentRevision.value += 1;
  },
  { deep: true },
);

const odometerPlayKey = ref(0);

const scrollRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const { canScroll, topScrim, update } = useScrollChromeScrim(scrollRef, {
  contentRef,
});

const toolbarScrimActive = computed(() => canScroll.value && topScrim.value);

const summaryAccounts = [
  {
    key: 'team',
    titleKey: 'Team Account',
    descriptionKey: 'Overview Team Account Description',
    amount: '$128,430.52',
  },
  {
    key: 'gas',
    titleKey: 'Gas Account',
    descriptionKey: 'Overview Gas Account Description',
    amount: '$297,252.25',
  },
] as const;

/** 未开通 Gas：摘要区不展示 Gas 账户卡片。 */
const visibleSummaryAccounts = computed(() =>
  gasProxyEnabled.value
    ? summaryAccounts
    : summaryAccounts.filter((account) => account.key !== 'gas'),
);

/** 未开通 Gas：Gas 区仅保留 TRX（与团队账户共用）；开通后展示全部链账户。 */
const visibleGasAccounts = computed(() =>
  gasProxyEnabled.value
    ? gasAccounts
    : gasAccounts.filter((account) => account.key === 'trx'),
);

const gasAccounts: GasAccountOverviewItem[] = [
  {
    key: 'trx',
    symbol: 'TRX',
    cryptoName: 'eds-trx-tron',
    titleKey: 'TRX Gas Account',
    descriptionKey: 'Overview TRX Gas Account Description',
    balance: '',
    sharedWithTeam: true,
    gasProxyPaymentLockedOn: true,
  },
  {
    key: 'eth',
    symbol: 'ETH',
    cryptoName: 'eds-eth-ethereum',
    titleKey: 'ETH Gas Account',
    descriptionKey: 'Overview ETH Gas Account Description',
    balance: '12.4821 ETH',
    insufficient: true,
  },
  {
    key: 'bnb',
    symbol: 'BNB',
    cryptoName: 'eds-bnb-binance coin',
    titleKey: 'BNB Gas Account',
    descriptionKey: 'Overview BNB Gas Account Description',
    balance: '86.245 BNB',
  },
  {
    key: 'pol',
    symbol: 'POL',
    cryptoName: 'eds-pol-polygon',
    titleKey: 'POL Gas Account',
    descriptionKey: 'Overview POL Gas Account Description',
    balance: '42,680.00 POL',
  },
  {
    key: 'sol',
    symbol: 'SOL',
    cryptoName: 'eds-sol-solana',
    titleKey: 'SOL Gas Account',
    descriptionKey: 'Overview SOL Gas Account Description',
    balance: '1,286.40 SOL',
  },
];

function gasProxySwitchValue(account: GasAccountOverviewItem) {
  if (account.gasProxyPaymentLockedOn) return true;
  return gasProxyPaymentByKey.value[account.key] ?? false;
}

const {
  confirmDialogOpen,
  confirmEnabling,
  verifyOpen,
  noPermissionDialogOpen,
  setTransactionPasswordDialogOpen,
  requestGasProxyPaymentToggle,
  confirmToggleDialog,
  cancelToggleDialog,
  submitTradePassword,
  onVerifyClosed,
} = useManageOverviewGasProxyPaymentFlow({
  canConfigureGasProxyPayment,
  transactionPasswordSet,
  gasProxyPaymentByKey,
});

function onGasProxyPaymentSwitch(account: GasAccountOverviewItem, next: boolean) {
  requestGasProxyPaymentToggle(account.key, next, account.gasProxyPaymentLockedOn);
}

function replayOdometer() {
  odometerPlayKey.value += 1;
}

function showBalanceAmount() {
  if (balanceAmountVisible.value) return;
  balanceAmountVisible.value = true;
  replayOdometer();
}

function hideBalanceAmount() {
  if (!balanceAmountVisible.value) return;
  balanceAmountVisible.value = false;
}

function toggleBalanceAmountVisibility() {
  if (balanceAmountVisible.value) {
    hideBalanceAmount();
    return;
  }
  showBalanceAmount();
}

function openRechargeSkid(
  target: OverviewRechargeSkidTarget,
  gasAccountKey?: OverviewGasRechargeAccountKey,
) {
  overviewSkidKind.value = 'recharge';
  rechargeSkidTarget.value = target;
  if (target === 'gas') {
    rechargeGasAccountKey.value = gasAccountKey ?? 'trx';
  }
  overviewSkidOpen.value = true;
}

function openBalanceReminderSkid() {
  overviewSkidKind.value = 'balance-reminder';
  overviewSkidOpen.value = true;
}

function closeOverviewSkid() {
  overviewSkidOpen.value = false;
}

function onBalanceReminderSave() {
  if (!balanceReminderSaveEnabled.value) return;
  closeAllAnchoredTooltips();
  if (!persistBalanceReminderSave()) return;
  closeOverviewSkid();
  showAppEndFeedback();
}

watch(canScroll, () => {
  update();
});

watch(gasProxyEnabled, () => {
  update();
});

watch(overviewSkidOpen, () => {
  update();
});

function applyOverviewQaSnapshot(patch: Partial<ManageOverviewQaSnapshot>) {
  if (patch.gasProxyEnabled !== undefined) {
    gasProxyEnabled.value = patch.gasProxyEnabled;
  }
  if (patch.balanceAmountVisible !== undefined) {
    balanceAmountVisible.value = patch.balanceAmountVisible;
  }
  if (patch.overviewSkidOpen !== undefined) {
    overviewSkidOpen.value = patch.overviewSkidOpen;
  }
  if (patch.canConfigureGasProxyPayment !== undefined) {
    canConfigureGasProxyPayment.value = patch.canConfigureGasProxyPayment;
  }
}

function resetOverviewQaBaseline() {
  gasProxyEnabled.value = true;
  balanceAmountVisible.value = true;
  overviewSkidOpen.value = false;
  canConfigureGasProxyPayment.value = true;
  overviewSkidKind.value = 'recharge';
  rechargeSkidTarget.value = 'team';
  rechargeGasAccountKey.value = 'trx';
}

onMounted(() => {
  registerManageOverviewOverlay({
    confirmDialogOpen,
    confirmEnabling,
    verifyOpen,
    noPermissionDialogOpen,
    setTransactionPasswordDialogOpen,
    confirmToggleDialog,
    cancelToggleDialog,
    submitTradePassword,
    onVerifyClosed,
  });
  manageOverviewQaApiRegistry.value = {
    applySnapshot: applyOverviewQaSnapshot,
    resetOverviewQaBaseline,
    openRechargeSkid,
    openBalanceReminderSkid,
    closeOverviewSkid,
  };
});

onBeforeUnmount(() => {
  registerManageOverviewOverlay(null);
  manageOverviewQaApiRegistry.value = null;
});
</script>

<template>
  <div :class="styles.overviewNest">
    <EgLayout v-model:show-skid="overviewSkidOpen" type="empty" show-toolbar>
      <template #toolbar>
        <div :class="styles.toolbarSlotHost">
          <EgToolBar
            :title="ui('Overview Asset')"
            :show-operation="!overviewSkidOpen"
            :show-divider="toolbarScrimActive"
            :frosted="toolbarScrimActive"
          >
            <template v-if="!overviewSkidOpen" #functional>
              <EgIconProButton
                :label="ui('Overview Balance Reminder')"
                @click="openBalanceReminderSkid"
              >
                <EgIcon name="eds-bell-ringing" size="sm" />
              </EgIconProButton>

              <EgFlotation
                placement="bottom"
                align="end"
                width-mode="fixed"
                :width="OVERVIEW_GENERATE_BILL_FLOTATION_WIDTH"
                height-mode="adaptive"
                :max-height="OVERVIEW_GENERATE_BILL_FLOTATION_MAX_HEIGHT"
                :show-add="false"
                :show-menu-divider="false"
                boundary-selector=".app-preview"
                flip
                close-on-scroll
              >
                <template #trigger="{ expanded }">
                  <span
                    :class="[
                      styles.billFlotationTriggerRoot,
                      expanded && styles.billFlotationTriggerExpanded,
                    ]"
                  >
                    <span
                      data-eds-trigger-metrics
                      :class="styles.billFlotationIconSlot"
                      :aria-expanded="expanded"
                    >
                      <EgIconButton
                        as="span"
                        shape="rectangular"
                        size="sm"
                        :label="ui('Overview Generate Bill')"
                      >
                        <EgIcon name="eds-bill" size="sm" />
                      </EgIconButton>
                    </span>
                    <span :class="styles.billFlotationLabelWrap">
                      <span :class="styles.billFlotationLabelPaint" aria-hidden="true">
                        {{ ui('Overview Generate Bill') }}
                      </span>
                      <span :class="styles.billFlotationLabelSizer">
                        {{ ui('Overview Generate Bill') }}
                      </span>
                    </span>
                  </span>
                </template>
                <template #content>
                  <ManageOverviewGenerateBillFlotationMenu />
                </template>
              </EgFlotation>
            </template>
          </EgToolBar>
          <button
            v-if="overviewSkidOpen"
            type="button"
            :class="styles.skidDismissBackdrop"
            :aria-label="ui('Close')"
            @click="closeOverviewSkid"
          />
        </div>
      </template>

      <div ref="scrollRef" :class="styles.scrollBody">
        <button
          v-if="overviewSkidOpen"
          type="button"
          :class="styles.skidDismissBackdrop"
          :aria-label="ui('Close')"
          @click="closeOverviewSkid"
        />
        <main ref="contentRef" class="desktopTokens" :class="styles.content">
          <section :class="styles.assetHeader">
            <div :class="styles.assetLabelRow">
              <span class="typography-body-medium">{{ ui('Overview Balance') }}</span>
              <EgIconButton
                shape="square"
                size="xs"
                :class="styles.visibilityButton"
                :label="
                  ui(
                    balanceAmountVisible
                      ? 'Overview Hide Asset Valuation'
                      : 'Overview Show Asset Valuation',
                  )
                "
                @click="toggleBalanceAmountVisibility"
              >
                <EgIcon
                  :name="balanceAmountVisible ? 'eds-eye' : 'eds-uneye'"
                  fit
                />
              </EgIconButton>
            </div>

            <button
              type="button"
              :class="styles.totalBalanceButton"
              :aria-label="
                ui(
                  balanceAmountVisible
                    ? 'Overview Hide Asset Valuation'
                    : 'Overview Show Asset Valuation',
                )
              "
              @click="toggleBalanceAmountVisibility"
            >
              <EgOdometer
                v-if="balanceAmountVisible"
                :key="odometerPlayKey"
                :value="TOTAL_BALANCE_DISPLAY"
              />
              <span v-else class="typography-display" :class="styles.totalBalanceMask">
                {{ BALANCE_MASK }}
              </span>
            </button>

            <div
              :class="[
                styles.summaryGrid,
                visibleSummaryAccounts.length === 1 && styles.summaryGridSingle,
              ]"
            >
              <article
                v-for="account in visibleSummaryAccounts"
                :key="account.key"
                :class="styles.summaryCard"
              >
                <div :class="styles.summaryCopy">
                  <div :class="styles.summaryTitleRow">
                    <span class="typography-body-small">{{ ui(account.titleKey) }}</span>
                    <EgFieldOvfTooltip
                      :class="styles.accountInfoTooltip"
                      :tooltip-text="ui(account.descriptionKey)"
                      semantic-truncated
                      trigger="hover"
                      target-tone="inherit"
                      boundary-selector=".app-preview"
                      :max-width="328"
                      :host-class="styles.fieldOvfHintHost"
                    >
                      <EgIconButton
                        shape="square"
                        size="xs"
                        :class="styles.infoButton"
                        :label="ui('Overview Account Description')"
                        @click.stop
                      >
                        <EgIcon :class="styles.iconOutline" name="eds-information" fit />
                        <EgIcon :class="styles.iconFill" name="eds-information-fill" fit />
                      </EgIconButton>
                    </EgFieldOvfTooltip>
                  </div>
                  <span class="typography-title" :class="styles.summaryAmount">
                    {{
                      balanceAmountVisible ? account.amount : SUMMARY_AMOUNT_MASK
                    }}
                  </span>
                </div>
                <span v-if="!overviewSkidOpen" :class="styles.summaryCardAction">
                  <EgButton
                    variant="solid"
                    tone="decor"
                    size="md"
                    @click="openRechargeSkid(account.key)"
                  >
                    {{ ui('Recharge') }}
                  </EgButton>
                </span>
              </article>
            </div>
          </section>

          <div :class="styles.sectionDividerInset">
            <EgDivider type="page" direction="horizontal" />
          </div>

          <section :class="styles.gasSection">
            <h2 class="typography-body-small-strong" :class="styles.sectionTitle">
              {{ ui('Overview Gas Account Balance') }}
            </h2>

            <div v-if="visibleGasAccounts.length" :class="styles.gasAccountRows">
              <article
                v-for="account in visibleGasAccounts"
                :key="account.key"
                :class="styles.gasAccountRow"
              >
                  <div :class="styles.gasAccountLeading">
                    <span :class="styles.gasCryptoHost">
                      <EgCrypto :name="account.cryptoName" size="md" fit />
                    </span>
                    <div :class="styles.gasAccountCopy">
                      <div :class="styles.gasAccountTextStack">
                        <div :class="styles.gasAccountTitleRow">
                          <span class="typography-body-medium">
                            {{ ui(account.titleKey) }}
                          </span>
                        </div>
                        <p :class="styles.gasAccountDescription">
                          {{ ui(account.descriptionKey) }}
                        </p>
                      </div>
                      <div :class="styles.gasProxyPaymentRow">
                        <span :class="styles.gasProxyPaymentLabel">
                          {{ ui('Overview Gas Proxy Payment') }}
                        </span>
                        <EgSwitch
                          :model-value="gasProxySwitchValue(account)"
                          :disabled="
                            account.gasProxyPaymentLockedOn || !canConfigureGasProxyPayment
                          "
                          size="sm"
                          @update:model-value="onGasProxyPaymentSwitch(account, $event)"
                          @click.stop
                        />
                      </div>
                    </div>
                  </div>

                  <div :class="styles.gasAccountTrailing">
                    <div :class="styles.gasBalanceDetailsStack">
                      <div :class="styles.gasBalanceRow">
                        <span class="typography-body-medium" :class="styles.gasBalanceValue">
                          {{
                            balanceAmountVisible
                              ? account.sharedWithTeam
                                ? ui('Overview Shared With Team Account')
                                : account.balance
                              : GAS_BALANCE_MASK
                          }}
                        </span>
                      </div>
                      <div
                        v-if="account.insufficient"
                        :class="styles.gasBalanceLinkSubmissionRow"
                      >
                        <EgFormSubmission
                          :class="styles.gasBalanceFormSubmission"
                          type="danger"
                          :show-link="false"
                          :text="ui('Overview Insufficient Balance')"
                        />
                        <EgButton
                          v-if="!overviewSkidOpen"
                          variant="outline"
                          tone="decor"
                          size="xs"
                          @click="openRechargeSkid('gas', account.key)"
                        >
                          {{ ui('Recharge') }}
                        </EgButton>
                      </div>
                    </div>
                  </div>
              </article>
            </div>
          </section>
        </main>
      </div>

      <template #skid>
        <EgSkid
          :title="ui(overviewSkidTitleKey)"
          :show-button="overviewSkidShowsSave"
          action-tone="decor"
          :confirm-label="ui('Save')"
        >
          <template v-if="overviewSkidKind === 'balance-reminder'" #action>
            <ManageOverviewBalanceReminderSkidAction
              :confirm-label="ui('Save')"
              tone="decor"
              :disabled="!balanceReminderSaveEnabled"
              :content-revision="balanceReminderSkidContentRevision"
              @confirm="onBalanceReminderSave"
            />
          </template>
          <ManageOverviewBalanceReminderSkidBody
            v-if="overviewSkidKind === 'balance-reminder'"
            v-model="balanceReminderForm"
          />
          <ManageOverviewRechargeSkidBody
            v-else
            :mode="rechargeSkidTarget"
            :gas-account-key="rechargeGasAccountKey"
          />
        </EgSkid>
      </template>
    </EgLayout>
  </div>
</template>
