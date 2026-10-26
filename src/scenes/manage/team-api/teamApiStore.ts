import { ref } from 'vue';
import {
  buildInitialTeamApiConfigs,
  type TeamApiConfigRecord,
} from './teamApiMockData';

export const teamApiConfigs = ref<TeamApiConfigRecord[]>(buildInitialTeamApiConfigs());

export function findTeamApiConfigById(id: string): TeamApiConfigRecord | undefined {
  return teamApiConfigs.value.find((config) => config.id === id);
}

export function updateTeamApiConfigEnabled(id: string, enabled: boolean) {
  const index = teamApiConfigs.value.findIndex((config) => config.id === id);
  if (index < 0) return;
  teamApiConfigs.value[index] = { ...teamApiConfigs.value[index], enabled };
}

export function removeTeamApiConfig(id: string) {
  teamApiConfigs.value = teamApiConfigs.value.filter((config) => config.id !== id);
}

export function addTeamApiConfig(
  draft: Pick<TeamApiConfigRecord, 'name' | 'permissionsKey' | 'ipWhitelist'>,
): TeamApiConfigRecord {
  const index = teamApiConfigs.value.length;
  const id = `TA-${String(10001 + index).padStart(5, '0')}`;
  const keySuffix = Math.random().toString(36).slice(2, 18);
  const record: TeamApiConfigRecord = {
    id,
    name: draft.name.trim(),
    authType: 'HMAC',
    apiKeyMasked: `ak_${keySuffix.slice(0, 3)}*******************...`,
    apiKeyFull: `ak_${String(index).padStart(2, '0')}${keySuffix}`,
    secretKey: `sk_${String(index).padStart(2, '0')}_hmac_${keySuffix}`,
    baseUrl: 'https://api.cregis.com',
    permissionsKey: draft.permissionsKey,
    ipWhitelist: draft.ipWhitelist.trim(),
    creatorName: 'Alex Chen',
    creatorEmail: 'alex.chen@cregis.com',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    enabled: true,
  };
  teamApiConfigs.value = [record, ...teamApiConfigs.value];
  return record;
}
