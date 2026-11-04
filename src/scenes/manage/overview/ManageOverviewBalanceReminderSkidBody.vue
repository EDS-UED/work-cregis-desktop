<script setup lang="ts">
import { computed } from 'vue';
import { EgCheckbox, EgFormSubmission, EgSwitch } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS,
  OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS,
  type OverviewBalanceReminderFormState,
} from './overviewBalanceReminderSkidData';
import styles from './ManageOverviewBalanceReminderSkidBody.module.css';

const form = defineModel<OverviewBalanceReminderFormState>({ required: true });

defineProps<{
  showValidation?: boolean;
}>();

const { ui } = useAppI18n();

const showExpandedSections = computed(() => form.value.featureEnabled);

function formatAmountOptionLabel(titleKey: string, amountDisplay: string) {
  return `${ui(titleKey)}：${amountDisplay}`;
}

function toggleAmount(key: (typeof OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS)[number]['key']) {
  form.value = {
    ...form.value,
    amountByKey: {
      ...form.value.amountByKey,
      [key]: !form.value.amountByKey[key],
    },
  };
}

function toggleRecipient(id: string) {
  form.value = {
    ...form.value,
    recipientById: {
      ...form.value.recipientById,
      [id]: !form.value.recipientById[id],
    },
  };
}

function setAmountChecked(
  key: (typeof OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS)[number]['key'],
  checked: boolean,
) {
  form.value = {
    ...form.value,
    amountByKey: {
      ...form.value.amountByKey,
      [key]: checked,
    },
  };
}

function setRecipientChecked(id: string, checked: boolean) {
  form.value = {
    ...form.value,
    recipientById: {
      ...form.value.recipientById,
      [id]: checked,
    },
  };
}

function onAmountRowClick(
  key: (typeof OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS)[number]['key'],
  event: MouseEvent,
) {
  const target = event.target;
  if (target instanceof Element && target.closest('.eds-checkbox')) return;
  toggleAmount(key);
}

function onRecipientRowClick(id: string, event: MouseEvent) {
  const target = event.target;
  if (target instanceof Element && target.closest('.eds-checkbox')) return;
  toggleRecipient(id);
}

const channelItems = [
  {
    titleKey: 'Overview Balance Reminder Channel In App Title',
    descriptionKey: 'Overview Balance Reminder Channel In App Description',
  },
  {
    titleKey: 'Overview Balance Reminder Channel App Push Title',
    descriptionKey: 'Overview Balance Reminder Channel App Push Description',
  },
  {
    titleKey: 'Overview Balance Reminder Channel Email Title',
    descriptionKey: 'Overview Balance Reminder Channel Email Description',
  },
] as const;
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.introRow">
      <div :class="styles.introCopy">
        <p :class="styles.introDescription">
          {{ ui('Overview Balance Reminder Description') }}
        </p>
      </div>
      <EgSwitch
        v-model="form.featureEnabled"
        :class="styles.introSwitch"
        size="md"
      />
    </div>

    <template v-if="showExpandedSections">
      <section :class="styles.section">
        <h3 :class="styles.sectionTitle">
          {{ ui('Overview Balance Reminder Amount Section') }}
        </h3>
        <div :class="styles.checkboxList">
          <div
            v-for="option in OVERVIEW_BALANCE_REMINDER_AMOUNT_OPTIONS"
            :key="option.key"
            :class="styles.checkboxRow"
            role="button"
            tabindex="0"
            @click="onAmountRowClick(option.key, $event)"
            @keydown.enter.prevent="toggleAmount(option.key)"
            @keydown.space.prevent="toggleAmount(option.key)"
          >
            <EgCheckbox
              :model-value="form.amountByKey[option.key]"
              @update:model-value="setAmountChecked(option.key, $event)"
              @click.stop
            />
            <span :class="styles.checkboxLabel">
              {{ formatAmountOptionLabel(option.titleKey, option.amountDisplay) }}
            </span>
          </div>
        </div>
      </section>

      <section :class="styles.section">
        <h3 :class="styles.sectionTitle">
          {{ ui('Overview Balance Reminder Recipients Section') }}
        </h3>
        <div :class="styles.checkboxList">
          <div
            v-for="recipient in OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS"
            :key="recipient.id"
            :class="styles.checkboxRow"
            role="button"
            tabindex="0"
            @click="onRecipientRowClick(recipient.id, $event)"
            @keydown.enter.prevent="toggleRecipient(recipient.id)"
            @keydown.space.prevent="toggleRecipient(recipient.id)"
          >
            <EgCheckbox
              :model-value="form.recipientById[recipient.id]"
              @update:model-value="setRecipientChecked(recipient.id, $event)"
              @click.stop
            />
            <span :class="styles.checkboxLabel">{{ recipient.displayName }}</span>
          </div>
        </div>
      </section>

    </template>

    <section :class="styles.section">
      <h3 :class="styles.sectionTitle">
        {{ ui('Overview Balance Reminder Channels Section') }}
      </h3>
      <ul :class="styles.channelList">
        <li
          v-for="channel in channelItems"
          :key="channel.titleKey"
          :class="styles.channelItem"
        >
          <span :class="styles.channelTitle">{{ ui(channel.titleKey) }}</span>
          <p :class="styles.channelDescription">
            {{ ui(channel.descriptionKey) }}
          </p>
        </li>
      </ul>
    </section>

    <div v-if="showValidation && showExpandedSections" :class="styles.validationHost">
      <EgFormSubmission
        type="danger"
        :show-link="false"
        :text="ui('Overview Balance Reminder Validation Message')"
      />
    </div>
  </div>
</template>
