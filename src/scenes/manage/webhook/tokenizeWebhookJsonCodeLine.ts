export type WebhookJsonCodeTokenKind =
  | 'plain'
  | 'key'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'punct';

export type WebhookJsonCodeToken = {
  kind: WebhookJsonCodeTokenKind;
  text: string;
};

const STRING_RE = /^"(?:\\.|[^"\\])*"/;
const NUMBER_RE = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/;
const WORD_RE = /^(true|false|null)\b/;

function pushPlain(tokens: WebhookJsonCodeToken[], text: string) {
  if (!text) return;
  const last = tokens[tokens.length - 1];
  if (last?.kind === 'plain') {
    last.text += text;
    return;
  }
  tokens.push({ kind: 'plain', text });
}

/** Pretty-printed JSON 行内语法分词（非完整 parser，足够展示 webhook payload）。 */
export function tokenizeWebhookJsonCodeLine(line: string): WebhookJsonCodeToken[] {
  const tokens: WebhookJsonCodeToken[] = [];
  let index = 0;

  while (index < line.length) {
    const rest = line.slice(index);

    if (/^\s+/.test(rest)) {
      const match = rest.match(/^\s+/);
      pushPlain(tokens, match![0]);
      index += match![0].length;
      continue;
    }

    const stringMatch = rest.match(STRING_RE);
    if (stringMatch) {
      const text = stringMatch[0];
      const after = rest.slice(text.length);
      if (/^\s*:/.test(after)) {
        tokens.push({ kind: 'key', text });
      } else {
        tokens.push({ kind: 'string', text });
      }
      index += text.length;
      continue;
    }

    const numberMatch = rest.match(NUMBER_RE);
    if (numberMatch) {
      tokens.push({ kind: 'number', text: numberMatch[0] });
      index += numberMatch[0].length;
      continue;
    }

    const wordMatch = rest.match(WORD_RE);
    if (wordMatch) {
      const text = wordMatch[0];
      tokens.push({
        kind: text === 'null' ? 'null' : 'boolean',
        text,
      });
      index += text.length;
      continue;
    }

    if (/^[{}[\],:]/.test(rest)) {
      tokens.push({ kind: 'punct', text: rest[0]! });
      index += 1;
      continue;
    }

    pushPlain(tokens, rest[0]!);
    index += 1;
  }

  return tokens;
}

export function splitWebhookJsonCodeLines(content: string): string[] {
  if (!content) return [];
  return content.split('\n');
}
