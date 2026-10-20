<script setup lang="ts">
import { computed, ref, watch, withDefaults } from 'vue';
import { EgDetail, EgDivider, EgTabs } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import SigningBatchDataListPaginerBar from '@/scenes/tasks/signing/batch/SigningBatchDataListPaginerBar.vue';
import { buildPaymentEngineBulkTransferDetailSections } from './buildPaymentEngineBulkTransferDetailSections';
import { buildPaymentEngineBulkTransferDetailView } from './paymentEngineBulkTransferDetailView';
import PaymentEngineBulkTransferTransferRecordsTable from './PaymentEngineBulkTransferTransferRecordsTable.vue';
import {
  resolvePaymentEngineRecordStatusDetailLabel,
  resolvePaymentEngineRecordStatusDetailTagStatus,
} from './paymentEngineRecordStatusCustomize';
import type { PaymentEngineBulkTransferLineRecord, PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import styles from './PaymentEngineBulkTransferDetailPage.module.css';

const props = withDefaults(
  defineProps<{
    detail: PaymentEngineRecordRow;
    menuItem: string;
    /** motion-page 内联 ToolBar 时 true，不用 EgLayout chrome inset。 */
    embeddedInPageStack?: boolean;
  }>(),
  {
    embeddedInPageStack: false,
  },
);

const { ui, locale } = useAppI18n();

const detailView = computed(() => {
  void locale.value;
  return buildPaymentEngineBulkTransferDetailView(
    props.detail,
    props.menuItem,
    ui,
    resolvePaymentEngineRecordStatusDetailLabel,
    resolvePaymentEngineRecordStatusDetailTagStatus,
  );
});

const detailSections = computed(() =>
  buildPaymentEngineBulkTransferDetailSections(detailView.value, ui),
);

const transferRecordTabLabels = computed(() => [
  ui(detailView.value.transferRecords.tabLabelKey),
]);

const activeTab = ref(0);

const displayTransferLines = ref<PaymentEngineBulkTransferLineRecord[]>([]);

watch(
  () => detailView.value.transferRecords.lines,
  (lines) => {
    displayTransferLines.value = lines.slice(0, 20);
  },
  { immediate: true },
);
</script>

<template>
  <div
    :class="[
      styles.pageRoot,
      props.embeddedInPageStack ? styles.pageRootEmbedded : styles.pageRootStandalone,
    ]"
  >
    <div :class="styles.detailHost">
      <EgDetail
        :toolbar-page-key="detail.id"
        :eyebrow="ui(detailView.headline.eyebrowKey)"
        :headline="detailView.headline.amountText"
        :show-eyebrow="true"
        :show-status-tag="true"
        :status-tag="detailView.headline.status.label"
        status-tag-size="lg"
        :status-tag-status="detailView.headline.status.kind"
        :show-tabs="false"
        :sections="detailSections"
        :show-toolbar="false"
      >
        <template #append>
          <div :class="styles.recordsRegion">
            <EgDivider
              type="page"
              direction="horizontal"
              :class="styles.recordsDivider"
            />
            <div :class="styles.recordsTab">
              <EgTabs
                v-model="activeTab"
                :labels="transferRecordTabLabels"
                horizontal-gap="xl"
                vertical-gap="xl"
              />
            </div>

            <div :class="styles.recordsTable">
              <PaymentEngineBulkTransferTransferRecordsTable
                :lines="displayTransferLines"
              />
            </div>

            <div :class="styles.recordsPaginer">
              <SigningBatchDataListPaginerBar
                :key="detail.id"
                :items="detailView.transferRecords.lines"
                @paginated-change="displayTransferLines = $event"
              />
            </div>
          </div>
        </template>
      </EgDetail>
    </div>
  </div>
</template>

<style scoped>
:deep(.eds-detail > div:first-child) {
  display: none;
}
</style>
