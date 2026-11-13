import type { EgFilterFieldMemberOption } from '@eds/desktop-components';
import { maskDisplayEmail } from '@/utils/maskDisplayEmail';

export type AutoRuleTeamMemberOption = {
  id: string;
  name: string;
  avatarName: string;
  emailMasked: string;
};

/** email-display-seed */
const AUTO_RULE_TEAM_MEMBER_RAW = [
  { id: 'alex-mah', name: 'Alex Mah.', avatarName: 'Alex Mah', email: 'testz@gmail.com' },
  { id: 'morgan-lee', name: 'Morgan Lee', avatarName: 'Morgan Lee', email: 'morganlee@gmail.com' },
  { id: 'ed-stark', name: 'Ed Stark.', avatarName: 'Ed Stark', email: 'edstark@gmail.com' },
  { id: 'emily-stone', name: 'Emily Stone', avatarName: 'Emily Stone', email: 'emilyk@gmail.com' },
] as const;

export const AUTO_RULE_TEAM_MEMBER_OPTIONS: AutoRuleTeamMemberOption[] =
  AUTO_RULE_TEAM_MEMBER_RAW.map((member) => ({
    id: member.id,
    name: member.name,
    avatarName: member.avatarName,
    emailMasked: maskDisplayEmail(member.email),
  }));

export function autoRuleTeamMemberById(id: string): AutoRuleTeamMemberOption | undefined {
  return AUTO_RULE_TEAM_MEMBER_OPTIONS.find((member) => member.id === id);
}

export function autoRuleTeamMemberFilterOptions(): EgFilterFieldMemberOption[] {
  return AUTO_RULE_TEAM_MEMBER_OPTIONS.map((member) => ({
    id: member.id,
    label: member.name,
    name: member.avatarName,
  }));
}
