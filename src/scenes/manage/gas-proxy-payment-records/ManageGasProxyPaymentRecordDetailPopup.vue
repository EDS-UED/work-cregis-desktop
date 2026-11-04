<script setup lang="ts">
import { computed, toRef } from 'vue';
import { EgDetail, EgDetailPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import {
  buildGasProxyPaymentRecordDetailSections,
  formatGasProxyPaymentRecordDetailHeadline,
  resolveGasProxyPaymentRecordDetailEyebrow,
} from './buildGasProxyPaymentRecordDetailSections';
import type { GasProxyPaymentRecordRow } from './gasProxyPaymentRecordTypes';

const props = defineProps<{
  open: boolean;
  row: GasProxyPaymentRecordRow | null;
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
  return buildGasProxyPaymentRecordDetailSections(props.row, ui);
});

const detailEyebrow = computed(() => {
  if (!props.row) return '';
  return resolveGasProxyPaymentRecordDetailEyebrow(props.row, ui);
});

const headline = computed(() => {
  if (!props.row) return '';
  return formatGasProxyPaymentRecordDetailHeadline(props.row);
});

const detailToolbarPageKey = computed(() => props.row?.id ?? 'gas-proxy-payment-record-detail');

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
    <div :class="detailChromeStyles.detailHost">
      <EgDetail
        v-if="row"
        :toolbar-page-key="detailToolbarPageKey"
        :eyebrow="detailEyebrow"
        :headline="headline"
        :show-eyebrow="true"
        :show-status-tag="false"
        :show-tabs="false"
        :sections="sections"
        :show-toolbar="false"
        :value-copy-label="ui('Copy')"
        @close="onDetailClose"
      />
    </div>
  </EgDetailPopup>
</template>
