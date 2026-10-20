<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  EgAvatar,
  EgButton,
  EgCheckbox,
  EgComboInputItem,
  EgDivider,
  EgFormSubmission,
  EgIcon,
  EgIconButton,
  EgInput,
  EgLayout,
  EgLink,
  EgListFieldOverflowText,
  EgSearch,
  EgSkid,
  EgSwitch,
  EgTabs,
  EgToolBar,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  CALLBACK_ORDER_DOC_URL,
  CALLBACK_WEBHOOK_DOC_URL,
  filterTeamNotifyMembers,
  isValidCallbackUrl,
  notifyMembersFromIds,
  PAYMENT_ENGINE_SETTINGS_TABS,
  paymentEngineSettingsState,
  type CallbackUrlTestStatus,
  type NotifySettingRow,
} from './paymentEngineSettings';
import styles from './PaymentEngineSettingsPage.module.css';

const CALLBACK_TEST_DELAY_MS = 900;

const { ui } = useAppI18n();

const tabLabels = computed(() => PAYMENT_ENGINE_SETTINGS_TABS.map((label) => ui(label)));
const isCallbackTab = computed(
  () => PAYMENT_ENGINE_SETTINGS_TABS[paymentEngineSettingsState.tabIndex] === 'Callback Setting',
);
const isNotificationTab = computed(
  () =>
    PAYMENT_ENGINE_SETTINGS_TABS[paymentEngineSettingsState.tabIndex] === 'Notification Setting',
);

const draftCallbackUrl = ref('');
const testStatus = ref<CallbackUrlTestStatus>('idle');
const testedUrl = ref('');
const notifySearch = ref('');
const notifyDraftIds = ref<string[]>([]);
const skidMode = ref<'callback' | 'notify'>('callback');
let testTimer: ReturnType<typeof setTimeout> | undefined;

const showSettingsSkid = computed({
  get: () =>
    paymentEngineSettingsState.callbackSkidOpen || paymentEngineSettingsState.notifySkidOpen,
  set: (open) => {
    if (open) return;
    if (paymentEngineSettingsState.notifySkidOpen) onNotifySkidClose();
    if (paymentEngineSettingsState.callbackSkidOpen) onCallbackSkidClose();
  },
});

const filteredTeamMembers = computed(() => filterTeamNotifyMembers(notifySearch.value));

function isNotifyDraftSelected(id: string): boolean {
  return notifyDraftIds.value.includes(id);
}

const showUrlFeedback = computed(
  () => testStatus.value === 'success' || testStatus.value === 'invalid' || testStatus.value === 'failed',
);
const canConfirmCallback = computed(
  () => testStatus.value === 'success' && testedUrl.value === draftCallbackUrl.value.trim(),
);
const showTestConnection = computed(() => {
  if (!draftCallbackUrl.value.trim()) return true;
  return (
    testStatus.value !== 'success' || testedUrl.value !== draftCallbackUrl.value.trim()
  );
});
const canTestConnection = computed(
  () => testStatus.value !== 'testing' && isValidCallbackUrl(draftCallbackUrl.value),
);
const callbackToggleOn = computed(
  () =>
    paymentEngineSettingsState.exceptionCallbackEnabled || paymentEngineSettingsState.callbackSkidOpen,
);

function clearTestTimer() {
  if (testTimer !== undefined) {
    clearTimeout(testTimer);
    testTimer = undefined;
  }
}

function resetCallbackDraft() {
  clearTestTimer();
  draftCallbackUrl.value = paymentEngineSettingsState.exceptionCallbackUrl;
  testStatus.value = paymentEngineSettingsState.exceptionCallbackUrl ? 'success' : 'idle';
  testedUrl.value = paymentEngineSettingsState.exceptionCallbackUrl;
}

function syncDraftUrlStatus() {
  const url = draftCallbackUrl.value.trim();
  if (!url) {
    testStatus.value = 'idle';
    testedUrl.value = '';
    return;
  }
  if (!isValidCallbackUrl(url)) {
    testStatus.value = 'invalid';
    testedUrl.value = url;
    return;
  }
  if (testStatus.value === 'success' && testedUrl.value === url) return;
  testStatus.value = 'idle';
  testedUrl.value = '';
}

function onDraftUrlInput(value: string) {
  draftCallbackUrl.value = value;
  if (testStatus.value === 'testing') return;
  syncDraftUrlStatus();
}

function onClearDraftUrl() {
  if (testStatus.value === 'testing') return;
  draftCallbackUrl.value = '';
  testStatus.value = 'idle';
  testedUrl.value = '';
}

function onTestConnection() {
  if (testStatus.value === 'testing' || !isValidCallbackUrl(draftCallbackUrl.value)) return;
  const url = draftCallbackUrl.value.trim();
  clearTestTimer();
  testStatus.value = 'testing';
  testTimer = setTimeout(() => {
    testTimer = undefined;
    const failed = /fail|timeout/i.test(url);
    testStatus.value = failed ? 'failed' : 'success';
    testedUrl.value = url;
  }, CALLBACK_TEST_DELAY_MS);
}

function closeNotifySkid() {
  paymentEngineSettingsState.notifySkidOpen = false;
  paymentEngineSettingsState.notifyEditRowId = null;
  notifySearch.value = '';
  notifyDraftIds.value = [];
}

function onNotifyEdit(row: NotifySettingRow) {
  if (!row.enabled) return;
  paymentEngineSettingsState.callbackSkidOpen = false;
  paymentEngineSettingsState.notifyEditRowId = row.id;
  notifySearch.value = '';
  notifyDraftIds.value = row.members.map((member) => member.id);
  skidMode.value = 'notify';
  paymentEngineSettingsState.notifySkidOpen = true;
}

function onNotifyDraftToggle(id: string, selected: boolean) {
  if (selected) {
    if (!notifyDraftIds.value.includes(id)) {
      notifyDraftIds.value = [...notifyDraftIds.value, id];
    }
    return;
  }
  notifyDraftIds.value = notifyDraftIds.value.filter((memberId) => memberId !== id);
}

function onNotifyMemberRowClick(id: string) {
  onNotifyDraftToggle(id, !isNotifyDraftSelected(id));
}

function onNotifySkidClose() {
  closeNotifySkid();
}

function onNotifySkidConfirm() {
  const rowId = paymentEngineSettingsState.notifyEditRowId;
  const row = paymentEngineSettingsState.notifyRows.find((item) => item.id === rowId);
  if (row) {
    row.members = notifyMembersFromIds(notifyDraftIds.value);
    row.extraCount = undefined;
  }
  closeNotifySkid();
}

function onExceptionCallbackToggle(next: boolean) {
  if (next) {
    closeNotifySkid();
    resetCallbackDraft();
    skidMode.value = 'callback';
    paymentEngineSettingsState.callbackSkidOpen = true;
    return;
  }
  if (!paymentEngineSettingsState.exceptionCallbackEnabled) {
    paymentEngineSettingsState.callbackSkidOpen = false;
    return;
  }
  paymentEngineSettingsState.disableCallbackOpen = true;
}

function onCallbackSkidClose() {
  paymentEngineSettingsState.callbackSkidOpen = false;
  paymentEngineSettingsState.googleVerifyOpen = false;
  if (!paymentEngineSettingsState.exceptionCallbackEnabled) {
    resetCallbackDraft();
  }
}

function onCallbackSkidConfirm() {
  if (!canConfirmCallback.value) return;
  paymentEngineSettingsState.pendingCallbackUrl = draftCallbackUrl.value.trim();
  paymentEngineSettingsState.googleVerifyOpen = true;
}

function onNotifyToggle(row: NotifySettingRow, next: boolean) {
  row.enabled = next;
}

watch(
  () => paymentEngineSettingsState.callbackSkidOpen,
  (open) => {
    if (open) {
      skidMode.value = 'callback';
      resetCallbackDraft();
      return;
    }
    clearTestTimer();
  },
  { immediate: true },
);

watch(
  () => paymentEngineSettingsState.notifySkidOpen,
  (open) => {
    if (open) skidMode.value = 'notify';
  },
);

watch(isNotificationTab, (onNotificationTab) => {
  if (!onNotificationTab && paymentEngineSettingsState.notifySkidOpen) {
    closeNotifySkid();
  }
});

watch(
  () => paymentEngineSettingsState.exceptionCallbackEnabled,
  (enabled) => {
    if (enabled) {
      paymentEngineSettingsState.callbackSkidOpen = false;
    }
  },
);

onBeforeUnmount(() => {
  clearTestTimer();
});
</script>

<template>
  <div :class="styles.root">
    <EgLayout
      v-model:show-skid="showSettingsSkid"
      type="empty"
      show-toolbar
    >
      <template #toolbar>
        <EgToolBar :title="ui('Settings')" show-divider />
      </template>

      <div :class="styles.page">
        <div :class="styles.tabBlock">
          <EgTabs
            v-model="paymentEngineSettingsState.tabIndex"
            :labels="tabLabels"
            horizontal-gap="xl"
            vertical-gap="md"
          />
          <EgDivider type="page" />
        </div>

        <div v-if="isCallbackTab" :class="styles.section">
          <div :class="styles.settingRow">
            <p :class="styles.settingTitle">{{ ui('Payment Exception Callback') }}</p>
            <EgSwitch
              :model-value="callbackToggleOn"
              @update:model-value="onExceptionCallbackToggle"
            />
          </div>
        </div>

        <div v-else-if="isNotificationTab" :class="styles.notifyList">
          <div
            v-for="row in paymentEngineSettingsState.notifyRows"
            :key="row.id"
            :class="styles.notifyItem"
          >
            <div :class="styles.notifyRow">
              <div :class="styles.notifyCopy">
                <p :class="styles.settingTitle">{{ ui(row.title) }}</p>
                <p v-if="row.description" :class="styles.settingHint">{{ ui(row.description) }}</p>
              </div>
              <div :class="styles.notifyActions">
                <EgButton
                  v-if="row.enabled"
                  tone="brand"
                  variant="text"
                  size="sm"
                  @click="onNotifyEdit(row)"
                >
                  {{ ui('Edit') }}
                </EgButton>
                <EgSwitch
                  :model-value="row.enabled"
                  @update:model-value="(on) => onNotifyToggle(row, on)"
                />
              </div>
            </div>
            <div v-if="row.enabled && row.members.length" :class="styles.memberWrap">
              <div :class="styles.memberBox">
                <div
                  v-for="member in row.members"
                  :key="member.id"
                  :class="styles.member"
                >
                  <EgAvatar
                    size="lg"
                    :name="member.name"
                    :color-index="member.colorIndex"
                  />
                  <div :class="styles.memberText">
                    <span :class="styles.memberName">
                      <EgListFieldOverflowText :text="member.name" size="medium" />
                    </span>
                    <span :class="styles.memberEmail">
                      <EgListFieldOverflowText :text="member.email" variant="secondary" />
                    </span>
                  </div>
                </div>
                <div
                  v-if="row.extraCount"
                  :class="styles.memberMore"
                  :aria-label="`+${row.extraCount}`"
                >
                  +{{ row.extraCount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #skid>
        <EgSkid
          v-if="skidMode === 'notify'"
          :title="ui('Notification Setting')"
          :confirm-label="ui('Confirm')"
          action-tone="decor"
          @close="onNotifySkidClose"
          @confirm="onNotifySkidConfirm"
        >
          <div :class="styles.notifySkidBody">
            <p :class="styles.notifySkidHeading">{{ ui('Add from Team') }}</p>
            <div :class="styles.notifySearch">
              <EgSearch
                :model-value="notifySearch"
                :placeholder="ui('Search by Username.')"
                width-mode="full"
                @update:model-value="(value) => (notifySearch = value)"
              />
            </div>
            <div :class="styles.teamList">
              <div
                v-for="member in filteredTeamMembers"
                :key="member.id"
                :class="styles.teamRow"
                @click="onNotifyMemberRowClick(member.id)"
              >
                <span :class="styles.teamCheck" @click.stop>
                  <EgCheckbox
                    :model-value="isNotifyDraftSelected(member.id)"
                    @update:model-value="(on) => onNotifyDraftToggle(member.id, on)"
                  />
                </span>
                <EgAvatar
                  size="lg"
                  :name="member.name"
                  :color-index="member.colorIndex"
                />
                <div :class="styles.teamCopy">
                  <span :class="styles.teamName">
                    <EgListFieldOverflowText :text="member.name" size="medium" />
                  </span>
                  <span :class="styles.teamEmail">
                    <EgListFieldOverflowText :text="member.email" variant="secondary" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </EgSkid>
        <EgSkid
          v-else
          :title="ui('Configure Callback URL')"
          :confirm-label="ui('Confirm')"
          action-tone="decor"
          @close="onCallbackSkidClose"
          @confirm="onCallbackSkidConfirm"
        >
          <div :class="styles.skidBody">
            <EgComboInputItem
              :label="ui('Callback URL')"
              :feedback="showUrlFeedback"
              :class="styles.skidField"
            >
              <EgInput
                :model-value="draftCallbackUrl"
                :placeholder="ui('Please enter')"
                width-mode="full"
                :clearable="false"
                :disabled="testStatus === 'testing'"
                @update:model-value="onDraftUrlInput"
              >
                <template #suffix>
                  <EgIconButton
                    v-if="draftCallbackUrl"
                    size="sm"
                    shape="square"
                    :label="ui('Close')"
                    :disabled="testStatus === 'testing'"
                    @mousedown.prevent
                    @click.stop="onClearDraftUrl"
                  >
                    <EgIcon name="eds-close-circle-fill" fit />
                  </EgIconButton>
                  <EgButton
                    v-if="showTestConnection"
                    tone="subtle"
                    variant="outline"
                    size="xs"
                    :loading="testStatus === 'testing'"
                    :disabled="!canTestConnection"
                    @mousedown.prevent
                    @click.stop="onTestConnection"
                  >
                    {{ testStatus === 'testing' ? '' : ui('Test Connection') }}
                  </EgButton>
                </template>
              </EgInput>
              <template v-if="showUrlFeedback" #feedback>
                <EgFormSubmission
                  v-if="testStatus === 'success'"
                  type="success"
                  :text="ui('Connection test successful. The server responded normally.')"
                  :show-link="false"
                />
                <EgFormSubmission
                  v-else-if="testStatus === 'invalid'"
                  type="danger"
                  :text="ui('Invalid URL format')"
                  :show-link="false"
                />
                <EgFormSubmission
                  v-else-if="testStatus === 'failed'"
                  type="danger"
                  :text="ui('Connection test failed. The server did not respond.')"
                  :show-link="false"
                />
              </template>
            </EgComboInputItem>

            <p :class="styles.skidHint">
              {{
                ui(
                  'By clicking "Confirm", you agree that all payment exception requests will be sent to the above URL upon receipt of the record. For details on the callback format, please refer to',
                )
              }}{{ ' ' }}<EgLink tone="brand" size="sm" :href="CALLBACK_ORDER_DOC_URL">{{
                CALLBACK_ORDER_DOC_URL
              }}</EgLink>{{
                ui(
                  '. To verify that a callback is genuinely sent by Cregis, you can use the signature and API key for validation. Further instructions are available in the documentation:',
                )
              }}{{ ' ' }}<EgLink tone="brand" size="sm" :href="CALLBACK_WEBHOOK_DOC_URL">{{
                CALLBACK_WEBHOOK_DOC_URL
              }}</EgLink><span :class="styles.skidHintPeriod">.</span>
            </p>
          </div>

          <template #action>
            <div :class="styles.skidAction">
              <EgButton
                :class="styles.skidConfirm"
                tone="decor"
                variant="solid"
                size="md"
                :disabled="!canConfirmCallback"
                @click="onCallbackSkidConfirm"
              >
                {{ ui('Confirm') }}
              </EgButton>
            </div>
          </template>
        </EgSkid>
      </template>
    </EgLayout>
  </div>
</template>
