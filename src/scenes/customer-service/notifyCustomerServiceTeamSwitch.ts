import { customerServiceState } from './customerServiceState';

/** Field value (team display name) — do not pass through `ui()`. */
export function notifyCustomerServiceTeamSwitch(teamDisplayName: string) {
  const trimmed = teamDisplayName.trim();
  if (!trimmed) return;
  customerServiceState.teamSwitchDisplayName = trimmed;
  customerServiceState.teamSwitchSequence += 1;
}
