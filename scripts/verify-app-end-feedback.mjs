#!/usr/bin/env node
/**
 * 全局 EgEndFeedbackCard 宿主不变量：App 挂载、panel 内绝对定位、业务禁自建 Host。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

function read(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

function fail(message) {
  console.error(`verify-app-end-feedback: ${message}`);
  process.exit(1);
}

const appVue = read('src/App.vue');
if (!/AppEndFeedbackHost/.test(appVue)) {
  fail('App.vue 须挂载 AppEndFeedbackHost');
}

const hostVue = read('src/components/AppEndFeedbackHost.vue');
if (/<Teleport\b/.test(hostVue)) {
  fail('AppEndFeedbackHost 禁 Teleport；须与 AppPopupOverlayHost 同级挂 eds-tooltip-panel');
}
if (!/data-app-end-feedback-host/.test(hostVue)) {
  fail('AppEndFeedbackHost 须带 data-app-end-feedback-host');
}
if (!/EgEndFeedbackCard/.test(hostVue)) {
  fail('AppEndFeedbackHost 须使用 EgEndFeedbackCard');
}

const globalCss = read('src/styles/global.css');
if (!/\.app-preview > \.eds-tooltip-panel > \[data-app-end-feedback-host\]/.test(globalCss)) {
  fail('global.css 须为 panel 内反馈宿主定义 absolute + z-index');
}

const feedbackTs = read('src/composables/appEndFeedback.ts');
if (!/showAppEndFeedbackAfterOverlay/.test(feedbackTs)) {
  fail('appEndFeedback.ts 须导出 showAppEndFeedbackAfterOverlay');
}
if (!/countOpenOverlayPopups|eds-popup/.test(feedbackTs)) {
  fail('showAppEndFeedbackAfterOverlay 须等待 overlay 内 EgPopup 卸净或超时兜底');
}

console.log('✓ verify-app-end-feedback passed');
