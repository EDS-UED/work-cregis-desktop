<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const label = computed(() => ui(props.row.teamApiPermissionsKey ?? 'Wallet'));
</script>

<template>
  <EgListFieldOverflowText :text="label" variant="primary" />
</template>
