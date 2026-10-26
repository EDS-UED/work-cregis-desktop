<script setup lang="ts">
import { computed } from 'vue';
import TaskAddressDetailsPopup from './TaskAddressDetailsPopup.vue';
import ApprovalDetailPopup from '../approval/ApprovalDetailPopup.vue';
import SigningDetailPopup from '../signing/SigningDetailPopup.vue';
import type { RecordDetailFlowInstance } from './recordDetailFlowContext';
import { recordDetailMenuItemRegistry } from './recordDetailFlowContext';

const props = defineProps<{
  flow: RecordDetailFlowInstance;
}>();

const detailOpen = computed({
  get: () => props.flow.detailOpen.value,
  set: (value: boolean) => {
    props.flow.detailOpen.value = value;
  },
});

const viewMoreOpen = computed({
  get: () => props.flow.viewMoreOpen.value,
  set: (value: boolean) => {
    props.flow.viewMoreOpen.value = value;
  },
});

const approvalPopupMounted = computed(
  () =>
    props.flow.detailKind.value === 'approval'
    && (props.flow.detailOpen.value || props.flow.approvalDetail.value != null),
);

const signingPopupMounted = computed(
  () =>
    props.flow.detailKind.value === 'signing'
    && (props.flow.detailOpen.value || props.flow.signingDetail.value != null),
);

const approvalDetail = computed(() => props.flow.approvalDetail.value);
const signingDetail = computed(() => props.flow.signingDetail.value);
const currentIndex = computed(() => props.flow.currentIndex.value);
const totalCount = computed(() => props.flow.totalCount.value);
const prevDisabled = computed(() => props.flow.prevDisabled.value);
const nextDisabled = computed(() => props.flow.nextDisabled.value);
const listStatusLabel = computed(() => props.flow.statusTagLabel.value);
const listStatusKind = computed(() => props.flow.statusTagStatus.value);
const progressListStatusLabel = computed(() => props.flow.progressListStatusLabel.value);
const progressListStatusKind = computed(() => props.flow.progressListStatusKind.value);
const showWithdrawAction = computed(() => props.flow.showWithdrawAction.value);
const recordMenuItem = computed(
  () =>
    props.flow.detailMenuItem.value
    ?? props.flow.menuItem.value
    ?? recordDetailMenuItemRegistry.value,
);
const viewMoreSide = computed(() => props.flow.viewMoreSide.value);
const addressDetailsDetail = computed(
  () => props.flow.signingDetail.value ?? props.flow.approvalDetail.value,
);
</script>

<template>
  <ApprovalDetailPopup
    v-if="approvalPopupMounted"
    v-model:open="detailOpen"
    :read-only="true"
    :detail="approvalDetail"
    :current-index="currentIndex"
    :total-count="totalCount"
    :prev-disabled="prevDisabled"
    :next-disabled="nextDisabled"
    :list-status-label="listStatusLabel"
    :list-status-kind="listStatusKind"
    :progress-list-status-label="progressListStatusLabel"
    :progress-list-status-kind="progressListStatusKind"
    :record-menu-item="recordMenuItem"
    :show-withdraw-action="showWithdrawAction"
    @popup-closed="flow.onDetailPopupClosed()"
    @prev="flow.navigateRelative(-1)"
    @next="flow.navigateRelative(1)"
    @view-more="flow.openViewMore"
    @withdraw-request="flow.onWithdrawRequest()"
  />

  <SigningDetailPopup
    v-if="signingPopupMounted"
    v-model:open="detailOpen"
    :read-only="true"
    :detail="signingDetail"
    :current-index="currentIndex"
    :total-count="totalCount"
    :prev-disabled="prevDisabled"
    :next-disabled="nextDisabled"
    :list-status-label="listStatusLabel"
    :list-status-kind="listStatusKind"
    :progress-list-status-label="progressListStatusLabel"
    :progress-list-status-kind="progressListStatusKind"
    @popup-closed="flow.onDetailPopupClosed()"
    @prev="flow.navigateRelative(-1)"
    @next="flow.navigateRelative(1)"
    @view-more="flow.openViewMore"
  />

  <TaskAddressDetailsPopup
    v-model:open="viewMoreOpen"
    :shell-suspended="detailOpen"
    :side="viewMoreSide"
    :detail="addressDetailsDetail"
  />
</template>
