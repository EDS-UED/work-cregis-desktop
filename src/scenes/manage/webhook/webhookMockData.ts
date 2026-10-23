export type WebhookPushStatus = 'success' | 'failed';

export const WEBHOOK_MOCK_ROW_COUNT = 28;

export type WebhookConfigRecord = {
  id: string;
  name: string;
  eventKey: 'Dangerous transaction';
  creatorName: string;
  creatorEmail: string;
  createdAt: string;
  enabled: boolean;
  endpointUrl: string;
  endpointVerified: boolean;
  secretKey: string;
};

export type WebhookPushRecord = {
  id: string;
  amlEventId: string;
  webhookId: string;
  webhookName: string;
  eventKey: 'Dangerous transaction';
  lastPushAt: string;
  pushStatus: WebhookPushStatus;
  endpointUrl: string;
  pushAttemptCount: number;
  failureReasonKey?: string;
  payloadJson: string;
  manuallyRetried: boolean;
};

const DEMO_PAYLOAD = JSON.stringify(
  {
    event: 'risky_transaction',
    timestamp: 1789528864,
    team_id: 'tm_881920491',
    data: {
      tx_hash: '0xrx2283hk37',
      chain: 'ETH',
      token: 'USDT',
      amount: '50000.00',
      kyt_risk_level: 'High Risk',
      risk_score: 85,
    },
  },
  null,
  2,
);

const WEBHOOK_NAME_POOL = [
  'AML Production Hook',
  'Ember Exchange Alerts',
  'Sandbox Listener',
  'Treasury Guard Webhook',
  'Withdraw Alert Bridge',
  'Compliance Event Relay',
  'Ops Incident Notifier',
] as const;

const CREATOR_POOL = [
  { name: 'Alex Chen', email: 'alex.chen@cregis.com' },
  { name: 'Dana Wu', email: 'dana.wu@cregis.com' },
  { name: 'Treasury', email: 'treasury@cregis.com' },
  { name: 'Ops Team', email: 'ops@cregis.com' },
  { name: 'Ben', email: 'ben@cregis.com' },
  { name: 'Chris', email: 'chris@proton.me' },
] as const;

const PUSH_STATUS_SHOWCASE: WebhookPushStatus[] = ['failed', 'success'];

function seededFraction(index: number, salt: number): number {
  const x = Math.sin((index + 1) * 9973 + salt * 7919) * 10000;
  return x - Math.floor(x);
}

function padRecordTime(baseDay: number, hour: number, minute: number, second: number): string {
  const day = String(baseDay).padStart(2, '0');
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const ss = String(second).padStart(2, '0');
  return `2032-10-${day} ${hh}:${mm}:${ss}`;
}

export function maskWebhookCreatorEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length === 1) return `${local}***@${domain}`;
  if (local.length <= 4) return `${local[0]}***${local.at(-1) ?? ''}@${domain}`;
  return `${local[0]}******${local.at(-1) ?? ''}@${domain}`;
}

export function formatWebhookCreatorDisplay(name: string, email: string): string {
  return `${name} (${maskWebhookCreatorEmail(email)})`;
}

function buildWebhookId(index: number): string {
  return `WH-${String(10000 + index).padStart(5, '0')}`;
}

function buildPushId(index: number): string {
  return `PUSH-${String(9000 + index).padStart(4, '0')}`;
}

export function buildInitialWebhookConfigs(): WebhookConfigRecord[] {
  return Array.from({ length: WEBHOOK_MOCK_ROW_COUNT }, (_, index) => {
    const creator = CREATOR_POOL[index % CREATOR_POOL.length]!;
    const name = WEBHOOK_NAME_POOL[index % WEBHOOK_NAME_POOL.length]!;
    const day = 23 - Math.floor(index / 4);
    const hour = 12 - (index % 5);
    const minute = 22 + (index % 38);
    const enabled = index === 0 || index === 2;

    return {
      id: buildWebhookId(index),
      name: index < 3 ? name : `${name} ${index + 1}`,
      eventKey: 'Dangerous transaction',
      creatorName: creator.name,
      creatorEmail: creator.email,
      createdAt: padRecordTime(Math.max(1, day), Math.max(0, hour), minute % 60, index % 60),
      enabled,
      endpointUrl: `https://hooks.example.com/aml/${index + 1}`,
      endpointVerified: true,
      secretKey: `whsec_${String(index).padStart(2, '0')}mock${seededFraction(index, 11).toString(36).slice(2, 14)}`,
    };
  });
}

export function buildInitialWebhookPushRecords(): WebhookPushRecord[] {
  return Array.from({ length: WEBHOOK_MOCK_ROW_COUNT }, (_, index) => {
    const configIndex = index % WEBHOOK_MOCK_ROW_COUNT;
    const webhookId = buildWebhookId(configIndex);
    const webhookName = WEBHOOK_NAME_POOL[configIndex % WEBHOOK_NAME_POOL.length]!;
    const pushStatus =
      index < PUSH_STATUS_SHOWCASE.length
        ? PUSH_STATUS_SHOWCASE[index]!
        : 'success';
    const day = 23 - Math.floor(index / 6);
    const minute = 10 + index;

    return {
      id: buildPushId(index),
      amlEventId: `8842-20321023${String(120000 + index).padStart(6, '0')}`,
      webhookId,
      webhookName: index < 3 ? webhookName : `${webhookName} ${configIndex + 1}`,
      eventKey: 'Dangerous transaction',
      lastPushAt: padRecordTime(Math.max(1, day), 11 + (index % 12), minute % 60, index % 60),
      pushStatus,
      endpointUrl: `https://hooks.example.com/aml/${configIndex + 1}`,
      pushAttemptCount: pushStatus === 'success' ? 1 : 4,
      failureReasonKey:
        pushStatus === 'success'
          ? undefined
          : index % 2 === 0
            ? 'Webhook push failed: connection timed out'
            : 'Webhook push failed: HTTP 502 Bad Gateway',
      payloadJson: DEMO_PAYLOAD,
      manuallyRetried: false,
    };
  });
}

export const WEBHOOK_MOCK_TEAM_ID = 'TEAM-8842';

export const WEBHOOK_GOOGLE_VERIFY_MOCK_CODE = '111111';
