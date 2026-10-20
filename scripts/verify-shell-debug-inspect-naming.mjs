#!/usr/bin/env node
/**
 * Shell Debug Inspect 命名 —— 全局不变量校验。
 *
 * 守住「点谁是谁」五条统一规则（`src/dev/shell-debug/inspect/inspectNamingRules.ts`），
 * 防止再退回「祖先借名 / 逐组件特判 / 编造区域名」。
 *
 * I1 规则顺序与 resolver 实际分支一致
 * I2 一层一名：组件根须 root === element，且任何分支都不得沿祖先取名
 * I3 region 片段必须在所属 EDS 组件的 *.module.css 中真实存在
 * I4 region 名不得与 catalog 组件重名（否则同链两层同名）
 * I5 region 不得覆盖已有 Vue 组件根（那属 R2，不该编造区域）
 * I6 旧机制字段已彻底移除（shellSubtree / ownerDomRootOnly / 逐组件壳层特判）
 * I7 布局 / 样式恒对准被点击节点
 * I8 CSS Module 片段匹配不得前缀误配（raw ⊄ paginationRaw）
 * I9 命名只有一条路径（UI 层不得另起 fallback）
 * I10 任意 EDS 包组件根都有自己的名字（未入 catalog 也不得退化成继承祖先名）
 * I11 同组件多 Figma 角色走 catalog resolveDisplayName hook，不写 resolver 特判
 * I12 「祖先」只作属性面板首行，禁止回流进命名
 * I13 Dev Inspect 不得读取壳外 Shell Debug UI（见 shellDebugUiScope.ts）
 * I14 hover 轻量路径：buildElementInspectHoverPreview + 无全局 cursor * + hover chrome 简化
 * I15 浮层 Pin：picker 须绕过 float guard wrapper；disconnect 不清 pin
 * I16 布局线框底图：仅绑 developerInspectActive；禁止在 pointermove 重建
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(fileURLToPath(import.meta.url), '..', '..');
const edsRoot = join(repoRoot, '..', 'eds-desktop', 'packages', 'components', 'src');
const inspectDir = join(repoRoot, 'src/dev/shell-debug/inspect');

const read = (p) => readFileSync(join(inspectDir, p), 'utf8');
const errors = [];
const fail = (id, msg) => errors.push(`${id} ${msg}`);

const rulesSource = read('inspectNamingRules.ts');
const resolverSource = read('resolveEdsComponentInspect.ts');
const identitySource = read('inspectIdentity.ts');
const regionsSource = read('edsInspectComponentRegions.ts');
const catalogSource = read('edsInspectCatalog.ts');
const styleTargetSource = read('resolveInspectStyleTarget.ts');

// ---------------------------------------------------------------- helpers

function walk(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, ext, out);
    else if (name.endsWith(ext)) out.push(full);
  }
  return out;
}

const edsVueFiles = walk(edsRoot, '.vue');
const edsCssFiles = walk(edsRoot, '.module.css');

function readCssClassNames(cssPath) {
  const names = new Set();
  for (const m of readFileSync(cssPath, 'utf8').matchAll(/^\.([a-zA-Z][\w-]*)/gm)) {
    names.add(m[1]);
  }
  return names;
}

/** 由 EDS 组件根 eds-* 类反查其源码目录（承载该组件的 .vue 所在目录）。 */
function findComponentDirByDomClass(domClass) {
  const needle = new RegExp(`['"\`]${domClass}['"\`]|class="${domClass}[ "]`);
  for (const file of edsVueFiles) {
    if (needle.test(readFileSync(file, 'utf8'))) return dirname(file);
  }
  return null;
}

function readRegionSpecs(source) {
  const block = source.match(/EDS_COMPONENT_REGIONS[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!block) throw new Error('EDS_COMPONENT_REGIONS 未找到');
  const specs = [];
  for (const chunk of block[1].split(/\},\s*\{/)) {
    const parent = chunk.match(/parentDomClass:\s*'([^']+)'/);
    const fragment = chunk.match(/cssModuleFragment:\s*'([^']+)'/);
    const display = chunk.match(/displayName:\s*'([^']+)'/);
    if (parent && fragment && display) {
      specs.push({
        parentDomClass: parent[1],
        cssModuleFragment: fragment[1],
        displayName: display[1],
      });
    }
  }
  return specs;
}

function classListHasModuleFragment(classNames, fragment) {
  const pattern = new RegExp(`(?:^|_)${fragment}(?:_|$)`);
  return classNames.some((name) => pattern.test(name));
}

// ------------------------------------------------- I1 规则顺序单一真源

const declaredOrder = [
  ...(rulesSource.match(/INSPECT_NAMING_RULE_ORDER[^=]*=\s*\[([\s\S]*?)\]/)?.[1] ?? '')
    .matchAll(/'([a-z-]+)'/g),
].map((m) => m[1]);

const EXPECTED_ORDER = [
  'atomic-graphic',
  'component-root',
  'text-leaf',
  'named-region',
  'dom-tag',
];
if (declaredOrder.join(',') !== EXPECTED_ORDER.join(',')) {
  fail('I1', `规则顺序声明异常：${declaredOrder.join(' → ') || '(空)'}`);
}

const resolverFn = resolverSource.match(
  /function resolveInspectLayerIdentity[\s\S]*?\n}/,
)?.[0];
if (!resolverFn) {
  fail('I1', '缺少统一入口 resolveInspectLayerIdentity');
} else {
  const actual = [...resolverFn.matchAll(/rule: '([a-z-]+)'/g)].map((m) => m[1]);
  if (actual.join(',') !== declaredOrder.join(',')) {
    fail('I1', `resolver 分支顺序 (${actual.join(' → ')}) 与规则表 (${declaredOrder.join(' → ')}) 不一致`);
  }
}

// ------------------------------------------------- I2 禁止子树借名

/** 取顶层函数体（首列 `}` 收尾），避免正则跨函数误配。 */
function readFunctionBody(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return null;
  const end = source.indexOf('\n}', start);
  return end < 0 ? source.slice(start) : source.slice(start, end + 2);
}

for (const fnName of ['findComponentRootOwner', 'findEdsComponentRootInstance', 'findVueInstancesWithDomRoot']) {
  const body = readFunctionBody(identitySource, fnName);
  if (!body) {
    fail('I2', `缺少 ${fnName}（组件根判定入口）`);
    continue;
  }
  if (!body.includes('root === target') && !body.includes('root !== element')) {
    fail('I2', `${fnName} 必须以 root === target / root !== element 排除子树节点`);
  }
  if (/root\??\.contains\(element\)/.test(body)) {
    fail('I2', `${fnName} 不得以 root.contains(element) 判定 owner（子树借名）`);
  }
}

for (const banned of ['isVueCatalogOwnerHit', 'findNearestVueCatalogOwner', 'DOM_ROOT_ONLY']) {
  if (identitySource.includes(banned)) {
    fail('I2', `子树借名残留：${banned}`);
  }
}

// 一层一名：命名入口的每条分支只看 element 自己，不得沿祖先取名。
// 三种历史回归写法都要拦：root.contains / parentElement 回溯 / 按渲染归属继承。
const identityBody = readFunctionBody(resolverSource, 'resolveInspectLayerIdentity');
if (!identityBody) {
  fail('I2', '缺少统一命名入口 resolveInspectLayerIdentity');
} else if (/parentElement|closest\(|contains\(/.test(identityBody)) {
  fail(
    'I2',
    '命名入口出现祖先取名（parentElement / closest / contains）→ 父级与子级会同名，'
      + '属性与代码片段随之取错',
  );
}

for (const banned of [
  'resolveDsTemplateInheritName',
  'resolveNamedLayerDisplayName',
  'isDsTemplateRenderedNode',
  'ds-template-inherit',
]) {
  for (const [label, source] of [['resolver', resolverSource], ['identity', identitySource], ['rules', rulesSource]]) {
    if (source.includes(banned)) {
      fail('I2', `祖先继承机制残留（${label}）：${banned}`);
    }
  }
}

// ------------------------------------------------- I3 / I5 region 真源

const regionSpecs = readRegionSpecs(regionsSource);
if (regionSpecs.length === 0) fail('I3', 'region 表为空（至少应含 Pagination / Apply_Item）');

for (const spec of regionSpecs) {
  const dir = findComponentDirByDomClass(spec.parentDomClass);
  if (!dir) {
    fail('I3', `region ${spec.displayName}: EDS 中找不到 ${spec.parentDomClass}`);
    continue;
  }

  const cssInDir = edsCssFiles.filter((p) => dirname(p) === dir);
  const hit = cssInDir.some((p) => readCssClassNames(p).has(spec.cssModuleFragment));
  if (!hit) {
    fail(
      'I3',
      `region ${spec.displayName}: 片段 "${spec.cssModuleFragment}" 不在 ${relative(edsRoot, dir)}/*.module.css`,
    );
  }

  // I5：若同目录存在以该 fragment 为根的独立 Vue 组件，则应由 R2 命中
  const ownedByComponent = edsVueFiles
    .filter((p) => dirname(p) === dir)
    .some((p) => {
      const src = readFileSync(p, 'utf8');
      const template = src.slice(src.indexOf('<template>'));
      return new RegExp(`<template>\\s*<[a-z][^>]*styles\\.${spec.cssModuleFragment}\\b`).test(template);
    });
  if (ownedByComponent) {
    fail('I5', `region ${spec.displayName}: 已是独立组件根，应由 R2 命中而非编造区域`);
  }
}

// ------------------------------------------------- I4 region 不与组件重名

const catalogDisplayNames = new Set(
  [...catalogSource.matchAll(/displayName:\s*'([^']+)'/g)].map((m) => m[1]),
);
for (const spec of regionSpecs) {
  if (catalogDisplayNames.has(spec.displayName)) {
    fail('I4', `region ${spec.displayName} 与 catalog 组件重名 → 同一 DOM 链会出现两层同名`);
  }
}

// ------------------------------------------------- I6 旧机制彻底移除

const deadSymbols = {
  'shellSubtree': catalogSource,
  'ownerDomRootOnly': catalogSource,
  'isShellSubtreeCatalogEntry': catalogSource,
  'isDomRootOnlyCatalogEntry': catalogSource,
  'shouldPresentDetailAsOwner': resolverSource,
  'isDetailApplyItemRowLayerHit': resolverSource,
};
for (const [symbol, source] of Object.entries(deadSymbols)) {
  if (source.includes(symbol)) fail('I6', `旧机制残留：${symbol}`);
}
if (existsSync(join(inspectDir, 'inspectDetailShell.ts'))) {
  fail('I6', 'inspectDetailShell.ts 应已删除（Detail 特判并入统一规则）');
}
// resolver 内不得再出现逐组件 displayName 分支（Icon/Crypto/Avatar/Divider 的属性构建除外）
const perComponentBranches = [...resolverSource.matchAll(/displayName === '([A-Za-z_]+)'/g)]
  .map((m) => m[1])
  .filter((name) => !['Icon', 'Crypto', 'Avatar', 'Divider'].includes(name));
if (perComponentBranches.length > 0) {
  fail('I6', `resolver 出现逐组件命名特判：${[...new Set(perComponentBranches)].join(', ')}`);
}

// ---------------------- I6b 非组件根层不得复制组件 props

const namedLayerInspect = readFunctionBody(resolverSource, 'buildNamedLayerInspect');
if (!namedLayerInspect) {
  fail('I6', '缺少 buildNamedLayerInspect（R4 / R5 共用构建）');
} else if (/readVueProps|extractPropItems|buildUsageSnippet|candidate\./.test(namedLayerInspect)) {
  fail('I6', 'R4 / R5 层不得复制组件 Vue props（props 只属于 R2 组件根）');
}

// ------------------------------------------------- I7 样式对准点击节点

if (!/return element;/.test(styleTargetSource)) {
  fail('I7', 'resolveInspectStyleTargetElement 必须返回被点击节点');
}

// ------------------------------------------------- I8 片段匹配

const cases = [
  { classes: ['_paginationRaw_ab12_69'], fragment: 'paginationRaw', expect: true },
  { classes: ['_paginationRaw_ab12_69'], fragment: 'raw', expect: false },
  { classes: ['_raw_ab12_41'], fragment: 'raw', expect: true },
  { classes: ['_itemRow_cd34_257'], fragment: 'itemRow', expect: true },
  { classes: ['_itemRowCopyable_cd34_272'], fragment: 'itemRow', expect: false },
];
for (const c of cases) {
  if (classListHasModuleFragment(c.classes, c.fragment) !== c.expect) {
    fail('I8', `片段匹配错误：${c.classes[0]} × "${c.fragment}" 应为 ${c.expect}`);
  }
}

// ------------------------------------------------- I9 单一命名路径

const infoSource = read('buildElementInspectInfo.ts');
if (!/const label = inspectTarget\.primaryLabel;/.test(infoSource)) {
  fail('I9', 'buildElementInspectInfo 必须直接取 inspectTarget.primaryLabel，不得另起 fallback');
}
for (const banned of ['buildLabel', 'formatVueInspectLabel']) {
  if (infoSource.includes(banned)) fail('I9', `并行命名路径残留：${banned}`);
}

// ------------------- I10 任意 EDS 组件根都有自己的名字

const rootBody = readFunctionBody(resolverSource, 'resolveComponentRootCandidate');
if (!rootBody) {
  fail('I10', '缺少 resolveComponentRootCandidate');
} else if (!/=\s*findEdsComponentRootInstance\(element\)/.test(rootBody)) {
  fail(
    'I10',
    'R2 必须含「任意 EDS 包组件根」一级（findEdsComponentRootInstance(element)），'
      + '否则未入 catalog 的 EDS 组件会退化成继承祖先名',
  );
}

const edsRootBody = readFunctionBody(identitySource, 'findEdsComponentRootInstance');
if (!edsRootBody) {
  fail('I10', '缺少 findEdsComponentRootInstance');
} else {
  if (!/root !== element/.test(edsRootBody)) {
    fail('I10', 'findEdsComponentRootInstance 必须以 root !== element 排除子树节点');
  }
  if (!/isEdsPackageInstance/.test(edsRootBody)) {
    fail('I10', 'findEdsComponentRootInstance 必须用 isEdsPackageInstance 限定 EDS 包组件');
  }
}

// 遗留的壳层特判必须已删（旧模型下靠它防吞名；新模型 root === element 已足够）
if (identitySource.includes('isInspectShellTooltip')) {
  fail('I10', '壳层 Tooltip 特判残留 → 弹窗壳会落到 R5、与外层 Popup 重名');
}

// ------------------- I11 多角色命名走 catalog hook

if (!/resolveDisplayName\?:/.test(catalogSource)) {
  fail('I11', 'catalog 未声明 resolveDisplayName hook');
}
const nameOutBody = readFunctionBody(resolverSource, 'resolveEntryDisplayName');
if (!nameOutBody) {
  fail('I11', '缺少 resolveEntryDisplayName（展示名唯一出口）');
} else if (!/entry\.resolveDisplayName\?\./.test(nameOutBody)) {
  fail('I11', 'resolveEntryDisplayName 必须走 catalog resolveDisplayName hook');
}
// 出口必须真被调用，且没有旁路直读 entry.displayName 的返回点
const nameOutCalls = (resolverSource.match(/resolveEntryDisplayName\(/g) ?? []).length;
if (nameOutCalls < 3) {
  fail('I11', `resolveEntryDisplayName 调用点仅 ${nameOutCalls - 1} 处，展示名存在旁路`);
}
if (/displayName:\s*candidate\.entry\.displayName/.test(resolverSource)) {
  fail('I11', '存在直读 candidate.entry.displayName 的展示名旁路（绕过角色命名 hook）');
}

// ------------------- I12 「祖先」只进属性面板，不进命名

const ancestorPath = join(inspectDir, 'resolveInspectAncestorName.ts');
if (!existsSync(ancestorPath)) {
  fail('I12', '缺少 resolveInspectAncestorName.ts（点不到的父层靠它交代归属）');
} else {
  const ancestorSource = read('resolveInspectAncestorName.ts');

  // 祖先只取「具名层」，否则会返回一串 Div
  if (!/resolveInspectNamedLayerLabel\(node, preview\)/.test(ancestorSource)) {
    fail('I12', '祖先必须用 resolveInspectNamedLayerLabel 逐层向上找最近具名层');
  }
  if (!/parentElement/.test(ancestorSource)) {
    fail('I12', '祖先解析须沿 parentElement 向上走');
  }
  if (
    !/INSPECT_TOOLTIP_ANCESTOR_LABEL/.test(ancestorSource)
    || !/eds-tooltip-v-/.test(ancestorSource)
  ) {
    fail('I12', 'teleport Tooltip 浮层祖先须固定为 Tooltip');
  }
  if (!/export const INSPECT_TOOLTIP_ANCESTOR_LABEL = 'Tooltip'/.test(ancestorSource)) {
    fail('I12', 'Tooltip 祖先须导出 INSPECT_TOOLTIP_ANCESTOR_LABEL 常量');
  }
  if (!/export function resolveInspectContainerName/.test(ancestorSource)) {
    fail('I12', '缺少 resolveInspectContainerName（容器行）');
  }
  const tooltipContainerSource = read('resolveInspectTooltipContainer.ts');
  if (!/normalizeTooltipPanelKindValue\(/.test(tooltipContainerSource)) {
    fail('I12', '容器值须为 raw panelKind（normalizeTooltipPanelKindValue）');
  }
  if (!/element\.closest\('\.eds-popover'\)\) return null/.test(tooltipContainerSource)) {
    fail('I12', 'Popover（.eds-popover）内不得展示容器行');
  }
  if (/resolveEffectBoxContainerLabel|resolveContainerFromEdsPopoverShell/.test(tooltipContainerSource)) {
    fail('I12', '容器不得用 effect 盒子名或 Popover 壳兜底');
  }
  if (!/resolveInspectTooltipContainerName/.test(ancestorSource)) {
    fail('I12', 'resolveInspectContainerName 须委托 resolveInspectTooltipContainerName');
  }

  // 具名层判定：R5（dom-tag）必须返回 null，否则祖先会取到 HTML 标签名
  const namedLayerBody = readFunctionBody(resolverSource, 'resolveInspectNamedLayerLabel');
  if (!namedLayerBody) {
    fail('I12', '缺少 resolveInspectNamedLayerLabel');
  } else if (!/rule === 'dom-tag'\) return null/.test(namedLayerBody)) {
    fail('I12', 'resolveInspectNamedLayerLabel 必须对 dom-tag 返回 null');
  }

  // 【禁止】回流：祖先一旦参与命名，父子同名 + 参数错位的老问题会复发
  // 只认真实 import / 调用；文档注释里提及该模块是允许的
  if (/^import[^;]*resolveInspectAncestorName/m.test(resolverSource)) {
    fail('I12', '命名模块 import 了 resolveInspectAncestorName → 祖先回流进名字');
  }
  if (/resolveInspectAncestorName\(/.test(resolverSource)) {
    fail('I12', '命名模块调用了 resolveInspectAncestorName → 祖先回流进名字');
  }
}

const prependStart = infoSource.indexOf('function prependAncestorProperty(');
const prependEnd = infoSource.indexOf('\nfunction buildElementAttributes(', prependStart);
const prependBody =
  prependStart >= 0 && prependEnd > prependStart
    ? infoSource.slice(prependStart, prependEnd)
    : readFunctionBody(infoSource, 'prependAncestorProperty');
if (!prependBody) {
  fail('I12', '缺少 prependAncestorProperty');
} else if (
  !/label: '祖先'/.test(prependBody)
  || !/label: '容器'/.test(prependBody)
  || !/buildSizePropertyItem\(rect\)/.test(prependBody)
  || !/label: '容器'[\s\S]{0,220}return \[\.\.\.leading,\s*buildSizePropertyItem\(rect\),\s*\.\.\.rest\]/.test(prependBody)
) {
  fail('I12', 'prependAncestorProperty 须输出 祖先 → 容器 → 其他属性（尺寸起）顺序');
}
if (!/orderInspectPropertyPanelItems/.test(readFileSync(join(inspectDir, 'InspectDetailPanel.vue'), 'utf8'))) {
  fail('I12', 'InspectDetailPanel 须 orderInspectPropertyPanelItems 固定 祖先 → 容器 在最前');
}
if (!/resolveInspectContainerName\(element, preview\)/.test(infoSource)) {
  fail('I12', 'buildElementInspectInfo 须调用 resolveInspectContainerName');
}
if (!/ancestorName === INSPECT_TOOLTIP_ANCESTOR_LABEL[\s\S]{0,160}resolveInspectContainerName/.test(infoSource)) {
  fail('I12', '容器行须在祖先为 Tooltip 时才 resolve');
}
if (/label: 'Role'/.test(readFunctionBody(infoSource, 'buildElementAttributes') ?? '')) {
  fail('I12', 'buildElementAttributes 不得输出 Role 属性');
}

// 两条属性路径都要带祖先：组件 props 与元素属性（面板二选一渲染）
const prependCalls = (infoSource.match(/prependAncestorProperty\(/g) ?? []).length;
if (prependCalls < 3) {
  fail(
    'I12',
    `prependAncestorProperty 调用点仅 ${prependCalls - 1} 处，`
      + '组件 props 与 elementAttributes 两条路径都须前插祖先',
  );
}

// ------------------------------------------------- I13 壳外 Shell Debug UI 不得被 Dev Inspect 读取

const shellDebugUiScopePath = join(repoRoot, 'src/dev/shell-debug/shellDebugUiScope.ts');
if (!existsSync(shellDebugUiScopePath)) {
  fail('I13', '缺少 shellDebugUiScope.ts');
}

const pickerSource = readFileSync(join(inspectDir, 'useElementPicker.ts'), 'utf8');
const floatScopeSource = readFileSync(join(inspectDir, 'inspectFloatLayerScope.ts'), 'utf8');

if (!/isShellDebugUiElement/.test(pickerSource)) {
  fail('I13', 'useElementPicker 须用 isShellDebugUiElement 排除壳外工具');
}
if (!/isShellDebugUiElement\(element\)/.test(infoSource)) {
  fail('I13', 'buildElementInspectInfo 须用 isShellDebugUiElement 拒绝壳外工具');
}
if (!/isShellDebugUiElement\(element\)/.test(floatScopeSource)) {
  fail('I13', 'isInspectFloatLayerElement 须排除 isShellDebugUiElement');
}

// I14 hover 轻量路径：禁止在鼠标移动时跑全量 buildElementInspectInfo / 全局 cursor *
const devInspectCss = readFileSync(join(inspectDir, 'developerInspect.css'), 'utf8');
const hoverFnStart = pickerSource.indexOf('function updateHoverTarget');
const hoverFnEnd = pickerSource.indexOf('function processPointerMove');
const hoverFnSource = hoverFnStart >= 0 && hoverFnEnd > hoverFnStart
  ? pickerSource.slice(hoverFnStart, hoverFnEnd)
  : '';
if (!/buildElementInspectHoverPreview\(target,\s*preview\)/.test(hoverFnSource)) {
  fail('I14', 'updateHoverTarget 须调用 buildElementInspectHoverPreview(target, preview)');
}
if (/\bbuildElementInspectInfo\s*\(/.test(hoverFnSource)) {
  fail('I14', 'updateHoverTarget 不得调用 buildElementInspectInfo');
}
if (
  /\*\s*:not/.test(devInspectCss)
  && /cursor:\s*crosshair\s*!important/.test(devInspectCss)
) {
  fail('I14', 'developerInspect.css 禁止对 * 强制 crosshair !important');
}
if (!/variant="hover"/.test(readFileSync(join(inspectDir, 'DeveloperInspectOverlay.vue'), 'utf8'))) {
  fail('I14', 'hover 高亮须使用 InspectLayoutChrome variant="hover"');
}
const overlaySource = readFileSync(join(inspectDir, 'DeveloperInspectOverlay.vue'), 'utf8');
if (!/buildHoverMeasureModel/.test(overlaySource)) {
  fail('I14', 'Pin+Hover 比对须调用 buildHoverMeasureModel');
}
if (!/InspectEdgeMeasureChrome/.test(overlaySource)) {
  fail('I14', 'Pin+Hover 间距须由 InspectEdgeMeasureChrome 渲染');
}
if (!/devInspectCompareMeasure\.css/.test(readFileSync(join(inspectDir, 'InspectEdgeMeasureChrome.vue'), 'utf8'))) {
  fail('I14', '比对间距色系真源须为 devInspectCompareMeasure.css');
}
if (!readFileSync(join(inspectDir, 'devInspectCompareMeasure.css'), 'utf8').includes('#f59f00')) {
  fail('I14', '比对间距浅色须为 #F59F00');
}
const measureSource = readFileSync(join(inspectDir, 'buildLayoutMeasurement.ts'), 'utf8');
if (/marginZones/.test(measureSource)) {
  fail('I14', 'buildLayoutChromeModel 不得输出 marginZones（margin 橙仅结构图）');
}
if (!/gapBelow/.test(measureSource) || !/gapRight/.test(measureSource)) {
  fail('I14', 'buildHoverMeasureModel 须按最近边间距（gapBelow/gapRight）计算');
}
if (!/resolveHoverMeasureLabels/.test(measureSource)) {
  fail('I14', '双轴比对间距须 resolveHoverMeasureLabels 错开标签');
}

const hoverPreviewStart = infoSource.indexOf('export function buildElementInspectHoverPreview');
const hoverPreviewEnd = infoSource.indexOf('export type BuildElementInspectInfoOptions');
const hoverPreviewSource = hoverPreviewStart >= 0 && hoverPreviewEnd > hoverPreviewStart
  ? infoSource.slice(hoverPreviewStart, hoverPreviewEnd)
  : '';
if (!/resolveInspectPrimaryLabel\(element\)/.test(hoverPreviewSource)) {
  fail('I14', 'buildElementInspectHoverPreview 须用 resolveInspectPrimaryLabel(element)');
}
if (/resolveInspectTarget|collectDeclaredCssValues|buildInspectCodeSections/.test(hoverPreviewSource)) {
  fail('I14', 'buildElementInspectHoverPreview 不得跑全量命名 / CSS 级联 / 代码片段');
}
if (/function resolveInspectPrimaryLabel[\s\S]*?parentElement|closest\(/.test(
  resolverSource.slice(
    resolverSource.indexOf('export function resolveInspectPrimaryLabel'),
    resolverSource.indexOf('export function resolveInspectTarget'),
  ),
)) {
  fail('I14', 'resolveInspectPrimaryLabel 不得沿祖先取名（与 I2 / I12 同约束）');
}
if (!/resolveInspectLayerIdentity\(element\)/.test(
  resolverSource.slice(
    resolverSource.indexOf('export function resolveInspectPrimaryLabel'),
    resolverSource.indexOf('export function resolveInspectTarget'),
  ),
)) {
  fail('I14', 'resolveInspectPrimaryLabel 须复用 resolveInspectLayerIdentity，禁止另起判定');
}

// 探针 div 插入 token 根会强制 style 重算，13 个排版角色逐个探测足以拖死 hover。
if (!/normalizedValueCache/.test(read('resolveDesignToken.ts'))) {
  fail('I14', 'normalizeComparableStyleValue 的探针结果须缓存');
}
if (
  /roleMatchesEffectiveMetrics[\s\S]{0,400}?normalizeStyleValueForCompare/.test(
    read('typographyInspectMatch.ts'),
  )
) {
  fail('I14', 'normalizeStyleValueForCompare 不得在排版角色循环内逐个调用');
}

// I15 浮层 Pin：guard 会吞掉 wrapped capture pointerdown，picker 须用原生 API。
const guardSource = readFileSync(
  join(repoRoot, 'src/dev/shell-debug/installShellDebugFloatLayerGuard.ts'),
  'utf8',
);
if (!/export const nativeWindowAddEventListener/.test(guardSource)) {
  fail('I15', 'installShellDebugFloatLayerGuard 须导出 nativeWindowAddEventListener');
}
if (!/nativeWindowAddEventListener\(\s*'pointerdown'/.test(pickerSource)) {
  fail('I15', 'useElementPicker 的 pointerdown 须用 nativeWindowAddEventListener（浮层 Pin）');
}
const syncPinnedStart = pickerSource.indexOf('function syncPinnedRect');
const syncPinnedEnd = pickerSource.indexOf('function syncHoverRect');
const syncPinnedSource = syncPinnedStart >= 0 && syncPinnedEnd > syncPinnedStart
  ? pickerSource.slice(syncPinnedStart, syncPinnedEnd)
  : '';
if (/clearInspectSelection\(\)/.test(syncPinnedSource)) {
  fail('I15', 'syncPinnedRect 不得在 element disconnect 时 clearInspectSelection');
}
const onPointerDownStart = pickerSource.indexOf('function onPointerDown');
const onPointerDownEnd = pickerSource.indexOf('function onScrollOrResize');
const onPointerDownSource = onPointerDownStart >= 0 && onPointerDownEnd > onPointerDownStart
  ? pickerSource.slice(onPointerDownStart, onPointerDownEnd)
  : '';
const resolveTargetIdx = onPointerDownSource.indexOf('elementFromPreviewPoint');
if (
  resolveTargetIdx >= 0
  && /isShellDebugUiElement\(eventTarget\)[\s\S]{0,120}return;/.test(
    onPointerDownSource.slice(0, resolveTargetIdx),
  )
) {
  fail('I15', 'onPointerDown 不得在 elementFromPreviewPoint 之前因 eventTarget 早退');
}
if (!/function isShellDebugUiPointerEvent/.test(pickerSource)
  || !/if \(isShellDebugUiPointerEvent\(event\)\) \{[\s\S]{0,220}markShellDebugUiInteraction/.test(onPointerDownSource)) {
  fail('I15', 'onPointerDown 点击 Dev 参数面板须 isShellDebugUiPointerEvent + markShellDebugUiInteraction，不得 clearInspectSelection');
}

// I16 布局线框底图：生命周期仅 developerInspectActive；与 hover/pin 路径解耦。
const layoutMapSource = readFileSync(join(inspectDir, 'buildLayoutMap.ts'), 'utf8');
const layoutMapVueSource = readFileSync(join(inspectDir, 'InspectLayoutMap.vue'), 'utf8');
if (!/export function collectLayoutMapItems/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须导出 collectLayoutMapItems');
}
if (!/InspectLayoutMap/.test(overlaySource)) {
  fail('I16', 'DeveloperInspectOverlay 须渲染 InspectLayoutMap 底图');
}
if (!/watch\(\s*developerInspectActive/.test(layoutMapVueSource)) {
  fail('I16', 'InspectLayoutMap 须 watch developerInspectActive 控制生命周期');
}
if (!/pointer-events:\s*none/.test(layoutMapVueSource)) {
  fail('I16', 'InspectLayoutMap 须 pointer-events: none');
}
if (!/showLayoutMap/.test(layoutMapVueSource) || !/inspectHoverInfo/.test(layoutMapVueSource) || !/isClientPopupActive/.test(layoutMapVueSource)) {
  fail('I16', 'InspectLayoutMap 须在 hover / pin / EgPopup 时隐藏底图');
}
if (!/bodyMutationObserver/.test(layoutMapVueSource) || !/observe\(document\.body/.test(layoutMapVueSource)) {
  fail('I16', 'InspectLayoutMap 须监听 body 上 teleport 浮层的 DOM 变更');
}
if (/collectLayoutMapItems|buildLayoutMap|scheduleLayoutMapRebuild/.test(hoverFnSource)) {
  fail('I16', 'updateHoverTarget 不得触发 layout map 重建');
}
if (/collectLayoutMapItems|buildLayoutMap|scheduleLayoutMapRebuild/.test(onPointerDownSource)) {
  fail('I16', 'onPointerDown 不得触发 layout map 重建');
}
if (/clearHoverSelection[\s\S]{0,200}layoutItems/.test(layoutMapVueSource)) {
  fail('I16', 'layout map 不得绑 clearHoverSelection');
}
if (!/isPresentingPopupOverlayLayer/.test(layoutMapSource)
  || !/resolvePresentingPopupOverlayRoot/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须识别正在展示的 EgPopup（effect-popup-box 面板可见）');
}
if (!/isPresentingPopoverOverlayLayer/.test(layoutMapSource)
  || !/HIGH_RANK_OVERLAY_LAYER_RANK/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须识别正在展示的 Popover，且 Popover / Flotation 全局置顶于 Popup');
}
if (!/isClientPopupActive/.test(layoutMapSource)) {
  fail('I16', 'EgPopup 打开时须强制 overlay 模式，避免仍 walk 列表页 layout');
}
if (!/topRank >= HIGH_RANK_OVERLAY_LAYER_RANK/.test(layoutMapSource)
  || !/topRank <= resolveOverlayLayerTypeRank\(presentingPopup\)/.test(layoutMapSource)) {
  fail('I16', 'Popover teleport 到 preview 时须 walk Popover；仅无更高浮层时 walk EgPopup');
}
if (!/isAnchoredTooltipHostOverlayOpen/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须忽略未展开的 tooltip 宿主（如常驻多签浮标），避免误切 overlay 模式');
}
if (!/if \(walkRoot\)[\s\S]{0,120}walkLayoutMapTree\(walkRoot/.test(layoutMapSource)) {
  fail('I16', 'collectLayoutMapItems 有叠层时须只 walk 内容壳（walkRoot），禁止 walk preview 列表 sibling');
}
if (!/resolveLayoutMapWalkRoot/.test(layoutMapSource)
  || !/filterLayoutMapItemsToScopeRoot/.test(layoutMapSource)
  || !/effect-popup-box/.test(
    layoutMapSource.slice(
      layoutMapSource.indexOf('export function resolveLayoutMapWalkRoot'),
      layoutMapSource.indexOf('function filterLayoutMapItemsToScopeRoot'),
    ),
  )) {
  fail('I16', 'buildLayoutMap 须把 Popup walk/clip 边界下沉到 .effect-popup-box，并过滤 scope 外几何');
}
if (!/resolveOverlayLayerTypeRank/.test(layoutMapSource) || !/resolveLayoutMapOverlayCollectionRoot/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须按 Popover > Flotation 叠层类型优先，并下沉 tooltip 宿主到可见内容壳');
}
if (!/elementOverlapsPreview/.test(layoutMapSource) || !/document\.querySelectorAll\(selector\)/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须采集 teleport 到 body 且与 preview 相交的 tooltip / flotation 浮层');
}
if (!/\.effect-flotation-box/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须直接采集 .effect-flotation-box（wrap-tooltip=false 的 EgFlotation 内容）');
}
if (!/role:\s*'frame'\s*\|\s*'cell'\s*\|\s*'padding'\s*\|\s*'margin'\s*\|\s*'gap'/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须含 padding / margin / gap 角色');
}
if (!/pushLayoutHostPaddingAndMargin/.test(layoutMapSource) || !/pushLayoutHostChildGaps/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须采集 layout 宿主 padding / margin / gap');
}
if (!/shouldCollectLayoutMapPaddingAndMargin/.test(layoutMapSource)
  || !/isLayoutMapPaddingContentShell/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须仅对 layout 宿主 / EDS 根 / content 壳采集 padding（如 Popover contentSlot）');
}
if (!/shouldClipLayoutMapSpacingToOverflowAncestors/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须避免 overflow 祖先误裁 padding / margin / gap 条带');
}
if (!/isLayoutMapBorderOnlyComponentRoot\(element\)[\s\S]{0,180}pushLayoutMapItem\(items, element, scope, 'frame'\)/.test(layoutMapSource)
  || /isLayoutMapBorderOnlyComponentRoot[\s\S]{0,220}pushLayoutHostPaddingAndMargin/.test(layoutMapSource)) {
  fail('I16', 'border-only 白名单组件须仅 1 条实线外框，不铺 padding / margin');
}
if (!/MIN_SPACING_CLIP_W = 1/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap spacing 裁剪门槛须为 1px，避免细 padding / gap 条带被误裁');
}
if (!/isLayoutGapHost/.test(layoutMapSource) || !/pushLayoutHostChildGapsAlongAxis/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须放宽 gap 宿主门槛，且 grid 双轴采集 row/column gap');
}
if (/MAX_LAYOUT_MAP_SPACING_ITEMS/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 不得裁剪 padding / margin / gap 条带');
}
if (!/item\.role === 'padding' \|\| item\.role === 'margin' \|\| item\.role === 'gap'/.test(layoutMapSource)) {
  fail('I16', 'capLayoutMapItems 须全量保留 spacing，仅裁 cell');
}
if (!/DEV_INSPECT_PADDING_ACCENT/.test(layoutMapVueSource) || !/layoutMarginItems/.test(layoutMapVueSource)) {
  fail('I16', 'InspectLayoutMap 须分色渲染 padding / margin / gap');
}
if (!/lineLayer[\s\S]{0,500}marginLayer[\s\S]{0,500}gapLayer[\s\S]{0,500}paddingLayer/.test(layoutMapVueSource)) {
  fail('I16', 'InspectLayoutMap 须 line → margin → gap → padding 叠层，spacing 均在描边之上');
}
const layoutMapBorderOnlySource = readFileSync(join(inspectDir, 'layoutMapBorderOnlyComponents.ts'), 'utf8');
if (!/isLayoutMapBorderOnlyComponentRoot/.test(layoutMapSource) || !/LAYOUT_MAP_BORDER_ONLY_DISPLAY_NAMES/.test(layoutMapBorderOnlySource)) {
  fail('I16', 'buildLayoutMap 须按原子组件白名单只画边框');
}
if (!/Progress/.test(layoutMapBorderOnlySource) || !/EndFeedbackCard/.test(layoutMapBorderOnlySource)) {
  fail('I16', 'layoutMapBorderOnlyComponents 须含用户指定的原子组件白名单');
}
if (!/'NavBar'/.test(layoutMapBorderOnlySource) || !/eds-nav-bar-shell/.test(layoutMapBorderOnlySource) || !/Paginer/.test(layoutMapBorderOnlySource) || !/'BatchBar'/.test(layoutMapBorderOnlySource)) {
  fail('I16', 'layoutMapBorderOnlyComponents 须含 NavBar / Paginer / BatchBar 胶囊');
}
if (!/isLayoutMapCapsuleTooltipPanelRoot/.test(layoutMapBorderOnlySource) || !/panelRadius === 'radius-full'/.test(layoutMapBorderOnlySource)) {
  fail('I16', 'layoutMapBorderOnlyComponents 须识别 popup + radius-full 胶囊 TooltipPanel');
}
const layoutMapPinningSource = readFileSync(join(inspectDir, 'layoutMapPinningLayers.ts'), 'utf8');
if (!/collectLayoutMapPinningLayers/.test(layoutMapPinningSource) || !/isLayoutMapItemOccludedByPinningLayer/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须按钉住层遮罩下层结构图');
}
if (!/layoutMapItemIntersectsPinningLayer/.test(layoutMapPinningSource)) {
  fail('I16', '钉住层遮罩须按条带/线框相交判定，不能只看中心点');
}
if (!/data-float-interactive/.test(layoutMapPinningSource)) {
  fail('I16', '钉住层须识别多签浮标等 data-float-interactive 交互区');
}
if (!/collectLayoutMapPopupOcclusionLayers/.test(layoutMapPinningSource)
  || !/collectLayoutMapPopupOcclusionLayers/.test(layoutMapSource)) {
  fail('I16', 'EgPopup 打开且仍 walk 整页时须用 popup 壳遮罩下层列表结构图');
}
if (!/isLayoutMapItemOccludedByPinningLayer\(host, item, scope\.pinningLayers\)/.test(layoutMapSource)) {
  fail('I16', 'padding / margin / gap 也须受钉住层遮罩');
}
if (!/resolveLayoutHostGaps/.test(layoutMapSource) || !/layoutMapGapDistanceMatches/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap gap 须匹配 CSS gap 声明，禁止几何空隙误判');
}
if (!/shouldDrawLayoutMapSolidFrame/.test(layoutMapSource) || !/isLayoutMapGroupEnvelope/.test(layoutMapSource)) {
  fail('I16', 'buildLayoutMap 须区分组外壳实线与内部虚线');
}

// ---------------------------------------------------------------- report

if (errors.length === 0) {
  console.log(
    `verify-shell-debug-inspect-naming: OK — ${EXPECTED_ORDER.length} 条规则 / ${regionSpecs.length} 个具名区域 / 16 项不变量`,
  );
  process.exit(0);
}

console.error('verify-shell-debug-inspect-naming: FAILED\n');
for (const err of errors) console.error(`  - ${err}`);
console.error('\n规则真源：src/dev/shell-debug/inspect/inspectNamingRules.ts');
process.exit(1);
