import {
  webhookNameAllowsEditSave,
  webhookNameHasInvalidCharacters,
  webhookNameIsValid,
} from '@/scenes/manage/webhook/webhookFormValidation';

export function teamApiNameIsValid(value: string): boolean {
  return webhookNameIsValid(value);
}

export function teamApiNameAllowsEditSave(value: string): boolean {
  return webhookNameAllowsEditSave(value);
}

export function teamApiNameHasInvalidCharacters(value: string): boolean {
  return webhookNameHasInvalidCharacters(value);
}

function teamApiIpWhitelistTokens(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  return trimmed.split(/[\s,;、]+/).filter(Boolean);
}

export function teamApiIpWhitelistIsValid(value: string): boolean {
  const tokens = teamApiIpWhitelistTokens(value);
  if (!tokens.length) return false;
  return tokens.every((token) => /^[0-9a-fA-F.:]+$/.test(token));
}
