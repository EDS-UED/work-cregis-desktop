<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  EgButton,
  EgComboPageButton,
  EgFormSubmission,
  EgIcon,
  EgInput,
  EgTextarea,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import LayoutChromeConfigFormPageChrome from '@/scenes/project/LayoutChromeConfigFormPageChrome.vue';
import ProjectCreateModeCard from '@/scenes/project/components/ProjectCreateModeCard.vue';
import type { WebhookConfigRecord } from './webhookMockData';
import { resolveWebhookEndpointVerifyMock } from './webhookEndpointVerifyMock';
import {
  WEBHOOK_ENDPOINT_VERIFY_MOCK_DELAY_MS,
  type WebhookEndpointVerifyButtonOutcome,
} from './webhookEndpointVerifyFlow';
import {
  endpointUrlHasInvalidCharacters,
  endpointUrlHttpsValid,
  endpointUrlIsValid,
  webhookNameHasInvalidCharacters,
  webhookNameAllowsEditSave,
  webhookNameIsValid,
  webhookNameLengthValid,
} from './webhookFormValidation';
import {
  webhookCreateFormQaNonce,
  webhookCreateFormQaPatch,
} from '@/dev/shell-debug/scenarios/qa/webhookConfig/webhookCreateFormQa';
import styles from './WebhookCreateEditPage.module.css';

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit';
    initial?: WebhookConfigRecord | null;
    /** motion-page 内联 LayoutChromePageStack 时 true。 */
    embeddedInPageStack?: boolean;
  }>(),
  {
    embeddedInPageStack: false,
  },
);

const emit = defineEmits<{
  cancel: [];
  submit: [draft: WebhookConfigRecord];
}>();

const { ui } = useAppI18n();

const optionCardGroupedSurface = {
  surface: 'grouped' as const,
  groupedRowSpacing: 'compact' as const,
  groupedRowRounded: true,
};

const name = ref('');
const nameBlurred = ref(false);
const nameFocused = ref(false);
const eventSelected = ref(false);
const endpointUrl = ref('');
const endpointBlurred = ref(false);
const endpointFocused = ref(false);
const endpointVerifiedForSubmit = ref(false);
const endpointVerifyButtonOutcome = ref<WebhookEndpointVerifyButtonOutcome>(null);
const verifyLoading = ref(false);
let verifyTimer: ReturnType<typeof setTimeout> | null = null;

function clearEndpointVerifyFlow() {
  endpointVerifiedForSubmit.value = false;
  endpointVerifyButtonOutcome.value = null;
}

function initialEndpointUrlTrimmed(): string {
  return props.initial?.endpointUrl?.trim() ?? '';
}

function syncEndpointVerifyStateForCurrentUrl() {
  const trimmed = endpointUrl.value.trim();
  if (
    props.mode === 'edit'
    && props.initial?.endpointVerified
    && trimmed === initialEndpointUrlTrimmed()
  ) {
    endpointVerifiedForSubmit.value = true;
    endpointVerifyButtonOutcome.value = { kind: 'success' };
    return;
  }
  clearEndpointVerifyFlow();
}

watch(
  () => props.initial,
  (value, previous) => {
    if (value === previous) return;
    name.value = value?.name ?? '';
    endpointUrl.value = value?.endpointUrl ?? '';
    nameBlurred.value = false;
    nameFocused.value = false;
    eventSelected.value = false;
    endpointBlurred.value = false;
    endpointFocused.value = false;
    endpointVerifyButtonOutcome.value = null;
    if (props.mode === 'edit' && value?.endpointVerified) {
      eventSelected.value = true;
      syncEndpointVerifyStateForCurrentUrl();
    } else {
      endpointVerifiedForSubmit.value = false;
    }
    verifyLoading.value = false;
    if (verifyTimer) {
      clearTimeout(verifyTimer);
      verifyTimer = null;
    }
  },
  { immediate: true },
);

function resetWebhookCreateFormForQa() {
  if (verifyTimer) {
    clearTimeout(verifyTimer);
    verifyTimer = null;
  }
  verifyLoading.value = false;
  name.value = '';
  nameBlurred.value = false;
  nameFocused.value = false;
  eventSelected.value = false;
  endpointUrl.value = '';
  endpointBlurred.value = false;
  endpointFocused.value = false;
  endpointVerifiedForSubmit.value = false;
  endpointVerifyButtonOutcome.value = null;
}

watch(webhookCreateFormQaNonce, () => {
  const patch = webhookCreateFormQaPatch.value;
  if (!patch) return;

  resetWebhookCreateFormForQa();

  if (patch.name !== undefined) name.value = patch.name;
  if (patch.endpointUrl !== undefined) endpointUrl.value = patch.endpointUrl;
  if (patch.eventSelected !== undefined) eventSelected.value = patch.eventSelected;
  if (patch.nameBlurred !== undefined) nameBlurred.value = patch.nameBlurred;
  if (patch.endpointBlurred !== undefined) endpointBlurred.value = patch.endpointBlurred;
  if (patch.endpointVerifiedForSubmit !== undefined) {
    endpointVerifiedForSubmit.value = patch.endpointVerifiedForSubmit;
  }
  if (patch.endpointVerifyButtonOutcome !== undefined) {
    endpointVerifyButtonOutcome.value = patch.endpointVerifyButtonOutcome;
  }
});

watch(endpointUrl, () => {
  if (verifyTimer) {
    clearTimeout(verifyTimer);
    verifyTimer = null;
  }
  verifyLoading.value = false;
  syncEndpointVerifyStateForCurrentUrl();
});

const nameShowValidation = computed(() => nameBlurred.value && !nameFocused.value);

const endpointShowValidation = computed(
  () => endpointBlurred.value && !endpointFocused.value,
);

const nameSubmissionType = computed(() => {
  if (!nameShowValidation.value) return 'notes' as const;
  if (webhookNameHasInvalidCharacters(name.value)) return 'danger' as const;
  if (!webhookNameLengthValid(name.value)) return 'danger' as const;
  return 'notes' as const;
});

const nameSubmissionText = computed(() => {
  if (nameShowValidation.value && webhookNameHasInvalidCharacters(name.value)) {
    return ui('Please enter a valid Webhook name');
  }
  return ui('Webhook name length hint');
});

const endpointSubmissionType = computed(() => {
  if (!endpointShowValidation.value) return 'notes' as const;
  const trimmed = endpointUrl.value.trim();
  if (!trimmed) return 'notes' as const;
  if (endpointUrlHasInvalidCharacters(trimmed) || !endpointUrlHttpsValid(trimmed)) {
    return 'danger' as const;
  }
  return 'notes' as const;
});

const endpointHint = computed(() => {
  if (endpointShowValidation.value) {
    const trimmed = endpointUrl.value.trim();
    if (
      trimmed
      && (endpointUrlHasInvalidCharacters(trimmed) || !endpointUrlHttpsValid(trimmed))
    ) {
      return ui('URL format error');
    }
  }
  return ui('HTTPS endpoint hint');
});

const isEditFormDirty = computed(() => {
  if (props.mode !== 'edit' || !props.initial) return true;
  const initial = props.initial;
  return (
    name.value.trim() !== initial.name.trim()
    || endpointUrl.value.trim() !== initial.endpointUrl.trim()
  );
});

const canSubmit = computed(() => {
  const nameReady =
    props.mode === 'edit'
      ? webhookNameAllowsEditSave(name.value)
      : webhookNameIsValid(name.value);
  const formValid =
    eventSelected.value
    && nameReady
    && endpointUrlIsValid(endpointUrl.value)
    && endpointVerifiedForSubmit.value;
  if (props.mode === 'edit') {
    return formValid && isEditFormDirty.value;
  }
  return formValid;
});

const verifySubtitle = computed(() => ui('Verify endpoint to complete creation'));

const showVerifySubtitleHint = computed(
  () => !verifyLoading.value && endpointVerifyButtonOutcome.value === null,
);

const verifyFeedbackSubmission = computed(() => {
  if (verifyLoading.value) return null;
  const outcome = endpointVerifyButtonOutcome.value;
  if (!outcome || outcome.kind !== 'failed') return null;
  return {
    type: 'danger' as const,
    text: ui(outcome.errorKey),
  };
});

const verifyButtonIconName = computed(() => {
  if (verifyLoading.value) return 'eds-load';
  if (endpointVerifyButtonOutcome.value?.kind === 'success') return 'eds-enable-fill';
  return 'eds-website';
});

const verifyButtonLabel = computed(() => {
  if (endpointVerifyButtonOutcome.value?.kind === 'success') {
    return ui('Verification passed');
  }
  if (endpointVerifyButtonOutcome.value?.kind === 'failed') {
    return ui('Endpoint verification');
  }
  return ui('Start verification');
});

const verifyButtonDisabled = computed(
  () => verifyLoading.value || endpointVerifyButtonOutcome.value?.kind === 'success',
);

const verifyButtonSuccess = computed(
  () => endpointVerifyButtonOutcome.value?.kind === 'success',
);

const confirmLabel = computed(() =>
  ui(props.mode === 'create' ? 'Create' : 'Save'),
);

const toolbarTitle = computed(() =>
  ui(props.mode === 'create' ? 'Create Webhook' : 'Edit Webhook'),
);

function onNameFocus() {
  nameFocused.value = true;
}

function onNameBlur() {
  nameFocused.value = false;
  nameBlurred.value = true;
}

function onEndpointFocus() {
  endpointFocused.value = true;
}

function onEndpointBlur() {
  endpointFocused.value = false;
  endpointBlurred.value = true;
}

function onEventSelect() {
  eventSelected.value = !eventSelected.value;
}

function onVerifyEndpoint() {
  if (verifyLoading.value || endpointVerifyButtonOutcome.value?.kind === 'success') return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  endpointBlurred.value = true;
  endpointFocused.value = false;

  if (verifyTimer) {
    clearTimeout(verifyTimer);
    verifyTimer = null;
  }

  endpointVerifyButtonOutcome.value = null;
  endpointVerifiedForSubmit.value = false;
  verifyLoading.value = true;

  verifyTimer = setTimeout(() => {
    verifyTimer = null;
    verifyLoading.value = false;

    const result = resolveWebhookEndpointVerifyMock(endpointUrl.value);
    if (result.ok) {
      endpointVerifyButtonOutcome.value = { kind: 'success' };
      endpointVerifiedForSubmit.value = endpointUrlIsValid(endpointUrl.value);
      return;
    }
    endpointVerifiedForSubmit.value = false;
    endpointVerifyButtonOutcome.value = {
      kind: 'failed',
      errorKey: result.errorKey,
    };
  }, WEBHOOK_ENDPOINT_VERIFY_MOCK_DELAY_MS);
}

onBeforeUnmount(() => {
  if (verifyTimer) {
    clearTimeout(verifyTimer);
    verifyTimer = null;
  }
});

function buildDraft(): WebhookConfigRecord {
  const base = props.initial;
  return {
    id: base?.id ?? `WH-${String(Date.now()).slice(-5)}`,
    name: name.value.trim(),
    eventKey: 'Dangerous transaction',
    creatorName: base?.creatorName ?? 'Alex Chen',
    creatorEmail: base?.creatorEmail ?? 'alex.chen@cregis.com',
    createdAt: base?.createdAt ?? new Date().toISOString().replace('T', ' ').slice(0, 19),
    enabled: base?.enabled ?? true,
    endpointUrl: endpointUrl.value.trim(),
    endpointVerified: endpointVerifiedForSubmit.value,
    secretKey: base?.secretKey ?? `whsec_${Math.random().toString(36).slice(2, 18)}`,
  };
}

function onSubmit() {
  nameBlurred.value = true;
  endpointBlurred.value = true;
  if (!canSubmit.value) return;
  if (!webhookNameIsValid(name.value)) return;
  emit('submit', buildDraft());
}
</script>

<template>
  <LayoutChromeConfigFormPageChrome
    v-if="props.embeddedInPageStack"
    :title="toolbarTitle"
    :confirm-label="confirmLabel"
    :can-submit="canSubmit"
    @back="emit('cancel')"
    @cancel="emit('cancel')"
    @confirm="onSubmit"
  >
    <div :class="styles.formStack">
          <div :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Webhook Name') }}</span>
            <EgInput
              v-model="name"
              width-mode="full"
              :placeholder="ui('Please Enter')"
              @focus="onNameFocus"
              @blur="onNameBlur"
            />
            <EgFormSubmission
              :type="nameSubmissionType"
              :show-link="false"
              :text="nameSubmissionText"
            />
          </div>

          <section :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Event') }}</span>
            <div :class="[styles.fieldBlockContent, styles.fieldBlockContentOptionCards]">
              <div :class="styles.optionCardGroup">
                <ProjectCreateModeCard
                  v-bind="optionCardGroupedSurface"
                  selection-control="checkbox"
                  :title="ui('Dangerous transaction')"
                  :description="ui('Dangerous transaction webhook description')"
                  :selected="eventSelected"
                  @select="onEventSelect"
                />
              </div>
            </div>
          </section>

          <div :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Endpoint URL') }}</span>
            <EgTextarea
              v-model="endpointUrl"
              width-mode="full"
              :placeholder="ui('Endpoint URL placeholder')"
              :paste-label="ui('Paste')"
              :clear-label="ui('Clear')"
              @focus="onEndpointFocus"
              @blur="onEndpointBlur"
            />
            <EgFormSubmission
              :type="endpointSubmissionType"
              :show-link="false"
              :text="endpointHint"
            />
          </div>

          <section :class="[styles.fieldBlock, styles.verifyFieldBlock]">
            <span :class="styles.fieldLabel">{{ ui('Endpoint verification') }}</span>
            <div :class="styles.verifyActionStack">
              <div
                :class="[
                  styles.verifyButtonHost,
                  verifyButtonSuccess && styles.verifyButtonHostSuccess,
                ]"
              >
                <EgButton
                  tone="subtle"
                  variant="outline"
                  size="lg"
                  :disabled="verifyButtonDisabled"
                  @click="onVerifyEndpoint"
                >
                  <template #icon>
                    <EgIcon
                      :name="verifyButtonIconName"
                      fit
                      size="md"
                      :class="[
                        verifyButtonIconName === 'eds-website' && styles.verifyButtonIconWebsite,
                        verifyLoading && styles.verifyButtonIconLoading,
                      ]"
                    />
                  </template>
                  {{ verifyButtonLabel }}
                </EgButton>
              </div>
              <EgFormSubmission
                v-if="showVerifySubtitleHint"
                type="notes"
                :show-link="false"
                :text="verifySubtitle"
              />
              <Transition name="verifyFeedback">
                <EgFormSubmission
                  v-if="verifyFeedbackSubmission"
                  :class="styles.verifyFeedback"
                  :type="verifyFeedbackSubmission.type"
                  :show-link="false"
                  :text="verifyFeedbackSubmission.text"
                />
              </Transition>
            </div>
          </section>
    </div>
  </LayoutChromeConfigFormPageChrome>

  <div
    v-else
    class="desktopTokens"
    :class="styles.page"
  >
    <div :class="styles.pageShell">
      <div :class="styles.formScroll">
        <div :class="styles.formStack">
          <div :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Webhook Name') }}</span>
            <EgInput
              v-model="name"
              width-mode="full"
              :placeholder="ui('Please Enter')"
              @focus="onNameFocus"
              @blur="onNameBlur"
            />
            <EgFormSubmission
              :type="nameSubmissionType"
              :show-link="false"
              :text="nameSubmissionText"
            />
          </div>

          <section :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Event') }}</span>
            <div :class="[styles.fieldBlockContent, styles.fieldBlockContentOptionCards]">
              <div :class="styles.optionCardGroup">
                <ProjectCreateModeCard
                  v-bind="optionCardGroupedSurface"
                  selection-control="checkbox"
                  :title="ui('Dangerous transaction')"
                  :description="ui('Dangerous transaction webhook description')"
                  :selected="eventSelected"
                  @select="onEventSelect"
                />
              </div>
            </div>
          </section>

          <div :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Endpoint URL') }}</span>
            <EgTextarea
              v-model="endpointUrl"
              width-mode="full"
              :placeholder="ui('Endpoint URL placeholder')"
              :paste-label="ui('Paste')"
              :clear-label="ui('Clear')"
              @focus="onEndpointFocus"
              @blur="onEndpointBlur"
            />
            <EgFormSubmission
              :type="endpointSubmissionType"
              :show-link="false"
              :text="endpointHint"
            />
          </div>

          <section :class="[styles.fieldBlock, styles.verifyFieldBlock]">
            <span :class="styles.fieldLabel">{{ ui('Endpoint verification') }}</span>
            <div :class="styles.verifyActionStack">
              <div
                :class="[
                  styles.verifyButtonHost,
                  verifyButtonSuccess && styles.verifyButtonHostSuccess,
                ]"
              >
                <EgButton
                  tone="subtle"
                  variant="outline"
                  size="lg"
                  :disabled="verifyButtonDisabled"
                  @click="onVerifyEndpoint"
                >
                  <template #icon>
                    <EgIcon
                      :name="verifyButtonIconName"
                      fit
                      size="md"
                      :class="[
                        verifyButtonIconName === 'eds-website' && styles.verifyButtonIconWebsite,
                        verifyLoading && styles.verifyButtonIconLoading,
                      ]"
                    />
                  </template>
                  {{ verifyButtonLabel }}
                </EgButton>
              </div>
              <EgFormSubmission
                v-if="showVerifySubtitleHint"
                type="notes"
                :show-link="false"
                :text="verifySubtitle"
              />
              <Transition name="verifyFeedback">
                <EgFormSubmission
                  v-if="verifyFeedbackSubmission"
                  :class="styles.verifyFeedback"
                  :type="verifyFeedbackSubmission.type"
                  :show-link="false"
                  :text="verifyFeedbackSubmission.text"
                />
              </Transition>
            </div>
          </section>
        </div>
      </div>

      <div :class="styles.pageFooter">
        <EgComboPageButton
          tone="decor"
          direction="left"
          divider
          :confirm-disabled="!canSubmit"
          :confirm-label="confirmLabel"
          :cancel-label="ui('Cancel')"
          @confirm="onSubmit"
          @cancel="emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>
