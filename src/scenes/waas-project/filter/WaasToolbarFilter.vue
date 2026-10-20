<script setup lang="ts">
import { computed } from 'vue';
import {
  EgFilter,
  createFilterTranslate,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterLogicMode,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';

const props = defineProps<{
  fields: EgFilterField[];
  operators: EgFilterOperator[];
  disabled?: boolean;
}>();

const conditions = defineModel<EgFilterCondition[]>({ default: () => [] });
const logicMode = defineModel<EgFilterLogicMode>('logicMode', { default: 'all' });

const { locale, ui } = useAppI18n();
const filterTranslate = computed(() => {
  const filterUi = createFilterTranslate(locale.value);
  return (text: string) => {
    const appText = ui(text);
    if (appText !== text) return appText;
    return filterUi(text);
  };
});
</script>

<template>
  <EgFilter
    v-model="conditions"
    v-model:logic-mode="logicMode"
    :fields="props.fields"
    :operators="props.operators"
    :translate="filterTranslate"
    add-label="添加条件"
    :max-conditions="20"
    placement="bottom"
    align="start"
    value-align="end"
    boundary-selector=".app-preview"
    teleport-to=".app-preview"
    :disabled="props.disabled"
  />
</template>
