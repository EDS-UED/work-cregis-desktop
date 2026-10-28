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
if (/closest\('\[tabindex="0"\]\[aria-expanded\]'\)/.test(scopeUtil)) {
  fail('click opener 禁止 ancestor closest，避免 hover openNow 误关 click Popover');
}
if (!/shouldSkipClickPopoverOutsideDismissForCoexistence/.test(scopeUtil)) {
  fail('须提供 hover 与 click 同屏时的 outside-dismiss 豁免');
}
if (!/isHoverAnchoredTooltipExceptNode/.test(scopeUtil) || !/isPointerOverHoverAnchoredLayer/.test(scopeUtil)) {
  fail('hover opener 与 close-on-scroll 须按 hover 层判定，不得关掉任意 click 浮层');
}
if (!/event\.type === 'scroll' && isPointerOverHoverAnchoredLayer/.test(scopeUtil)) {
  fail('指针在 hover 层上时须跳过 click 浮层的 close-on-scroll');
}
if (!/installAnchoredTooltipCoexistGuard/.test(read('src/utils/installAnchoredTooltipCoexistGuard.ts'))) {
  fail('须始终安装 coexist guard（main 入口）');
}
if (!/installAnchoredTooltipCoexistGuard/.test(read('src/dev/shell-debug/installShellDebugGuardEarly.ts'))) {
  fail('installShellDebugGuardEarly 须无条件安装 coexist guard');
}
if (/VITE_SHELL_DEBUG/.test(read('src/dev/shell-debug/installShellDebugGuardEarly.ts'))) {
  fail('coexist guard 不得再 gated 于 VITE_SHELL_DEBUG');
}
if (!/isHoverAnchoredTooltipInteractionTarget/.test(scopeUtil)) {
  fail('anchoredTooltipLayerScope 须提供 hover 浮层 interaction 判定');
}

if (!/isHoverAnchoredTooltipExceptNode/.test(shim) || !/hover-only/.test(shim)) {
  fail('anchoredTooltipManager shim 须用 shared scope 做 hover-only closeAll');
}

if (!/shouldSkipClickPopoverOutsideDismissForCoexistence/.test(guard)) {
  fail('installShellDebugFloatLayerGuard 须跳过 hover/AML 同屏时的 outside-dismiss');
}

const viteConfig = read('vite.config.ts');
if (!/skipSelf:\s*true/.test(viteConfig) || !/this\.resolve\(source/.test(viteConfig)) {
  fail('vite alias 须按解析后的真实路径替换 anchoredTooltipManager，否则 EDS 相对 import 仍走原版 closeAll');
}

console.log('verify-anchored-tooltip-layer-scope: ok');
