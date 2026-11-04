#!/usr/bin/env node
/**
 * 业务 EgFilter 默认对齐 Showcase filterCustomizeDefaults（无条件 456px）。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SCENES = join(ROOT, 'src/scenes');

function read(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

function fail(message) {
  console.error(`verify-app-eg-filter-defaults: ${message}`);
  process.exit(1);
}

function walkVueFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) {
      walkVueFiles(abs, out);
      continue;
    }
    if (name.endsWith('.vue')) out.push(abs);
  }
  return out;
}

const presetPath = 'src/scenes/shared/appEgFilterLayoutDefaults.ts';
const presetSource = read(presetPath);
if (!presetSource.includes('APP_EG_FILTER_PANEL_WIDTH_UNCONDITIONAL = 456')) {
  fail(`${presetPath} 须与 Showcase 一致：无条件宽 456px`);
}

const toolbarFilter = read('src/scenes/shared/AppToolbarEgFilter.vue');
if (!/resolveAppEgFilterPresetBind/.test(toolbarFilter)) {
  fail('AppToolbarEgFilter 须 v-bind resolveAppEgFilterPresetBind');
}

const directEgFilterFiles = [];
for (const abs of walkVueFiles(SCENES)) {
  const rel = abs.slice(ROOT.length + 1);
  const source = read(rel);
  if (!/<EgFilter\b/.test(source)) continue;
  if (rel === 'src/scenes/shared/AppToolbarEgFilter.vue') continue;
  if (!/resolveAppEgFilterPresetBind|egFilterPresetBind/.test(source)) {
    directEgFilterFiles.push(rel);
  }
}

if (directEgFilterFiles.length > 0) {
  fail(
    `内嵌 EgFilter 须绑定 Showcase 预设（resolveAppEgFilterPresetBind / egFilterPresetBind）：\n${directEgFilterFiles.join('\n')}`,
  );
}

console.log('✓ verify-app-eg-filter-defaults passed');
