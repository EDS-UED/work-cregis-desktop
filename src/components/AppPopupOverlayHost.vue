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

const approvalFlow = computed(() => approvalFlowRegistry.value);
const signingFlow = computed(() => signingFlowRegistry.value);
const signingBatchFlow = computed(() => signingBatchFlowRegistry.value);
const recordDetailFlow = computed(() => recordDetailFlowRegistry.value);
const transactionRecordDetailFlow = computed(
  () => transactionRecordDetailFlowRegistry.value,
);
const paymentEngineDetailFlow = computed(() => paymentEngineDetailFlowRegistry.value);
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
      <SigningBatchGlobalProgressHost />
    </div>
  </div>
</template>
