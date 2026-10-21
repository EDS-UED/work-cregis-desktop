<script setup lang="ts">
import { computed, ref, type ComponentPublicInstance } from 'vue';
import {
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgListFieldOverflowText,
  type DataListBatchActionResult,
  type DataListItem,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksListFieldCurrency from '@/scenes/tasks/list-field/TasksListFieldCurrency.vue';
import TasksListFieldStatus from '@/scenes/tasks/list-field/TasksListFieldStatus.vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import { buildTasksListFieldTimeCustomize } from '@/scenes/tasks/list-field/tasksListFieldTimeDefaults';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import PaymentEngineListFieldAmount from './list-field/PaymentEngineListFieldAmount.vue';
import PaymentEngineListFieldAmountAddress from './list-field/PaymentEngineListFieldAmountAddress.vue';
import PaymentEngineListFieldCallbackAmountBusiness from './list-field/PaymentEngineListFieldCallbackAmountBusiness.vue';
import PaymentEngineListFieldCallbackBusinessTypeAddress from './list-field/PaymentEngineListFieldCallbackBusinessTypeAddress.vue';
import PaymentEngineListFieldCallbackBusinessTypeUrl from './list-field/PaymentEngineListFieldCallbackBusinessTypeUrl.vue';
import PaymentEngineListFieldCallbackAmountTime from './list-field/PaymentEngineListFieldCallbackAmountTime.vue';
import PaymentEngineListFieldCallbackAddressTime from './list-field/PaymentEngineListFieldCallbackAddressTime.vue';
import PaymentEngineListFieldCallbackEvent from './list-field/PaymentEngineListFieldCallbackEvent.vue';
import PaymentEngineListFieldCallbackUrl from './list-field/PaymentEngineListFieldCallbackUrl.vue';
import TasksListFieldReceiver from '@/scenes/tasks/list-field/TasksListFieldReceiver.vue';
import TasksListFieldSender from '@/scenes/tasks/list-field/TasksListFieldSender.vue';
import columnCellStyles from '@/scenes/tasks/list-field/TasksDataListColumnCell.module.css';
import PaymentEngineListFieldOrderAmounts from './list-field/PaymentEngineListFieldOrderAmounts.vue';
import PaymentEngineListFieldRefundActions from './list-field/PaymentEngineListFieldRefundActions.vue';
import PaymentEngineListFieldMeta from './list-field/PaymentEngineListFieldMeta.vue';
import PaymentEngineListFieldOrderIds from './list-field/PaymentEngineListFieldOrderIds.vue';
import PaymentEngineListFieldSettlementNumber from './list-field/PaymentEngineListFieldSettlementNumber.vue';
import PaymentEngineListFieldOrderStatus from './list-field/PaymentEngineListFieldOrderStatus.vue';
import {
  buildBulkTransferCryptoCustomize,
  buildPaymentExceptionCryptoCustomize,
  buildRefundAmountCustomize,
  buildRefundTokenCryptoCustomize,
  buildAddressBookCryptoCustomize,
  buildCallbackReceiverCustomize,
  buildCallbackSenderCustomize,
  resolveCallbackRowBusinessTypeLabelKey,
} from './paymentEngineListFieldCustomize';
import {
  buildWaasCollectionAddressCryptoCustomize,
  buildWaasRuleCollectionCurrencyCustomize,
  buildWaasTaskCurrencyCustomize,
} from '@/scenes/waas-project/waasListFieldCustomize';
import WaasListFieldCollectionCurrencyRange from '@/scenes/waas-project/list-field/WaasListFieldCollectionCurrencyRange.vue';
import WaasListFieldRuleNameId from '@/scenes/waas-project/list-field/WaasListFieldRuleNameId.vue';
import WaasListFieldRuleStatus from '@/scenes/waas-project/list-field/WaasListFieldRuleStatus.vue';
import WaasListFieldSubAddressMeta from '@/scenes/waas-project/list-field/WaasListFieldSubAddressMeta.vue';
import WaasListFieldSubAddressActions from '@/scenes/waas-project/list-field/WaasListFieldSubAddressActions.vue';
import WaasListFieldProcessingAmount from '@/scenes/waas-project/list-field/WaasListFieldProcessingAmount.vue';
import WaasListFieldProcessingActions from '@/scenes/waas-project/list-field/WaasListFieldProcessingActions.vue';
import WaasListFieldCallbackActions from '@/scenes/waas-project/list-field/WaasListFieldCallbackActions.vue';
import WaasListFieldRuleActions from '@/scenes/waas-project/list-field/WaasListFieldRuleActions.vue';
import RiskControlListFieldPolicyActions from '@/scenes/risk-control/list-field/RiskControlListFieldPolicyActions.vue';
import RiskControlListFieldAutomationActions from '@/scenes/risk-control/list-field/RiskControlListFieldAutomationActions.vue';
import RiskControlListFieldAddressBookAddress from '@/scenes/risk-control/list-field/RiskControlListFieldAddressBookAddress.vue';
import RiskControlListFieldAddressBookActions from '@/scenes/risk-control/list-field/RiskControlListFieldAddressBookActions.vue';
import RiskControlListFieldLogEvent from '@/scenes/risk-control/list-field/RiskControlListFieldLogEvent.vue';
import RiskControlListFieldLogActions from '@/scenes/risk-control/list-field/RiskControlListFieldLogActions.vue';
import {
  isManageRoleMenuItem,
  isManageWebhookConfigMenuItem,
  isManageWebhookPushRecordsMenuItem,
} from '@/scenes/manage/manageMenuData';
import RoleListFieldActions from '@/scenes/manage/role/list-field/RoleListFieldActions.vue';
import RoleListFieldCreatorTime from '@/scenes/manage/role/list-field/RoleListFieldCreatorTime.vue';
import RoleListFieldName from '@/scenes/manage/role/list-field/RoleListFieldName.vue';
import { resolveWebhookConfigCreatorAvatarColorSeed } from '@/scenes/manage/webhook/filter/buildWebhookConfigCreatorFilterOptions';
import WebhookListFieldConfigActions from '@/scenes/manage/webhook/list-field/WebhookListFieldConfigActions.vue';
import WebhookListFieldNameEvent from '@/scenes/manage/webhook/list-field/WebhookListFieldNameEvent.vue';
import WebhookListFieldNameId from '@/scenes/manage/webhook/list-field/WebhookListFieldNameId.vue';
import WebhookListFieldCreatorTime from '@/scenes/manage/webhook/list-field/WebhookListFieldCreatorTime.vue';
import WebhookListFieldPushActions from '@/scenes/manage/webhook/list-field/WebhookListFieldPushActions.vue';
import WebhookListFieldPushStatus from '@/scenes/manage/webhook/list-field/WebhookListFieldPushStatus.vue';
import WebhookListFieldStatus from '@/scenes/manage/webhook/list-field/WebhookListFieldStatus.vue';
import RiskControlListFieldAmlAddressRequester from '@/scenes/risk-control/list-field/RiskControlListFieldAmlAddressRequester.vue';
import RiskControlListFieldAmlRiskScore from '@/scenes/risk-control/list-field/RiskControlListFieldAmlRiskScore.vue';
import RiskControlListFieldAutoRuleActions from '@/scenes/risk-control/list-field/RiskControlListFieldAutoRuleActions.vue';
import RiskControlListFieldAutoRuleNameId from '@/scenes/risk-control/list-field/RiskControlListFieldAutoRuleNameId.vue';
import RiskControlListFieldAutoRuleScope from '@/scenes/risk-control/list-field/RiskControlListFieldAutoRuleScope.vue';
import RiskControlListFieldAutoRuleStatus from '@/scenes/risk-control/list-field/RiskControlListFieldAutoRuleStatus.vue';
import {
  isRiskControlAmlMenuItem,
  isRiskControlAutoRulesMenuItem,
} from '@/scenes/risk-control/riskControlMenuData';
import { isWaasAmountAddressMenuItem, isWaasProcessingMenuItem } from '@/scenes/waas-project/waasStandardMenuData';
import WaasListFieldTaskCount from '@/scenes/waas-project/list-field/WaasListFieldTaskCount.vue';
import WaasListFieldTaskCurrencyId from '@/scenes/waas-project/list-field/WaasListFieldTaskCurrencyId.vue';
import {
  isCallbackErrorRecordMenuItem,
  isPaymentEngineAmountAddressMenuItem,
  isPaymentOrderRecordMenuItem,
  isPaymentSettlementRecordMenuItem,
} from './paymentEngineOrderRecordData';
import {
  type PaymentEngineRecordColumnConfig,
  type PaymentEngineRecordRow,
} from './paymentEngineRecordConfigs';
import type { PaymentEngineRecordSortTarget } from './paymentEngineRecordSort';
import type { TasksDataListSortOrder } from '@/scenes/tasks/tasksDataListSort';
import { buildPaymentEngineRecordStatusCustomize } from './paymentEngineRecordStatusCustomize';
import {
  PAYMENT_ENGINE_COLUMN_HEIGHT,
  PAYMENT_ENGINE_HEADER_HEIGHT,
} from './usePaymentEngineDataListPage';
import batchListFillStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import { useDataListSelectAllShortcut } from '@/scenes/tasks/shared/useDataListSelectAllShortcut';
import styles from './PaymentEngineDataListPage.module.css';

const props = withDefaults(
  defineProps<{
    menuItem: string;
    columns: PaymentEngineRecordColumnConfig[];
    rows: PaymentEngineRecordRow[];
    loading: boolean;
    initing: boolean;
    batchActions: Array<{ key: string; label: string }>;
    onBatchAction: (
      key: string,
      rows: Array<Record<string, unknown> & { _index: number }>,
    ) => Promise<DataListBatchActionResult | void>;
    activeSort?: PaymentEngineRecordSortTarget | null;
    columnHeight?: number;
    dataListFill?: boolean;
  }>(),
  {
    columnHeight: PAYMENT_ENGINE_COLUMN_HEIGHT,
    dataListFill: false,
  },
);

const emit = defineEmits<{
  'update:selectMode': [value: boolean];
  'row-click': [data: DataListItem];
  'sort-change': [value: PaymentEngineRecordSortTarget | null];
  'callback-push-order': [row: PaymentEngineRecordRow];
  'callback-ignore': [row: PaymentEngineRecordRow];
}>();

const selectMode = defineModel<boolean>('selectMode', { default: false });

const dataListRef = ref<ComponentPublicInstance | null>(null);

const batchSelectShortcutEnabled = computed(() => props.batchActions.length > 0);

useDataListSelectAllShortcut({
  selectMode: computed(() => selectMode.value),
  dataListRef,
  pageRowCount: computed(() => props.rows.length),
  selectedCount: computed(() => 0),
  enabled: batchSelectShortcutEnabled,
});

const { ui, locale } = useAppI18n();

function recordRow(data: DataListItem): PaymentEngineRecordRow {
  return data as PaymentEngineRecordRow;
}

function statusCustomize(row: PaymentEngineRecordRow): Record<string, unknown> {
  return buildPaymentEngineRecordStatusCustomize(row, props.menuItem);
}

function cryptoCustomize(
  row: PaymentEngineRecordRow,
  column: PaymentEngineRecordColumnConfig,
): Record<string, unknown> {
  if (props.menuItem === 'Whitelist') {
    return buildAddressBookCryptoCustomize(row, column.minWidth);
  }
  if (props.menuItem === 'Refund Record') {
    return buildRefundTokenCryptoCustomize(row, column.minWidth);
  }
  if (props.menuItem === 'Payment Exception Record') {
    return buildPaymentExceptionCryptoCustomize(row, column.minWidth);
  }
  if (props.menuItem === 'Bulk Transfer Record') {
    return buildBulkTransferCryptoCustomize(row, column.minWidth);
  }
  if (props.menuItem === 'API Collection') {
    return buildWaasCollectionAddressCryptoCustomize(row, column.minWidth);
  }
  return buildRefundTokenCryptoCustomize(row, column.minWidth);
}

function columnProp(column: PaymentEngineRecordColumnConfig): string {
  if (column.key === 'orderIds' || column.key === 'settlementNumber') return 'id';
  if (column.key === 'status') return 'status';
  if (column.key === 'createdAt') return 'createdAt';
  if (column.key === 'orderAmounts') return 'orderAmount';
  if (column.key === 'receivedAmount') return 'receivedAmount';
  if (column.key === 'orderAmount') return 'orderAmount';
  if (column.key === 'crypto') return 'currencySymbol';
  if (column.key === 'bulkState' || column.key === 'refundState') return 'status';
  if (column.key === 'bulkMeta' || column.key === 'refundMeta') return 'createdAt';
  if (column.key === 'callbackEvent') return 'callbackEventId';
  if (
    column.key === 'callbackAmount'
    || column.key === 'callbackAmountTime'
    || column.key === 'callbackAmountBusinessType'
    || column.key === 'callbackBusinessTypeAddress'
    || column.key === 'callbackBusinessTypeUrl'
  ) {
    if (
      column.key === 'callbackBusinessTypeAddress'
      || column.key === 'callbackBusinessTypeUrl'
    ) {
      return 'businessTypeKey';
    }
    return 'orderAmount';
  }
  if (column.key === 'callbackSender') return 'walletFromAddress';
  if (column.key === 'callbackReceiver') return 'walletToAddress';
  if (column.key === 'callbackAddressTime') return 'callbackUrl';
  if (column.key === 'callbackStatus') return 'callbackStatus';
  if (column.key === 'callbackPushMethod') return 'callbackTriggerMode';
  if (column.key === 'callbackTime') return 'createdAt';
  if (column.key === 'callbackUrl') return 'callbackUrl';
  if (column.key === 'ruleNameId') return 'id';
  if (column.key === 'collectionCurrencyRange') return 'currencySymbol';
  if (column.key === 'ruleEnabled') return 'status';
  if (column.key === 'ruleActions' || column.key === 'callbackActions' || column.key === 'refundActions') {
    return 'actions';
  }
  if (
    column.key === 'subAddressActions'
    || column.key === 'processingActions'
    || column.key === 'policyActions'
    || column.key === 'automationActions'
    || column.key === 'addressBookActions'
    || column.key === 'logActions'
    || column.key === 'autoRuleActions'
  ) {
    return 'actions';
  }
  if (column.key === 'autoRuleWaasProject') return 'autoRuleWaasProject';
  if (column.key === 'autoRuleServiceProvider') return 'autoRuleServiceProvider';
  if (column.key === 'logType') return 'logTypeKey';
  if (column.key === 'logEvent') return 'logStrategyName';
  if (column.key === 'amlAddressRequester') return 'amlTargetValue';
  if (column.key === 'amlServiceProvider') return 'amlServiceProvider';
  if (column.key === 'amlQueryTime') return 'createdAt';
  if (column.key === 'amlRiskScore') return 'amlRiskScore';
  if (column.key === 'addressBookAddress') return 'walletToAddress';
  if (column.key === 'subAddressMeta') return 'walletFromAddress';
  if (column.key === 'transactionType' || column.key === 'payoutType' || column.key === 'businessType') {
    return 'merchantOrderId';
  }
  if (column.key === 'processingMeta') return 'createdAt';
  if (column.key === 'roleName') return 'ruleName';
  if (column.key === 'roleCreatorTime') return 'logOperatorName';
  if (column.key === 'roleActions') return 'actions';
  if (column.key === 'processingAmount') return 'orderAmount';
  if (column.key === 'taskCurrencyId') return 'orderAmount';
  if (column.key === 'taskStatus') return 'status';
  if (column.key === 'taskDateRange') return 'createdAt';
  if (column.key === 'taskAmount') return 'orderAmount';
  if (column.key === 'taskCount') return 'orderAmount';
  if (column.key === 'collectionHistoryMeta') return 'createdAt';
  return 'orderAmount';
}

function columnAlign(column: PaymentEngineRecordColumnConfig): 'left' | 'center' | 'right' {
  if (column.align === 'end') return 'right';
  if (column.align === 'center') return 'center';
  return 'left';
}

/** 异常回调 · 金额|时间：列表左对齐，批选右对齐。 */
function resolveCallbackAmountTimeAlignEnd(column: PaymentEngineRecordColumnConfig): boolean {
  if (column.key !== 'callbackAmountTime') {
    return column.align === 'end';
  }
  if (isCallbackErrorRecordMenuItem(props.menuItem)) {
    return selectMode.value;
  }
  return column.align === 'end';
}

function resolveDataListColumnAlign(column: PaymentEngineRecordColumnConfig): 'left' | 'center' | 'right' {
  if (column.key === 'callbackAmountTime' && isCallbackErrorRecordMenuItem(props.menuItem)) {
    return selectMode.value ? 'right' : 'left';
  }
  return columnAlign(column);
}

function columnHeaderAlign(column: PaymentEngineRecordColumnConfig): 'start' | 'end' {
  return resolveCallbackAmountTimeAlignEnd(column) ? 'end' : 'start';
}

function resolveComboHeaderAlignEnd(column: PaymentEngineRecordColumnConfig): boolean {
  if (column.key === 'callbackAmountTime' && isCallbackErrorRecordMenuItem(props.menuItem)) {
    return selectMode.value;
  }
  return Boolean(column.comboAlignEnd);
}

function resolveSortOrder(
  column: PaymentEngineRecordColumnConfig,
  segment: 'primary' | 'secondary',
): TasksDataListSortOrder | '' {
  const activeSort = props.activeSort;
  if (!activeSort) return '';
  if (activeSort.columnKey !== column.key || activeSort.segment !== segment) return '';
  return activeSort.order;
}

function onColumnSortChange(
  column: PaymentEngineRecordColumnConfig,
  segment: 'primary' | 'secondary',
  order: TasksDataListSortOrder | null,
) {
  emit(
    'sort-change',
    order ? { columnKey: column.key, segment, order } : null,
  );
}

const isHeaderSortDisabled = computed(
  () => props.loading || props.rows.length === 0 || selectMode.value,
);

function isActionColumn(column: PaymentEngineRecordColumnConfig): boolean {
  return (
    column.key === 'ruleActions'
    ||     column.key === 'callbackActions'
    || column.key === 'refundActions'
    || column.key === 'subAddressActions'
    || column.key === 'processingActions'
    || column.key === 'policyActions'
    || column.key === 'automationActions'
    || column.key === 'addressBookActions'
    || column.key === 'logActions'
    || column.key === 'autoRuleActions'
    || column.key === 'webhookConfigActions'
    || column.key === 'webhookPushActions'
    || column.key === 'roleActions'
  );
}

function resolveColumnFlexGrow(column: PaymentEngineRecordColumnConfig): boolean {
  if (column.flexGrow != null) return column.flexGrow;
  if (isActionColumn(column)) return false;
  if (column.width) return false;
  return true;
}
</script>

<template>
  <div
    :class="[
      styles.listRegion,
      props.dataListFill && batchListFillStyles.batchDetailDataListFill,
    ]"
  >
<EgDataList
          ref="dataListRef"
          v-model:select-mode="selectMode"
          :data-list="rows"
          :header-height="PAYMENT_ENGINE_HEADER_HEIGHT"
          :column-height="props.columnHeight"
          :loading="loading"
          :initing="initing"
          :initing-text="ui('Loading')"
          :batch-actions="batchActions"
          :on-batch-action="onBatchAction"
          :batch-count-suffix="ui('Selected')"
          @row-click="emit('row-click', $event)"
        >
          <EgDataListColumn
            v-for="column in columns"
            :key="column.key"
            :prop="columnProp(column)"
            :label="ui(column.labelKey)"
            :min-width="column.minWidth"
            :width="column.width"
            :flex-grow="resolveColumnFlexGrow(column)"
            :display-order="column.displayOrder"
            :align="resolveDataListColumnAlign(column)"
            :sortable="false"
            :is-action="isActionColumn(column)"
            :hidden="selectMode && isActionColumn(column)"
          >
            <template v-if="column.headerKind === 'combo'" #header>
              <div
                :class="[
                  pageStyles.comboHeader,
                  resolveComboHeaderAlignEnd(column) && pageStyles.comboHeaderAlignEnd,
                ]"
              >
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui(column.labelKey) }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    v-if="column.sortable"
                    :label="column.labelKey"
                    :align="columnHeaderAlign(column)"
                    :disabled="isHeaderSortDisabled"
                    :active-order="resolveSortOrder(column, 'primary')"
                    @sort-change="(order) => onColumnSortChange(column, 'primary', order)"
                  />
                </div>
                <EgDivider type="navigator" direction="vertical" />
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui(column.secondaryLabelKey ?? '') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    v-if="column.secondarySortable"
                    :label="column.secondaryLabelKey ?? ''"
                    :align="columnHeaderAlign(column)"
                    :disabled="isHeaderSortDisabled"
                    :active-order="resolveSortOrder(column, 'secondary')"
                    @sort-change="(order) => onColumnSortChange(column, 'secondary', order)"
                  />
                </div>
              </div>
            </template>

            <template v-else-if="column.sortable" #header>
              <div
                :class="[
                  pageStyles.comboHeader,
                  column.align === 'end' && pageStyles.comboHeaderAlignEnd,
                ]"
              >
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui(column.labelKey) }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    :label="column.labelKey"
                    :align="columnHeaderAlign(column)"
                    :disabled="isHeaderSortDisabled"
                    :active-order="resolveSortOrder(column, 'primary')"
                    @sort-change="(order) => onColumnSortChange(column, 'primary', order)"
                  />
                </div>
              </div>
            </template>

            <template #default="{ data }">
              <WaasListFieldSubAddressActions
                v-if="column.key === 'subAddressActions' && menuItem === 'Sub-Address'"
              />

              <WaasListFieldRuleActions
                v-else-if="column.key === 'ruleActions' && menuItem === 'Rule Configuration'"
              />

              <WaasListFieldProcessingActions
                v-else-if="column.key === 'processingActions' && isWaasProcessingMenuItem(menuItem)"
              />

              <WaasListFieldCallbackActions
                v-else-if="column.key === 'callbackActions'"
                @push-order="emit('callback-push-order', recordRow(data))"
                @ignore="emit('callback-ignore', recordRow(data))"
              />

              <PaymentEngineListFieldRefundActions
                v-else-if="column.key === 'refundActions' && menuItem === 'Refund Record'"
                :row="recordRow(data)"
              />

              <RiskControlListFieldPolicyActions
                v-else-if="column.key === 'policyActions' && menuItem === 'Policy Settings'"
              />

              <RiskControlListFieldAutomationActions
                v-else-if="column.key === 'automationActions' && menuItem === 'Automation'"
              />

              <RiskControlListFieldAutoRuleActions
                v-else-if="column.key === 'autoRuleActions' && isRiskControlAutoRulesMenuItem(menuItem)"
              />

              <RiskControlListFieldAddressBookActions
                v-else-if="
                  column.key === 'addressBookActions'
                    && (menuItem === 'Whitelist' || menuItem === 'Blacklist')
                "
              />

              <RiskControlListFieldLogActions
                v-else-if="column.key === 'logActions' && menuItem === 'Logs'"
                :row="recordRow(data)"
              />

              <RoleListFieldActions
                v-else-if="column.key === 'roleActions' && isManageRoleMenuItem(menuItem)"
                :row="recordRow(data)"
              />

              <RoleListFieldName
                v-else-if="column.key === 'roleName' && isManageRoleMenuItem(menuItem)"
                :row="recordRow(data)"
              />

              <RoleListFieldCreatorTime
                v-else-if="
                  column.key === 'roleCreatorTime'
                    && isManageRoleMenuItem(menuItem)
                "
                :row="recordRow(data)"
              />

              <WebhookListFieldConfigActions
                v-else-if="
                  column.key === 'webhookConfigActions'
                    && isManageWebhookConfigMenuItem(menuItem)
                "
                :row="recordRow(data)"
              />

              <WebhookListFieldPushActions
                v-else-if="
                  column.key === 'webhookPushActions'
                    && isManageWebhookPushRecordsMenuItem(menuItem)
                "
                :row="recordRow(data)"
              />

              <template v-else-if="!isActionColumn(column)">
              <template
                v-if="
                  column.key === 'webhookNameId'
                    && isManageWebhookConfigMenuItem(menuItem)
                "
              >
                <WebhookListFieldNameId :row="recordRow(data)" />
              </template>

              <template
                v-else-if="
                  column.key === 'webhookEvent'
                    && isManageWebhookConfigMenuItem(menuItem)
                "
              >
                <EgListFieldOverflowText
                  :text="ui(recordRow(data).webhookEventKey ?? 'Dangerous transaction')"
                  variant="primary"
                />
              </template>

              <template
                v-else-if="
                  column.key === 'webhookNameEvent'
                    && isManageWebhookPushRecordsMenuItem(menuItem)
                "
              >
                <WebhookListFieldNameEvent :row="recordRow(data)" />
              </template>

              <template
                v-else-if="
                  column.key === 'webhookCreatorTime'
                    && isManageWebhookConfigMenuItem(menuItem)
                "
              >
                <WebhookListFieldCreatorTime :row="recordRow(data)" />
              </template>

              <template
                v-else-if="
                  column.key === 'webhookEnabled'
                    && isManageWebhookConfigMenuItem(menuItem)
                "
              >
                <WebhookListFieldStatus :row="recordRow(data)" />
              </template>

              <template
                v-else-if="
                  column.key === 'webhookPushTime'
                    && isManageWebhookPushRecordsMenuItem(menuItem)
                "
              >
                <TasksListFieldTime
                  :customize="{
                    ...buildTasksListFieldTimeCustomize(column.minWidth),
                    datetime: recordRow(data).createdAt,
                  }"
                />
              </template>

              <template
                v-else-if="
                  column.key === 'webhookPushStatus'
                    && isManageWebhookPushRecordsMenuItem(menuItem)
                "
              >
                <WebhookListFieldPushStatus :row="recordRow(data)" />
              </template>

              <template v-else-if="column.key === 'logType' && menuItem === 'Logs'">
                <EgListFieldOverflowText
                  :text="ui(recordRow(data).logTypeKey ?? 'Policy')"
                  variant="primary"
                />
              </template>

              <template
                v-else-if="column.key === 'autoRuleWaasProject' && isRiskControlAutoRulesMenuItem(menuItem)"
              >
                <RiskControlListFieldAutoRuleScope :row="recordRow(data)" />
              </template>

              <template
                v-else-if="
                  column.key === 'autoRuleServiceProvider'
                    && isRiskControlAutoRulesMenuItem(menuItem)
                "
              >
                <EgListFieldOverflowText
                  :text="recordRow(data).autoRuleServiceProvider ?? 'Regtank'"
                  variant="primary"
                />
              </template>

              <template v-else-if="column.key === 'amlAddressRequester' && isRiskControlAmlMenuItem(menuItem)">
                <RiskControlListFieldAmlAddressRequester :row="recordRow(data)" />
              </template>

              <template v-else-if="column.key === 'amlServiceProvider' && isRiskControlAmlMenuItem(menuItem)">
                <EgListFieldOverflowText
                  :text="recordRow(data).amlServiceProvider ?? 'Regtank'"
                  variant="primary"
                />
              </template>

              <template v-else-if="column.key === 'amlQueryTime' && isRiskControlAmlMenuItem(menuItem)">
                <EgListFieldOverflowText
                  v-if="recordRow(data).amlQueryTimeDisplay"
                  :text="recordRow(data).amlQueryTimeDisplay ?? '--'"
                  variant="primary"
                  tabular
                />
                <TasksListFieldTime
                  v-else
                  :customize="{
                    ...buildTasksListFieldTimeCustomize(column.minWidth),
                    datetime: recordRow(data).createdAt,
                  }"
                />
              </template>

              <template v-else-if="column.key === 'amlRiskScore' && isRiskControlAmlMenuItem(menuItem)">
                <RiskControlListFieldAmlRiskScore
                  :row="recordRow(data)"
                  :align-end="column.align === 'end'"
                />
              </template>

              <template v-else-if="column.key === 'logEvent' && menuItem === 'Logs'">
                <RiskControlListFieldLogEvent :row="recordRow(data)" />
              </template>

              <template v-else-if="column.key === 'orderIds'">
                <PaymentEngineListFieldOrderIds
                  :order-id="recordRow(data).id"
                  :merchant-order-id="recordRow(data).merchantOrderId"
                />
              </template>

              <template v-else-if="column.key === 'settlementNumber'">
                <PaymentEngineListFieldSettlementNumber
                  :settlement-number="recordRow(data).id"
                />
              </template>

              <template v-else-if="column.key === 'status' && isPaymentOrderRecordMenuItem(menuItem)">
                <PaymentEngineListFieldOrderStatus :status="recordRow(data).status" />
              </template>

              <template
                v-else-if="
                  column.key === 'status'
                    || column.key === 'bulkState'
                    || column.key === 'refundState'
                    || column.key === 'callbackStatus'
                    || column.key === 'taskStatus'
                "
              >
                <TasksListFieldStatus :customize="statusCustomize(recordRow(data))" />
              </template>

              <template v-else-if="column.key === 'createdAt'">
                <TasksListFieldTime
                  :customize="{
                    ...buildTasksListFieldTimeCustomize(column.minWidth),
                    datetime: recordRow(data).createdAt,
                    alignEnd: column.align === 'end',
                  }"
                />
              </template>

              <template v-else-if="column.key === 'bulkMeta'">
                <PaymentEngineListFieldMeta
                  :primary="recordRow(data).createdAt"
                  :secondary="recordRow(data).bulkTransferId ?? recordRow(data).merchantOrderId"
                />
              </template>

              <template v-else-if="column.key === 'refundMeta'">
                <PaymentEngineListFieldMeta
                  :primary="recordRow(data).createdAt"
                  :secondary="recordRow(data).merchantOrderId"
                />
              </template>

              <template v-else-if="column.key === 'callbackEvent'">
                <PaymentEngineListFieldCallbackEvent
                  :row="recordRow(data)"
                  :show-trigger-mode-tag="menuItem === 'History Callback'"
                />
              </template>

              <template v-else-if="column.key === 'callbackBusinessTypeUrl'">
                <PaymentEngineListFieldCallbackBusinessTypeUrl
                  :business-type-key="resolveCallbackRowBusinessTypeLabelKey(recordRow(data))"
                  :callback-url="recordRow(data).callbackUrl ?? ''"
                  :trigger-mode="recordRow(data).callbackTriggerMode"
                />
              </template>

              <template v-else-if="column.key === 'callbackBusinessTypeAddress'">
                <PaymentEngineListFieldCallbackBusinessTypeAddress
                  :business-type-key="resolveCallbackRowBusinessTypeLabelKey(recordRow(data))"
                  :callback-url="recordRow(data).callbackUrl ?? ''"
                />
              </template>

              <template v-else-if="column.key === 'callbackAmountBusinessType'">
                <PaymentEngineListFieldCallbackAmountBusiness
                  :amount="recordRow(data).orderAmount"
                  :symbol="recordRow(data).orderSymbol ?? ''"
                  :crypto-name="recordRow(data).currencyCryptoName"
                  :network-label="recordRow(data).networkLabel"
                  :business-type-key="resolveCallbackRowBusinessTypeLabelKey(recordRow(data))"
                />
              </template>

              <template v-else-if="column.key === 'callbackAmountTime'">
                <PaymentEngineListFieldCallbackAmountTime
                  :amount="recordRow(data).orderAmount"
                  :symbol="recordRow(data).orderSymbol"
                  :crypto-name="recordRow(data).currencyCryptoName"
                  :network-label="
                    recordRow(data).currencyNetwork
                    ?? recordRow(data).networkLabel
                  "
                  :datetime="recordRow(data).createdAt"
                  :align-end="resolveCallbackAmountTimeAlignEnd(column)"
                />
              </template>

              <template v-else-if="column.key === 'callbackSender'">
                <div :class="columnCellStyles.listFieldCell">
                  <TasksListFieldSender
                    :customize="buildCallbackSenderCustomize(
                      recordRow(data),
                      column.minWidth,
                      locale,
                      menuItem,
                    )"
                  />
                </div>
              </template>

              <template v-else-if="column.key === 'callbackReceiver'">
                <div :class="columnCellStyles.listFieldCell">
                  <TasksListFieldReceiver
                    :customize="buildCallbackReceiverCustomize(
                      recordRow(data),
                      column.minWidth,
                      menuItem,
                    )"
                  />
                </div>
              </template>

              <template v-else-if="column.key === 'callbackAddressTime'">
                <PaymentEngineListFieldCallbackAddressTime
                  :url="recordRow(data).callbackUrl ?? ''"
                  :datetime="recordRow(data).createdAt"
                  :align-end="column.align === 'end'"
                />
              </template>

              <template v-else-if="column.key === 'callbackTime'">
                <TasksListFieldTime
                  :customize="{
                    ...buildTasksListFieldTimeCustomize(column.minWidth),
                    datetime: recordRow(data).createdAt,
                    alignEnd: column.align === 'end',
                  }"
                />
              </template>

              <template v-else-if="column.key === 'callbackUrl'">
                <PaymentEngineListFieldCallbackUrl
                  :url="recordRow(data).callbackUrl ?? ''"
                  :align-end="column.align === 'end'"
                />
              </template>

              <template v-else-if="column.key === 'crypto'">
                <TasksListFieldCurrency :customize="cryptoCustomize(recordRow(data), column)" />
              </template>

              <template v-else-if="column.key === 'addressBookAddress'">
                <RiskControlListFieldAddressBookAddress
                  :address="recordRow(data).walletToAddress ?? recordRow(data).id"
                  :tag-label="recordRow(data).walletToAlias"
                />
              </template>

              <template v-else-if="column.key === 'orderAmounts'">
                <PaymentEngineListFieldOrderAmounts
                  :received-amount="recordRow(data).receivedAmount"
                  :received-symbol="recordRow(data).receivedSymbol"
                  :received-crypto-name="recordRow(data).currencyCryptoName"
                  :received-fiat="recordRow(data).receivedFiat"
                  :order-amount="recordRow(data).orderAmount"
                  :order-symbol="recordRow(data).orderSymbol"
                  :order-crypto-name="recordRow(data).currencyCryptoName"
                  :order-fiat="recordRow(data).orderFiat"
                  :network-label="
                    recordRow(data).currencyNetwork
                    ?? recordRow(data).networkLabel
                  "
                  :order-approximate-fiat="!isPaymentSettlementRecordMenuItem(menuItem)"
                  :column-min-width="column.minWidth"
                  :align-end="column.align === 'end'"
                />
              </template>

              <template v-else-if="column.key === 'receivedAmount' || column.key === 'orderAmount'">
                <PaymentEngineListFieldAmount
                  :crypto-amount="
                    column.key === 'receivedAmount'
                      ? recordRow(data).receivedAmount
                      : recordRow(data).orderAmount
                  "
                  :crypto-symbol="
                    column.key === 'receivedAmount'
                      ? recordRow(data).receivedSymbol
                      : recordRow(data).orderSymbol
                  "
                  :crypto-name="
                    column.key === 'orderAmount'
                      ? recordRow(data).currencyCryptoName
                      : undefined
                  "
                  :fiat-amount="
                    column.key === 'receivedAmount'
                      ? recordRow(data).receivedFiat
                      : recordRow(data).orderFiat
                  "
                  :network-label="
                    column.key === 'orderAmount' ? recordRow(data).networkLabel : undefined
                  "
                  :network-label-placement="
                    isPaymentSettlementRecordMenuItem(menuItem) && column.key === 'orderAmount'
                      ? 'secondary'
                      : 'primary'
                  "
                  :approximate-fiat="!isPaymentSettlementRecordMenuItem(menuItem)"
                  align-end
                />
              </template>

              <template v-else-if="column.key === 'bulkAmount'">
                <WaasListFieldProcessingAmount
                  v-if="isWaasAmountAddressMenuItem(menuItem)"
                  :row="recordRow(data)"
                  :column-min-width="column.minWidth"
                />
                <PaymentEngineListFieldAmountAddress
                  v-else-if="isPaymentEngineAmountAddressMenuItem(menuItem)"
                  :menu-item="menuItem"
                  :row="recordRow(data)"
                  :column-min-width="column.minWidth"
                />
                <PaymentEngineListFieldAmount
                  v-else
                  :crypto-amount="recordRow(data).orderAmount"
                  :crypto-symbol="recordRow(data).orderSymbol"
                  :fiat-amount="recordRow(data).orderFiat"
                  align-end
                />
              </template>

              <template v-else-if="column.key === 'refundAmount'">
                <TasksListFieldAmount
                  :customize="buildRefundAmountCustomize(recordRow(data), column.minWidth)"
                />
              </template>

              <template v-else-if="column.key === 'subAddressMeta'">
                <WaasListFieldSubAddressMeta
                  :address="recordRow(data).walletFromAddress ?? recordRow(data).id"
                  :balance="recordRow(data).subAddressBalance ?? recordRow(data).orderAmount"
                  :symbol="recordRow(data).orderSymbol ?? 'BTC'"
                  :tag-label="recordRow(data).walletFromAlias"
                />
              </template>

              <template v-else-if="column.key === 'transactionType'">
                <EgDataListCellOverflow
                  :content-class="styles.cellOverflowText"
                  :text="ui(recordRow(data).transactionTypeKey ?? 'Deposit')"
                  context="cell"
                />
              </template>

              <template v-else-if="column.key === 'payoutType'">
                <EgDataListCellOverflow
                  :content-class="styles.cellOverflowText"
                  :text="ui(recordRow(data).payoutTypeKey ?? 'API')"
                  context="cell"
                />
              </template>

              <template v-else-if="column.key === 'businessType'">
                <EgDataListCellOverflow
                  :content-class="styles.cellOverflowText"
                  :text="ui(recordRow(data).businessTypeKey ?? 'Collection')"
                  context="cell"
                />
              </template>

              <template v-else-if="column.key === 'processingMeta'">
                <PaymentEngineListFieldMeta
                  :primary="recordRow(data).createdAt"
                  :secondary="recordRow(data).collectionId ?? recordRow(data).id"
                  :align-end="column.align === 'end'"
                />
              </template>

              <template v-else-if="column.key === 'processingAmount'">
                <PaymentEngineListFieldAmount
                  :crypto-amount="recordRow(data).orderAmount"
                  :crypto-symbol="recordRow(data).orderSymbol"
                  align-end
                />
              </template>

              <template v-else-if="column.key === 'ruleNameId'">
                <RiskControlListFieldAutoRuleNameId
                  v-if="isRiskControlAutoRulesMenuItem(menuItem)"
                  :row="recordRow(data)"
                />
                <WaasListFieldRuleNameId
                  v-else
                  :rule-name="recordRow(data).ruleName ?? recordRow(data).id"
                  :rule-number="recordRow(data).ruleNumber ?? recordRow(data).merchantOrderId"
                />
              </template>

              <template v-else-if="column.key === 'collectionCurrencyRange'">
                <WaasListFieldCollectionCurrencyRange
                  :customize="buildWaasRuleCollectionCurrencyCustomize(recordRow(data), column.minWidth)"
                  :amount-range-key="recordRow(data).collectionAmountRangeKey ?? 'Unlimited'"
                />
              </template>

              <template v-else-if="column.key === 'ruleEnabled'">
                <RiskControlListFieldAutoRuleStatus
                  v-if="isRiskControlAutoRulesMenuItem(menuItem)"
                  :row="recordRow(data)"
                />
                <WaasListFieldRuleStatus
                  v-else
                  :enabled="Boolean(recordRow(data).ruleEnabled)"
                />
              </template>

              <template v-else-if="column.key === 'policyWeight'">
                <EgListFieldOverflowText
                  :text="recordRow(data).policyWeight ?? '0'"
                  variant="primary"
                  tabular
                />
              </template>

              <template v-else-if="column.key === 'policyType'">
                <EgListFieldOverflowText
                  :text="ui(recordRow(data).policyTypeKey ?? 'Manual Transfer')"
                  variant="primary"
                />
              </template>

              <template v-else-if="column.key === 'automationType'">
                <EgListFieldOverflowText
                  :text="ui(recordRow(data).automationTypeKey ?? 'Collection')"
                  variant="primary"
                />
              </template>

              <template v-else-if="column.key === 'taskCurrencyId'">
                <WaasListFieldTaskCurrencyId
                  :customize="buildWaasTaskCurrencyCustomize(recordRow(data), column.minWidth)"
                  :transaction-count="recordRow(data).taskTransactionCount ?? '0'"
                  :amount="recordRow(data).orderAmount ?? '0'"
                />
              </template>

              <template v-else-if="column.key === 'taskDateRange'">
                <PaymentEngineListFieldMeta
                  :primary="recordRow(data).taskStartAt ?? recordRow(data).createdAt"
                  :secondary="recordRow(data).taskEndAt ?? recordRow(data).createdAt"
                  :align-end="column.align === 'end'"
                />
              </template>

              <template v-else-if="column.key === 'taskAmount'">
                <PaymentEngineListFieldAmount
                  :crypto-amount="recordRow(data).orderAmount"
                  :crypto-symbol="recordRow(data).orderSymbol ?? recordRow(data).currencySymbol ?? 'USDT'"
                  :crypto-name="recordRow(data).currencyCryptoName"
                  :show-crypto-icon="false"
                  align-end
                />
              </template>

              <template v-else-if="column.key === 'taskCount'">
                <WaasListFieldTaskCount
                  :collection-id="recordRow(data).collectionId ?? recordRow(data).id"
                />
              </template>

              <template v-else-if="column.key === 'collectionHistoryMeta'">
                <PaymentEngineListFieldMeta
                  :primary="recordRow(data).completionTime ?? recordRow(data).createdAt"
                  :secondary="recordRow(data).collectionId ?? recordRow(data).id"
                  :align-end="column.align === 'end'"
                />
              </template>
              </template>
            </template>
          </EgDataListColumn>
        </EgDataList>
  </div>
</template>
