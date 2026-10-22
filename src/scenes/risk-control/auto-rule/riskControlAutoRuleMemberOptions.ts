import type { EgFilterFieldMemberOption } from '@eds/desktop-components';

export type AutoRuleTeamMemberOption = {
  id: string;
  name: string;
  avatarName: string;
  emailMasked: string;
};

export const AUTO_RULE_TEAM_MEMBER_OPTIONS: AutoRuleTeamMemberOption[] = [
  {
    id: 'alex-mah',
    name: 'Alex Mah.',
    avatarName: 'Alex Mah',
    emailMasked: 't******z@gmail.com',
  },
  {
    id: 'morgan-lee',
    name: 'Morgan Lee',
    avatarName: 'Morgan Lee',
    emailMasked: 'm******e@gmail.com',
  },
  {
    id: 'ed-stark',
    name: 'Ed Stark.',
    avatarName: 'Ed Stark',
    emailMasked: 'e******k@gmail.com',
  },
  {
    id: 'emily-stone',
    name: 'Emily Stone',
    avatarName: 'Emily Stone',
    emailMasked: 'e******k@gmail.com',
  },
];

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
