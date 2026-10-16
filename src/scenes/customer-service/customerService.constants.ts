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
