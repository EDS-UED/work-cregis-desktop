<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgButton, EgTextarea } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  CUSTOMER_SERVICE_FEEDBACK_DETAIL_PLACEHOLDER_KEY,
  CUSTOMER_SERVICE_FEEDBACK_OPTION_KEYS,
  CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY,
  CUSTOMER_SERVICE_FEEDBACK_TITLE_KEY,
} from './customerService.constants';
import styles from './CustomerServiceFeedbackSheet.module.css';

const open = defineModel<boolean>('open', { default: false });

const { ui } = useAppI18n();

const selectedOptionKey = ref<string | null>(null);
const detailText = ref('');

const showDetailField = computed(
  () => selectedOptionKey.value === CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY,
);

const canSubmit = computed(() => {
  if (!selectedOptionKey.value) return false;
  if (selectedOptionKey.value === CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY) {
    return detailText.value.trim().length > 0;
  }
  return true;
});

function resetForm() {
  selectedOptionKey.value = null;
  detailText.value = '';
}

function onCancel() {
  open.value = false;
}

function onSubmit() {
  if (!selectedOptionKey.value || !canSubmit.value) return;
  open.value = false;
}

watch(open, (isOpen) => {
  if (!isOpen) resetForm();
});
</script>

<template>
  <div
    v-if="open"
    :class="styles.overlay"
    role="presentation"
    @click.self="onCancel"
  >
    <div
      :class="styles.sheet"
      role="dialog"
      :aria-label="ui(CUSTOMER_SERVICE_FEEDBACK_TITLE_KEY)"
      @click.stop
    >
      <h3 :class="styles.title">{{ ui(CUSTOMER_SERVICE_FEEDBACK_TITLE_KEY) }}</h3>

      <div :class="styles.chipRow">
        <EgButton
          v-for="key in CUSTOMER_SERVICE_FEEDBACK_OPTION_KEYS"
          :key="key"
          variant="outline"
          tone="subtle"
          size="sm"
          :active="selectedOptionKey === key"
          @click="selectedOptionKey = key"
        >
          {{ ui(key) }}
        </EgButton>
      </div>

      <EgTextarea
        v-if="showDetailField"
        v-model="detailText"
        :class="styles.textarea"
        width-mode="full"
        :placeholder="ui(CUSTOMER_SERVICE_FEEDBACK_DETAIL_PLACEHOLDER_KEY)"
        :paste-label="ui('Paste')"
        :clear-label="ui('Clear')"
      />

      <div :class="styles.actions">
        <EgButton variant="outline" tone="subtle" size="md" @click="onCancel">
          {{ ui('Cancel') }}
        </EgButton>
        <EgButton
          variant="solid"
          tone="decor"
          size="md"
          :disabled="!canSubmit"
          @click="onSubmit"
        >
          {{ ui('Submit') }}
        </EgButton>
      </div>
    </div>
  </div>
</template>
