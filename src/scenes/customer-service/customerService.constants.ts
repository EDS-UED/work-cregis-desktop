/** Customer service widget — product spec 400×623; docked bottom-left next to NavBar (not a Dialog/Detail preset). */
export const CUSTOMER_SERVICE_POPUP_WIDTH = 400;
export const CUSTOMER_SERVICE_POPUP_HEIGHT = 623;

/** Demo team identity (field values — do not pass to `ui()`). */
export const CUSTOMER_SERVICE_TEAM_NAME = 'Acme Technology Co.';
export const CUSTOMER_SERVICE_SUBSCRIPTION_PLAN = 'Enterprise';

export const CUSTOMER_SERVICE_GREETING_KEY =
  'Hello! I am CregisAI Assistant. I can see you are currently on [{page}]. How can I help?';

export const CUSTOMER_SERVICE_SUGGESTION_KEYS = [
  'How do I change the daily withdrawal limit?',
  'How do I configure team role permissions and risk-control rules?',
  'Look up an unreceived order (handoff to a human agent)',
] as const;

export const CUSTOMER_SERVICE_HANDOFF_KEY = 'Look up an unreceived order (handoff to a human agent)';

/** Demo: user message containing this substring triggers AI refusal → human handoff. */
export const CUSTOMER_SERVICE_REFUSAL_DEMO_TRIGGER = 'refuse-demo';

export const CUSTOMER_SERVICE_REFUSAL_REPLY_KEY =
  'I’m unable to help with that request.';

export const CUSTOMER_SERVICE_FEEDBACK_QUESTION_KEY =
  'What went wrong with this response?';

export const CUSTOMER_SERVICE_FEEDBACK_OTHER_PROMPT_KEY =
  'Please describe what went wrong.';

export const CUSTOMER_SERVICE_HANDOFF_REP_MESSAGE_KEY =
  'You are speaking with customer service representative "{name}".';

/** Demo agent display name (field value — do not pass to `ui()`). */
export const CUSTOMER_SERVICE_HANDOFF_REP_NAME = 'Alex Chen';

export const CUSTOMER_SERVICE_TEAM_SWITCH_ANNOUNCEMENT_KEY =
  'Switched to [{team}], AI permissions and SOP have been updated.';

export const CUSTOMER_SERVICE_FEEDBACK_OPTION_KEYS = [
  'Inaccurate answer',
  'Ineffective steps',
  'Irrelevant response',
  'Others',
] as const;

export const CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY = 'Others';

export const CUSTOMER_SERVICE_HISTORY_TITLE_KEY = 'Conversation History Records';
export const CUSTOMER_SERVICE_PERSONAL_SPACE_KEY = 'Web3 Wallet';

export type CustomerServiceChatSpace = 'team' | 'personal';

export const CUSTOMER_SERVICE_DEMO_HISTORY = [
  {
    topicKey: 'Daily Withdrawal Limit',
    messageKey: 'How do I change the daily withdrawal limit?',
    space: 'team' as const,
    time: '2026-10-16 10:32',
  },
  {
    topicKey: 'Team Role Permissions and Risk-Control Rules',
    messageKey: 'How do I configure team role permissions and risk-control rules?',
    space: 'team' as const,
    time: '2026-10-15 18:04',
  },
  {
    topicKey: 'Unreceived Order Inquiry',
    messageKey: 'Look up an unreceived order (handoff to a human agent)',
    space: 'personal' as const,
    time: '2026-10-14 09:12',
  },
] as const;
