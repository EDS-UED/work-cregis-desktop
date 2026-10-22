import { webhookNameHasInvalidCharacters } from '@/scenes/manage/webhook/webhookFormValidation';

export function autoRuleNameHasInvalidCharacters(value: string): boolean {
  return webhookNameHasInvalidCharacters(value);
}

export function validateAutoRuleNameLength(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 30;
}

export function autoRuleNameLengthValid(value: string): boolean {
  return validateAutoRuleNameLength(value);
}

export function autoRuleNameIsValid(value: string): boolean {
  return !autoRuleNameHasInvalidCharacters(value) && autoRuleNameLengthValid(value);
}

export function validateAutoRuleRiskScoreThreshold(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const parsed = Number.parseFloat(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 10) return false;
  return /^\d+(\.\d)?$/.test(trimmed);
}
