<script setup lang="ts">
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import PaymentEngineListFieldMeta from '@/scenes/payment-engine/list-field/PaymentEngineListFieldMeta.vue';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const primary = computed(() => ui(props.row.policyTypeKey ?? 'Manual Transfer'));
const secondary = computed(() => String(props.row.policyWeight ?? '0'));
</script>

<template>
  <PaymentEngineListFieldMeta :primary="primary" :secondary="secondary" />
</template>
