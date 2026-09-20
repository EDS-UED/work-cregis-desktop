<script setup lang="ts">
import { computed } from 'vue';
import { EgListFieldOverflowText } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import TasksListFieldCurrency from '@/scenes/tasks/list-field/TasksListFieldCurrency.vue';
import styles from '@/scenes/payment-engine/list-field/PaymentEngineListField.shared.module.css';

const props = defineProps<{
  customize: Record<string, unknown>;
  amountRangeKey: string;
}>();

const { ui } = useAppI18n();

const amountRangeText = computed(() => ui(props.amountRangeKey));
</script>

<template>
  <div :class="styles.host">
    <TasksListFieldCurrency :customize="customize" />
    <EgListFieldOverflowText :text="amountRangeText" variant="secondary" />
  </div>
</template>
