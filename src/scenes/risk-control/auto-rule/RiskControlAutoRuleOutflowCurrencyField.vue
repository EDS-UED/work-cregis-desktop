<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgCrypto,
  EgIcon,
  EgIconButton,
  EgInput,
  EgTag,
  EgToast,
  type CryptoName,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import RiskControlAutoRuleOutflowCurrencyAddPicker from './RiskControlAutoRuleOutflowCurrencyAddPicker.vue';
import {
  resolveAutoRuleOutflowCurrencyEntryFromValueKey,
  type RiskControlAutoRuleOutflowCurrencyEntry,
} from './riskControlAutoRuleOutflowCurrencyOptions';
import { useEdsToastMotion } from '@/scenes/tasks/shared/useEdsToastMotion';
import sharedEntryStyles from './riskControlAutoRuleEntryAddField.shared.module.css';
import styles from './RiskControlAutoRuleOutflowCurrencyField.module.css';

const props = defineProps<{
  modelValue: readonly RiskControlAutoRuleOutflowCurrencyEntry[];
  scopeSelected?: boolean;
  scopeRequiredToastKey?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: RiskControlAutoRuleOutflowCurrencyEntry[]];
}>();

const { ui } = useAppI18n();

const currencyPickerValue = ref('');

const scopeSelected = computed(() => props.scopeSelected !== false);
const scopeRequiredToastKey = computed(
  () => props.scopeRequiredToastKey ?? 'Auto rule select wallet before currency',
);

const {
  text: toastText,
  keepMounted: toastKeepMounted,
  motionActive: toastMotionActive,
  show: showToast,
} = useEdsToastMotion();

const committedValueKeys = computed(() =>
  props.modelValue.map((entry) => entry.valueKey),
);

function parsePickerValueKeys(raw: string): string[] {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function onBeforeOpenPicker() {
  currencyPickerValue.value = '';
}

function onAddPickerBlocked() {
  showToast(ui(scopeRequiredToastKey.value));
}

function onAddPickerModelUpdate(raw: string) {
  const newlyPicked = parsePickerValueKeys(raw);
  if (!newlyPicked.length) {
    currencyPickerValue.value = '';
    return;
  }

  const prevByKey = new Map(props.modelValue.map((entry) => [entry.valueKey, entry]));
  const merged: RiskControlAutoRuleOutflowCurrencyEntry[] = [...props.modelValue];

  for (const valueKey of newlyPicked) {
    if (prevByKey.has(valueKey)) continue;
    const resolved = resolveAutoRuleOutflowCurrencyEntryFromValueKey(valueKey);
    if (!resolved) continue;
    merged.push({ ...resolved, minAmount: '' });
  }

  emit('update:modelValue', merged);
  currencyPickerValue.value = '';
}

function updateEntryMinAmount(index: number, minAmount: string) {
  const next = props.modelValue.map((entry, entryIndex) =>
    entryIndex === index ? { ...entry, minAmount } : entry,
  );
  emit('update:modelValue', next);
}

function removeEntry(index: number) {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, entryIndex) => entryIndex !== index),
  );
}

function resolveEntryCurrencyCryptoName(
  entry: RiskControlAutoRuleOutflowCurrencyEntry,
): CryptoName {
  const resolved = resolveAutoRuleOutflowCurrencyEntryFromValueKey(entry.valueKey);
  return (resolved?.cryptoName ?? entry.cryptoName) as CryptoName;
}
</script>

<template>
  <div :class="styles.field">
    <div v-if="modelValue.length" :class="styles.entryList">
      <div
        v-for="(entry, index) in modelValue"
        :key="entry.valueKey"
        :class="styles.entryRow"
      >
        <div :class="styles.entryBody">
          <div :class="styles.entryMeta">
            <span :class="styles.entryCrypto">
              <EgCrypto :name="resolveEntryCurrencyCryptoName(entry)" size="sm" fit />
            </span>
            <span :class="styles.entrySymbol">{{ entry.symbol }}</span>
            <span v-if="entry.networkLabel" :class="styles.entryNetworkTag">
              <EgTag family="system" system-type="stroke-subtle" size="sm" truncate>
                {{ entry.networkLabel }}
              </EgTag>
            </span>
          </div>
          <div :class="styles.amountRow">
            <span :class="styles.amountLabel">{{ ui('Greater than or equal to') }}</span>
            <EgInput
              :class="styles.amountInput"
              :model-value="entry.minAmount"
              size="sm"
              width-mode="full"
              :unit="entry.symbol"
              placeholder="0"
              @update:model-value="updateEntryMinAmount(index, $event)"
            />
          </div>
        </div>
        <EgIconButton
          :class="[styles.entryDeleteButton, sharedEntryStyles.entryDeleteButton]"
          shape="rectangular"
          size="sm"
          :label="ui('Delete')"
          @click="removeEntry(index)"
        >
          <EgIcon
            :class="sharedEntryStyles.entryDeleteIcon"
            name="eds-recycle"
            size="sm"
          />
        </EgIconButton>
      </div>
    </div>

    <div :class="styles.addRow">
      <RiskControlAutoRuleOutflowCurrencyAddPicker
        :model-value="currencyPickerValue"
        :committed-value-keys="committedValueKeys"
        :allow-open="scopeSelected"
        @before-open="onBeforeOpenPicker"
        @open-blocked="onAddPickerBlocked"
        @update:model-value="onAddPickerModelUpdate"
      />
    </div>

    <Teleport to=".app-preview">
      <div
        v-if="toastKeepMounted"
        :class="['autoRuleScopeToastHost', toastMotionActive && 'is-active']"
      >
        <div class="motion-flotation desktopTokens">
          <EgToast type="result" :text="toastText" />
        </div>
      </div>
    </Teleport>
  </div>
</template>
