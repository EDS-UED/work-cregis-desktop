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
import { resolveCallbackEventLabelKey } from './paymentEngineListFieldCustomize';
import {
  isCallbackRecordDetailMenuItem,
  isCallbackErrorRecordMenuItem,
  isPaymentExceptionRecordMenuItem,
  isPaymentOrderRecordMenuItem,
  isPaymentRefundRecordMenuItem,
  isPaymentSettlementRecordMenuItem,
  isWalletPayoutRecordMenuItem,
  isTransactionRecordDetailMenuItem,
  isApiCollectionRecordMenuItem,
  isCollectionRecordDetailMenuItem,
  isRuleConfigurationRecordMenuItem,
} from './paymentEngineOrderRecordData';
import {
  resolvePaymentEngineRecordStatusDetailLabel,
  resolvePaymentEngineRecordStatusDetailTagStatus,
} from './paymentEngineRecordStatusCustomize';
import type { PaymentEngineRecordRow } from './paymentEngineRecordConfigs';
import {
  AML_QUERY_RESULT_ENTITY_TAGS_ITEM_KEY,
  AML_QUERY_RESULT_RISK_RATING_ITEM_KEY,
  buildRiskControlAmlRecordDetailSections,
  resolveRiskControlAmlRecordDetailTabLabels,
} from '@/scenes/risk-control/buildRiskControlAmlRecordDetailSections';
import { resolveRiskControlAmlQueryRecordDetail } from '@/scenes/risk-control/riskControlAmlQueryRecordDetailData';
import RiskControlAmlRecordDetailEntityTags from '@/scenes/risk-control/RiskControlAmlRecordDetailEntityTags.vue';
import RiskControlAmlRecordDetailRiskRatingValue from '@/scenes/risk-control/RiskControlAmlRecordDetailRiskRatingValue.vue';
import RiskControlAmlRecordDetailRiskScoreEyebrowPortal from '@/scenes/risk-control/RiskControlAmlRecordDetailRiskScoreEyebrowPortal.vue';
import RiskControlAmlRecordDetailRiskTracePanel from '@/scenes/risk-control/RiskControlAmlRecordDetailRiskTracePanel.vue';
import { applyDetailCurrencyExpand } from '@/scenes/risk-control/applyDetailCurrencyExpand';
import {
  AUTO_RULE_CURRENCIES_ITEM_KEY,
  buildAutoRuleExpandedCurrencyValueEntries,
} from '@/scenes/risk-control/buildRiskControlAutoRuleDetailSections';
import {
  buildLogExpandedCurrencyValueEntries,
  LOG_CURRENCIES_ITEM_KEY,
  resolveRiskControlLogRecordHeadline,
} from '@/scenes/risk-control/buildRiskControlLogDetailSections';
import { resolveRiskControlLogRecordDetail } from '@/scenes/risk-control/riskControlLogDetailData';
import { resolveRiskControlAutoRuleRecordDetail } from '@/scenes/risk-control/riskControlAutoRuleDetailData';
import {
  isRiskControlAmlMenuItem,
  isRiskControlAutoRulesMenuItem,
  isRiskControlLogsMenuItem,
} from '@/scenes/risk-control/riskControlMenuData';

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

const detailHostRef = ref<HTMLElement | null>(null);

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
const isWalletPayoutRecordDetail = computed(() => isWalletPayoutRecordMenuItem(props.menuItem));
const isTransactionRecordDetail = computed(() => isTransactionRecordDetailMenuItem(props.menuItem));
const isApiCollectionRecordDetail = computed(() => isApiCollectionRecordMenuItem(props.menuItem));
const isCollectionRecordDetail = computed(() => isCollectionRecordDetailMenuItem(props.menuItem));
const isRuleConfigurationRecordDetail = computed(
  () => isRuleConfigurationRecordMenuItem(props.menuItem),
);
const isAmlRecordDetail = computed(() => isRiskControlAmlMenuItem(props.menuItem));
const isAutoRuleRecordDetail = computed(() => isRiskControlAutoRulesMenuItem(props.menuItem));
const isLogsRecordDetail = computed(() => isRiskControlLogsMenuItem(props.menuItem));

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

const showCallbackRecordTabs = computed(() => false);

const amlRecordTabLabels = computed(() => {
  void locale.value;
  if (!isAmlRecordDetail.value) return [];
  return resolveRiskControlAmlRecordDetailTabLabels(ui);
});

const showAmlRecordTabs = computed(
  () => isAmlRecordDetail.value && amlRecordTabLabels.value.length > 1,
);

const showDetailTabs = computed(
  () =>
    showOrderRecordTabs.value
    || showCallbackRecordTabs.value
    || showAmlRecordTabs.value,
);

const detailTabLabels = computed(() => {
  if (isOrderRecordDetail.value) return orderRecordTabLabels.value;
  if (isCallbackRecordDetail.value) return callbackRecordTabLabels.value;
  if (isAmlRecordDetail.value) return amlRecordTabLabels.value;
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
    if (
      isOrderRecordDetail.value
      || isCallbackRecordDetail.value
      || isAmlRecordDetail.value
    ) {
      clampDetailActiveTab(props.initialActiveTab);
    }
  },
  { immediate: true },
);

watch(detailTabLabels, () => {
  if (!props.detail) return;
  if (
    isOrderRecordDetail.value
    || isCallbackRecordDetail.value
    || isAmlRecordDetail.value
  ) {
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

const amlRecordDetail = computed(() => {
  if (!props.detail || !isAmlRecordDetail.value) return null;
  return resolveRiskControlAmlQueryRecordDetail(props.detail);
});

const amlRiskTraceTabActive = computed(
  () => isAmlRecordDetail.value && activeTab.value === 2,
);

const headline = computed(() => {
  if (!props.detail) return '';
  if (isLogsRecordDetail.value) {
    return resolveRiskControlLogRecordHeadline(props.detail, ui);
  }
  if (isAmlRecordDetail.value) {
    return amlRecordDetail.value?.riskScore ?? props.detail.amlRiskScore ?? '0.0';
  }
  if (isAutoRuleRecordDetail.value || isRuleConfigurationRecordDetail.value) {
    return props.detail.ruleName?.trim() || props.detail.ruleNumber || props.detail.id;
  }
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

const walletPayoutRecordHeadlineStatus = computed(() => {
  void locale.value;
  if (
    !props.detail
    || !(isWalletPayoutRecordDetail.value
      || isApiCollectionRecordDetail.value
      || isCollectionRecordDetail.value)
  ) {
    return null;
  }
  return {
    label: ui(resolvePaymentEngineRecordStatusDetailLabel(props.detail, props.menuItem, ui)),
    status: resolvePaymentEngineRecordStatusDetailTagStatus(props.detail, props.menuItem),
  };
});

const transactionRecordHeadlineStatus = computed(() => {
  void locale.value;
  if (!props.detail || !isTransactionRecordDetail.value) return null;
  return {
    label: ui(resolvePaymentEngineRecordStatusDetailLabel(props.detail, props.menuItem, ui)),
    status: resolvePaymentEngineRecordStatusDetailTagStatus(props.detail, props.menuItem),
  };
});

const callbackRecordHeadlineStatus = computed(() => {
  void locale.value;
  if (!props.detail || !isCallbackRecordDetail.value) return null;
  if (isCallbackErrorRecordMenuItem(props.menuItem)) {
    return {
      label: ui(resolveCallbackEventLabelKey(props.detail.callbackEventType)),
      status: 'warning' as const,
    };
  }
  return {
    label: ui(resolvePaymentEngineRecordStatusDetailLabel(props.detail, props.menuItem, ui)),
    status: resolvePaymentEngineRecordStatusDetailTagStatus(props.detail, props.menuItem),
  };
});

const ruleConfigurationHeadlineStatus = computed(() => {
  void locale.value;
  if (!props.detail || !isRuleConfigurationRecordDetail.value) return null;
  return props.detail.ruleEnabled
    ? { label: ui('Enabled'), status: 'success' as const }
    : { label: ui('Disabled'), status: 'invalid' as const };
});

const autoRuleRecordHeadlineStatus = computed(() => {
  void locale.value;
  if (!props.detail || !isAutoRuleRecordDetail.value) return null;
  return props.detail.ruleEnabled
    ? { label: ui('Enabled'), status: 'success' as const }
    : { label: ui('Disabled'), status: 'invalid' as const };
});

const detailHeadlineStatus = computed(
  () =>
    orderRecordHeadlineStatus.value
    ?? refundRecordHeadlineStatus.value
    ?? paymentExceptionRecordHeadlineStatus.value
    ?? settlementRecordHeadlineStatus.value
    ?? walletPayoutRecordHeadlineStatus.value
    ?? transactionRecordHeadlineStatus.value
    ?? callbackRecordHeadlineStatus.value
    ?? ruleConfigurationHeadlineStatus.value
    ?? autoRuleRecordHeadlineStatus.value,
);

const showDetailEyebrow = computed(
  () =>
    !isRuleConfigurationRecordDetail.value
    && !isAutoRuleRecordDetail.value
    && !isLogsRecordDetail.value
    && !isAmlRecordDetail.value,
);

const detailEyebrowKey = computed(() => {
  if (isAmlRecordDetail.value) return 'Risk Score';
  if (isSettlementRecordDetail.value) return 'Total Settlement Amount';
  if (isOrderRecordDetail.value) return 'Order Amount';
  if (isRefundRecordDetail.value) return 'Refund Amount';
  return 'Amount';
});

const showDetailHeadlineStatus = computed(
  () => !isAmlRecordDetail.value && detailHeadlineStatus.value != null,
);

const expandedDetailItemKeys = ref(new Set<string>());

watch(
  () => [props.detail?.id, props.open] as const,
  () => {
    expandedDetailItemKeys.value = new Set();
  },
);

const baseSections = computed(() => {
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
  if (isAmlRecordDetail.value) {
    return buildRiskControlAmlRecordDetailSections(
      props.detail,
      activeTab.value,
      ui,
    );
  }
  return buildPaymentEngineDetailSections(props.detail, props.menuItem, ui);
});

const sections = computed(() => {
  const result = baseSections.value;
  if (!props.detail || expandedDetailItemKeys.value.size === 0) {
    return result;
  }

  const expandedEntriesByKey = new Map<string, ReturnType<typeof buildAutoRuleExpandedCurrencyValueEntries>>();

  if (
    isAutoRuleRecordDetail.value
    && expandedDetailItemKeys.value.has(AUTO_RULE_CURRENCIES_ITEM_KEY)
  ) {
    const detail = resolveRiskControlAutoRuleRecordDetail(props.detail);
    expandedEntriesByKey.set(
      AUTO_RULE_CURRENCIES_ITEM_KEY,
      buildAutoRuleExpandedCurrencyValueEntries(detail, ui),
    );
  }

  if (
    isLogsRecordDetail.value
    && expandedDetailItemKeys.value.has(LOG_CURRENCIES_ITEM_KEY)
  ) {
    const detail = resolveRiskControlLogRecordDetail(props.detail);
    expandedEntriesByKey.set(
      LOG_CURRENCIES_ITEM_KEY,
      buildLogExpandedCurrencyValueEntries(detail, ui),
    );
  }

  if (expandedEntriesByKey.size === 0) {
    return result;
  }

  return applyDetailCurrencyExpand(
    result,
    expandedDetailItemKeys.value,
    expandedEntriesByKey,
  );
});

function onItemValueLinkClick(key: string) {
  if (key === AUTO_RULE_CURRENCIES_ITEM_KEY || key === LOG_CURRENCIES_ITEM_KEY) {
    expandedDetailItemKeys.value = new Set([key]);
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
        v-model:active-tab="activeTab"
        :toolbar-page-key="detailToolbarPageKey"
        :show-toolbar-nav="showDetailTabs"
        :toolbar-current="activeTab"
        :eyebrow="ui(detailEyebrowKey)"
        :headline="headline"
        :show-eyebrow="showDetailEyebrow"
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
        :value-device-info-label="ui('Device information')"
        :value-device-type-label="ui('Device Type')"
        :value-device-id-label="ui('Device ID')"
        :value-device-ip-label="ui('IP')"
        @close="onDetailClose"
        @item-value-link-click="onItemValueLinkClick"
      >
        <template #headline-text>
          {{ headlineParts.primary }}<span
            v-if="headlineParts.fiat"
            :class="detailChromeStyles.headlineFiat"
          >{{ headlineParts.fiat }}</span>
        </template>
        <template
          v-if="amlRecordDetail"
          #[`item-value-${AML_QUERY_RESULT_RISK_RATING_ITEM_KEY}`]
        >
          <RiskControlAmlRecordDetailRiskRatingValue
            :label-key="amlRecordDetail.riskLabelKey"
            :custom-style="amlRecordDetail.riskCustomStyle"
          />
        </template>
        <template
          v-if="amlRecordDetail"
          #[`item-value-${AML_QUERY_RESULT_ENTITY_TAGS_ITEM_KEY}`]
        >
          <RiskControlAmlRecordDetailEntityTags :tags="amlRecordDetail.entityTags" />
        </template>
        <template v-if="amlRecordDetail && amlRiskTraceTabActive" #append>
          <RiskControlAmlRecordDetailRiskTracePanel
            :source-trace="amlRecordDetail.sourceTrace"
            :destination-trace="amlRecordDetail.destinationTrace"
          />
        </template>
      </EgDetail>
      <RiskControlAmlRecordDetailRiskScoreEyebrowPortal
        v-if="amlRecordDetail"
        :host-ref="detailHostRef"
        :page-key="detailToolbarPageKey"
      />
    </div>
  </EgDetailPopup>
</template>
