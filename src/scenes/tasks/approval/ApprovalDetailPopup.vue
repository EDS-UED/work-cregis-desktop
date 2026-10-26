<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import { EgButton, EgConfirmPopover, EgDetail, EgDetailPopup, type TagStatus } from '@eds/desktop-components';
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
import { buildApprovalDetailSections } from './buildApprovalDetailSections';
import { isTaskAmlRiskDemoRowIndex } from '../list-field/tasksListFieldStatusRowData';
import { parseRowIndexFromApprovalId } from './approvalStore';
import type { ApprovalDetail } from './types';
import DetailHeadlineGroupPortal from '../shared/DetailHeadlineGroupPortal.vue';
import detailChromeStyles from '../shared/detailPopupChrome.module.css';
import DetailToolbarSlot from '../shared/DetailToolbarSlot.vue';
import DetailToolbarRemarkTrigger from '../shared/DetailToolbarRemarkTrigger.vue';
import ExpiryCountdown from '../shared/ExpiryCountdown.vue';
import { useDetailAmlSearchFlow } from '../shared/useDetailAmlSearchFlow';
import { applyDetailAmlSearchSectionOverlay } from '../shared/applyDetailAmlSearchSectionOverlay';
import DetailAmlSearchToastHost from '../shared/DetailAmlSearchToastHost.vue';
import remarkTriggerStyles from '../shared/remarkPopoverTrigger.module.css';
import { sentRequestDetailShowsWithdrawToolbar } from '../tasksDataListPageData';
import {
  resolveDetailTaskAmlInterceptFromReceivers,
  resolveDetailTaskAmlPassInterceptKind,
} from '../shared/detailTaskAmlIntercept';
import SigningAddressRiskAlertPopup from '../signing/SigningAddressRiskAlertPopup.vue';

const props = withDefaults(
  defineProps<{
  open: boolean;
  shellSuspended?: boolean;
  detail: ApprovalDetail | null;
  currentIndex: number;
  totalCount: number;
  prevDisabled: boolean;
  nextDisabled: boolean;
  readOnly?: boolean;
  listStatusLabel?: string;
  listStatusKind?: TagStatus;
  /** 已审批详情进度演示；缺省与 listStatusLabel 相同。 */
  progressListStatusLabel?: string;
  progressListStatusKind?: TagStatus;
  recordMenuItem?: string;
  showWithdrawAction?: boolean;
  onRemarkBeforeOpen?: () => void | Promise<void>;
  }>(),
  {
    shellSuspended: false,
    readOnly: false,
    showWithdrawAction: false,
  },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'popup-closed': [];
  'shell-opened': [];
  'address-risk-alert-open-change': [open: boolean];
  prev: [];
  next: [];
  passConfirm: [];
  rejectConfirm: [];
  withdrawRequest: [];
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

const TASK_AML_DANGER_CONFIRM_WIDTH = 365;

const amlIntercept = computed(() =>
  props.detail
    ? resolveDetailTaskAmlInterceptFromReceivers(props.detail.receivers, ui)
    : resolveDetailTaskAmlInterceptFromReceivers([], ui),
);

const addressRiskAlertOpen = ref(false);
const riskAcknowledgedDetailId = ref<string | null>(null);
let pendingPassAfterRiskAck: (() => void) | null = null;

const passInterceptKind = computed(() =>
  resolveDetailTaskAmlPassInterceptKind(
    amlIntercept.value,
    props.detail?.id === riskAcknowledgedDetailId.value,
  ),
);

function runPassWithRiskGate(run: () => void) {
  if (passInterceptKind.value !== 'blacklist-dialog') {
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
    ? buildApprovalDetailSections(props.detail, ui, locale.value)
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
      amlRiskDemoRow: isTaskAmlRiskDemoRowIndex(parseRowIndexFromApprovalId(props.detail.id)),
    }),
  );
});

const headlineStatus = computed(() => {
  if (!progressSteps.value.length) return null;
  const listStatus =
    props.listStatusLabel && props.listStatusKind
      ? { label: props.listStatusLabel, status: props.listStatusKind }
      : undefined;
  const progressListStatus =
    props.progressListStatusLabel && props.progressListStatusKind
      ? { label: props.progressListStatusLabel, status: props.progressListStatusKind }
      : undefined;
  return resolveDetailHeadlineStatus(progressSteps.value, ui, listStatus, {
    readOnly: props.readOnly,
    progressListStatus,
  });
});
const showStatusTag = computed(() => headlineStatus.value != null);
const statusTag = computed(() => headlineStatus.value?.label ?? '');
const statusTagStatus = computed(() => headlineStatus.value?.status ?? 'ready');

const resolvedShowWithdrawAction = computed(() => {
  if (!props.readOnly) return props.showWithdrawAction;
  if (props.showWithdrawAction) return true;

  const rowIndex = props.detail?.id
    ? parseRowIndexFromApprovalId(props.detail.id)
    : undefined;

  return sentRequestDetailShowsWithdrawToolbar({
    menuItem: props.recordMenuItem,
    listStatusLabel: props.listStatusLabel,
    rowIndex,
    locale: locale.value,
  });
});

const showDetailToolbar = computed(
  () => !props.readOnly || resolvedShowWithdrawAction.value,
);

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
    emit('passConfirm');
  } catch {
    // prepareDetailRemarkOpen rejected (processed / disabled).
  }
}

function onPassClick() {
  runPassWithRiskGate(() => {
    void executePassClick();
  });
}

function onWithdrawConfirm() {
  emit('withdrawRequest');
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
          <template v-if="resolvedShowWithdrawAction || !readOnly" #leading>
            <DetailToolbarRemarkTrigger :page-key="detail?.id" />
          </template>
          <template #actions>
            <EgConfirmPopover
              v-if="resolvedShowWithdrawAction"
              :title="ui('Warm reminder')"
              :message="ui('Are you sure you want to withdraw this application?')"
              :confirm-label="ui('Confirm')"
              :close-label="ui('Close')"
              placement="top"
              @confirm="onWithdrawConfirm"
            >
              <template #trigger="{ onClick, active }">
                <span
                  :class="[
                    remarkTriggerStyles.remarkTrigger,
                    active && remarkTriggerStyles.remarkTriggerWithdrawPressed,
                  ]"
                >
                  <EgButton
                    tone="danger"
                    variant="solid"
                    size="md"
                    :aria-expanded="active"
                    @click.stop="onClick"
                  >
                    {{ ui('Withdraw Application') }}
                  </EgButton>
                </span>
              </template>
            </EgConfirmPopover>
            <template v-else-if="!readOnly">
              <EgButton
                tone="danger"
                variant="text"
                size="md"
                @click="onRejectClick"
              >
                {{ ui('Reject') }}
              </EgButton>

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
                      {{ ui('Pass') }}
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
                {{ ui('Pass') }}
              </EgButton>
            </template>
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
