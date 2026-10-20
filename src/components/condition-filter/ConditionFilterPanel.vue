<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgButton,
  EgDivider,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  EgIcon,
  EgIconButton,
  EgInput,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  createConditionFilterRow,
  type ConditionFilterFieldOption,
  type ConditionFilterRow,
} from './conditionFilter';
import styles from './ConditionFilterPanel.module.css';

const props = defineProps<{
  fields: ConditionFilterFieldOption[];
}>();

const conditions = defineModel<ConditionFilterRow[]>('conditions', {
  required: true,
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  clear: [];
}>();

const { ui } = useAppI18n();
const openFieldId = ref<string | null>(null);

const fieldMenuItems = computed(() =>
  props.fields.map((field) => ({
    key: field.key,
    label: ui(field.labelKey),
  })),
);

function fieldLabel(key: string) {
  const match = props.fields.find((field) => field.key === key);
  return ui(match?.labelKey ?? props.fields[0]?.labelKey ?? key);
}

function fallbackFieldKey() {
  return props.fields[0]?.key ?? '';
}

function toggleFieldMenu(id: string) {
  openFieldId.value = openFieldId.value === id ? null : id;
}

function setField(row: ConditionFilterRow, field: string) {
  row.field = field;
  openFieldId.value = null;
}

function removeCondition(id: string) {
  openFieldId.value = null;
  conditions.value = conditions.value.filter((item) => item.id !== id);
  if (conditions.value.length === 0) {
    conditions.value = [createConditionFilterRow(fallbackFieldKey())];
  }
}

function addCondition() {
  openFieldId.value = null;
  conditions.value = [...conditions.value, createConditionFilterRow(fallbackFieldKey())];
}
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.body">
      <p :class="styles.title">{{ ui('Filter Conditions') }}</p>
      <div
        v-for="row in conditions"
        :key="row.id"
        :class="styles.row"
      >
        <div :class="styles.fieldCell">
          <EgFlotationTrigger
            trigger-style="outline"
            size="md"
            width-mode="adaptive"
            :label="fieldLabel(row.field)"
            :expanded="openFieldId === row.id"
            @click="toggleFieldMenu(row.id)"
          />
          <div
            v-if="openFieldId === row.id"
            :class="styles.fieldMenu"
          >
            <EgFlotationMenuItem
              v-for="item in fieldMenuItems"
              :key="item.key"
              box-type="text"
              :label="item.label"
              :focused="item.key === row.field"
              :show-tag="false"
              @click="setField(row, item.key)"
            />
          </div>
        </div>
        <div :class="styles.inputWrap">
          <EgInput
            v-model="row.value"
            width-mode="full"
            :placeholder="ui('Please enter')"
            @focus="openFieldId = null"
          />
        </div>
        <EgIconButton
          size="sm"
          :label="ui('Delete')"
          @click="removeCondition(row.id)"
        >
          <EgIcon name="eds-recycle" fit />
        </EgIconButton>
      </div>
      <EgButton variant="text" size="md" @click="addCondition">
        + {{ ui('Add condition') }}
      </EgButton>
    </div>
    <EgDivider type="module" direction="horizontal" />
    <div :class="styles.footer">
      <EgButton variant="text" tone="decor" size="md" @click="openFieldId = null; emit('clear')">
        {{ ui('Clear options') }}
      </EgButton>
      <div :class="styles.footerActions">
        <EgButton variant="text" tone="decor" size="md" @click="emit('cancel')">
          {{ ui('Cancel') }}
        </EgButton>
        <EgButton variant="solid" tone="decor" size="md" @click="emit('confirm')">
          {{ ui('Confirm') }}
        </EgButton>
      </div>
    </div>
  </div>
</template>
