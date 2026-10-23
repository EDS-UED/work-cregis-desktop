<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import {
  EgButton,
  EgConfirmPopover,
  EgDetail,
  EgDetailPopup,
  type TagStatus,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  formatGroupedAmountText,
  formatGroupedThresholdString,
} from '@/utils/formatGroupedDisplay';
import { splitDetailAmountHeadline } from '../shared/splitDetailAmountHeadline';
import {
  applyDetailAddressExpand,
  isDetailAddressExpandKey,
} from '../shared/detailAddressExpand';
import { findDetailItemByKey } from '../shared/findDetailItemByKey';
import { buildDetailApprovalProgressSteps } from '../shared/buildDetailApprovalProgressSteps';
import { resolveDetailProgressStepBuildOptions } from '../shared/resolveDetailProgressStepBuildOptions';
import DetailApprovalProgressAppend from '../shared/DetailApprovalProgressAppend.vue';
import { resolveDetailHeadlineStatus } from '../shared/resolveDetailHeadlineStatus';
import { usePopupShellLifecycle } from '../shared/usePopupShellLifecycle';
import { useDetailToolbarPageMotion } from '../shared/useDetailToolbarPageMotion';
import { buildSigningDetailSections } from './buildSigningDetailSections';
import {
  resolveDetailTaskAmlInterceptFromReceivers,
  resolveDetailTaskAmlPassInterceptKind,
} from '../shared/detailTaskAmlIntercept';
import SigningAddressRiskAlertPopup from './SigningAddressRiskAlertPopup.vue';
import {
  resolveDetailMinerFeePopoverContext,
  resolveMinerFeeProfileFromDetail,
} from '../shared/minerFeeProfile';
import type { MinerFeeSelection } from '../shared/minerFeeProfile';
import { isMultiSignSigningDetail } from './signingStore';
import type { SigningDetail } from './types';
import DetailHeadlineGroupPortal from '../shared/DetailHeadlineGroupPortal.vue';
import detailChromeStyles from '../shared/detailPopupChrome.module.css';
import DetailToolbarSlot from '../shared/DetailToolbarSlot.vue';
import DetailToolbarRemarkTrigger from '../shared/DetailToolbarRemarkTrigger.vue';
import ExpiryCountdown from '../shared/ExpiryCountdown.vue';
import ApprovalRemarkPopover from '../approval/ApprovalRemarkPopover.vue';
import remarkTriggerStyles from '../shared/remarkPopoverTrigger.module.css';
import { useDetailAmlSearchFlow } from '../shared/useDetailAmlSearchFlow';
import { applyDetailAmlSearchSectionOverlay } from '../shared/applyDetailAmlSearchSectionOverlay';
import DetailAmlSearchToastHost from '../shared/DetailAmlSearchToastHost.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    shellSuspended?: boolean;
    detail: SigningDetail | null;
    currentIndex: number;
    totalCount: number;
    prevDisabled: boolean;
    nextDisabled: boolean;
    readOnly?: boolean;
    listStatusLabel?: string;
    listStatusKind?: TagStatus;
    progressListStatusLabel?: string;
    onRemarkBeforeOpen?: () => void | Promise<void>;
  }>(),
  {
    shellSuspended: false,
    readOnly: false,
  },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'popup-closed': [];
  'shell-opened': [];
  'address-risk-alert-open-change': [open: boolean];
  prev: [];
  next: [];
  passConfirm: [selection: MinerFeeSelection | null];
  rejectConfirm: [];
  'view-more': [side: 'sender' | 'receiver'];
}>();

const { ui, locale } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  suspended: toRef(props, 'shellSuspended'),
  onShellOpened: () => emit('shell-opened'),
  onClosed: () => {
    emit('update:open', false);
    emit('popup-closed');
  },
});

const detailId = computed(() => props.detail?.id);
const { detailToolbarPageKey } = useDetailToolbarPageMotion({
  detailId,
  currentIndex: computed(() => props.currentIndex),
});

const headline = computed(() =>
  formatGroupedAmountText(props.detail?.amountHeadline ?? ''),
);
const headlineParts = computed(() => splitDetailAmountHeadline(headline.value));
const signingThresholdDisplay = computed(() =>
  formatGroupedThresholdString(props.detail?.signingThreshold ?? ''),
);
const isMultiSign = computed(() => isMultiSignSigningDetail(props.detail));
const showDetailToolbar = computed(() => !props.readOnly);
const amlIntercept = computed(() =>
  props.detail
    ? resolveDetailTaskAmlInterceptFromReceivers(props.detail.receivers, ui)
    : resolveDetailTaskAmlInterceptFromReceivers([], ui),
);

const addressRiskAlertOpen = ref(false);
const riskAcknowledgedDetailId = ref<string | null>(null);
let pendingPassAfterRiskAck: (() => void) | null = null;

const TASK_AML_DANGER_CONFIRM_WIDTH = 365;

const passInterceptKind = computed(() =>
  resolveDetailTaskAmlPassInterceptKind(
    amlIntercept.value,
    props.detail?.id === riskAcknowledgedDetailId.value,
  ),
);

function needsSignRiskAck(): boolean {
  return passInterceptKind.value === 'blacklist-dialog';
}

function runPassWithRiskGate(run: () => void) {
  if (!needsSignRiskAck()) {
    run();
    return;
  }
  pendingPassAfterRiskAck = run;
  addressRiskAlertOpen.value = true;
}

function onAddressRiskAlertContinue() {
  riskAcknowledgedDetailId.value = props.detail?.id ?? null;
  const run = pendingPassAfterRiskAck;
  pendingPassAfterRiskAck = null;
  run?.();
}

function onAddressRiskAlertReject() {
  pendingPassAfterRiskAck = null;
  void onRejectClick();
}

function onDangerConfirmPass(run: () => void) {
  riskAcknowledgedDetailId.value = props.detail?.id ?? null;
  run();
}

const detailHostRef = ref<HTMLElement | null>(null);
const expandedAddressKeys = ref(new Set<string>());

const {
  amlSearchActiveItemKey,
  amlSearchResultsByKey,
  amlToastText,
  amlToastKeepMounted,
  amlToastMotionActive,
  onItemValueAmlSearchClick,
} = useDetailAmlSearchFlow({
  detailId: computed(() => props.detail?.id),
  ui,
});

watch(addressRiskAlertOpen, (open) => {
  emit('address-risk-alert-open-change', open);
});

watch(
  () => props.detail?.id,
  () => {
    riskAcknowledgedDetailId.value = null;
    pendingPassAfterRiskAck = null;
    addressRiskAlertOpen.value = false;
    expandedAddressKeys.value = new Set();
  },
);

const sections = computed(() => {
  void locale.value;
  const base = props.detail
    ? buildSigningDetailSections(props.detail, ui, locale.value)
    : [];
  const expanded = applyDetailAddressExpand(base, expandedAddressKeys.value);
  return applyDetailAmlSearchSectionOverlay(expanded, {
    resultsByKey: amlSearchResultsByKey.value,
    translate: ui,
  });
});
const progressSteps = computed(() => {
  if (!props.detail) return [];

  const thresholdSubtitle = props.detail.signingThreshold
    ? `${ui('Signing threshold')}: ${signingThresholdDisplay.value}`
    : undefined;

  return buildDetailApprovalProgressSteps(
    props.detail,
    resolveDetailProgressStepBuildOptions({
      readOnly: props.readOnly,
      listStatusLabel: props.listStatusLabel,
      progressListStatusLabel: props.progressListStatusLabel,
      thresholdSubtitle,
    }),
  );
});

const headlineStatus = computed(() => {
  if (!progressSteps.value.length) return null;
  const listStatus =
    props.listStatusLabel && props.listStatusKind
      ? { label: props.listStatusLabel, status: props.listStatusKind }
      : undefined;
  return resolveDetailHeadlineStatus(progressSteps.value, ui, listStatus);
});
const showStatusTag = computed(() => headlineStatus.value != null);
const statusTag = computed(() => headlineStatus.value?.label ?? '');
const statusTagStatus = computed(() => headlineStatus.value?.status ?? 'ready');

function onItemValueLinkClick(key: string) {
  const item = findDetailItemByKey(sections.value, key);
  if (item?.addressLayout === 'multi-orders' && isDetailAddressExpandKey(key)) {
    emit('view-more', key);
    return;
  }
  if (isDetailAddressExpandKey(key)) {
    expandedAddressKeys.value = new Set([...expandedAddressKeys.value, key]);
  }
}
const minerFeeProfile = computed(() =>
  props.detail ? resolveMinerFeeProfileFromDetail(props.detail) : null,
);

const detailMinerFeePopover = computed(() =>
  props.detail ? resolveDetailMinerFeePopoverContext(props.detail) : null,
);

async function executeMultiSignPass() {
  try {
    await props.onRemarkBeforeOpen?.();
    emit('passConfirm', null);
  } catch {
    // prepareDetailRemarkOpen rejected (processed / disabled).
  }
}

function onMultiSignPassClick() {
  runPassWithRiskGate(() => {
    void executeMultiSignPass();
  });
}

async function onRejectClick() {
  try {
    await props.onRemarkBeforeOpen?.();
    emit('rejectConfirm');
  } catch {
    // prepareDetailRemarkOpen rejected (processed / disabled).
  }
}

async function executePassClick() {
  try {
    await props.onRemarkBeforeOpen?.();
    emit('passConfirm', null);
  } catch {
    // prepareDetailRemarkOpen rejected (processed / disabled).
  }
}

function onPassClick() {
  runPassWithRiskGate(() => {
    void executePassClick();
  });
}

function onMinerFeeSignTriggerClick(openMinerFeePanel: () => void) {
  runPassWithRiskGate(() => {
    openMinerFeePanel();
  });
}

async function onMultiSignRejectClick() {
  try {
    await props.onRemarkBeforeOpen?.();
    emit('rejectConfirm');
  } catch {
    // prepareDetailRemarkOpen rejected (processed / disabled).
  }
}

function onDetailClose() {
  popupOpen.value = false;
}
</script>

<template>
  <EgDetailPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    @close="onPopupClosed"
  >
    <div ref="detailHostRef" :class="detailChromeStyles.detailHost">
    <EgDetail
      v-if="detail"
      :toolbar-page-key="detailToolbarPageKey"
      :headline="headline"
      :show-eyebrow="false"
      :show-status-tag="showStatusTag"
      :status-tag="statusTag"
      status-tag-size="lg"
      :status-tag-status="statusTagStatus"
      :show-tabs="false"
      :sections="sections"
      :show-toolbar="showDetailToolbar"
      :show-toolbar-nav="false"
      toolbar-divider-pinned
      :value-copy-label="ui('Copy')"
      :value-address-book-label="ui('Add to address book')"
      :value-aml-search-label="ui('AML Search')"
      :value-browser-label="ui('Block explorer')"
      :aml-search-active-item-key="amlSearchActiveItemKey"
      toolbar-tone="decor"
      @close="onDetailClose"
      @item-value-link-click="onItemValueLinkClick"
      @item-value-aml-search-click="onItemValueAmlSearchClick"
    >
      <template v-if="showDetailToolbar" #toolbar>
        <DetailToolbarSlot :show-toolbar-nav="false" toolbar-divider-pinned>
          <template v-if="!readOnly" #leading>
            <DetailToolbarRemarkTrigger :page-key="detail?.id" />
          </template>
          <template v-if="!readOnly" #actions>
            <EgButton
              v-if="isMultiSign"
              tone="danger"
              variant="text"
              size="md"
              @click="onMultiSignRejectClick"
            >
              {{ ui('Reject') }}
            </EgButton>
            <EgButton
              v-else
              tone="danger"
              variant="text"
              size="md"
              @click="onRejectClick"
            >
              {{ ui('Reject') }}
            </EgButton>

            <EgConfirmPopover
              v-if="isMultiSign && passInterceptKind === 'danger-popover'"
              :title="ui('Task AML dangerous address confirm title')"
              :message="ui('Task AML dangerous address confirm message')"
              :confirm-label="ui('Task AML dangerous address confirm acknowledge')"
              :close-label="ui('Close')"
              placement="top"
              height-mode="adaptive"
              :width="TASK_AML_DANGER_CONFIRM_WIDTH"
              boundary-selector=".eds-popup"
              @confirm="onDangerConfirmPass(() => void executeMultiSignPass())"
            >
              <template #trigger="{ onClick, active }">
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
                    :aria-expanded="active"
                    @click.stop="onClick"
                  >
                    {{ ui('Sign') }}
                  </EgButton>
                </span>
              </template>
            </EgConfirmPopover>
            <EgButton
              v-else-if="isMultiSign"
              tone="decor"
              variant="solid"
              size="md"
              @click="onMultiSignPassClick"
            >
              {{ ui('Sign') }}
            </EgButton>

            <ApprovalRemarkPopover
              v-else-if="minerFeeProfile"
              skip-remark-step
              boundary-selector=".eds-popup"
              :title="ui('Miner Fee')"
              remark=""
              :miner-fee-profile="minerFeeProfile"
              :pending-transaction-count="detailMinerFeePopover?.pendingTransactionCount ?? 0"
              :prefer-full-batch-stub="detailMinerFeePopover?.preferFullBatchStub ?? false"
              :batch-stub-transaction-count="detailMinerFeePopover?.batchStubTransactionCount ?? 1"
              :on-before-open="onRemarkBeforeOpen"
              @confirm="emit('passConfirm', $event)"
            >
              <template #trigger="{ active, onClick: openMinerFeePanel }">
                <EgConfirmPopover
                  v-if="passInterceptKind === 'danger-popover'"
                  :title="ui('Task AML dangerous address confirm title')"
                  :message="ui('Task AML dangerous address confirm message')"
                  :confirm-label="ui('Task AML dangerous address confirm acknowledge')"
                  :close-label="ui('Close')"
                  placement="top"
                  height-mode="adaptive"
                  :width="TASK_AML_DANGER_CONFIRM_WIDTH"
                  boundary-selector=".eds-popup"
                  @confirm="onDangerConfirmPass(() => openMinerFeePanel())"
                >
                  <template #trigger="{ onClick: openDangerConfirm, active: dangerActive }">
                    <span
                      :class="[
                        remarkTriggerStyles.remarkTrigger,
                        (active || dangerActive) && remarkTriggerStyles.remarkTriggerPassPressed,
                      ]"
                    >
                      <EgButton
                        tone="decor"
                        variant="solid"
                        size="md"
                        :aria-expanded="active || dangerActive"
                        @click.stop="openDangerConfirm"
                      >
                        {{ ui('Sign') }}
                      </EgButton>
                    </span>
                  </template>
                </EgConfirmPopover>
                <span
                  v-else
                  :class="[
                    remarkTriggerStyles.remarkTrigger,
                    active && remarkTriggerStyles.remarkTriggerPassPressed,
                  ]"
                >
                  <EgButton
                    tone="decor"
                    variant="solid"
                    size="md"
                    :aria-expanded="active"
                    @click.stop="onMinerFeeSignTriggerClick(openMinerFeePanel)"
                  >
                    {{ ui('Sign') }}
                  </EgButton>
                </span>
              </template>
            </ApprovalRemarkPopover>

            <EgConfirmPopover
              v-else-if="passInterceptKind === 'danger-popover'"
              :title="ui('Task AML dangerous address confirm title')"
              :message="ui('Task AML dangerous address confirm message')"
              :confirm-label="ui('Task AML dangerous address confirm acknowledge')"
              :close-label="ui('Close')"
              placement="top"
              height-mode="adaptive"
              :width="TASK_AML_DANGER_CONFIRM_WIDTH"
              boundary-selector=".eds-popup"
              @confirm="onDangerConfirmPass(() => void executePassClick())"
            >
              <template #trigger="{ onClick, active }">
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
                    :aria-expanded="active"
                    @click.stop="onClick"
                  >
                    {{ ui('Sign') }}
                  </EgButton>
                </span>
              </template>
            </EgConfirmPopover>
            <EgButton
              v-else
              tone="decor"
              variant="solid"
              size="md"
              @click="onPassClick"
            >
              {{ ui('Sign') }}
            </EgButton>
          </template>
        </DetailToolbarSlot>
      </template>

      <template v-if="detail?.expiryCountdownMinutes" #item-value-expiry>
        <ExpiryCountdown
          :minutes="detail.expiryCountdownMinutes"
          :seconds="detail.expiryCountdownSeconds ?? '00'"
        />
      </template>

      <template #headline-text>
        {{ headlineParts.primary }}<span
          v-if="headlineParts.fiat"
          :class="detailChromeStyles.headlineFiat"
        >{{ headlineParts.fiat }}</span>
      </template>

      <template #append>
        <DetailApprovalProgressAppend :steps="progressSteps" />
      </template>
    </EgDetail>
    <DetailHeadlineGroupPortal
      v-if="detail"
      :host-ref="detailHostRef"
      :business-type-key="detail.businessType"
      :page-key="detail.id"
      :show-quota-streamer="!readOnly"
    />
    <DetailAmlSearchToastHost
      :keep-mounted="amlToastKeepMounted"
      :motion-active="amlToastMotionActive"
      :text="amlToastText"
    />
    <SigningAddressRiskAlertPopup
      v-model:open="addressRiskAlertOpen"
      :title-key="amlIntercept.alertTitleKey"
      :message-key="amlIntercept.alertMessageKey"
      @continue="onAddressRiskAlertContinue"
      @reject="onAddressRiskAlertReject"
    />
    </div>
  </EgDetailPopup>
</template>
