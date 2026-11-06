<script setup lang="ts">
import { ref, watch } from 'vue';
import { EgButton, EgDivider } from '@eds/desktop-components';
import type { ComboActionSkidTone } from '@eds/desktop-components';
import comboActionStyles from '@eds/desktop-components/molecules/combo/ComboAction.module.css';
import { useSkidPanelActionDivider } from './useSkidPanelActionDivider';

const props = withDefaults(
  defineProps<{
    confirmLabel: string;
    tone?: ComboActionSkidTone;
    disabled?: boolean;
    /** Skid 正文变化（展开区块、列表展开等）时递增以重算底栏分割线。 */
    contentRevision?: number;
  }>(),
  {
    tone: 'decor',
    disabled: false,
    contentRevision: 0,
  },
);

const emit = defineEmits<{
  confirm: [];
}>();

const rootRef = ref<HTMLElement | null>(null);
const { actionDividerVisible, scheduleActionDividerCheck } = useSkidPanelActionDivider(
  rootRef,
);

watch(
  () => props.contentRevision,
  () => {
    scheduleActionDividerCheck();
  },
);
</script>

<template>
  <div ref="rootRef" :class="comboActionStyles.skidRoot">
    <EgDivider :hide="!actionDividerVisible" />
    <div :class="comboActionStyles.skidActions">
      <EgButton
        :class="comboActionStyles.fullWidth"
        :tone="props.tone"
        variant="solid"
        size="md"
        :disabled="props.disabled"
        @click="emit('confirm')"
      >
        {{ props.confirmLabel }}
      </EgButton>
    </div>
  </div>
</template>
