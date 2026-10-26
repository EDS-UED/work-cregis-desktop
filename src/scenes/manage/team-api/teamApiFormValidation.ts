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

export function teamApiIpWhitelistIsValid(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (!tokens.length) return false;
  return tokens.every((token) => /^[0-9a-fA-F.:]+$/.test(token));
}
