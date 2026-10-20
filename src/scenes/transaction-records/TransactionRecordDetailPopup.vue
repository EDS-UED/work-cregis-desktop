<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import { EgDetail, EgDetailPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatGroupedAmountText } from '@/utils/formatGroupedDisplay';
import { splitDetailAmountHeadline } from '@/scenes/tasks/shared/splitDetailAmountHeadline';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import SigningBatchDataListPaginerBar from '@/scenes/tasks/signing/batch/SigningBatchDataListPaginerBar.vue';
import SigningBatchPopupMotionPageChrome from '@/scenes/tasks/signing/batch/SigningBatchPopupMotionPageChrome.vue';
import SigningBatchPopupSlotFooterBody from '@/scenes/tasks/signing/batch/SigningBatchPopupSlotFooterBody.vue';
import SigningBatchSignSubPageShell from '@/scenes/tasks/signing/batch/SigningBatchSignSubPageShell.vue';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import { buildTransactionRecordDetailSections } from './buildTransactionRecordDetailSections';
import { buildTransactionRecordAmountHeadline } from './transactionRecordDetail';
import { buildParallelOutDetailLines } from './transactionRecordParallelOutDetailData';
import TransactionRecordParallelOutDetailTable from './TransactionRecordParallelOutDetailTable.vue';
import type { TransactionRecordDetailPage } from './transactionRecordDetailPage';
import type { TransactionRecordParallelOutDetailLine } from './transactionRecordParallelOutDetailTypes';
import type { TransactionRecordRow } from './transactionRecordTypes';

const props = defineProps<{
  open: boolean;
  detail: TransactionRecordRow | null;
  detailPage: TransactionRecordDetailPage;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:detailPage': [value: TransactionRecordDetailPage];
  'popup-closed': [];
}>();

const { ui, locale } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
    emit('popup-closed');
  },
});

const activePage = ref<TransactionRecordDetailPage>(props.detailPage);
const pageStackDirection = ref<'forward' | 'backward' | 'none'>('none');

const isSummaryPage = computed(() => activePage.value === 'summary');
const isParallelOutLinesPage = computed(() => activePage.value === 'parallel-out-lines');

/** EgDetailPopup 固定 880×620：stack 始终 fill。 */
const popupContentFill = computed(() => true);

const headline = computed(() =>
  formatGroupedAmountText(
    props.detail ? buildTransactionRecordAmountHeadline(props.detail) : '',
  ),
);
const headlineParts = computed(() => splitDetailAmountHeadline(headline.value));

const sections = computed(() => {
  void locale.value;
  if (!props.detail) return [];
  return buildTransactionRecordDetailSections(props.detail, ui);
});

const parallelOutDetailLines = computed(() => {
  if (!props.detail?.transactionCountShowsDetailLink) {
    return [];
  }
  return buildParallelOutDetailLines(props.detail);
});

const parallelOutDisplayLines = ref<TransactionRecordParallelOutDetailLine[]>([]);

function resolvePageStackDirection(
  from: TransactionRecordDetailPage,
  to: TransactionRecordDetailPage,
): 'forward' | 'backward' | 'none' {
  if (from === 'summary' && to !== 'summary') {
    return 'forward';
  }
  if (from !== 'summary' && to === 'summary') {
    return 'backward';
  }
  return 'none';
}

function setActivePage(next: TransactionRecordDetailPage) {
  if (next === activePage.value) {
    return;
  }
  pageStackDirection.value = resolvePageStackDirection(activePage.value, next);
  activePage.value = next;
  emit('update:detailPage', next);
}

watch(
  () => props.detailPage,
  (page) => {
    if (page === activePage.value) {
      return;
    }
    pageStackDirection.value = resolvePageStackDirection(activePage.value, page);
    activePage.value = page;
  },
);

watch(
  () => props.open,
  (open) => {
    if (open) {
      activePage.value = props.detailPage;
      pageStackDirection.value = 'none';
      return;
    }
    parallelOutDisplayLines.value = [];
    pageStackDirection.value = 'none';
  },
);

function onDetailClose() {
  popupOpen.value = false;
}

function onItemValueLinkClick(key: string) {
  if (key !== 'transaction-count' || !props.detail?.transactionCountShowsDetailLink) {
    return;
  }
  setActivePage('parallel-out-lines');
}

function onParallelOutDetailBack() {
  setActivePage('summary');
}
</script>

<template>
  <EgDetailPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    @close="onPopupClosed"
  >
    <div :class="detailChromeStyles.detailHost">
      <div :class="detailChromeStyles.detailPageStack">
        <div
          :class="[
            batchStyles.batchPopupContent,
            popupContentFill && batchStyles.batchPopupContentFill,
          ]"
        >
          <div
            class="motion-page-stack"
            :class="[
              batchStyles.batchPopupPageStack,
              batchStyles.batchPopupPageStackFill,
            ]"
            :data-page-direction="pageStackDirection"
            :data-batch-popup-page="activePage"
          >
            <Transition name="motion-page">
              <div
                :key="activePage"
                class="motion-page"
                :class="batchStyles.batchPopupPageFill"
              >
                <SigningBatchPopupMotionPageChrome>
                  <EgDetail
                    v-if="isSummaryPage && detail"
                    :toolbar-page-key="detail.id"
                    :eyebrow="ui('Amount')"
                    :headline="headline"
                    :show-eyebrow="true"
                    :show-status-tag="false"
                    :show-tabs="false"
                    :sections="sections"
                    :show-toolbar="false"
                    @close="onDetailClose"
                    @item-value-link-click="onItemValueLinkClick"
                  >
                    <template #headline-text>
                      {{ headlineParts.primary }}<span
                        v-if="headlineParts.fiat"
                        :class="detailChromeStyles.headlineFiat"
                      >{{ headlineParts.fiat }}</span>
                    </template>
                  </EgDetail>

                  <SigningBatchSignSubPageShell
                    v-else-if="isParallelOutLinesPage && detail"
                    :class="batchStyles.batchPopupPageFill"
                    :title="ui('Transaction count details')"
                    @back="onParallelOutDetailBack"
                  >
                    <TransactionRecordParallelOutDetailTable :lines="parallelOutDisplayLines" />
                  </SigningBatchSignSubPageShell>

                  <template v-if="isParallelOutLinesPage" #footer>
                    <SigningBatchPopupSlotFooterBody
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
                          :key="detail?.id"
                          :items="parallelOutDetailLines"
                          @paginated-change="parallelOutDisplayLines = $event"
                        />
                      </template>
                    </SigningBatchPopupSlotFooterBody>
                  </template>
                </SigningBatchPopupMotionPageChrome>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </EgDetailPopup>
</template>
