<script setup lang="ts">
import { computed } from 'vue';
import RecordDetailFlowHost from '@/scenes/tasks/shared/RecordDetailFlowHost.vue';
import { recordDetailFlowRegistry } from '@/scenes/tasks/shared/recordDetailFlowContext';
import ApprovalFlowHost from '@/scenes/tasks/approval/ApprovalFlowHost.vue';
import { approvalFlowRegistry } from '@/scenes/tasks/approval/approvalFlowContext';
import SigningBatchFlowHost from '@/scenes/tasks/signing/batch/SigningBatchFlowHost.vue';
import SigningBatchGlobalProgressHost from '@/scenes/tasks/signing/batch/SigningBatchGlobalProgressHost.vue';
import { signingBatchFlowRegistry } from '@/scenes/tasks/signing/batch/signingBatchFlowContext';
import SigningFlowHost from '@/scenes/tasks/signing/SigningFlowHost.vue';
import { signingFlowRegistry } from '@/scenes/tasks/signing/signingFlowContext';
import PaymentEngineDetailFlowHost from '@/scenes/payment-engine/PaymentEngineDetailFlowHost.vue';
import { paymentEngineDetailFlowRegistry } from '@/scenes/payment-engine/paymentEngineDetailFlowContext';
import TransactionRecordDetailFlowHost from '@/scenes/transaction-records/TransactionRecordDetailFlowHost.vue';
import { transactionRecordDetailFlowRegistry } from '@/scenes/transaction-records/transactionRecordDetailFlowContext';
import ManageWebhookOverlayHost from '@/scenes/manage/webhook/ManageWebhookOverlayHost.vue';
import { manageWebhookOverlayRegistry } from '@/scenes/manage/webhook/manageWebhookOverlayContext';
import ManageRoleOverlayHost from '@/scenes/manage/role/ManageRoleOverlayHost.vue';
import { manageRoleOverlayRegistry } from '@/scenes/manage/role/manageRoleOverlayContext';
import ManageTeamApiOverlayHost from '@/scenes/manage/team-api/ManageTeamApiOverlayHost.vue';
import { manageTeamApiOverlayRegistry } from '@/scenes/manage/team-api/manageTeamApiOverlayContext';
import RiskControlAmlManualQueryOverlayHost from '@/scenes/risk-control/aml-manual-query/RiskControlAmlManualQueryOverlayHost.vue';
import { riskControlAmlManualQueryOverlayRegistry } from '@/scenes/risk-control/aml-manual-query/riskControlAmlManualQueryOverlayContext';
import RiskControlAutoRuleOverlayHost from '@/scenes/risk-control/auto-rule/RiskControlAutoRuleOverlayHost.vue';
import { riskControlAutoRuleOverlayRegistry } from '@/scenes/risk-control/auto-rule/riskControlAutoRuleOverlayContext';
import RiskControlAmlRecordDetailOverlayHost from '@/scenes/risk-control/RiskControlAmlRecordDetailOverlayHost.vue';
import { riskControlAmlRecordDetailOverlayRegistry } from '@/scenes/risk-control/riskControlAmlRecordDetailOverlayContext';

const approvalFlow = computed(() => approvalFlowRegistry.value);
const signingFlow = computed(() => signingFlowRegistry.value);
const signingBatchFlow = computed(() => signingBatchFlowRegistry.value);
const recordDetailFlow = computed(() => recordDetailFlowRegistry.value);
const transactionRecordDetailFlow = computed(
  () => transactionRecordDetailFlowRegistry.value,
);
const paymentEngineDetailFlow = computed(() => paymentEngineDetailFlowRegistry.value);
const manageWebhookOverlay = computed(() => manageWebhookOverlayRegistry.value);
const manageRoleOverlay = computed(() => manageRoleOverlayRegistry.value);
const manageTeamApiOverlay = computed(() => manageTeamApiOverlayRegistry.value);
const riskControlAutoRuleOverlay = computed(() => riskControlAutoRuleOverlayRegistry.value);
const riskControlAmlManualQueryOverlay = computed(
  () => riskControlAmlManualQueryOverlayRegistry.value,
);
const riskControlAmlRecordDetailOverlay = computed(
  () => riskControlAmlRecordDetailOverlayRegistry.value,
);
</script>

<template>
  <div class="app-popup-overlay-root">
    <div class="app-popup-overlay-host">
      <ApprovalFlowHost v-if="approvalFlow" :flow="approvalFlow" />
      <SigningFlowHost v-if="signingFlow" :flow="signingFlow" />
      <RecordDetailFlowHost v-if="recordDetailFlow" :flow="recordDetailFlow" />
      <TransactionRecordDetailFlowHost
        v-if="transactionRecordDetailFlow"
        :flow="transactionRecordDetailFlow"
      />
      <PaymentEngineDetailFlowHost
        v-if="paymentEngineDetailFlow"
        :flow="paymentEngineDetailFlow"
      />
      <SigningBatchFlowHost v-if="signingBatchFlow" :flow="signingBatchFlow" />
      <ManageWebhookOverlayHost v-if="manageWebhookOverlay" />
      <ManageRoleOverlayHost v-if="manageRoleOverlay" />
      <ManageTeamApiOverlayHost v-if="manageTeamApiOverlay" />
      <RiskControlAutoRuleOverlayHost v-if="riskControlAutoRuleOverlay" />
      <RiskControlAmlManualQueryOverlayHost v-if="riskControlAmlManualQueryOverlay" />
      <RiskControlAmlRecordDetailOverlayHost v-if="riskControlAmlRecordDetailOverlay" />
      <SigningBatchGlobalProgressHost />
    </div>
  </div>
</template>
