<script setup lang="ts">
import type {
  EgFilterCondition,
  EgFilterField,
  EgFilterLogicMode,
  EgFilterOperator,
} from '@eds/desktop-components';
import AppToolbarEgFilter from '@/scenes/shared/AppToolbarEgFilter.vue';
import type { AppEgFilterLayoutMode } from '@/scenes/shared/appEgFilterLayoutDefaults';

const props = defineProps<{
  fields: EgFilterField[];
  operators?: EgFilterOperator[];
  disabled?: boolean;
  layoutMode?: AppEgFilterLayoutMode;
}>();

const conditions = defineModel<EgFilterCondition[]>({ default: () => [] });
const logicMode = defineModel<EgFilterLogicMode>('logicMode', { default: 'all' });
</script>

<template>
  <AppToolbarEgFilter
    :fields="props.fields"
    :disabled="props.disabled"
    :layout-mode="props.layoutMode"
    v-model="conditions"
    v-model:logic-mode="logicMode"
  />
</template>
