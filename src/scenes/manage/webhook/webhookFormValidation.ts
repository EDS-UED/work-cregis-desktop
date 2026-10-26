const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
const CJK_PATTERN = /\p{Script=Han}/u;

/** 名称类输入（Webhook、AML 规则等）：允许空格；禁 emoji；长度在 blur 后单独校验。 */
export function webhookNameHasInvalidCharacters(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return EMOJI_PATTERN.test(trimmed);
}

export function webhookNameLengthValid(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 20;
}

export function webhookNameIsValid(value: string): boolean {
  return !webhookNameHasInvalidCharacters(value) && webhookNameLengthValid(value);
}

/** 编辑页底栏：有改动即可点保存；超长等在提交时再拦并展示校验。 */
export function webhookNameAllowsEditSave(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && !webhookNameHasInvalidCharacters(trimmed);
}

export function endpointUrlHasInvalidCharacters(value: string): boolean {
  if (EMOJI_PATTERN.test(value)) return true;
  return CJK_PATTERN.test(value);
}

export function endpointUrlHttpsValid(value: string): boolean {
  return /^https:\/\/.+/i.test(value.trim());
}

export function endpointUrlIsValid(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (endpointUrlHasInvalidCharacters(trimmed)) return false;
  return endpointUrlHttpsValid(trimmed);
}
