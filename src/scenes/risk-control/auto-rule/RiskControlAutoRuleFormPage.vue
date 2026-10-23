<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgButton,
  EgFormSubmission,
  EgIcon,
  EgInput,
} from '@eds/desktop-components';
import feedbackStyles from '@eds/desktop-components/molecules/feedback/Feedback.module.css';
import { useAppI18n } from '@/composables/useAppI18n';
import ProjectCreateModeCard from '@/scenes/project/components/ProjectCreateModeCard.vue';
import type { RiskControlAutoRuleFormDraft, RiskControlAutoRuleFormMode } from './useRiskControlAutoRuleFlow';
import {
  autoRuleNameHasInvalidCharacters,
  autoRuleNameIsValid,
  autoRuleNameLengthValid,
  validateAutoRuleRiskScoreThreshold,
} from './riskControlAutoRuleFormValidation';
import RiskControlAutoRuleSkipCheckRows from './RiskControlAutoRuleSkipCheckRows.vue';
import RiskControlAutoRuleOutflowCurrencyField from './RiskControlAutoRuleOutflowCurrencyField.vue';
import RiskControlAutoRuleOutflowWalletPicker from './RiskControlAutoRuleOutflowWalletPicker.vue';
import RiskControlAutoRuleRecipientPicker from './RiskControlAutoRuleRecipientPicker.vue';
import {
  INFLOW_TRIGGER_TYPE_OPTIONS,
  isInflowTriggerTypeKey,
} from './riskControlAutoRuleInflowTriggerOptions';
import {
  OUTFLOW_WAAS_PROJECT_OPTIONS,
  outflowWalletLabelForId,
} from './riskControlAutoRuleOutflowScopeOptions';
import ellipticProviderLogoUrl from '@/assets/risk-control/elliptic-provider-logo.svg';
import styles from './RiskControlAutoRuleFormPage.module.css';

const WITHDRAWAL_TYPE_MANUAL = 'Manual Transfer';
const WITHDRAWAL_TYPE_API = 'API Payout';
const SERVICE_PROVIDER_ELLIPTIC = 'Elliptic';
const AUTO_RULE_ELLIPTIC_UNIT_FEE_DISPLAY = '$0.5';
const RISK_CONTROL_ACTION_ALARM = 'Alarm the reviewer(s)/signer(s)';
const RISK_CONTROL_ACTION_REJECT = 'Reject the withdrawal request';
const EXCEPTION_HANDLING_SKIP_QUERY = 'Skip the query';
const EXCEPTION_HANDLING_NOTIFY_DESIGNATED =
  'Notify designated personnel to handle';
const RISK_ALERT_IN_APP = 'In-app notification';
const RISK_ALERT_EMAIL = 'Email notification';
const SCOPE_PICKER_MENU_MAX_HEIGHT = 310;

const props = defineProps<{
  mode: RiskControlAutoRuleFormMode;
  draft: RiskControlAutoRuleFormDraft;
  nameExists: (name: string, excludeId?: string) => boolean;
  scopeTaken: (scopeLabel: string, withdrawalTypeKey: string, excludeId?: string) => boolean;
  requestSkipDisableConfirm: (field: 'skipWhitelist' | 'skipInternal') => void;
  excludeRuleId?: string;
}>();

const emit = defineEmits<{
  'update:draft': [value: RiskControlAutoRuleFormDraft];
  submit: [];
}>();

const { ui } = useAppI18n();

const ruleNameBlurred = ref(false);
const ruleNameFocused = ref(false);
const riskScoreBlurred = ref(false);
const localDraft = computed({
  get: () => props.draft,
  set: (value) => emit('update:draft', value),
});

watch(
  () => props.draft.direction,
  () => {
    ruleNameBlurred.value = false;
    riskScoreBlurred.value = false;
  },
);

watch(
  () => localDraft.value.direction,
  (direction, previousDirection) => {
    if (direction !== 'inflow') return;
    if (localDraft.value.withdrawalTypeKey) return;
    if (INFLOW_TRIGGER_TYPE_OPTIONS.length !== 1) return;
    if (previousDirection === 'inflow') return;
    patchDraft({ withdrawalTypeKey: INFLOW_TRIGGER_TYPE_OPTIONS[0].titleKey });
  },
  { immediate: true },
);

const isOutflow = computed(() => localDraft.value.direction === 'outflow');

const riskAlertRecipientsHintKey = computed(() =>
  isOutflow.value
    ? 'Auto rule risk alert recipients hint'
    : 'Auto rule risk alert recipients inflow hint',
);

const autoRuleFormFootnoteKey = computed(() =>
  isOutflow.value ? 'AML query caution coverage limit' : 'Auto rule form footnote inflow',
);

function riskAlertRecipientsValid(draft: RiskControlAutoRuleFormDraft): boolean {
  if (draft.riskAlertRecipientKeys.length === 0) return false;
  if (
    draft.riskAlertRecipientKeys.includes(RISK_ALERT_IN_APP)
    && draft.riskAlertInAppRecipientIds.length === 0
  ) {
    return false;
  }
  if (
    draft.riskAlertRecipientKeys.includes(RISK_ALERT_EMAIL)
    && draft.riskAlertEmailTeamMemberIds.length === 0
  ) {
    return false;
  }
  return true;
}

const triggerRuleGroupActive = computed(
  () => Boolean(localDraft.value.withdrawalTypeKey),
);

const isInflowTriggerSelected = computed(
  () => !isOutflow.value && isInflowTriggerTypeKey(localDraft.value.withdrawalTypeKey),
);

const isManualOutflowSelected = computed(
  () => localDraft.value.withdrawalTypeKey === WITHDRAWAL_TYPE_MANUAL,
);

const isApiOutflowSelected = computed(
  () => localDraft.value.withdrawalTypeKey === WITHDRAWAL_TYPE_API,
);

const outflowCurrencyScopeSelected = computed(() => {
  if (!isOutflow.value) {
    return Boolean(localDraft.value.scopeTarget.trim());
  }
  if (isManualOutflowSelected.value) {
    return localDraft.value.scopeWalletIds.length > 0;
  }
  if (isApiOutflowSelected.value) {
    return Boolean(localDraft.value.scopeTarget.trim());
  }
  return false;
});

const triggerCurrencyScopeToastKey = computed(() => {
  if (!isOutflow.value || isApiOutflowSelected.value) {
    return 'Auto rule select waas project before currency';
  }
  return 'Auto rule select wallet before currency';
});

const scopeWaasTriggerLabel = computed(() => {
  const trimmed = localDraft.value.scopeTarget.trim();
  if (!trimmed) return '';
  const matched = OUTFLOW_WAAS_PROJECT_OPTIONS.find(
    (option) => option.label === trimmed || option.id === trimmed,
  );
  return matched?.label ?? trimmed;
});

const ruleNameShowValidation = computed(
  () => ruleNameBlurred.value && !ruleNameFocused.value,
);

const ruleNameDuplicateActive = computed(() => {
  if (!ruleNameShowValidation.value) return false;
  const trimmed = localDraft.value.ruleName.trim();
  return trimmed.length >= 2 && props.nameExists(trimmed, props.excludeRuleId);
});

const ruleNameSubmissionType = computed(() => {
  if (!ruleNameShowValidation.value) return 'notes' as const;
  const name = localDraft.value.ruleName;
  if (autoRuleNameHasInvalidCharacters(name)) return 'danger' as const;
  if (ruleNameDuplicateActive.value) return 'danger' as const;
  if (!autoRuleNameLengthValid(name)) return 'danger' as const;
  return 'notes' as const;
});

const ruleNameSubmissionText = computed(() => {
  const name = localDraft.value.ruleName;
  if (ruleNameShowValidation.value && autoRuleNameHasInvalidCharacters(name)) {
    return ui('Please enter a valid rule name');
  }
  if (ruleNameDuplicateActive.value) {
    return ui('Auto rule name already exists');
  }
  return ui('Auto rule name length hint');
});

const riskScoreErrorKey = computed(() => {
  if (!riskScoreBlurred.value) return '';
  if (!validateAutoRuleRiskScoreThreshold(localDraft.value.riskScoreThreshold)) {
    return 'Auto rule risk score invalid';
  }
  return '';
});

const riskScoreThresholdHintValue = computed(
  () => localDraft.value.riskScoreThreshold.trim(),
);

const confirmLabel = computed(() =>
  ui(props.mode === 'create' ? 'Create' : 'Save'),
);

const canSubmit = computed(() => {
  if (!autoRuleNameIsValid(localDraft.value.ruleName)) return false;
  if (props.nameExists(localDraft.value.ruleName.trim(), props.excludeRuleId)) return false;
  if (!validateAutoRuleRiskScoreThreshold(localDraft.value.riskScoreThreshold)) return false;
  if (!localDraft.value.serviceProvider.trim()) return false;
  if (isOutflow.value) {
    if (!localDraft.value.withdrawalTypeKey) return false;
    if (localDraft.value.withdrawalTypeKey === WITHDRAWAL_TYPE_MANUAL) {
      const ids = localDraft.value.scopeWalletIds;
      if (!ids.length) return false;
      for (const id of ids) {
        const label = outflowWalletLabelForId(id);
        if (props.scopeTaken(label, WITHDRAWAL_TYPE_MANUAL, props.excludeRuleId)) {
          return false;
        }
      }
    } else {
      const scope = localDraft.value.scopeTarget.trim();
      if (!scope) return false;
      if (
        props.scopeTaken(scope, localDraft.value.withdrawalTypeKey, props.excludeRuleId)
      ) {
        return false;
      }
    }
    if (!localDraft.value.riskControlActionKey.trim()) return false;
    if (!localDraft.value.exceptionHandlingKey.trim()) return false;
    if (
      localDraft.value.exceptionHandlingKey === EXCEPTION_HANDLING_NOTIFY_DESIGNATED
      && localDraft.value.exceptionHandlerMemberIds.length === 0
    ) {
      return false;
    }
  } else {
    if (!isInflowTriggerTypeKey(localDraft.value.withdrawalTypeKey)) return false;
    const scope = localDraft.value.scopeTarget.trim();
    if (!scope) return false;
    if (props.scopeTaken(scope, '', props.excludeRuleId)) {
      return false;
    }
  }
  if (!riskAlertRecipientsValid(localDraft.value)) return false;
  return true;
});

function isScopeOptionDisabled(label: string, withdrawalTypeKey: string) {
  return props.scopeTaken(label, withdrawalTypeKey, props.excludeRuleId);
}

function selectOutflowScope(
  label: string,
  withdrawalTypeKey: string,
  close: () => void,
) {
  if (isScopeOptionDisabled(label, withdrawalTypeKey)) return;
  patchDraft({ scopeTarget: label });
  close();
}

function selectInflowScope(label: string, close: () => void) {
  if (isScopeOptionDisabled(label, '')) return;
  patchDraft({ scopeTarget: label, waasProject: label });
  close();
}

function onServiceProviderSelect() {
  if (localDraft.value.serviceProvider === SERVICE_PROVIDER_ELLIPTIC) {
    patchDraft({ serviceProvider: '' });
    return;
  }
  patchDraft({ serviceProvider: SERVICE_PROVIDER_ELLIPTIC });
}

function toggleDraftSingleChoice(
  field: 'riskControlActionKey' | 'exceptionHandlingKey',
  value: string,
) {
  patchDraft({
    [field]: localDraft.value[field] === value ? '' : value,
  });
}

function toggleRiskAlertRecipientKey(key: string) {
  const current = localDraft.value.riskAlertRecipientKeys;
  if (current.includes(key)) {
    const nextKeys = current.filter((entry) => entry !== key);
    if (key === RISK_ALERT_IN_APP) {
      patchDraft({
        riskAlertRecipientKeys: nextKeys,
        riskAlertInAppRecipientIds: [],
      });
      return;
    }
    if (key === RISK_ALERT_EMAIL) {
      patchDraft({
        riskAlertRecipientKeys: nextKeys,
        riskAlertEmailTeamMemberIds: [],
        riskAlertOtherEmails: [],
      });
      return;
    }
    patchDraft({ riskAlertRecipientKeys: nextKeys });
    return;
  }
  patchDraft({ riskAlertRecipientKeys: [...current, key] });
}

function onExceptionHandlingSelect(key: string) {
  if (localDraft.value.exceptionHandlingKey === key) {
    patchDraft({ exceptionHandlingKey: '', exceptionHandlerMemberIds: [] });
    return;
  }
  patchDraft({
    exceptionHandlingKey: key,
    exceptionHandlerMemberIds:
      key === EXCEPTION_HANDLING_NOTIFY_DESIGNATED
        ? localDraft.value.exceptionHandlerMemberIds
        : [],
  });
}

function onExceptionHandlerMembers(ids: string[]) {
  patchDraft({ exceptionHandlerMemberIds: ids });
}

function onWithdrawalTypeSelect(key: string) {
  if (localDraft.value.withdrawalTypeKey === key) {
    patchDraft({
      withdrawalTypeKey: '',
      scopeTarget: '',
      scopeWalletIds: [],
      currencyEntries: [],
    });
    return;
  }
  patchDraft({
    withdrawalTypeKey: key,
    scopeTarget: '',
    scopeWalletIds: [],
    currencyEntries: [],
  });
}

function onInflowTriggerTypeSelect(key: string) {
  if (localDraft.value.withdrawalTypeKey === key) {
    patchDraft({
      withdrawalTypeKey: '',
      scopeTarget: '',
      waasProject: '',
      currencyEntries: [],
    });
    return;
  }
  patchDraft({
    withdrawalTypeKey: key,
    scopeTarget: '',
    waasProject: '',
    currencyEntries: [],
  });
}

function patchDraft(partial: Partial<RiskControlAutoRuleFormDraft>) {
  emit('update:draft', { ...localDraft.value, ...partial });
}

function onRuleNameFocus() {
  ruleNameFocused.value = true;
}

function onRuleNameBlur() {
  ruleNameFocused.value = false;
  ruleNameBlurred.value = true;
}

function onRiskScoreBlur() {
  riskScoreBlurred.value = true;
}

function onSubmitClick() {
  ruleNameBlurred.value = true;
  riskScoreBlurred.value = true;
  if (!canSubmit.value) return;
  emit('submit');
}

function onSkipCheckboxUpdate(field: 'skipWhitelist' | 'skipInternal', next: boolean) {
  if (next) {
    patchDraft({ [field]: true });
    return;
  }
  props.requestSkipDisableConfirm(field);
}

defineExpose({
  canSubmit,
  confirmLabel,
  submitForm: onSubmitClick,
});
</script>

<template>
  <div class="desktopTokens" :class="styles.formStack">
          <div :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Rule Name') }}</span>
            <EgInput
              :model-value="localDraft.ruleName"
              width-mode="full"
              :placeholder="ui('Please Enter')"
              @update:model-value="(value) => patchDraft({ ruleName: value })"
              @focus="onRuleNameFocus"
              @blur="onRuleNameBlur"
            />
            <EgFormSubmission
              :type="ruleNameSubmissionType"
              :show-link="false"
              :text="ruleNameSubmissionText"
            />
          </div>

          <section :class="[styles.fieldBlock, styles.fieldBlockHasHint]">
            <div :class="styles.fieldLabelGroup">
              <span :class="styles.fieldLabel">{{ ui('Auto rule trigger condition') }}</span>
              <p :class="styles.fieldHint">
                {{ ui('Auto rule outflow trigger hint') }}
              </p>
            </div>
            <div :class="styles.fieldBlockContent">
            <div
              :class="[
                styles.outflowRuleGroup,
                triggerRuleGroupActive && styles.outflowRuleGroupActive,
              ]"
            >
              <div v-if="isOutflow">
              <div :class="styles.outflowRuleTypeBlock">
                <span :class="styles.outflowRuleTypeLabel">{{ ui('Withdrawal Type') }}</span>
                <div
                  role="radiogroup"
                  :aria-label="ui('Withdrawal Type')"
                  :class="styles.outflowRuleOptionStack"
                >
                  <ProjectCreateModeCard
                    radio-name="auto-rule-withdrawal-type"
                    radio-value="manual"
                    surface="grouped"
                    grouped-row-spacing="compact"
                    grouped-row-rounded
                    grouped-highlight-selected-row
                    :title="ui('Auto rule manual withdrawal title')"
                    :selected="isManualOutflowSelected"
                    @select="onWithdrawalTypeSelect(WITHDRAWAL_TYPE_MANUAL)"
                  />
                  <ProjectCreateModeCard
                    radio-name="auto-rule-withdrawal-type"
                    radio-value="api"
                    surface="grouped"
                    grouped-row-spacing="compact"
                    grouped-row-rounded
                    grouped-highlight-selected-row
                    :title="ui('API Payout')"
                    :selected="isApiOutflowSelected"
                    @select="onWithdrawalTypeSelect(WITHDRAWAL_TYPE_API)"
                  />
                </div>
              </div>
              <div v-if="isManualOutflowSelected" :class="styles.outflowRuleBody">
                <div :class="styles.cardBodyField">
                  <span :class="styles.cardBodySectionTitle">{{ ui('Wallet') }}</span>
                  <div :class="styles.scopeFlotationHost">
                    <RiskControlAutoRuleOutflowWalletPicker
                      :class="styles.scopeFlotationTrigger"
                      :model-value="localDraft.scopeWalletIds"
                      :is-option-disabled="
                        (label) => isScopeOptionDisabled(label, WITHDRAWAL_TYPE_MANUAL)
                      "
                      @update:model-value="patchDraft({ scopeWalletIds: $event })"
                    />
                  </div>
                </div>
                <div :class="styles.cardBodyField">
                  <span :class="styles.cardBodySectionTitle">{{ ui('Currency') }}</span>
                  <RiskControlAutoRuleOutflowCurrencyField
                    :model-value="localDraft.currencyEntries"
                    :scope-selected="outflowCurrencyScopeSelected"
                    :scope-required-toast-key="triggerCurrencyScopeToastKey"
                    @update:model-value="patchDraft({ currencyEntries: $event })"
                  />
                </div>
                <RiskControlAutoRuleSkipCheckRows
                  :skip-whitelist="localDraft.skipWhitelist"
                  :skip-internal="localDraft.skipInternal"
                  @skip-update="onSkipCheckboxUpdate"
                />
              </div>
              <div v-else-if="isApiOutflowSelected" :class="styles.outflowRuleBody">
                <div :class="styles.cardBodyField">
                  <span :class="styles.cardBodySectionTitle">{{ ui('WaaS Project') }}</span>
                  <EgFlotation
                    :class="styles.scopeFlotationHost"
                    placement="bottom"
                    align="start"
                    width-mode="trigger"
                    :show-add="false"
                    :show-menu-divider="false"
                    close-on-scroll
                  >
                    <template #trigger="{ expanded }">
                      <EgFlotationTrigger
                        :class="styles.scopeFlotationTrigger"
                        trigger-style="subtle"
                        size="md"
                        width-mode="adaptive"
                        :label="scopeWaasTriggerLabel || ui('Please Select')"
                        :expanded="expanded"
                      />
                    </template>
                    <template #content="{ menuWidth, menuWidthMode, close }">
                      <EgFlotationMenu
                        panel-radius="radius-md"
                        :width-mode="menuWidthMode"
                        :width="menuWidth"
                        height-mode="adaptive"
                        :max-height="SCOPE_PICKER_MENU_MAX_HEIGHT"
                        :scrollable="true"
                        :list-scroll="true"
                        :show-add="false"
                        :show-divider="false"
                      >
                        <EgFlotationMenuItem
                          v-for="option in OUTFLOW_WAAS_PROJECT_OPTIONS"
                          :key="option.id"
                          box-type="text"
                          :label="option.label"
                          :show-tag="false"
                          :disabled="isScopeOptionDisabled(option.label, WITHDRAWAL_TYPE_API)"
                          :focused="localDraft.scopeTarget === option.label"
                          @click="selectOutflowScope(option.label, WITHDRAWAL_TYPE_API, close)"
                        />
                      </EgFlotationMenu>
                    </template>
                  </EgFlotation>
                </div>
                <div :class="styles.cardBodyField">
                  <span :class="styles.cardBodySectionTitle">{{ ui('Currency') }}</span>
                  <RiskControlAutoRuleOutflowCurrencyField
                    :model-value="localDraft.currencyEntries"
                    :scope-selected="outflowCurrencyScopeSelected"
                    :scope-required-toast-key="triggerCurrencyScopeToastKey"
                    @update:model-value="patchDraft({ currencyEntries: $event })"
                  />
                </div>
                <RiskControlAutoRuleSkipCheckRows
                  :skip-whitelist="localDraft.skipWhitelist"
                  :skip-internal="localDraft.skipInternal"
                  @skip-update="onSkipCheckboxUpdate"
                />
              </div>
              </div>
              <div v-else>
                <div :class="styles.outflowRuleTypeBlock">
                  <span :class="styles.outflowRuleTypeLabel">{{ ui('Deposit Method') }}</span>
                  <div
                    role="radiogroup"
                    :aria-label="ui('Deposit Method')"
                    :class="styles.outflowRuleOptionStack"
                  >
                    <ProjectCreateModeCard
                      v-for="option in INFLOW_TRIGGER_TYPE_OPTIONS"
                      :key="option.id"
                      radio-name="auto-rule-inflow-trigger-type"
                      :radio-value="option.id"
                      surface="grouped"
                      grouped-row-spacing="compact"
                      grouped-row-rounded
                      grouped-highlight-selected-row
                      :title="ui(option.titleKey)"
                      :selected="localDraft.withdrawalTypeKey === option.titleKey"
                      @select="onInflowTriggerTypeSelect(option.titleKey)"
                    />
                  </div>
                </div>
                <div v-if="isInflowTriggerSelected" :class="styles.outflowRuleBody">
                <div :class="styles.cardBodyField">
                  <span :class="styles.cardBodySectionTitle">{{ ui('WaaS Project') }}</span>
                  <EgFlotation
                    :class="styles.scopeFlotationHost"
                    placement="bottom"
                    align="start"
                    width-mode="trigger"
                    :show-add="false"
                    :show-menu-divider="false"
                    close-on-scroll
                  >
                    <template #trigger="{ expanded }">
                      <EgFlotationTrigger
                        :class="styles.scopeFlotationTrigger"
                        trigger-style="subtle"
                        size="md"
                        width-mode="adaptive"
                        :label="scopeWaasTriggerLabel || ui('Please Select')"
                        :expanded="expanded"
                      />
                    </template>
                    <template #content="{ menuWidth, menuWidthMode, close }">
                      <EgFlotationMenu
                        panel-radius="radius-md"
                        :width-mode="menuWidthMode"
                        :width="menuWidth"
                        height-mode="adaptive"
                        :max-height="SCOPE_PICKER_MENU_MAX_HEIGHT"
                        :scrollable="true"
                        :list-scroll="true"
                        :show-add="false"
                        :show-divider="false"
                      >
                        <EgFlotationMenuItem
                          v-for="option in OUTFLOW_WAAS_PROJECT_OPTIONS"
                          :key="option.id"
                          box-type="text"
                          :label="option.label"
                          :show-tag="false"
                          :disabled="isScopeOptionDisabled(option.label, '')"
                          :focused="localDraft.scopeTarget === option.label"
                          @click="selectInflowScope(option.label, close)"
                        />
                      </EgFlotationMenu>
                    </template>
                  </EgFlotation>
                </div>
                <div :class="styles.cardBodyField">
                  <span :class="styles.cardBodySectionTitle">{{ ui('Currency') }}</span>
                  <RiskControlAutoRuleOutflowCurrencyField
                    :model-value="localDraft.currencyEntries"
                    :scope-selected="outflowCurrencyScopeSelected"
                    :scope-required-toast-key="triggerCurrencyScopeToastKey"
                    @update:model-value="patchDraft({ currencyEntries: $event })"
                  />
                </div>
                <RiskControlAutoRuleSkipCheckRows
                  :skip-whitelist="localDraft.skipWhitelist"
                  :skip-internal="localDraft.skipInternal"
                  @skip-update="onSkipCheckboxUpdate"
                />
                </div>
              </div>
            </div>
            </div>
          </section>

          <section :class="styles.fieldBlock">
            <span :class="styles.fieldLabel">{{ ui('Service Provider') }}</span>
            <ProjectCreateModeCard
              radio-name="auto-rule-service-provider"
              radio-value="elliptic"
              :title="SERVICE_PROVIDER_ELLIPTIC"
              :selected="localDraft.serviceProvider === SERVICE_PROVIDER_ELLIPTIC"
              @select="onServiceProviderSelect"
            >
              <template #description>
                <span :class="styles.serviceProviderFeeLine">
                  <span :class="styles.serviceProviderFeeAmount">
                    {{ AUTO_RULE_ELLIPTIC_UNIT_FEE_DISPLAY }}
                  </span>
                  <span :class="styles.serviceProviderFeeSuffix">
                    {{ ui('Auto rule service provider per query') }}
                  </span>
                </span>
              </template>
              <template #trailing>
                <img
                  :class="styles.serviceProviderLogo"
                  :src="ellipticProviderLogoUrl"
                  alt=""
                  aria-hidden="true"
                />
              </template>
            </ProjectCreateModeCard>
          </section>

          <section
            v-if="isOutflow"
            :class="[styles.fieldBlock, styles.fieldBlockHasHint]"
          >
            <div :class="styles.fieldLabelGroup">
              <span :class="styles.fieldLabel">{{ ui('Screening Node') }}</span>
              <p :class="styles.fieldHintWarning">
                {{ ui('Auto rule screening node timing notice') }}
              </p>
            </div>
          </section>

          <div :class="[styles.fieldBlock, styles.fieldBlockHasHint]">
            <div :class="styles.fieldLabelGroup">
              <span :class="styles.fieldLabel">{{ ui('Risk Rating Criteria') }}</span>
              <p :class="styles.fieldHint">
                {{ ui('Auto rule risk score range hint min lead') }}<span :class="styles.riskScoreRangeHintValueSuccess">0.0</span>{{ ui('Auto rule risk score range hint min tail') }}{{ ui('Auto rule risk score range hint max lead') }}<span :class="styles.riskScoreRangeHintValueDanger">10.0</span>{{ ui('Auto rule risk score range hint max tail') }}
              </p>
            </div>
            <div :class="styles.fieldBlockContent">
              <EgInput
                :model-value="localDraft.riskScoreThreshold"
                width-mode="full"
                :placeholder="ui('Please Enter')"
                @update:model-value="(value) => patchDraft({ riskScoreThreshold: value })"
                @blur="onRiskScoreBlur"
              />
              <div
                v-if="!(riskScoreBlurred && riskScoreErrorKey)"
                class="eds-form-submission"
                :class="feedbackStyles.formSubmission"
              >
                <span :class="feedbackStyles.formIcon">
                  <EgIcon name="eds-information-fill" fit fill-tone="primary" />
                </span>
                <span :class="feedbackStyles.formBody">
                  <span :class="feedbackStyles.formText">
                    {{ ui('Auto rule risk score threshold hint prefix') }}<span :class="styles.riskScoreThresholdHintValue">{{ riskScoreThresholdHintValue }}</span>{{ ui('Auto rule risk score threshold hint suffix') }}
                  </span>
                </span>
              </div>
              <EgFormSubmission
                v-if="riskScoreBlurred && riskScoreErrorKey"
                type="danger"
                :show-link="false"
                :text="ui(riskScoreErrorKey)"
              />
            </div>
          </div>

          <section
            v-if="isOutflow"
            :class="[styles.fieldBlock, styles.fieldBlockHasHint]"
          >
            <div :class="styles.fieldLabelGroup">
              <span :class="styles.fieldLabel">{{ ui('Risk control action') }}</span>
              <p :class="styles.fieldHint">
                {{ ui('Auto rule risk control action hint') }}
              </p>
            </div>
            <div
              :class="[styles.fieldBlockContent, styles.fieldBlockContentOptionCards]"
            >
              <ProjectCreateModeCard
                radio-name="auto-rule-risk-action"
                radio-value="alarm"
                :title="ui('Alarm the reviewer(s)/signer(s)')"
                :description="''"
                :selected="localDraft.riskControlActionKey === RISK_CONTROL_ACTION_ALARM"
                @select="toggleDraftSingleChoice('riskControlActionKey', RISK_CONTROL_ACTION_ALARM)"
              />
              <ProjectCreateModeCard
                radio-name="auto-rule-risk-action"
                radio-value="reject"
                :title="ui('Reject the withdrawal request')"
                :description="''"
                :selected="localDraft.riskControlActionKey === RISK_CONTROL_ACTION_REJECT"
                @select="toggleDraftSingleChoice('riskControlActionKey', RISK_CONTROL_ACTION_REJECT)"
              />
            </div>
          </section>

          <section
            v-if="isOutflow"
            :class="[styles.fieldBlock, styles.fieldBlockHasHint]"
          >
            <div :class="styles.fieldLabelGroup">
              <span :class="styles.fieldLabel">{{ ui('Screening Exception handling') }}</span>
              <p :class="styles.fieldHint">
                {{ ui('Auto rule exception handling hint') }}
              </p>
            </div>
            <div
              :class="[styles.fieldBlockContent, styles.fieldBlockContentOptionCards]"
            >
              <ProjectCreateModeCard
                radio-name="auto-rule-exception"
                radio-value="skip-query"
                :title="ui('Skip the query')"
                :description="''"
                :selected="localDraft.exceptionHandlingKey === EXCEPTION_HANDLING_SKIP_QUERY"
                @select="onExceptionHandlingSelect(EXCEPTION_HANDLING_SKIP_QUERY)"
              />
              <ProjectCreateModeCard
                radio-name="auto-rule-exception"
                radio-value="notify-designated"
                expand-style="embeddedPanel"
                :title="ui('Notify designated personnel to handle')"
                :description="''"
                :selected="
                  localDraft.exceptionHandlingKey === EXCEPTION_HANDLING_NOTIFY_DESIGNATED
                "
                @select="onExceptionHandlingSelect(EXCEPTION_HANDLING_NOTIFY_DESIGNATED)"
              >
                <div :class="styles.cardBodyField">
                  <span :class="styles.cardBodySectionTitle">{{
                    ui('Auto rule exception handler label')
                  }}</span>
                  <RiskControlAutoRuleRecipientPicker
                    :show-title="false"
                    :model-value="localDraft.exceptionHandlerMemberIds"
                    @update:model-value="onExceptionHandlerMembers"
                  />
                </div>
              </ProjectCreateModeCard>
            </div>
          </section>

          <section :class="[styles.fieldBlock, styles.fieldBlockHasHint]">
            <div :class="styles.fieldLabelGroup">
              <span :class="styles.fieldLabel">{{ ui('Risk Alert Recipient') }}</span>
              <p v-if="isOutflow" :class="styles.fieldHint">
                {{ ui(riskAlertRecipientsHintKey) }}
              </p>
            </div>
            <div
              :class="[styles.fieldBlockContent, styles.fieldBlockContentOptionCards]"
            >
              <ProjectCreateModeCard
                selection-control="checkbox"
                expand-style="embeddedPanel"
                :title="ui('In-app notification')"
                :description="
                  isOutflow ? '' : ui('Auto rule inflow risk alert inapp hint')
                "
                :selected="localDraft.riskAlertRecipientKeys.includes(RISK_ALERT_IN_APP)"
                @select="toggleRiskAlertRecipientKey(RISK_ALERT_IN_APP)"
              >
                <RiskControlAutoRuleRecipientPicker
                  :model-value="localDraft.riskAlertInAppRecipientIds"
                  @update:model-value="
                    (value) => patchDraft({ riskAlertInAppRecipientIds: value })
                  "
                />
              </ProjectCreateModeCard>
              <ProjectCreateModeCard
                selection-control="checkbox"
                expand-style="embeddedPanel"
                :title="ui('Email notification')"
                :description="
                  isOutflow ? '' : ui('Auto rule inflow risk alert email hint')
                "
                :selected="localDraft.riskAlertRecipientKeys.includes(RISK_ALERT_EMAIL)"
                @select="toggleRiskAlertRecipientKey(RISK_ALERT_EMAIL)"
              >
                <RiskControlAutoRuleRecipientPicker
                  :model-value="localDraft.riskAlertEmailTeamMemberIds"
                  @update:model-value="
                    (value) => patchDraft({ riskAlertEmailTeamMemberIds: value })
                  "
                />
              </ProjectCreateModeCard>
            </div>
          </section>

    <p :class="styles.formFootnote">
      <span :class="styles.formFootnoteIcon" aria-hidden="true">
        <EgIcon name="eds-aml-warning-fill" size="sm" fit fill-tone="primary" />
      </span>
      {{ ui(autoRuleFormFootnoteKey) }}
    </p>

  </div>
</template>
