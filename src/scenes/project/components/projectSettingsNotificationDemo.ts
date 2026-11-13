import { maskDisplayEmail } from '@/utils/maskDisplayEmail';

export type ProjectSettingsNotificationMember = {
  id: string;
  name: string;
  email: string;
  /** web3-avatar-N palette index (0-based). */
  colorIndex: number;
};

export type ProjectSettingsNotificationItem = {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  enabled: boolean;
  showEdit: boolean;
  members?: ProjectSettingsNotificationMember[];
  /** Full member list when overflow expand is available. */
  allMembers?: ProjectSettingsNotificationMember[];
  overflowCount?: number;
};

function withMaskedMemberEmail(
  member: ProjectSettingsNotificationMember,
): ProjectSettingsNotificationMember {
  return { ...member, email: maskDisplayEmail(member.email) };
}

/** email-display-seed */
const CALLBACK_FAILED_ALL_MEMBERS_RAW: ProjectSettingsNotificationMember[] = [
  { id: 'mariano', name: 'Mariano', email: 'Mariano@x.com', colorIndex: 0 },
  { id: 'erika', name: 'Erika Mateo', email: 'erike@cregis.com', colorIndex: 1 },
  { id: 'azar', name: 'Azar Hosseini', email: 'hosseini@htomail.com', colorIndex: 9 },
  { id: 'gaspar', name: 'Gaspar', email: 'gaspar@htomail.com', colorIndex: 14 },
  { id: 'camps', name: 'Camps', email: 'camps@fox.com', colorIndex: 18 },
  { id: 'diana', name: 'Diana Cole', email: 'diana@cregis.com', colorIndex: 2 },
  { id: 'frank', name: 'Frank Lin', email: 'frank@htomail.com', colorIndex: 5 },
  { id: 'helen', name: 'Helen Wu', email: 'helen@fox.com', colorIndex: 11 },
  { id: 'ivan', name: 'Ivan Petrov', email: 'ivan@x.com', colorIndex: 16 },
];

const CALLBACK_FAILED_ALL_MEMBERS =
  CALLBACK_FAILED_ALL_MEMBERS_RAW.map(withMaskedMemberEmail);

export const NOTIFICATION_MEMBER_PREVIEW_LIMIT = 5;

export type ProjectSettingsNotificationPreset = 'waas' | 'waas-order' | 'payment-engine';

const INSUFFICIENT_BALANCE_ITEM_ID = 'insufficient-balance';

function maskNotificationItemMembers(
  item: ProjectSettingsNotificationItem,
): ProjectSettingsNotificationItem {
  return {
    ...item,
    members: item.members?.map(withMaskedMemberEmail),
    allMembers: item.allMembers?.map(withMaskedMemberEmail),
  };
}

export function resolveNotificationDemoItems(preset: ProjectSettingsNotificationPreset) {
  const items = preset === 'waas-order'
    ? NOTIFICATION_DEMO_ITEMS
    : NOTIFICATION_DEMO_ITEMS.filter((item) => item.id !== INSUFFICIENT_BALANCE_ITEM_ID);
  return items.map(maskNotificationItemMembers);
}

/** email-display-seed — 经 resolveNotificationDemoItems 脱敏后展示 */
export const NOTIFICATION_DEMO_ITEMS: ProjectSettingsNotificationItem[] = [
  {
    id: 'callback-failed',
    titleKey: 'Callback Failed',
    enabled: true,
    showEdit: true,
    allMembers: CALLBACK_FAILED_ALL_MEMBERS,
    overflowCount: 99,
  },
  {
    id: 'enable-disable',
    titleKey: 'Enable / Disable Project',
    enabled: false,
    showEdit: true,
    members: [
      { id: 'mariano', name: 'Mariano', email: 'Mariano@x.com', colorIndex: 0 },
      { id: 'erika', name: 'Erika Mateo', email: 'erike@cregis.com', colorIndex: 1 },
    ],
  },
  {
    id: 'reset-api-key',
    titleKey: 'Reset API Key',
    enabled: false,
    showEdit: true,
    members: [
      { id: 'mariano', name: 'Mariano', email: 'Mariano@x.com', colorIndex: 0 },
      { id: 'erika', name: 'Erika Mateo', email: 'erike@cregis.com', colorIndex: 1 },
    ],
  },
  {
    id: 'insufficient-balance',
    titleKey: 'Insufficient team balance to cover service charges',
    enabled: false,
    showEdit: true,
    members: [
      { id: 'mariano', name: 'Mariano', email: 'Mariano@x.com', colorIndex: 0 },
      { id: 'erika', name: 'Erika Mateo', email: 'erike@cregis.com', colorIndex: 1 },
    ],
  },
];
