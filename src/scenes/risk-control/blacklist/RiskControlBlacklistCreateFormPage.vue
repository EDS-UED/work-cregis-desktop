<script setup lang="ts">
import { computed } from 'vue';
import { EgFormSubmission, EgInput } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import RiskControlAmlManualQueryNetworkField from '@/scenes/risk-control/aml-manual-query/RiskControlAmlManualQueryNetworkField.vue';
import type { RiskControlBlacklistCreateDraft } from './riskControlBlacklistCreateTypes';
import styles from './RiskControlBlacklistCreateFormPage.module.css';

const props = defineProps<{
  draft: RiskControlBlacklistCreateDraft;
}>();

const emit = defineEmits<{
  'update:draft': [value: RiskControlBlacklistCreateDraft];
  submit: [];
}>();

const { ui } = useAppI18n();

const fromAmlQueryRecord = computed(
  () =>
    props.draft.prefilledFromAmlQueryRecord === true
    || Boolean(props.draft.amlQueryRecordId?.trim()),
);

const introKey = computed(() =>
  fromAmlQueryRecord.value
    ? 'Risk control blacklist create intro from aml'
    : 'Risk control blacklist create intro',
);

const canSubmit = computed(() => props.draft.address.trim().length > 0);

const contentRevision = computed(() =>
  [
    props.draft.address,
    props.draft.networkLabel,
    props.draft.amlQueryRecordId ?? '',
    String(props.draft.prefilledFromAmlQueryRecord ?? false),
  ].join(':'),
);

function patchDraft(partial: Partial<RiskControlBlacklistCreateDraft>) {
  emit('update:draft', { ...props.draft, ...partial });
}

function submitForm() {
  if (!canSubmit.value) return;
  emit('submit');
}

defineExpose({
  canSubmit,
  contentRevision,
  submitForm,
});
</script>

<template>
  <div class="desktopTokens" :class="styles.formStack">
    <p :class="['typography-body-small', styles.intro]">
      {{ ui(introKey) }}
    </p>

    <div v-if="fromAmlQueryRecord" :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('AML Query Records') }}</span>
      <EgInput
        :model-value="draft.amlQueryRecordId ?? ''"
        width-mode="full"
        :readonly="true"
        :overflow-feedback="false"
      />
    </div>

    <div :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('Address') }}</span>
      <EgInput
        :model-value="draft.address"
        width-mode="full"
        :placeholder="ui('Please Enter')"
        @update:model-value="(value) => patchDraft({ address: value })"
      />
      <EgFormSubmission
        v-if="fromAmlQueryRecord"
        type="notes"
        :show-link="false"
        :text="ui('Risk control blacklist auto fill address hint')"
      />
    </div>

    <div :class="styles.fieldBlock">
      <span :class="styles.fieldLabel">{{ ui('Query Network') }}</span>
      <RiskControlAmlManualQueryNetworkField
        :model-value="draft.networkLabel"
        @update:model-value="(value) => patchDraft({ networkLabel: value })"
      />
    </div>
  </div>
</template>
