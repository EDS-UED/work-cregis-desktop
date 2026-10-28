#!/usr/bin/env node
/**
 * click / hover 锚定浮层同屏：shim closeAll scope + outside-dismiss 豁免。
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(relPath) {
  return readFileSync(join(repoRoot, relPath), 'utf8');
}

function fail(message) {
  console.error(`verify-anchored-tooltip-layer-scope: FAILED — ${message}`);
  process.exit(1);
}

const scopeUtil = read('src/utils/anchoredTooltipLayerScope.ts');
const shim = read('src/dev/shell-debug/shim/anchoredTooltipManager.ts');
const guard = read('src/dev/shell-debug/installShellDebugFloatLayerGuard.ts');

if (!/isClickAnchoredTooltipOpenExceptNode/.test(scopeUtil)) {
  fail('anchoredTooltipLayerScope 须提供 click opener 判定');
}
if (!/\[tabindex="0"\]\[aria-expanded\]/.test(scopeUtil)) {
  fail('click opener 须同时要求 tabindex=0 与 aria-expanded，禁止误匹配行内其它 tabindex=0');
}
if (!/isHoverAnchoredTooltipInteractionTarget/.test(scopeUtil)) {
  fail('anchoredTooltipLayerScope 须提供 hover 浮层 interaction 判定');
}

if (!/isClickAnchoredTooltipOpenExceptNode/.test(shim) || !/hover-only/.test(shim)) {
  fail('anchoredTooltipManager shim 须用 shared scope 做 hover-only closeAll');
}

if (!/isHoverAnchoredTooltipInteractionTarget/.test(guard)) {
  fail('installShellDebugFloatLayerGuard 须在 hover 浮层上跳过 outside-dismiss');
}

console.log('verify-anchored-tooltip-layer-scope: ok');
