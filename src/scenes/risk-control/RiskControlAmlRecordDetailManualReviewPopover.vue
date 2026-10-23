<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgButton, EgPopover, EgTooltip } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import RiskControlAmlRecordDetailManualReviewForm from './RiskControlAmlRecordDetailManualReviewForm.vue';

const props = defineProps<{
  initialRiskLevel?: 'danger' | 'safe' | null;
  showSafeWaasHintWhenSelectingSafe?: boolean;
}>();

const emit = defineEmits<{
  submit: [level: 'danger' | 'safe'];
}>();

const { ui } = useAppI18n();

const tooltipRef = ref<{ close: () => void } | null>(null);
const formSessionKey = ref(0);

const formMountKey = computed(
  () => `${formSessionKey.value}:${props.initialRiskLevel ?? 'none'}:${props.showSafeWaasHintWhenSelectingSafe ? 1 : 0}`,
);

function onOpen() {
  formSessionKey.value += 1;
}

function onTopToolClose() {
  tooltipRef.value?.close();
}

function onFormSubmit(level: 'danger' | 'safe') {
  emit('submit', level);
  tooltipRef.value?.close();
}
</script>

<template>
  <EgTooltip
    ref="tooltipRef"
    placement="top"
    align="center"
    :wrap-tooltip="false"
    boundary-selector=".eds-popup"
    @open="onOpen"
  >
    <EgButton variant="solid" tone="decor" size="md">
      {{ ui('AML handling manual review title') }}
    </EgButton>
    <template #content>
      <EgPopover
        placement="top"
        align="center"
        width-mode="fixed"
        :width="336"
        height-mode="adaptive"
        top-tool
        :top-tool-title="ui('AML manual review dialog title')"
        top-tool-closable
        @top-tool-close="onTopToolClose"
      >
        <RiskControlAmlRecordDetailManualReviewForm
          v-if="formSessionKey > 0"
          :key="formMountKey"
          :initial-risk-level="props.initialRiskLevel"
          :show-safe-waas-hint-when-selecting-safe="props.showSafeWaasHintWhenSelectingSafe"
          @submit="onFormSubmit"
        />
      </EgPopover>
    </template>
  </EgTooltip>
</template>
