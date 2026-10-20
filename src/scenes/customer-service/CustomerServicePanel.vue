<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  EgIcon,
  EgIconButton,
  EgInput,
  EgListFieldOverflowText,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { getActiveTeamWorkspace, useAppTeamWorkspace } from '@/composables/appTeamWorkspace';
import { useScrollChromeScrim } from '@/scenes/tasks/shared/useScrollChromeScrim';
import {
  CUSTOMER_SERVICE_DEMO_HISTORY,
  CUSTOMER_SERVICE_FEEDBACK_OPTION_KEYS,
  CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY,
  CUSTOMER_SERVICE_FEEDBACK_OTHER_PROMPT_KEY,
  CUSTOMER_SERVICE_FEEDBACK_QUESTION_KEY,
  CUSTOMER_SERVICE_GREETING_KEY,
  CUSTOMER_SERVICE_HANDOFF_KEY,
  CUSTOMER_SERVICE_HANDOFF_REP_MESSAGE_KEY,
  CUSTOMER_SERVICE_HANDOFF_REP_NAME,
  CUSTOMER_SERVICE_HISTORY_TITLE_KEY,
  CUSTOMER_SERVICE_PERSONAL_SPACE_KEY,
  CUSTOMER_SERVICE_REFUSAL_DEMO_TRIGGER,
  CUSTOMER_SERVICE_REFUSAL_REPLY_KEY,
  CUSTOMER_SERVICE_SUGGESTION_KEYS,
  CUSTOMER_SERVICE_TEAM_SWITCH_ANNOUNCEMENT_KEY,
  type CustomerServiceChatSpace,
} from './customerService.constants';
import { customerServiceState } from './customerServiceState';
import styles from './CustomerServicePanel.module.css';

type ChatRole = 'assistant' | 'user';

type ChatMessageKind = 'normal' | 'feedback-question' | 'handoff' | 'team-switch-announcement';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  kind: ChatMessageKind;
};

type MessageFeedback = 'up' | 'down';

type PendingFeedback = {
  phase: 'choices' | 'other';
  promptMessageId: string;
};

type ChatSession = {
  id: string;
  topic: string;
  topicIsUiKey: boolean;
  space: CustomerServiceChatSpace;
  teamName: string | null;
  time: string;
  messages: ChatMessage[];
  humanHandoff: boolean;
  thumbsDownCount: number;
  messageFeedback: Record<string, MessageFeedback>;
  pendingFeedback: PendingFeedback | null;
};

const emit = defineEmits<{
  close: [];
}>();

const { ui, locale } = useAppI18n();
const { activeTeamDisplay } = useAppTeamWorkspace(ui);

const teamPlanLabel = computed(() => activeTeamDisplay.value);

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
    kind: 'normal',
  };
}

function createSessionBase(): Omit<ChatSession, 'id' | 'messages' | 'time' | 'topic'> & {
  topic: string;
} {
  return {
    topic: 'Current conversation',
    topicIsUiKey: true,
    space: 'team',
    teamName: activeTeamDisplay.value,
    humanHandoff: false,
    thumbsDownCount: 0,
    messageFeedback: {},
    pendingFeedback: null,
  };
}

function createSession(): ChatSession {
  return {
    id: createId('session'),
    ...createSessionBase(),
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
    teamName: spec.space === 'team' ? getActiveTeamWorkspace().name : null,
    time: spec.time,
    messages: [
      buildGreeting(),
      { id: createId('msg'), role: 'user', text: message, kind: 'normal' },
      {
        id: createId('msg'),
        role: 'assistant',
        text: assistantReplyFor(message),
        kind: 'normal',
      },
    ],
    humanHandoff: false,
    thumbsDownCount: 0,
    messageFeedback: {},
    pendingFeedback: null,
  };
}

function sessionTopicLabel(session: ChatSession) {
  return session.topicIsUiKey ? ui(session.topic) : session.topic;
}

function sessionSpaceLabel(session: ChatSession) {
  if (session.space === 'personal') return ui(CUSTOMER_SERVICE_PERSONAL_SPACE_KEY);
  return session.teamName ?? getActiveTeamWorkspace().name;
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
    && messages.value[0]?.role === 'assistant'
    && !activeSession.value.pendingFeedback,
);

const composerPlaceholder = computed(() => {
  if (activeSession.value.pendingFeedback?.phase === 'other') {
    return ui(CUSTOMER_SERVICE_FEEDBACK_OTHER_PROMPT_KEY);
  }
  return ui('Ask a question');
});

function firstAssistantMessageIndex(list: ChatMessage[]) {
  return list.findIndex((message) => message.role === 'assistant');
}

function shouldShowMessageFeedback(message: ChatMessage, messageIndex: number) {
  const session = activeSession.value;
  if (session.humanHandoff) return false;
  if (message.role !== 'assistant' || message.kind !== 'normal') return false;
  return messageIndex !== firstAssistantMessageIndex(messages.value);
}

function formatHandoffRepMessage() {
  return ui(CUSTOMER_SERVICE_HANDOFF_REP_MESSAGE_KEY).replace(
    '{name}',
    CUSTOMER_SERVICE_HANDOFF_REP_NAME,
  );
}

function pushAssistantMessage(
  session: ChatSession,
  text: string,
  kind: ChatMessageKind = 'normal',
) {
  session.messages.push({
    id: createId('msg'),
    role: 'assistant',
    text,
    kind,
  });
}

const HUMAN_HANDOFF_LOAD_DELAY_MS = 1200;

function triggerHumanHandoff(session: ChatSession) {
  if (session.humanHandoff) return;
  session.humanHandoff = true;
  session.pendingFeedback = null;

  const connectingText = ui('Connecting you to a human agent…');
  const lastMessage = session.messages[session.messages.length - 1];
  const alreadyConnecting =
    lastMessage?.role === 'assistant' && lastMessage.text === connectingText;

  if (!alreadyConnecting) {
    pushAssistantMessage(session, connectingText, 'normal');
    void scrollToLatest();
  }

  window.setTimeout(() => {
    pushAssistantMessage(session, formatHandoffRepMessage(), 'handoff');
    void scrollToLatest();
  }, HUMAN_HANDOFF_LOAD_DELAY_MS);
}

function buildTeamSwitchAnnouncement(teamDisplayName: string): ChatMessage {
  return {
    id: createId('msg'),
    role: 'assistant',
    text: ui(CUSTOMER_SERVICE_TEAM_SWITCH_ANNOUNCEMENT_KEY).replace('{team}', teamDisplayName),
    kind: 'team-switch-announcement',
  };
}

function appendTeamSwitchAnnouncement(session: ChatSession, teamDisplayName: string) {
  session.teamName = teamDisplayName;
  session.messages.push(buildTeamSwitchAnnouncement(teamDisplayName));
  session.time = formatSessionTime();
}

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
  if (userText.toLowerCase().includes(CUSTOMER_SERVICE_REFUSAL_DEMO_TRIGGER)) {
    return ui(CUSTOMER_SERVICE_REFUSAL_REPLY_KEY);
  }
  return ui('I can help with that. Please tell me more.');
}

function onThumbUp(messageId: string) {
  const session = activeSession.value;
  if (session.humanHandoff) return;
  session.messageFeedback[messageId] = 'up';
}

function onThumbDown(messageId: string) {
  const session = activeSession.value;
  if (session.humanHandoff) return;

  session.messageFeedback[messageId] = 'down';
  session.thumbsDownCount += 1;

  if (session.thumbsDownCount >= 2) {
    triggerHumanHandoff(session);
    return;
  }

  if (session.pendingFeedback) return;

  const promptId = createId('msg');
  session.messages.push({
    id: promptId,
    role: 'assistant',
    text: ui(CUSTOMER_SERVICE_FEEDBACK_QUESTION_KEY),
    kind: 'feedback-question',
  });
  session.pendingFeedback = { phase: 'choices', promptMessageId: promptId };
  session.time = formatSessionTime();
  void scrollToLatest();
}

function onFeedbackChoice(key: string) {
  const session = activeSession.value;
  const pending = session.pendingFeedback;
  if (!pending || pending.phase !== 'choices') return;

  session.messages.push({
    id: createId('msg'),
    role: 'user',
    text: ui(key),
    kind: 'normal',
  });
  session.pendingFeedback = null;

  if (key === CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY) {
    const promptId = createId('msg');
    session.messages.push({
      id: promptId,
      role: 'assistant',
      text: ui(CUSTOMER_SERVICE_FEEDBACK_OTHER_PROMPT_KEY),
      kind: 'feedback-question',
    });
    session.pendingFeedback = { phase: 'other', promptMessageId: promptId };
  }

  session.time = formatSessionTime();
  void scrollToLatest();
}

function hasUserMessage(session: ChatSession) {
  return session.messages.some((message) => message.role === 'user');
}

const historySessions = computed(() => sessions.value.filter(hasUserMessage));

function pushUserMessage(text: string, topicKey?: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const session = activeSession.value;

  if (session.pendingFeedback?.phase === 'other') {
    session.messages.push({
      id: createId('msg'),
      role: 'user',
      text: trimmed,
      kind: 'normal',
    });
    session.pendingFeedback = null;
    session.time = formatSessionTime();
    view.value = 'chat';
    void scrollToLatest();
    return;
  }

  session.messages.push({
    id: createId('msg'),
    role: 'user',
    text: trimmed,
    kind: 'normal',
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
  const reply = assistantReplyFor(trimmed);
  session.messages.push({
    id: createId('msg'),
    role: 'assistant',
    text: reply,
    kind: 'normal',
  });
  if (reply === ui(CUSTOMER_SERVICE_REFUSAL_REPLY_KEY)) {
    triggerHumanHandoff(session);
  }
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

watch(
  () => customerServiceState.teamSwitchSequence,
  (sequence) => {
    if (sequence === 0) return;
    const teamDisplayName = customerServiceState.teamSwitchDisplayName;
    if (!teamDisplayName) return;
    appendTeamSwitchAnnouncement(activeSession.value, teamDisplayName);
    view.value = 'chat';
    void scrollToLatest();
  },
);
</script>

<template>
  <div class="eds-customer-service-panel" :class="styles.root">
    <div
      ref="scrollRef"
      :class="[styles.scroll, bottomScrim && styles.scrollFadeBottom]"
    >
      <header :class="[styles.header, topScrim && styles.headerScrim]">
        <div :class="styles.brand">
          <span :class="styles.assistantAvatarSm" aria-hidden="true">
            <EgIcon name="eds-sparkle" size="sm" fit />
          </span>
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
            <button
              v-for="session in historySessions"
              :key="session.id"
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
          </div>
        </template>

        <template v-else>
          <template v-for="(message, messageIndex) in messages" :key="message.id">
            <div
              v-if="
                message.kind === 'team-switch-announcement' || message.kind === 'handoff'
              "
              :class="styles.announcementRow"
            >
              <p :class="styles.announcementPill">
                <span
                  v-if="message.kind === 'team-switch-announcement'"
                  :class="styles.announcementIcon"
                  aria-hidden="true"
                >
                  💡
                </span>
                <span :class="styles.announcementText">{{ message.text }}</span>
              </p>
            </div>
            <div
              v-else
              :class="[
                styles.row,
                message.role === 'user' ? styles.rowUser : styles.rowAssistant,
              ]"
            >
              <span
                v-if="message.role === 'assistant'"
                :class="styles.assistantAvatarXs"
                aria-hidden="true"
              >
                <EgIcon name="eds-sparkle" size="sm" fit />
              </span>
              <p :class="[styles.bubble, message.role === 'user' && styles.bubbleUser]">
                {{ message.text }}
              </p>
            </div>
            <div
              v-if="shouldShowMessageFeedback(message, messageIndex)"
              :class="styles.feedbackRow"
            >
              <button
                type="button"
                :class="[
                  styles.feedbackBtn,
                  activeSession.messageFeedback[message.id] === 'up' && styles.feedbackBtnActive,
                ]"
                :aria-label="ui('Helpful')"
                @click="onThumbUp(message.id)"
              >
                👍
              </button>
              <button
                type="button"
                :class="[
                  styles.feedbackBtn,
                  activeSession.messageFeedback[message.id] === 'down' && styles.feedbackBtnActive,
                ]"
                :aria-label="ui('Not helpful')"
                @click="onThumbDown(message.id)"
              >
                👎
              </button>
            </div>
            <div
              v-if="
                message.kind === 'feedback-question'
                  && activeSession.pendingFeedback?.promptMessageId === message.id
                  && activeSession.pendingFeedback.phase === 'choices'
              "
              :class="styles.feedbackChoices"
            >
              <button
                v-for="key in CUSTOMER_SERVICE_FEEDBACK_OPTION_KEYS"
                :key="key"
                type="button"
                :class="styles.feedbackChoice"
                @click="onFeedbackChoice(key)"
              >
                {{ ui(key) }}
              </button>
            </div>
          </template>

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
              :placeholder="composerPlaceholder"
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
