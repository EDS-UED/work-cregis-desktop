#!/usr/bin/env node
/**
 * EgGasFeePopover 四网（BTC / ETH / TON / TRON）矿工费 Popover catalog 与
 * eds-desktop Showcase `gasFeeShowcaseMock` 及 uiTextZhCN 对齐。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SHOWCASE_MOCK = join(
  ROOT,
  '../eds-desktop/apps/showcase/src/views/components/previews/gasFeeShowcaseMock.ts',
);
const UI_ZH = join(ROOT, 'src/i18n/uiTextZhCN.ts');

/** 批签 stub / TON 等：Showcase 未列但四网 Popover 会用到。 */
const EXTRA_MINER_FEE_POPOVER_KEYS = [
  'Miner fee batch stub btc',
  'Miner fee batch stub ada',
  'Miner fee batch stub fil',
  'Miner fee batch stub tron',
  'Miner fee batch stub tron streamer',
  'Miner fee network stub ton xrp',
  'Miner fee network stub evm',
];

function parseShowcaseGasFeeUiText(source) {
  const match = source.match(
    /const SHOWCASE_GAS_FEE_UI_TEXT: Record<string, string> = (\{[\s\S]*?\n\});/,
  );
  if (!match) {
    throw new Error('SHOWCASE_GAS_FEE_UI_TEXT not found in gasFeeShowcaseMock.ts');
  }
  const objectLiteral = match[1];
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${objectLiteral});`)();
}

function readUiTextZhCNValue(source, key) {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`'${esc}':\\s*'((?:\\\\'|[^'])*)'`, 's'),
    new RegExp(`'${esc}':\\s*\\n\\s*'((?:\\\\'|[^'])*)'`, 's'),
    new RegExp(`\\b${esc}:\\s*'((?:\\\\'|[^'])*)'`, 's'),
    new RegExp(`\\b${esc}:\\s*\\n\\s*'((?:\\\\'|[^'])*)'`, 's'),
  ];
  for (const re of patterns) {
    const m = source.match(re);
    if (m) return m[1].replace(/\\'/g, "'");
  }
  return undefined;
}

let showcaseSource;
try {
  showcaseSource = readFileSync(SHOWCASE_MOCK, 'utf8');
} catch {
  console.error(`[verify-miner-fee-gas-fee-i18n] missing ${SHOWCASE_MOCK}`);
  process.exit(1);
}

const uiSource = readFileSync(UI_ZH, 'utf8');
const showcaseCatalog = parseShowcaseGasFeeUiText(showcaseSource);

const requiredKeys = [
  ...Object.keys(showcaseCatalog),
  ...EXTRA_MINER_FEE_POPOVER_KEYS,
];

let failed = false;

for (const key of requiredKeys) {
  const zh = readUiTextZhCNValue(uiSource, key);
  if (zh === undefined) {
    console.error(`[verify-miner-fee-gas-fee-i18n] uiTextZhCN missing key: ${key}`);
    failed = true;
    continue;
  }
  const expected = showcaseCatalog[key];
  if (expected !== undefined && zh !== expected) {
    console.error(
      `[verify-miner-fee-gas-fee-i18n] uiTextZhCN mismatch for "${key}"\n  showcase: ${JSON.stringify(expected)}\n  zhCN:     ${JSON.stringify(zh)}`,
    );
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log(
  `✓ verify-miner-fee-gas-fee-i18n passed (${Object.keys(showcaseCatalog).length} showcase keys + ${EXTRA_MINER_FEE_POPOVER_KEYS.length} extra)`,
);
