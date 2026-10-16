<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  EgAvatar,
  EgDivider,
  EgIcon,
  EgIconButton,
  EgInput,
  EgListFieldOverflowText,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import {
  CUSTOMER_SERVICE_DEMO_HISTORY,
  CUSTOMER_SERVICE_GREETING_KEY,
  CUSTOMER_SERVICE_HANDOFF_KEY,
  CUSTOMER_SERVICE_HISTORY_TITLE_KEY,
  CUSTOMER_SERVICE_PERSONAL_SPACE_KEY,
  CUSTOMER_SERVICE_SUBSCRIPTION_PLAN,
  CUSTOMER_SERVICE_SUGGESTION_KEYS,
  CUSTOMER_SERVICE_TEAM_NAME,
  type CustomerServiceChatSpace,
} from './customerService.constants';
import { customerServiceState } from './customerServiceState';
import styles from './CustomerServicePanel.module.css';

type ChatRole = 'assistant' | 'user';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type ChatSession = {
  id: string;
  topic: string;
  topicIsUiKey: boolean;
  space: CustomerServiceChatSpace;
  teamName: string | null;
  time: string;
  messages: ChatMessage[];
};

const emit = defineEmits<{
  close: [];
}>();

const { ui, locale } = useAppI18n();

const view = ref<'chat' | 'history'>('chat');
const draft = ref('');
const attachInputRef = ref<HTMLInputElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

let nextId = 1;

function createId(prefix: string) {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

const locationLabel = computed(() => {
  const title = ui(customerServiceState.locationTitle);
  const item = customerServiceState.locationItem;
  if (!item) return title;
  return `${title} · ${ui(item)}`;
});

const teamPlanLabel = `${CUSTOMER_SERVICE_TEAM_NAME} (${CUSTOMER_SERVICE_SUBSCRIPTION_PLAN})`;

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function formatSessionTime(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function buildGreeting(): ChatMessage {
  return {
    id: createId('msg'),
    role: 'assistant',
    text: ui(CUSTOMER_SERVICE_GREETING_KEY).replace('{page}', locationLabel.value),
  };
}

function createSession(): ChatSession {
  return {
    id: createId('session'),
    topic: 'Current conversation',
    topicIsUiKey: true,
    space: 'team',
    teamName: CUSTOMER_SERVICE_TEAM_NAME,
    time: formatSessionTime(),
    messages: [buildGreeting()],
  };
}

function createDemoSession(
  spec: (typeof CUSTOMER_SERVICE_DEMO_HISTORY)[number],
): ChatSession {
  const message = ui(spec.messageKey);
  return {
    id: createId('session'),
    topic: spec.topicKey,
    topicIsUiKey: true,
    space: spec.space,
    teamName: spec.space === 'team' ? CUSTOMER_SERVICE_TEAM_NAME : null,
    time: spec.time,
    messages: [
      buildGreeting(),
      { id: createId('msg'), role: 'user', text: message },
      { id: createId('msg'), role: 'assistant', text: assistantReplyFor(message) },
    ],
  };
}

function sessionTopicLabel(session: ChatSession) {
  return session.topicIsUiKey ? ui(session.topic) : session.topic;
}

function sessionSpaceLabel(session: ChatSession) {
  if (session.space === 'personal') return ui(CUSTOMER_SERVICE_PERSONAL_SPACE_KEY);
  return session.teamName ?? CUSTOMER_SERVICE_TEAM_NAME;
}

const sessions = ref<ChatSession[]>([
  createSession(),
  ...CUSTOMER_SERVICE_DEMO_HISTORY.map(createDemoSession),
]);
const activeSessionId = ref(sessions.value[0]!.id);

const activeSession = computed(
  () => sessions.value.find((session) => session.id === activeSessionId.value) ?? sessions.value[0]!,
);

const messages = computed(() => activeSession.value.messages);

const showSuggestions = computed(
  () =>
    view.value === 'chat'
    && messages.value.length === 1
    && messages.value[0]?.role === 'assistant',
);

const { topScrim, bottomScrim, update } = useScrollChromeScrim(scrollRef, {
  contentRef,
});

async function scrollToLatest() {
  await nextTick();
  update();
  const scroller = scrollRef.value;
  if (scroller) {
    scroller.scrollTop = scroller.scrollHeight;
  }
}

function assistantReplyFor(userText: string): string {
  if (userText === ui(CUSTOMER_SERVICE_HANDOFF_KEY)) {
    return ui('Connecting you to a human agent…');
  }
  return ui('I can help with that. Please tell me more.');
}

function hasUserMessage(session: ChatSession) {
  return session.messages.some((message) => message.role === 'user');
}

const historySessions = computed(() => sessions.value.filter(hasUserMessage));

function pushUserMessage(text: string, topicKey?: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const session = activeSession.value;
  session.messages.push({
    id: createId('msg'),
    role: 'user',
    text: trimmed,
  });
  if (session.topicIsUiKey && session.topic === 'Current conversation') {
    if (topicKey) {
      session.topic = topicKey;
    } else {
      session.topic = trimmed;
      session.topicIsUiKey = false;
    }
  }
  session.time = formatSessionTime();
  session.messages.push({
    id: createId('msg'),
    role: 'assistant',
    text: assistantReplyFor(trimmed),
  });
  view.value = 'chat';
  void scrollToLatest();
}

function sendDraft() {
  const text = draft.value;
  draft.value = '';
  pushUserMessage(text);
}

function onComposerKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey) return;
  event.preventDefault();
  sendDraft();
}

function onSuggestion(key: string) {
  pushUserMessage(ui(key), key);
}

function onNewChat() {
  const session = createSession();
  sessions.value = [session, ...sessions.value];
  activeSessionId.value = session.id;
  draft.value = '';
  view.value = 'chat';
  void scrollToLatest();
}

function onOpenHistory() {
  view.value = view.value === 'history' ? 'chat' : 'history';
  void nextTick(() => update());
}

function onSelectSession(id: string) {
  activeSessionId.value = id;
  view.value = 'chat';
  void scrollToLatest();
}

function onAttachClick() {
  attachInputRef.value?.click();
}

function onAttachChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  pushUserMessage(file.name);
}

watch(
  () => [view.value, messages.value.length, sessions.value.length] as const,
  () => {
    void nextTick(() => update());
  },
);

watch(locale, () => {
  const session = activeSession.value;
  if (session.messages.length === 1 && session.messages[0]?.role === 'assistant') {
    session.messages[0] = buildGreeting();
  }
});
</script>

<template>
  <div class="eds-customer-service-panel" :class="styles.root">
    <div
      ref="scrollRef"
      :class="[styles.scroll, bottomScrim && styles.scrollFadeBottom]"
    >
      <header :class="[styles.header, topScrim && styles.headerScrim]">
        <div :class="styles.brand">
          <EgAvatar
            size="sm"
            variant="robot"
            name="CregisAI"
            :label="ui('CregisAI Assistant')"
          />
          <div :class="styles.brandCopy">
            <h2 :class="styles.title">{{ ui('CregisAI Assistant') }}</h2>
            <div :class="styles.subtitle">
              <EgListFieldOverflowText
                :text="teamPlanLabel"
                variant="secondary"
                size="small"
              />
            </div>
          </div>
        </div>
        <div :class="styles.headerActions">
          <EgIconButton
            shape="square"
            size="sm"
            :label="ui('Chat History')"
            motion="hover-enter-only"
            @click="onOpenHistory"
          >
            <EgIcon name="eds-history" fit />
          </EgIconButton>
          <EgIconButton
            shape="square"
            size="sm"
            :label="ui('New Chat')"
            motion="hover-enter-only"
            @click="onNewChat"
          >
            <EgIcon name="eds-add" fit />
          </EgIconButton>
          <EgIconButton
            shape="square"
            size="sm"
            :label="ui('Close')"
            motion="hover-enter-only"
            @click="emit('close')"
          >
            <EgIcon name="eds-win-close" fit />
          </EgIconButton>
        </div>
      </header>

      <div ref="contentRef" :class="styles.body">
        <template v-if="view === 'history'">
          <h3 :class="styles.historyTitle">{{ ui(CUSTOMER_SERVICE_HISTORY_TITLE_KEY) }}</h3>
          <p v-if="historySessions.length === 0" :class="styles.empty">
            {{ ui('No chat history') }}
          </p>
          <div v-else :class="styles.historyList">
            <template v-for="(session, index) in historySessions" :key="session.id">
              <EgDivider
                v-if="index > 0"
                type="module"
                direction="horizontal"
              />
              <button
                type="button"
                :class="[
                  styles.historyItem,
                  session.id === activeSessionId && styles.historyItemActive,
                ]"
                @click="onSelectSession(session.id)"
              >
                <span :class="styles.historyTopic">
                  <EgListFieldOverflowText
                    :text="sessionTopicLabel(session)"
                    size="medium"
                    boundary-selector=".app-preview"
                  />
                </span>
                <span :class="styles.historyMeta">
                  <span :class="styles.historyTeam">
                    <EgListFieldOverflowText
                      :text="sessionSpaceLabel(session)"
                      variant="secondary"
                      size="small"
                      boundary-selector=".app-preview"
                    />
                  </span>
                  <span :class="styles.historyTime">{{ session.time }}</span>
                </span>
              </button>
            </template>
          </div>
        </template>

        <template v-else>
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              styles.row,
              message.role === 'user' ? styles.rowUser : styles.rowAssistant,
            ]"
          >
            <EgAvatar
              v-if="message.role === 'assistant'"
              size="xs"
              variant="robot"
              name="CregisAI"
              :label="ui('CregisAI Assistant')"
            />
            <p :class="[styles.bubble, message.role === 'user' && styles.bubbleUser]">
              {{ message.text }}
            </p>
          </div>

          <div v-if="showSuggestions" :class="styles.suggestions">
            <button
              v-for="key in CUSTOMER_SERVICE_SUGGESTION_KEYS"
              :key="key"
              type="button"
              :class="styles.suggestion"
              @click="onSuggestion(key)"
            >
              {{ ui(key) }}
            </button>
          </div>
        </template>
      </div>

      <footer :class="[styles.composer, bottomScrim && styles.composerScrim]">
        <form :class="styles.composerForm" @submit.prevent="sendDraft" @keydown="onComposerKeydown">
          <div :class="styles.composerField">
            <EgInput
              v-model="draft"
              size="sm"
              width-mode="full"
              :clearable="false"
              :overflow-feedback="false"
              :placeholder="ui('Ask a question')"
            />
          </div>
          <input
            ref="attachInputRef"
            :class="styles.attachInput"
            type="file"
            @change="onAttachChange"
          />
          <EgIconButton
            shape="square"
            size="sm"
            :label="ui('Send Attachment')"
            motion="hover-enter-only"
            @click="onAttachClick"
          >
            <EgIcon name="eds-paperclip" fit />
          </EgIconButton>
          <EgIconButton
            shape="square"
            size="sm"
            :label="ui('Send')"
            :disabled="!draft.trim()"
            motion="hover-enter-only"
            type="submit"
          >
            <EgIcon name="eds-arrow-send-all-email" fit />
          </EgIconButton>
        </form>
      </footer>
    </div>
  </div>
</template>
