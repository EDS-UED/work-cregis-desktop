<script setup lang="ts">
import { computed } from 'vue';
import {
  closeAllAnchoredTooltips,
  EgAvatar,
  EgIcon,
  EgIconButton,
  EgMemberTooltip,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  AUTO_RULE_FILTER_PICKER_MENU_WIDTH,
} from './riskControlAutoRuleFilterPickerConstants';
import {
  autoRuleTeamMemberById,
  autoRuleTeamMemberFilterOptions,
} from './riskControlAutoRuleMemberOptions';
import sharedEntryStyles from './riskControlAutoRuleEntryAddField.shared.module.css';
import styles from './RiskControlAutoRuleRecipientPicker.module.css';

const props = withDefaults(
  defineProps<{
    modelValue: readonly string[];
    showTitle?: boolean;
    /** 异常处理「指定人员」为单选；风险提醒渠道等多选。 */
    pickerMode?: 'single' | 'multi';
  }>(),
  {
    showTitle: true,
    pickerMode: 'multi',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const { ui } = useAppI18n();

const isSinglePicker = computed(() => props.pickerMode === 'single');

const memberOptions = computed(() => autoRuleTeamMemberFilterOptions());

const selectedMembers = computed(() =>
  props.modelValue
    .map((id) => autoRuleTeamMemberById(id))
    .filter((member): member is NonNullable<typeof member> => Boolean(member)),
);

const memberPickerValue = computed({
  get: () => [...props.modelValue].join(','),
  set: (raw: string) => {
    const ids = raw
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    emit('update:modelValue', ids);
  },
});

function removeMember(id: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((entry) => entry !== id),
  );
}

function onAddTriggerPointerDown() {
  closeAllAnchoredTooltips();
}
</script>

<template>
  <div :class="styles.field">
    <span v-if="showTitle" :class="styles.fieldTitle">{{
      ui('Auto rule recipient field label')
    }}</span>

    <div v-if="selectedMembers.length" :class="styles.entryList">
      <div
        v-for="member in selectedMembers"
        :key="member.id"
        :class="styles.entryRow"
      >
        <div :class="styles.entryMeta">
          <EgAvatar size="xl" :name="member.avatarName" :color-seed="member.id" />
          <div :class="styles.entryCopy">
            <span :class="styles.entryName">{{ member.name }}</span>
            <span :class="styles.entryEmail">{{ member.emailMasked }}</span>
          </div>
        </div>
        <EgIconButton
          :class="[styles.entryDeleteButton, sharedEntryStyles.entryDeleteButton]"
          shape="rectangular"
          size="sm"
          :label="ui('Delete')"
          @click="removeMember(member.id)"
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
      <div :class="styles.addPickerWrap">
      <EgMemberTooltip
        v-model="memberPickerValue"
        :selection-mode="isSinglePicker ? 'single' : 'multi'"
        :member-options="memberOptions"
        :show-type-tabs="false"
        menu-width-mode="fixed"
        :menu-width="AUTO_RULE_FILTER_PICKER_MENU_WIDTH"
        boundary-selector=".app-preview"
        picker-align="start"
        :placeholder="ui('Add')"
      >
        <template #trigger="{ expanded }">
          <EgIconButton
            data-eds-trigger-metrics
            shape="rectangular"
            outline-style="bordered"
            size="lg"
            :label="ui('Add')"
            :class="[styles.addIconTriggerHost, expanded && styles.addIconTriggerExpanded]"
            :aria-expanded="expanded"
            @pointerdown.capture="onAddTriggerPointerDown"
          >
            <EgIcon name="eds-add-medium" fit />
          </EgIconButton>
        </template>
      </EgMemberTooltip>
      </div>
    </div>
  </div>
</template>
