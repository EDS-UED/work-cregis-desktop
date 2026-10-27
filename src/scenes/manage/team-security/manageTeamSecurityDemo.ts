import type { IconName } from '@eds/desktop-components';

export const MANAGE_TEAM_SECURITY_DEMO_TEAM_NAME = 'Doris Studio';
export const MANAGE_TEAM_SECURITY_DEMO_TEAM_NUMBER = '1437097449734144';

export type ManageTeamSecurityChecklistStatus = 'attention' | 'complete';

export type ManageTeamSecurityChecklistActionTone = 'primary' | 'secondary';

export type ManageTeamSecurityChecklistItem = {
  id: string;
  icon: IconName;
  titleKey: string;
  descriptionKey: string;
  status: ManageTeamSecurityChecklistStatus;
  actionLabelKey: string;
  actionTone: ManageTeamSecurityChecklistActionTone;
  showUpgradeTag?: boolean;
};

/** 默认演示：企业认证未通过；其余项已完成。 */
export const MANAGE_TEAM_SECURITY_CHECKLIST: ManageTeamSecurityChecklistItem[] = [
  {
    id: 'enterprise-verification',
    icon: 'eds-business-type',
    titleKey: 'Enterprise Verification',
    descriptionKey: 'Team security enterprise verification hint',
    status: 'attention',
    actionLabelKey: 'Certify',
    actionTone: 'primary',
  },
  {
    id: 'address-book-verification',
    icon: 'eds-user-information',
    titleKey: 'Address Book Verification',
    descriptionKey: 'Team security address book verification hint',
    status: 'attention',
    actionLabelKey: 'Turn On',
    actionTone: 'primary',
  },
  {
    id: 'risk-control-strategy',
    icon: 'eds-engine',
    titleKey: 'Risk Control Strategy',
    descriptionKey: 'Team security risk control strategy hint',
    status: 'complete',
    actionLabelKey: 'View',
    actionTone: 'secondary',
  },
  {
    id: 'invite-members',
    icon: 'eds-user-pointer',
    titleKey: 'Invite Member',
    descriptionKey: 'Team security invite members hint',
    status: 'complete',
    actionLabelKey: 'Invite',
    actionTone: 'secondary',
  },
];
