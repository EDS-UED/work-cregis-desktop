<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
  toRef,
  watch,
} from 'vue';
import {
  EgAnchoredPopover,
  EgGasFeePopover,
  EgMinerFeeBatchStubPanel,
  EgPopup,
  EgStreamer,
  EgButton,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatGroupedNumber } from '@/utils/formatGroupedDisplay';
import { usePopupShellLifecycle } from '../../shared/usePopupShellLifecycle';
import DetailToolbarRemarkTrigger from '../../shared/DetailToolbarRemarkTrigger.vue';
import remarkTriggerStyles from '../../shared/remarkPopoverTrigger.module.css';
import {
  type MinerFeeProfile,
  type MinerFeeSelection,
  isMinerFeeBatchStubProfile,
  resolveMinerFeeBatchTransactionCount,
  resolveMinerFeePopoverTitleKey,
} from '../../shared/minerFeeProfile';
import { resolveGasFeeNetworkFromProfile } from '../../shared/resolveGasFeeNetwork';
import { formatBreakdownLine, buildBatchSummary } from './buildBatchSummary';
import { splitDetailAmountHeadline } from '../../shared/splitDetailAmountHeadline';
import { buildWithdrawalQuotaNoticeText } from '../buildWithdrawalQuotaNoticeText';
import detailChromeStyles from '../../shared/detailPopupChrome.module.css';
import { DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS } from '../../tasksDataListPageData';
import { sortIneligibleByReasonOrder } from './evaluateBatchEligibility';
import type { BatchIneligibleReasonFilter } from './batchIneligibleReasonFilter';
import type { BatchEligibilityResult, BatchSummaryBreakdown, SigningBatchRowModel } from './types';
import {
  BATCH_SIGN_CONFIRM_POPUP_HEIGHT,
  BATCH_SIGN_CONFIRM_POPUP_WIDTH,
} from './batchSigning.constants';
import SigningBatchDataListPaginerBar from './SigningBatchDataListPaginerBar.vue';
import SigningBatchPopupMotionPageChrome from './SigningBatchPopupMotionPageChrome.vue';
import SigningBatchPopupSlotChrome from './SigningBatchPopupSlotChrome.vue';
import SigningBatchPopupSlotFooterBody from './SigningBatchPopupSlotFooterBody.vue';
import SigningBatchSignDetailPanel from './SigningBatchSignDetailPanel.vue';
import SigningBatchSignReasonsPanel from './SigningBatchSignReasonsPanel.vue';
import SigningBatchIneligibleReasonFilterDecor from './SigningBatchIneligibleReasonFilterDecor.vue';
import SigningBatchSignSubPageShell from './SigningBatchSignSubPageShell.vue';
import { useBatchSignConfirmEscape } from './useBatchSignConfirmEscape';
import styles from './batchSigning.shared.module.css';

type ConfirmPage = 'summary' | 'detail' | 'reasons';

const props = defineProps<{
  open: boolean;
  shellSuspended?: boolean;
  eligibility: BatchEligibilityResult;
  summary: BatchSummaryBreakdown;
  remark: string;
  minerFeeProfile: MinerFeeProfile | null;
  pendingTransactionCount?: number;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:remark': [value: string];
  confirm: [selection: MinerFeeSelection | null];
  cancel: [];
}>();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  suspended: toRef(props, 'shellSuspended'),
  onClosed: () => {
    emit('update:open', false);
    emit('cancel');
  },
});

const { ui } = useAppI18n();

const slotChromeRef = ref<InstanceType<typeof SigningBatchPopupSlotChrome> | null>(null);
const motionPageChromeRef = ref<InstanceType<typeof SigningBatchPopupMotionPageChrome> | null>(null);
const gasFeePopoverRef = ref<{ close?: () => void } | null>(null);
const batchStubAnchoredRef = ref<{ close?: () => void } | null>(null);

const activePage = ref<ConfirmPage>('summary');
const pageStackDirection = ref<'forward' | 'backward' | 'none'>('none');
const motionTransitionPending = ref(0);
/** 固定高度 Popup：stack 始终 fill，子页 DataList 与整页 motion 共用 bounded 高度。 */
const popupContentFill = computed(() => true);
const detailDisplayRows = ref<SigningBatchRowModel[]>([]);
const reasonsDisplayRows = ref<SigningBatchRowModel[]>([]);
const reasonsFilter = ref<BatchIneligibleReasonFilter>('all');
const isSummaryPage = computed(() => activePage.value === 'summary');
const isDetailPage = computed(() => activePage.value === 'detail');
const isReasonsPage = computed(() => activePage.value === 'reasons');

const ineligiblePaginatorItems = computed(() => {
  const sorted = sortIneligibleByReasonOrder(props.eligibility.ineligible);
  if (reasonsFilter.value === 'all') {
    return sorted.map((item) => item.row);
  }
  return sorted
    .filter((item) => item.reason === reasonsFilter.value)
    .map((item) => item.row);
});

function defaultPaginatorPageSize(): number {
  const parsed = Number.parseInt(DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS[0] ?? '20', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
}

watch(reasonsFilter, () => {
  reasonsDisplayRows.value = ineligiblePaginatorItems.value.slice(0, defaultPaginatorPageSize());
});

const hasSignable = computed(() => props.eligibility.signable.length > 0);

const showToolbarConfirm = computed(() => true);
const quotaNoticeText = computed(() => buildWithdrawalQuotaNoticeText(ui));
const breakdownSummary = computed(() => {
  if (hasSignable.value) {
    return props.summary;
  }
  return buildBatchSummary(props.eligibility.ineligible.map((item) => item.row));
});
const summaryHeadlineParts = computed(() => {
  if (!hasSignable.value) {
    return { primary: '0', fiat: null as string | null };
  }
  return splitDetailAmountHeadline(
    `${props.summary.totalCrypto} ≈ ${props.summary.totalFiat}`,
  );
});
const businessTypeLine = computed(() =>
  formatBreakdownLine(
    breakdownSummary.value.businessTypes.map((item) => ({ ...item, label: ui(item.label) })),
  ),
);
const payoutWalletLine = computed(() => formatBreakdownLine(breakdownSummary.value.wallets));
const minerFeeSectionTitle = computed(() => {
  if (!props.minerFeeProfile) {
    return ui('Miner Fee');
  }
  return ui(resolveMinerFeePopoverTitleKey(props.minerFeeProfile));
});

const minerFeeTransactionCount = computed(() =>
  resolveMinerFeeBatchTransactionCount(
    props.eligibility.signable.length,
    props.pendingTransactionCount ?? 0,
  ),
);

const showBatchStubOnly = computed(() => {
  if (!props.minerFeeProfile) {
    return false;
  }
  return isMinerFeeBatchStubProfile(props.minerFeeProfile, minerFeeTransactionCount.value);
});

const gasFeeNetwork = computed(() => {
  if (!props.minerFeeProfile || showBatchStubOnly.value) {
    return null;
  }
  return resolveGasFeeNetworkFromProfile(props.minerFeeProfile);
});
const subPageTitle = computed(() => {
  if (isDetailPage.value) {
    return ui('Signable transaction details');
  }
  if (isReasonsPage.value) {
    return ui('Ineligible transaction reasons');
  }
  return '';
});

const showSystemBarClose = computed(() => isSummaryPage.value);

const toolbarConfirmDisabled = computed(() => !hasSignable.value);

function resolvePageStackDirection(
  from: ConfirmPage,
  to: ConfirmPage,
): 'forward' | 'backward' | 'none' {
  if (from === 'summary' && to !== 'summary') {
    return 'forward';
  }
  if (from !== 'summary' && to === 'summary') {
    return 'backward';
  }
  return 'none';
}

function setActivePage(next: ConfirmPage) {
  if (next === activePage.value) {
    return;
  }
  pageStackDirection.value = resolvePageStackDirection(activePage.value, next);
  activePage.value = next;
}

function resetToSummary() {
  activePage.value = 'summary';
  pageStackDirection.value = 'none';
  motionTransitionPending.value = 0;
  reasonsFilter.value = 'all';
}

function onMotionPageBeforeEnter() {
  motionTransitionPending.value += 1;
}

function onMotionPageBeforeLeave() {
  motionTransitionPending.value += 1;
}

function settleMotionPageTransition() {
  motionTransitionPending.value = Math.max(0, motionTransitionPending.value - 1);
  if (motionTransitionPending.value === 0) {
    pageStackDirection.value = 'none';
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      resetToSummary();
    }
  },
);

watch(
  () => activePage.value,
  async () => {
    await nextTick();
    motionPageChromeRef.value?.scrollToTop?.();
  },
);

function onClose() {
  popupOpen.value = false;
}

function goToDetail() {
  setActivePage('detail');
}

function goToReasons() {
  setActivePage('reasons');
}

function goBack() {
  setActivePage('summary');
}

function onSubPageBack() {
  goBack();
}

function onMinerFeeToolbarClick(anchorClick: () => void) {
  if (toolbarConfirmDisabled.value) {
    return;
  }
  anchorClick();
}

function onGasFeeConfirm(payload: { displayValue: string }) {
  if (!props.minerFeeProfile) {
    return;
  }
  gasFeePopoverRef.value?.close?.();
  batchStubAnchoredRef.value?.close?.();
  emit('confirm', {
    profileKind: props.minerFeeProfile.kind,
    displayValue: payload.displayValue,
  });
}

function onToolbarConfirm() {
  emit('confirm', null);
}

useBatchSignConfirmEscape({
  open: toRef(props, 'open'),
  activePage: () => activePage.value,
  onBack: goBack,
  onClose,
});
</script>

<template>
  <EgPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    uses="custom"
    :box-width="BATCH_SIGN_CONFIRM_POPUP_WIDTH"
    :box-height="BATCH_SIGN_CONFIRM_POPUP_HEIGHT"
    @close="onPopupClosed"
  >
    <SigningBatchPopupSlotChrome
      ref="slotChromeRef"
      integrated-page-stack
      :show-system-bar-close="showSystemBarClose"
      :content-fill="popupContentFill"
      content-inset-preset="xs"
      :show-toolbar="false"
      @close="onClose"
    >
      <div
        :class="[
          styles.batchPopupContent,
          popupContentFill && styles.batchPopupContentFill,
        ]"
      >
        <div
          class="motion-page-stack"
          :class="[
            styles.batchPopupPageStack,
            styles.batchPopupPageStackFill,
          ]"
          :data-page-direction="pageStackDirection"
          :data-batch-popup-page="activePage"
        >
          <Transition
            name="motion-page"
            @before-enter="onMotionPageBeforeEnter"
            @before-leave="onMotionPageBeforeLeave"
            @after-enter="settleMotionPageTransition"
            @after-leave="settleMotionPageTransition"
          >
            <div
              :key="activePage"
              class="motion-page"
              :class="styles.batchPopupPageFill"
            >
              <SigningBatchPopupMotionPageChrome
                ref="motionPageChromeRef"
                :body-scroll="isSummaryPage"
                :footer-scrim="isSummaryPage"
              >
                <div v-if="isSummaryPage" :class="styles.batchSummaryStack">
                <section :class="styles.detailHeadline">
                  <div :class="styles.detailHeadlineInner">
                    <div :class="styles.detailHeadlineTop">
                      <div :class="styles.detailHeadlineTitleGroup">
                        <span :class="styles.detailHeadlineEyebrow">{{ ui('Total Signing Amount') }}</span>
                        <h2 :class="styles.detailHeadlineText">
                          {{ summaryHeadlineParts.primary }}
                          <span
                            v-if="summaryHeadlineParts.fiat"
                            :class="detailChromeStyles.headlineFiat"
                          >{{ summaryHeadlineParts.fiat }}</span>
                        </h2>
                      </div>
                      <EgStreamer
                        :class="styles.detailHeadlineStreamer"
                        visual="moderate"
                        :text="quotaNoticeText"
                        show-button
                        :button-label="ui('Increase quota')"
                        button-tone="decor"
                        button-size="sm"
                      />
                    </div>

                    <div :class="styles.detailHeadlineMenu">
                      <div :class="styles.detailHeadlineBid" aria-hidden="true">
                        <span :class="styles.detailHeadlineBidBar" />
                      </div>
                      <div :class="styles.detailHeadlineMenuBody">
                        <div :class="styles.detailHeadlineDataBox">
                          <div :class="styles.detailHeadlineList">
                            <div :class="styles.detailHeadlineRow">
                              <span :class="styles.detailHeadlineRowLabel">
                                {{ ui('Operation Type') }}:
                              </span>
                              <span :class="styles.detailHeadlineRowValue">{{ businessTypeLine }}</span>
                            </div>
                            <div :class="styles.detailHeadlineRow">
                              <span :class="styles.detailHeadlineRowLabel">
                                {{ ui('Outbound wallets') }}:
                              </span>
                              <span :class="styles.detailHeadlineRowValue">{{ payoutWalletLine }}</span>
                            </div>
                            <div :class="styles.detailHeadlineRow">
                              <span :class="styles.detailHeadlineRowLabel">
                                {{ ui('Signable Transactions') }}:
                              </span>
                              <span :class="styles.detailHeadlineRowValue">
                                {{ formatGroupedNumber(eligibility.signable.length) }}{{ ui('Signing transaction count unit') }}
                              </span>
                              <button
                                v-if="hasSignable"
                                type="button"
                                :class="styles.detailHeadlineRowLink"
                                @click="goToDetail"
                              >
                                {{ ui('View details') }}
                              </button>
                            </div>
                            <div
                              v-if="eligibility.ineligible.length > 0"
                              :class="styles.detailHeadlineRow"
                            >
                              <span :class="styles.detailHeadlineRowLabel">
                                {{ ui('Non-signable Transactions') }}:
                              </span>
                              <span
                                :class="[
                                  styles.detailHeadlineRowValue,
                                  styles.detailHeadlineRowValueDanger,
                                ]"
                              >
                                {{ formatGroupedNumber(eligibility.ineligible.length) }}{{ ui('Signing transaction count unit') }}
                              </span>
                              <button
                                type="button"
                                :class="styles.detailHeadlineRowLink"
                                @click="goToReasons"
                              >
                                {{ ui('View Reason') }}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <SigningBatchSignSubPageShell
                v-else-if="isDetailPage"
                enable-amount-sort
                :class="styles.batchPopupPageFill"
                :title="subPageTitle"
                @back="onSubPageBack"
              >
                <SigningBatchSignDetailPanel :rows="detailDisplayRows" />
              </SigningBatchSignSubPageShell>

              <SigningBatchSignSubPageShell
                v-else-if="isReasonsPage"
                enable-amount-sort
                :class="styles.batchPopupPageFill"
                :title="subPageTitle"
                @back="onSubPageBack"
              >
                <template #topActions>
                  <SigningBatchIneligibleReasonFilterDecor />
                </template>
                <SigningBatchSignReasonsPanel
                  :key="`reasons-panel-${reasonsFilter}`"
                  v-model:filter="reasonsFilter"
                  :eligibility="eligibility"
                  :rows="reasonsDisplayRows"
                />
              </SigningBatchSignSubPageShell>

                <template #footer>
                  <SigningBatchPopupSlotFooterBody
                    v-if="isSummaryPage"
                    show-toolbar-divider
                    :show-paginer-row="false"
                    show-toolbar-row
                    :show-toolbar-cancel="false"
                    :show-toolbar-confirm="showToolbarConfirm"
                    :toolbar-confirm-disabled="toolbarConfirmDisabled"
                    :toolbar-confirm-label="ui('Confirm')"
                    toolbar-cancel-label=""
                    toolbar-cancel-tone="decor"
                    toolbar-cancel-variant="text"
                    toolbar-confirm-tone="decor"
                    @toolbar-confirm="onToolbarConfirm"
                  >
                    <template v-if="hasSignable" #toolbar-leading>
                      <DetailToolbarRemarkTrigger
                        :model-value="remark"
                        @update:model-value="emit('update:remark', $event)"
                      />
                    </template>
                    <template v-if="minerFeeProfile && gasFeeNetwork" #toolbar-confirm>
                      <EgGasFeePopover
                        ref="gasFeePopoverRef"
                        :network="gasFeeNetwork"
                        :translate="ui"
                        :symbol="minerFeeProfile.symbol"
                        :title="minerFeeSectionTitle"
                        :transaction-count="minerFeeTransactionCount"
                        boundary-selector=".eds-popup"
                        @confirm="onGasFeeConfirm"
                      >
                        <template #trigger="{ active, onClick }">
                          <span
                            :class="[
                              remarkTriggerStyles.remarkTrigger,
                              active && remarkTriggerStyles.remarkTriggerPassPressed,
                            ]"
                          >
                            <EgButton
                              tone="decor"
                              variant="solid"
                              size="md"
                              :disabled="toolbarConfirmDisabled"
                              :aria-expanded="active"
                              @click.stop="onMinerFeeToolbarClick(onClick)"
                            >
                              {{ ui('Confirm') }}
                            </EgButton>
                          </span>
                        </template>
                      </EgGasFeePopover>
                    </template>
                    <template v-else-if="minerFeeProfile && showBatchStubOnly" #toolbar-confirm>
                      <EgAnchoredPopover
                        ref="batchStubAnchoredRef"
                        boundary-selector=".eds-popup"
                        :top-tool-title="minerFeeSectionTitle"
                        top-tool
                        top-tool-closable
                        width-mode="fixed"
                        height-mode="adaptive"
                      >
                        <template #trigger="{ active, onClick }">
                          <span
                            :class="[
                              remarkTriggerStyles.remarkTrigger,
                              active && remarkTriggerStyles.remarkTriggerPassPressed,
                            ]"
                          >
                            <EgButton
                              tone="decor"
                              variant="solid"
                              size="md"
                              :disabled="toolbarConfirmDisabled"
                              :aria-expanded="active"
                              @click.stop="onMinerFeeToolbarClick(onClick)"
                            >
                              {{ ui('Confirm') }}
                            </EgButton>
                          </span>
                        </template>
                        <EgMinerFeeBatchStubPanel
                          v-if="minerFeeProfile"
                          :translate="ui"
                          :symbol="minerFeeProfile.symbol"
                          :profile-kind="minerFeeProfile.kind"
                          :transaction-count="minerFeeTransactionCount"
                          @confirm="onGasFeeConfirm"
                        />
                      </EgAnchoredPopover>
                    </template>
                  </SigningBatchPopupSlotFooterBody>

                  <SigningBatchPopupSlotFooterBody
                    v-else-if="isDetailPage"
                    :show-toolbar-divider="false"
                    show-paginer-row
                    :show-toolbar-row="false"
                    :show-toolbar-cancel="false"
                    :show-toolbar-confirm="false"
                    :toolbar-confirm-disabled="false"
                    toolbar-confirm-label=""
                    toolbar-cancel-label=""
                    toolbar-cancel-tone="decor"
                    toolbar-cancel-variant="text"
                    toolbar-confirm-tone="decor"
                  >
                    <template #footer>
                      <SigningBatchDataListPaginerBar
                        :items="eligibility.signable"
                        @paginated-change="detailDisplayRows = $event"
                      />
                    </template>
                  </SigningBatchPopupSlotFooterBody>

                  <SigningBatchPopupSlotFooterBody
                    v-else-if="isReasonsPage"
                    :show-toolbar-divider="false"
                    show-paginer-row
                    :show-toolbar-row="false"
                    :show-toolbar-cancel="false"
                    :show-toolbar-confirm="false"
                    :toolbar-confirm-disabled="false"
                    toolbar-confirm-label=""
                    toolbar-cancel-label=""
                    toolbar-cancel-tone="decor"
                    toolbar-cancel-variant="text"
                    toolbar-confirm-tone="decor"
                  >
                    <template #footer>
                      <SigningBatchDataListPaginerBar
                        :key="`reasons-${reasonsFilter}`"
                        :items="ineligiblePaginatorItems"
                        @paginated-change="reasonsDisplayRows = $event"
                      />
                    </template>
                  </SigningBatchPopupSlotFooterBody>
                </template>
              </SigningBatchPopupMotionPageChrome>
            </div>
          </Transition>
        </div>
      </div>
    </SigningBatchPopupSlotChrome>
  </EgPopup>
</template>
