<script setup lang="ts">
import { computed } from 'vue';
import { EgTag } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import styles from './PaymentEngineListField.shared.module.css';

const props = defineProps<{
  row: PaymentEngineRecordRow;
}>();

const { ui } = useAppI18n();

const isManual = computed(() => props.row.callbackTriggerMode === 'manual');
</script>

<template>
  <div :class="styles.hostCenter">
    <EgTag size="sm" family="system" system-type="gray" truncate>
      {{ ui(isManual ? 'Manual' : 'Auto') }}
    </EgTag>
  </div>
</template>
