<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgDetail, EgDetailPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import {
  buildFeeRecordDetailSections,
  FEE_RECORD_BULK_TRANSFER_ORDER_ITEM_KEY,
  formatFeeRecordSignedFiatAmount,
} from './buildFeeRecordDetailSections';
import { resolveFeeRecordDetailHeadlineStatus } from './feeRecordStatusLabels';
import type { FeeRecordRow } from './feeRecordTypes';

const props = defineProps<{
  open: boolean;
  row: FeeRecordRow | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const { ui, locale } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
  },
});

const sections = computed(() => {
  void locale.value;
  if (!props.row) return [];
  return buildFeeRecordDetailSections(props.row, ui);
});

const detailEyebrow = computed(() => {
  if (!props.row) return '';
  return ui(props.row.operationTypeKey);
});

const headline = computed(() => {
  if (!props.row) return '';
  return formatFeeRecordSignedFiatAmount(props.row);
});

const headlineStatus = computed(() => {
  if (!props.row) return null;
  return resolveFeeRecordDetailHeadlineStatus(props.row, ui);
});

const detailToolbarPageKey = computed(() => props.row?.id ?? 'fee-record-detail');

function onDetailClose() {
  popupOpen.value = false;
}

function onItemValueLinkClick(key: string) {
  if (key !== FEE_RECORD_BULK_TRANSFER_ORDER_ITEM_KEY) return;
}
</script>

<template>
  <EgDetailPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    @close="onPopupClosed"
  >
    <div :class="detailChromeStyles.detailHost">
      <EgDetail
        v-if="row"
        :toolbar-page-key="detailToolbarPageKey"
        :eyebrow="detailEyebrow"
        :headline="headline"
        :show-eyebrow="true"
        :show-status-tag="Boolean(headlineStatus)"
        :status-tag="headlineStatus?.label ?? ''"
        status-tag-size="lg"
        :status-tag-status="headlineStatus?.status ?? 'success'"
        :show-tabs="false"
        :sections="sections"
        :show-toolbar="false"
        :value-copy-label="ui('Copy')"
        @close="onDetailClose"
        @item-value-link-click="onItemValueLinkClick"
      />
    </div>
  </EgDetailPopup>
</template>
