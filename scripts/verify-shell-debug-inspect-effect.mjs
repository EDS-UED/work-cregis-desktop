#!/usr/bin/env node
/**
 * Dev Inspect Effect 语义类 —— 不变量校验。
 *
 * E1 effectSemanticSpec 含 primaryToken + layoutSnippet
 * E2 样式一行 class · token；布局仅关键片段
 * E3 buildTooltipUsageSnippet 始终含 panelKind
 * E4 buildInspectCodeSections effect 区块优先于 declared
 * E5 catalog / panelKind 映射真源 inspectTooltipPanelKind.ts
 * E7 容器行 = raw panelKind；Popover 内无容器行
 * E6 语法色单一真源：shellDebugInspectCodeTokens.css 的全局类，无容器分支 / inline style
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const inspectDir = join(repoRoot, 'src/dev/shell-debug/inspect');
const read = (name) => readFileSync(join(inspectDir, name), 'utf8');

const errors = [];
const fail = (id, msg) => errors.push(`${id} ${msg}`);

const specSource = read('effectSemanticSpec.ts');
const effectSource = read('buildEffectSemanticInspect.ts');
const sectionsSource = read('buildInspectCodeSections.ts');
const catalogSource = read('edsInspectCatalog.ts');
const panelKindSource = read('inspectTooltipPanelKind.ts');
const tooltipContainerSource = read('resolveInspectTooltipContainer.ts');

if (!specSource.includes('primaryToken')) {
  fail('E1', 'effectSemanticSpec 须含 primaryToken');
}
if (!specSource.includes('layoutSnippet')) {
  fail('E1', 'effectSemanticSpec 须含 layoutSnippet');
}
if (!specSource.includes('formatEffectSemanticStyleLine')) {
  fail('E2', '须导出 formatEffectSemanticStyleLine');
}
if (!specSource.includes('formatEffectSemanticLayoutLines')) {
  fail('E2', '须导出 formatEffectSemanticLayoutLines');
}
if (effectSource.includes('/* 覆盖 */')) {
  fail('E2', '样式区不应再输出 /* 覆盖 */ 块');
}
if (!effectSource.includes('formatEffectSemanticStyleLine')) {
  fail('E2', 'buildEffectSemanticInspect 须用一行样式');
}
if (!specSource.includes('formatEffectSemanticCssBlock')) {
  fail('E2', '须导出 formatEffectSemanticCssBlock');
}
if (!specSource.includes('parseEffectSemanticClassFromStyleLine')) {
  fail('E2', '须导出 parseEffectSemanticClassFromStyleLine');
}

const panelSource = readFileSync(join(inspectDir, 'InspectDetailPanel.vue'), 'utf8');
if (!panelSource.includes('data-effect-spec-panel')) {
  fail('E2', 'InspectDetailPanel 须在 Dev 面板内联展示 Effect 参数（data-effect-spec-panel）');
}

const highlightSource = readFileSync(join(inspectDir, 'inspectCodeHighlight.ts'), 'utf8');
if (!highlightSource.includes("'effectClass'")) {
  fail('E2', 'Effect class 须用 effectClass token + 虚线下划线');
}
if (!/function tokenizeInspectPropertyCodeValue\([\s\S]*context\?: InspectPropertyValueContext/.test(highlightSource)) {
  fail('E6', 'tokenizeInspectPropertyCodeValue 须接收 context 以正确高亮元素类型等 code 值');
}
if (!highlightSource.includes('MARKUP_CODE_VALUES') || !highlightSource.includes("'button'")) {
  fail('E6', '元素类型值（如 button）须走品红 markup code 高亮');
}
if (!/context\?\.label === '容器'\)[\s\S]{0,48}return 'code'/.test(highlightSource)) {
  fail('E6', '容器属性值须走 code 品红 keyword（与布局 flex 同列）');
}
if (!/context\?\.label === '祖先'\)[\s\S]{0,48}return 'token'/.test(highlightSource)) {
  fail('E6', '祖先属性值须走 token 黄色高亮');
}
if (!specSource.includes('class=".${spec.className}"')) {
  fail('E2', '样式区须输出 class=".effect-*"');
}

// E6 语法色单一真源：Popover 代码块与 teleport 出去的 tooltip 共用同一条 CSS 声明。
const tokenCssPath = join(inspectDir, 'shellDebugInspectCodeTokens.css');
/** 注释里会写「禁止 …」的反例，只校验真实声明。 */
const tokenCss = readFileSync(tokenCssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

for (const banned of [
  'inspectCodeTokenStyle',
  'inspectEffectSpecTokenStyle',
  'inspectCodeSyntaxLiteralColor',
  'INSPECT_CODE_SYNTAX_LITERAL',
]) {
  if (highlightSource.includes(banned)) {
    fail('E6', `按容器取色的旁路残留：${banned}（色值只许留在 shellDebugInspectCodeTokens.css）`);
  }
}
if (!highlightSource.includes('inspectCodeTokenClass')) {
  fail('E6', 'inspectCodeTokenClass 是语法色唯一入口，不得移除');
}
if (/:style="(?:effectSpec|inspectCode)/.test(panelSource)) {
  fail('E6', 'InspectDetailPanel 不得用 inline style 给 code token 上色');
}
if (/--dev-inspect-syntax-/.test(tokenCss)) {
  fail('E6', '禁止用只在容器上声明的 --dev-inspect-syntax-* 中间变量（teleport 后变量链断裂）');
}
if (/!important/.test(tokenCss)) {
  fail('E6', '语法色规则不得用 !important 给单个容器补色');
}
if (/(?:\[data-effect-spec-panel\]|\.shell-debug-effect-spec-tooltip)[^\n{]*\.dev-inspect-code-token/.test(tokenCss)) {
  fail('E6', '语法色规则不得带容器前缀，否则 tooltip 与 Popover 会分叉');
}
if (!panelSource.includes('shellDebugInspectCodeTokens.css')) {
  fail('E6', 'InspectDetailPanel 须直接 import 语法色真源 CSS');
}
if (/\.token(?:Keyword|Value|Function|String|Attr|Tag|Comment|Prop)\s*[,{]/.test(panelSource)) {
  fail('E6', 'InspectDetailPanel <style module> 不得再声明 token 颜色');
}

if (!effectSource.includes('panelKind=')) {
  fail('E3', 'buildTooltipUsageSnippet 须含 panelKind');
}

if (!sectionsSource.includes('buildEffectSemanticCodeSections')) {
  fail('E4', 'buildInspectCodeSections 须消费 effect 语义区块');
}

if (!panelKindSource.includes("flotation: 'FlotationBox'")) {
  fail('E5', 'catalog panelKind=flotation 须映射 FlotationBox（组件名，非容器行）');
}
if (!catalogSource.includes("from './inspectTooltipPanelKind'")) {
  fail('E5', 'edsInspectCatalog 须从 inspectTooltipPanelKind 导入 panelKind 映射');
}
if (!/resolveTooltipCatalogDisplayNameFromPanelKind\(props\.panelKind\)/.test(catalogSource)) {
  fail('E5', 'catalog resolveDisplayName 须用 resolveTooltipCatalogDisplayNameFromPanelKind');
}

if (!/normalizeTooltipPanelKindValue\(/.test(tooltipContainerSource)) {
  fail('E7', '容器行须输出 raw panelKind（normalizeTooltipPanelKindValue）');
}
if (!/element\.closest\('\.eds-popover'\)\) return null/.test(tooltipContainerSource)) {
  fail('E7', 'Popover 内不得展示容器行');
}
if (/resolveEffectBoxContainerLabel|resolveContainerFromEdsPopoverShell/.test(tooltipContainerSource)) {
  fail('E7', '容器行禁止 effect 盒子名兜底');
}
if (!panelKindSource.includes("'subtle'") || !panelKindSource.includes("'molde'")) {
  fail('E7', 'panelKind 须收录 subtle / molde');
}
if (!panelKindSource.includes("panelKind ?? 'flotation'")) {
  fail('E7', 'panelKind 缺省须对齐 EDS 默认 flotation');
}

if (errors.length > 0) {
  console.error('verify-shell-debug-inspect-effect: FAILED');
  for (const line of errors) console.error(`  ${line}`);
  process.exit(1);
}

console.log('verify-shell-debug-inspect-effect: OK — 7 项 Effect 不变量');
