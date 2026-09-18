<script setup lang="ts">
import { computed, ref, toRef, watch, withDefaults } from 'vue';
import { EgDetail, EgDetailPopup } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatGroupedAmountText } from '@/utils/formatGroupedDisplay';
import { splitDetailAmountHeadline } from '@/scenes/tasks/shared/splitDetailAmountHeadline';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import {
  buildPaymentEngineCallbackErrorDetailSections,
  resolvePaymentEngineCallbackErrorDetailTabLabels,
} from './buildPaymentEngineCallbackErrorDetailSections';
import { buildPaymentEngineDetailSections } from './buildPaymentEngineDetailSections';
import {
  buildPaymentEngineOrderRecordDetailSections,
  resolvePaymentEngineOrderRecordHeadlineStatus,
  resolvePaymentEngineOrderRecordTabLabels,
} from './buildPaymentEngineOrderRecordDetailSections';
import { buildPaymentEngineAmountHeadline } from './paymentEngineDetail';
import {
  isCallbackRecordDetailMenuItem,
  isPaymentExceptionRecordMenuItem,
  isPaymentOrderRecordMenuItem,
  isPaymentRefundRecordMenuItem,
  isPaymentSettlementRecordMenuItem,
} from './paymentEngineOrderRecordData';
import {
  resolvePaymentEngineRecordStatusDetailLabel,
  resolvePaymentEngineRecordStatusDetailTagStatus,
} from './paymentEngineRecordStatusCustomize';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';

const props = withDefaults(
  defineProps<{
    open: boolean;
    detail: PaymentEngineRecordRow | null;
    menuItem: string;
    initialActiveTab?: number;
  }>(),
  {
    initialActiveTab: 0,
  },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
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

const isOrderRecordDetail = computed(() => isPaymentOrderRecordMenuItem(props.menuItem));
const isRefundRecordDetail = computed(() => isPaymentRefundRecordMenuItem(props.menuItem));
const isPaymentExceptionRecordDetail = computed(
  () => isPaymentExceptionRecordMenuItem(props.menuItem),
);
const isCallbackRecordDetail = computed(() => isCallbackRecordDetailMenuItem(props.menuItem));
const isSettlementRecordDetail = computed(() => isPaymentSettlementRecordMenuItem(props.menuItem));

const orderRecordTabLabels = computed(() => {
  void locale.value;
  if (!props.detail) return [];
  return resolvePaymentEngineOrderRecordTabLabels(props.detail, ui);
});

const showOrderRecordTabs = computed(
  () => isOrderRecordDetail.value && orderRecordTabLabels.value.length > 1,
);

const callbackRecordTabLabels = computed(() => {
  void locale.value;
  if (!props.detail || !isCallbackRecordDetail.value) return [];
  return resolvePaymentEngineCallbackErrorDetailTabLabels(props.detail, ui);
});

const showCallbackRecordTabs = computed(
  () => isCallbackRecordDetail.value && callbackRecordTabLabels.value.length > 1,
);

const showDetailTabs = computed(
  () => showOrderRecordTabs.value || showCallbackRecordTabs.value,
);

const detailTabLabels = computed(() => {
  if (isOrderRecordDetail.value) return orderRecordTabLabels.value;
  if (isCallbackRecordDetail.value) return callbackRecordTabLabels.value;
  return [];
});

const activeTab = ref(props.initialActiveTab);

const detailToolbarPageKey = computed(() => {
  if (!props.detail) return '';

  if (showDetailTabs.value) {
    return `${props.detail.id}:tab-${activeTab.value}`;
  }

  return props.detail.id;
});

function clampDetailActiveTab(preferred = props.initialActiveTab) {
  const maxIndex = Math.max(0, detailTabLabels.value.length - 1);
  activeTab.value = Math.min(Math.max(0, preferred), maxIndex);
}

watch(
  () => [
    props.detail?.id,
    props.detail?.orderRefund?.status,
    props.detail?.callbackEventType,
    props.initialActiveTab,
    detailTabLabels.value.length,
    props.menuItem,
  ] as const,
  () => {
    if (!props.detail) return;
    if (isOrderRecordDetail.value || isCallbackRecordDetail.value) {
      clampDetailActiveTab(props.initialActiveTab);
    }
  },
  { immediate: true },
);

watch(detailTabLabels, () => {
  if (!props.detail) return;
  if (isOrderRecordDetail.value || isCallbackRecordDetail.value) {
    clampDetailActiveTab(props.initialActiveTab);
  }
});

const settlementHeadlineParts = computed(() => {
  if (!props.detail || !isSettlementRecordDetail.value) return null;

  const primary = formatGroupedAmountText(
    `${props.detail.orderAmount} ${props.detail.orderSymbol}`,
  );
  const fiat = props.detail.orderFiat?.trim();

  return {
    primary,
    fiat: fiat ? ` ${formatGroupedAmountText(fiat)}` : null,
  };
});

const headline = computed(() => {
  if (!props.detail) return '';
  if (settlementHeadlineParts.value) {
    const parts = settlementHeadlineParts.value;
    return parts.fiat ? `${parts.primary}${parts.fiat}` : parts.primary;
  }
  return formatGroupedAmountText(buildPaymentEngineAmountHeadline(props.detail));
});
const headlineParts = computed(() => {
  if (settlementHeadlineParts.value) {
    return settlementHeadlineParts.value;
  }
  return splitDetailAmountHeadline(headline.value);
});

const orderRecordHeadlineStatus = computed(() => {
  void locale.value;
  if (!props.detail || !isOrderRecordDetail.value) return null;
  return resolvePaymentEngineOrderRecordHeadlineStatus(props.detail, ui);
});

const refundRecordHeadlineStatus = computed(() => {
  void locale.value;
  if (!props.detail || !isRefundRecordDetail.value) return null;
  return {
    label: ui(resolvePaymentEngineRecordStatusDetailLabel(props.detail, props.menuItem, ui)),
    status: resolvePaymentEngineRecordStatusDetailTagStatus(props.detail, props.menuItem),
  };
});

const paymentExceptionRecordHeadlineStatus = computed(() => {
  void locale.value;
  if (!props.detail || !isPaymentExceptionRecordDetail.value) return null;
  return {
    label: ui(resolvePaymentEngineRecordStatusDetailLabel(props.detail, props.menuItem, ui)),
    status: resolvePaymentEngineRecordStatusDetailTagStatus(props.detail, props.menuItem),
  };
});

const settlementRecordHeadlineStatus = computed(() => {
  void locale.value;
  if (!props.detail || !isSettlementRecordDetail.value) return null;
  return {
    label: ui(resolvePaymentEngineRecordStatusDetailLabel(props.detail, props.menuItem, ui)),
    status: resolvePaymentEngineRecordStatusDetailTagStatus(props.detail, props.menuItem),
  };
});

const detailEyebrowKey = computed(() => {
  if (isSettlementRecordDetail.value) return 'Total Settlement Amount';
  if (isOrderRecordDetail.value) return 'Order Amount';
  if (isRefundRecordDetail.value) return 'Refund Amount';
  return 'Amount';
});

const detailHeadlineStatus = computed(
  () =>
    orderRecordHeadlineStatus.value
    ?? refundRecordHeadlineStatus.value
    ?? paymentExceptionRecordHeadlineStatus.value
    ?? settlementRecordHeadlineStatus.value,
);

const showDetailHeadlineStatus = computed(() => detailHeadlineStatus.value != null);

const sections = computed(() => {
  void locale.value;
  if (!props.detail) return [];
  if (isOrderRecordDetail.value) {
    return buildPaymentEngineOrderRecordDetailSections(
      props.detail,
      activeTab.value,
      ui,
    );
  }
  if (isCallbackRecordDetail.value) {
    return buildPaymentEngineCallbackErrorDetailSections(
      props.detail,
      activeTab.value,
      ui,
      props.menuItem,
    );
  }
  return buildPaymentEngineDetailSections(props.detail, props.menuItem, ui);
});

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
        v-if="detail"
        v-model:active-tab="activeTab"
        :toolbar-page-key="detailToolbarPageKey"
        :show-toolbar-nav="showDetailTabs"
        :toolbar-current="activeTab"
        :eyebrow="ui(detailEyebrowKey)"
        :headline="headline"
        :show-eyebrow="true"
        :show-status-tag="showDetailHeadlineStatus"
        :status-tag="detailHeadlineStatus?.label ?? ''"
        status-tag-size="lg"
        :status-tag-status="detailHeadlineStatus?.status ?? 'success'"
        :show-tabs="showDetailTabs"
        :tab-labels="detailTabLabels"
        :sections="sections"
        :show-toolbar="false"
        :value-copy-label="ui('Copy')"
        :value-address-book-label="ui('Add to address book')"
        :value-aml-search-label="ui('AML Search')"
        :value-browser-label="ui('Block explorer')"
        @close="onDetailClose"
      >
        <template #headline-text>
          {{ headlineParts.primary }}<span
            v-if="headlineParts.fiat"
            :class="detailChromeStyles.headlineFiat"
          >{{ headlineParts.fiat }}</span>
        </template>
      </EgDetail>
    </div>
  </EgDetailPopup>
</template>
