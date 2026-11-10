<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgAvatar,
  EgCheckbox,
  EgDivider,
  EgInput,
  EgLinkButton,
  EgSwitch,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  listOverviewBalanceReminderAmountOptions,
  OVERVIEW_BALANCE_REMINDER_RECIPIENT_DEFAULT_VISIBLE,
  OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS,
  type OverviewBalanceReminderAmountKey,
  type OverviewBalanceReminderFormState,
} from './overviewBalanceReminderSkidData';
import styles from './ManageOverviewBalanceReminderSkidBody.module.css';

const props = defineProps<{
  gasProxyEnabled: boolean;
}>();

const form = defineModel<OverviewBalanceReminderFormState>({ required: true });

const { ui } = useAppI18n();

const visibleAmountOptions = computed(() =>
  listOverviewBalanceReminderAmountOptions(props.gasProxyEnabled),
);

const showExpandedSections = computed(() => form.value.featureEnabled);

const recipientsExpanded = ref(false);

const visibleRecipients = computed(() => {
  if (recipientsExpanded.value) {
    return OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS;
  }
  return OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS.slice(
    0,
    OVERVIEW_BALANCE_REMINDER_RECIPIENT_DEFAULT_VISIBLE,
  );
});

const showRecipientToggleLink = computed(
  () =>
    OVERVIEW_BALANCE_REMINDER_RECIPIENT_OPTIONS.length
    > OVERVIEW_BALANCE_REMINDER_RECIPIENT_DEFAULT_VISIBLE,
);

function expandRecipients() {
  recipientsExpanded.value = true;
}

function collapseRecipients() {
  recipientsExpanded.value = false;
}

function toggleAmount(key: OverviewBalanceReminderAmountKey) {
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

function setAmountChecked(key: OverviewBalanceReminderAmountKey, checked: boolean) {
  form.value = {
    ...form.value,
    amountByKey: {
      ...form.value.amountByKey,
      [key]: checked,
    },
  };
}

function ensureAmountChecked(key: OverviewBalanceReminderAmountKey) {
  if (form.value.amountByKey[key]) return;
  setAmountChecked(key, true);
}

function setAmountThreshold(key: OverviewBalanceReminderAmountKey, value: string) {
  ensureAmountChecked(key);
  form.value = {
    ...form.value,
    thresholdByKey: {
      ...form.value.thresholdByKey,
      [key]: value,
    },
  };
}

function onAmountInputFocus(key: OverviewBalanceReminderAmountKey) {
  ensureAmountChecked(key);
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

function onAmountRowClick(key: OverviewBalanceReminderAmountKey, event: MouseEvent) {
  const target = event.target;
  if (
    target instanceof Element
    && (target.closest('.eds-checkbox') || target.closest('.eds-input'))
  ) {
    return;
  }
  toggleAmount(key);
}

const channelSummaryLineKeys = [
  'Overview Balance Reminder Channel In App Line',
  'Overview Balance Reminder Channel App Push Line',
  'Overview Balance Reminder Channel Email Line',
] as const;

function onRecipientRowClick(id: string, event: MouseEvent) {
  const target = event.target;
  if (target instanceof Element && target.closest('.eds-checkbox')) return;
  toggleRecipient(id);
}

</script>

<template>
  <div :class="styles.root">
    <div :class="styles.introBlock">
      <div :class="styles.introRow">
        <div :class="styles.introCopy">
          <p :class="styles.introTitle">
            {{ ui('Overview Balance Reminder Enable Title') }}
          </p>
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
      <div v-if="showExpandedSections" :class="styles.sectionDividerInset">
        <EgDivider type="page" direction="horizontal" />
      </div>
    </div>

    <template v-if="showExpandedSections">
      <section :class="styles.section">
        <h3 :class="styles.sectionTitle">
          {{ ui('Overview Balance Reminder Amount Section') }}
        </h3>
        <div :class="styles.checkboxList">
          <div
            v-for="option in visibleAmountOptions"
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
            <div :class="styles.amountFieldRow">
              <span :class="styles.amountAccountLabel">{{ ui(option.titleKey) }}</span>
              <EgInput
                :class="styles.amountInput"
                :model-value="form.thresholdByKey[option.key]"
                size="xs"
                width-mode="full"
                :unit="option.unit"
                placeholder="0"
                :clearable="false"
                inputmode="decimal"
                @focus="onAmountInputFocus(option.key)"
                @update:model-value="setAmountThreshold(option.key, $event)"
                @click.stop
              />
            </div>
          </div>
        </div>
      </section>

      <section :class="styles.section">
        <h3 :class="styles.sectionTitle">
          {{ ui('Overview Balance Reminder Recipients Section') }}
        </h3>
        <div :class="styles.recipientList">
          <div
            v-for="recipient in visibleRecipients"
            :key="recipient.id"
            :class="styles.recipientRow"
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
            <div :class="styles.recipientMeta">
              <EgAvatar
                size="xl"
                :name="recipient.avatarName"
                :color-seed="recipient.id"
              />
              <div :class="styles.recipientCopy">
                <span :class="styles.recipientName">{{ recipient.name }}</span>
                <span :class="styles.recipientEmail">{{ recipient.email }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="showRecipientToggleLink && !recipientsExpanded"
            :class="styles.recipientToggleRow"
            @click.stop.prevent="expandRecipients"
          >
            <EgLinkButton
              size="sm"
              tone="brand"
              href="#"
              @click.stop.prevent="expandRecipients"
            >
              {{ ui('Overview Balance Reminder Recipients Expand All') }}
            </EgLinkButton>
          </div>
          <div
            v-if="showRecipientToggleLink && recipientsExpanded"
            :class="styles.recipientToggleRow"
            @click.stop.prevent="collapseRecipients"
          >
            <EgLinkButton
              size="sm"
              tone="brand"
              href="#"
              @click.stop.prevent="collapseRecipients"
            >
              {{ ui('Overview Balance Reminder Recipients Collapse') }}
            </EgLinkButton>
          </div>
        </div>
      </section>

      <section :class="styles.section">
        <h3 :class="styles.sectionTitle">
          {{ ui('Overview Balance Reminder Channels Section') }}
        </h3>
        <ul :class="styles.channelSummaryList">
          <li
            v-for="lineKey in channelSummaryLineKeys"
            :key="lineKey"
            :class="styles.channelSummaryItem"
          >
            <span :class="styles.channelSummaryBullet" aria-hidden="true" />
            <span :class="styles.channelSummaryLabel">{{ ui(lineKey) }}</span>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
