<script setup lang="ts">
import { computed } from 'vue';
import {
  EgFilter,
  createFilterTranslate,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterLogicMode,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  resolveAppEgFilterPresetBind,
  type AppEgFilterLayoutMode,
} from './appEgFilterLayoutDefaults';

const props = withDefaults(
  defineProps<{
    fields: EgFilterField[];
    disabled?: boolean;
    layoutMode?: AppEgFilterLayoutMode;
  }>(),
  {
    layoutMode: 'unconditional',
  },
);

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

const presetBind = computed(() => resolveAppEgFilterPresetBind(props.layoutMode));
</script>

<template>
  <EgFilter
    v-model="conditions"
    v-model:logic-mode="logicMode"
    v-bind="presetBind"
    :fields="props.fields"
    :translate="filterTranslate"
    :disabled="props.disabled"
  />
</template>
