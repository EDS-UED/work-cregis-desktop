<script setup lang="ts">
import { computed, ref, watch, withDefaults } from 'vue';
import {
  EgButton,
  EgFormSubmission,
  EgRemarkPopoverPanel,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import ProjectCreateModeCard from '@/scenes/project/components/ProjectCreateModeCard.vue';
import styles from './RiskControlAmlRecordDetailManualReviewDialog.module.css';

const props = withDefaults(
  defineProps<{
    initialRiskLevel?: 'danger' | 'safe' | null;
    showSafeWaasHintWhenSelectingSafe?: boolean;
    /** 详情浮层 EgPopover；与 EgDialog 共用字段，间距单独收紧。 */
    variant?: 'dialog' | 'popover';
  }>(),
  {
    variant: 'dialog',
  },
);

const emit = defineEmits<{
  submit: [level: 'danger' | 'safe'];
}>();

const { ui } = useAppI18n();
const remark = ref('');
const riskLevel = ref<'danger' | 'safe' | null>(props.initialRiskLevel ?? null);
const safeWaasHintAcknowledged = ref(false);

const REMARK_MAX = 1000;

const manualReviewNotePlaceholder = computed(() =>
  ui('AML manual review note placeholder'),
);

const canSubmit = computed(() => riskLevel.value != null);

const showSafeWaasHint = computed(
  () =>
    Boolean(props.showSafeWaasHintWhenSelectingSafe) &&
    props.initialRiskLevel === 'danger' &&
    riskLevel.value === 'safe',
);

watch(
  () => props.initialRiskLevel,
  (level) => {
    riskLevel.value = level ?? null;
    safeWaasHintAcknowledged.value = false;
  },
);

watch(riskLevel, (level) => {
  if (level !== 'safe') {
    safeWaasHintAcknowledged.value = false;
  }
});

function selectLevel(level: 'danger' | 'safe') {
  if (riskLevel.value === level) {
    riskLevel.value = null;
    return;
  }
  riskLevel.value = level;
}

function onSubmit() {
  if (!canSubmit.value || riskLevel.value == null) return;
  emit('submit', riskLevel.value);
}
</script>

<template>
  <div
    :class="[styles.panelRoot, props.variant === 'popover' && styles.panelRootPopover]"
    :data-aml-manual-review-popover-form="props.variant === 'popover' ? '' : undefined"
  >
    <div :class="[styles.fieldBlock, styles.fieldBlockLevel]">
      <span :class="['typography-body-small', styles.fieldLabel]">
        {{ ui('AML manual review level label') }}
      </span>
      <div
        role="radiogroup"
        :aria-label="ui('AML manual review level label')"
        :class="styles.levelRuleGroup"
      >
        <ProjectCreateModeCard
          radio-name="aml-manual-review-risk-level"
          radio-value="danger"
          surface="grouped"
          grouped-row-spacing="compact"
          grouped-row-rounded
          :title="ui('Danger')"
          :description="''"
          :selected="riskLevel === 'danger'"
          @select="selectLevel('danger')"
        />
        <ProjectCreateModeCard
          radio-name="aml-manual-review-risk-level"
          radio-value="safe"
          surface="grouped"
          grouped-row-spacing="compact"
          grouped-row-rounded
          :title="ui('Safe')"
          :description="''"
          :selected="riskLevel === 'safe'"
          @select="selectLevel('safe')"
        />
      </div>
      <EgFormSubmission
        v-if="showSafeWaasHint"
        v-model="safeWaasHintAcknowledged"
        :show-link="false"
        :text="ui('AML manual review safe waas unblock hint')"
      />
    </div>

    <EgRemarkPopoverPanel
      v-model="remark"
      :hide-label="false"
      hide-confirm
      :max-length="REMARK_MAX"
      :label="ui('AML manual review note label')"
      :placeholder="manualReviewNotePlaceholder"
      :paste-label="ui('Paste')"
      :clear-label="ui('Clear')"
      :feedback-text="ui('AML manual review note feedback')"
      :confirm-label="ui('Confirm')"
      :reset-on-mount="true"
      :autofocus="false"
    />

    <EgButton
      :class="styles.confirm"
      tone="decor"
      variant="solid"
      size="md"
      :disabled="!canSubmit"
      @click="onSubmit"
    >
      {{ ui('Confirm') }}
    </EgButton>
  </div>
</template>
