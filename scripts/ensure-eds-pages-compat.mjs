/**
 * Pages CI checks out a clean eds-desktop pin that may lack local compat aliases /
 * glue CSS that work-cregis-desktop still imports. Patch the sibling checkout in place
 * (idempotent) before prebuild / vite build.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const edsRoot = resolve(root, '../eds-desktop');
const componentsSrc = resolve(edsRoot, 'packages/components/src');
const compatRoot = resolve(root, 'scripts/eds-pages-compat');

function ensureContains(filePath, needle, append) {
  if (!existsSync(filePath)) {
    console.error(`[eds-pages-compat] missing ${filePath}`);
    process.exit(1);
  }
  const current = readFileSync(filePath, 'utf8');
  if (current.includes(needle)) return false;
  const next = current.endsWith('\n') ? `${current}${append}` : `${current}\n${append}`;
  writeFileSync(filePath, next.endsWith('\n') ? next : `${next}\n`, 'utf8');
  return true;
}

function ensureFile(filePath, contents) {
  if (existsSync(filePath)) return false;
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents, 'utf8');
  return true;
}

if (!existsSync(componentsSrc)) {
  console.error(`[eds-pages-compat] eds-desktop components not found at ${componentsSrc}`);
  process.exit(1);
}

let changed = 0;

const deformCssSrc = resolve(compatRoot, 'motionLayoutDeformTransition.css');
const deformCssDest = resolve(componentsSrc, 'styles/motionLayoutDeformTransition.css');
if (existsSync(deformCssSrc)) {
  mkdirSync(dirname(deformCssDest), { recursive: true });
  copyFileSync(deformCssSrc, deformCssDest);
  changed += 1;
}

const deformTsSrc = resolve(compatRoot, 'motion-layout-deform/motionLayoutDeform.ts');
const deformTsDest = resolve(componentsSrc, 'atoms/motion-layout-deform/motionLayoutDeform.ts');
const deformIndexSrc = resolve(compatRoot, 'motion-layout-deform/index.ts');
const deformIndexDest = resolve(componentsSrc, 'atoms/motion-layout-deform/index.ts');
if (existsSync(deformTsSrc) && existsSync(deformIndexSrc)) {
  copyFileSync(deformTsSrc, deformTsDest);
  copyFileSync(deformIndexSrc, deformIndexDest);
  changed += 1;
}

const patches = [
  {
    file: resolve(componentsSrc, 'molecules/tooltip/index.ts'),
    needle: 'EgAnchoredTooltip',
    append: `
/** Compat aliases for work-cregis-desktop naming */
export { default as EgAnchoredTooltip } from './AnchoredTooltip.vue';
export { default as EgTextOverflowTooltip } from './TextOverflowTooltip.vue';
`,
  },
  {
    file: resolve(componentsSrc, 'molecules/index.ts'),
    needle: 'EgPaginationItem',
    append: `
export { EgIconProButton as EgIconButtonPro } from './icon-button-pro';
export { EgPaginationGroupButton as EgPaginationItem } from './pagination-item';
`,
  },
  {
    file: resolve(componentsSrc, 'molecules/link/index.ts'),
    needle: 'EgLink ',
    append: `
/** Compat aliases for work-cregis-desktop naming */
export { default as EgLink } from './Link.vue';
`,
  },
  {
    file: resolve(componentsSrc, 'molecules/search/index.ts'),
    needle: 'EgSearch ',
    append: `
/** Compat aliases for work-cregis-desktop naming */
export { default as EgSearch } from './Search.vue';
`,
  },
  {
    file: resolve(componentsSrc, 'molecules/tab/index.ts'),
    needle: 'EgSegmentedControl',
    append: `
/** Compat aliases for work-cregis-desktop naming */
export { default as EgSegmentedControl } from './Segmented.vue';
`,
  },
  {
    file: resolve(componentsSrc, 'molecules/combo/index.ts'),
    needle: 'EgComboActionFlotation',
    append: `
/** Compat aliases for work-cregis-desktop naming */
export { default as EgComboActionFlotation } from './ComboActionFlotation.vue';
export { default as EgComboActionPopupWindow } from './ComboActionPopupWindow.vue';
export { default as EgComboInputItem } from './ComboInputItem.vue';
export { default as EgComboTextareaItem } from './ComboTextareaItem.vue';
export { default as EgComboActionSkid } from './ComboActionSkid.vue';
export { default as EgComboActionPage } from './ComboActionPage.vue';
`,
  },
  {
    file: resolve(componentsSrc, 'organisms/dialog/index.ts'),
    needle: 'EgReminder',
    append: `
/** @deprecated Compat alias — use EgDialog */
export { default as EgReminder } from './Dialog.vue';
`,
  },
  {
    file: resolve(componentsSrc, 'organisms/filter/index.ts'),
    needle: 'provideFilterTranslate',
    append: `
export { provideFilterTranslate, useFilterTranslate } from './filterTranslate';
`,
  },
];

for (const patch of patches) {
  if (ensureContains(patch.file, patch.needle, patch.append)) changed += 1;
}

const moleculesIndex = resolve(componentsSrc, 'molecules/index.ts');
const moleculesText = readFileSync(moleculesIndex, 'utf8');
if (
  moleculesText.includes("export { EgLinkButton } from './link';")
  && !moleculesText.includes("export { EgLinkButton, EgLink } from './link';")
) {
  writeFileSync(
    moleculesIndex,
    moleculesText.replace(
      "export { EgLinkButton } from './link';",
      "export { EgLinkButton, EgLink } from './link';",
    ),
    'utf8',
  );
  changed += 1;
}

// Filter.vue: translate must not use useFilterTranslate() on the same component that provides it.
const filterVue = resolve(componentsSrc, 'organisms/filter/Filter.vue');
if (existsSync(filterVue)) {
  let filterText = readFileSync(filterVue, 'utf8');
  if (
    filterText.includes('provideFilterTranslate((text) => props.translate?.(text) ?? text);')
    && filterText.includes('const t = useFilterTranslate();')
  ) {
    filterText = filterText
      .replace(
        `import {
  provideFilterTranslate,
  useFilterTranslate,
  type FilterTranslate,
} from './filterTranslate';`,
        `import {
  provideFilterTranslate,
  type FilterTranslate,
} from './filterTranslate';`,
      )
      .replace(
        'provideFilterTranslate((text) => props.translate?.(text) ?? text);\n\nconst t = useFilterTranslate();',
        `// Translate locally (inject only sees ancestors, not this component's own provide).
const t: FilterTranslate = (text) => props.translate?.(text) ?? text;
provideFilterTranslate(t);`,
      );
    writeFileSync(filterVue, filterText, 'utf8');
    changed += 1;
  }
}

console.log(`[eds-pages-compat] ok (${changed} patch(es) applied)`);
