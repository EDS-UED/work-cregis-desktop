import { computed, reactive } from 'vue';
import { notifyCustomerServiceTeamSwitch } from '@/scenes/customer-service/notifyCustomerServiceTeamSwitch';

export type TeamWorkspacePlanKey = 'Starter' | 'Business' | 'Enterprise';

export type TeamWorkspaceOption = {
  id: string;
  name: string;
  planLabelKey: TeamWorkspacePlanKey;
};

/** Demo workspaces for team switch (field names — do not pass to `ui()`). */
export const APP_TEAM_WORKSPACE_OPTIONS: readonly TeamWorkspaceOption[] = [
  { id: 'tony', name: 'Tony', planLabelKey: 'Starter' },
  { id: 'hello', name: 'Hello Team', planLabelKey: 'Business' },
  { id: 'acme', name: 'Acme Technology Co.', planLabelKey: 'Enterprise' },
  { id: 'test', name: '测试团队', planLabelKey: 'Enterprise' },
] as const;

export const appTeamWorkspaceState = reactive({
  activeTeamId: 'test',
});

export function teamWorkspaceMark(name: string) {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0) : 'G';
}

export function getActiveTeamWorkspace() {
  return (
    APP_TEAM_WORKSPACE_OPTIONS.find((team) => team.id === appTeamWorkspaceState.activeTeamId)
    ?? APP_TEAM_WORKSPACE_OPTIONS[2]
  );
}

export function formatTeamWorkspaceDisplay(
  team: TeamWorkspaceOption,
  translate: (key: string) => string,
) {
  return `${team.name} (${translate(team.planLabelKey)})`;
}

export function useAppTeamWorkspace(translate: (key: string) => string) {
  const activeTeam = computed(() => getActiveTeamWorkspace());

  const activeTeamDisplay = computed(() =>
    formatTeamWorkspaceDisplay(activeTeam.value, translate),
  );

  const corporationMark = computed(() => teamWorkspaceMark(activeTeam.value.name));

  function switchTeam(teamId: string) {
    if (teamId === appTeamWorkspaceState.activeTeamId) return;
    const team = APP_TEAM_WORKSPACE_OPTIONS.find((option) => option.id === teamId);
    if (!team) return;
    appTeamWorkspaceState.activeTeamId = teamId;
    notifyCustomerServiceTeamSwitch(formatTeamWorkspaceDisplay(team, translate));
  }

  return {
    options: APP_TEAM_WORKSPACE_OPTIONS,
    activeTeam,
    activeTeamDisplay,
    corporationMark,
    switchTeam,
  };
}
