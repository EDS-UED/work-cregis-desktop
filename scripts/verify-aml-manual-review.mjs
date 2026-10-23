#!/usr/bin/env node
/**
 * AML 人工复核默认档位 / WaaS 提示 — 与 resolveAmlManualReviewDefaultRiskLevel.ts 同步。
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const source = readFileSync(
  join(ROOT, 'src/scenes/risk-control/resolveAmlManualReviewDefaultRiskLevel.ts'),
  'utf8',
);

assert.match(source, /resolveAmlManualReviewDetailRiskTier/, 'tier resolver must exist');
assert.match(source, /return 'suspicious'/, 'suspicious tier required');
assert.doesNotMatch(source, /resolveAmlRiskRatingVisual/, 'must not infer from visual tone');

function tier(detail) {
  if (detail.riskLabelKey === 'Safe' || detail.riskCustomStyle === 'aml-safe') return 'safe';
  if (detail.riskLabelKey === 'Danger' || detail.riskCustomStyle === 'aml-danger') return 'danger';
  return 'suspicious';
}

function defaultLevel(detail) {
  const t = tier(detail);
  if (t === 'safe') return 'safe';
  if (t === 'danger') return 'danger';
  return null;
}

function showHint(detail) {
  return tier(detail) === 'danger';
}

const danger = { riskLabelKey: 'Danger', riskCustomStyle: 'aml-danger' };
const safe = { riskLabelKey: 'Safe', riskCustomStyle: 'aml-safe' };
const suspicious = { riskLabelKey: 'Suspicious', riskCustomStyle: 'aml-suspicious' };

assert.equal(defaultLevel(danger), 'danger');
assert.equal(defaultLevel(safe), 'safe');
assert.equal(defaultLevel(suspicious), null);
assert.equal(showHint(danger), true);
assert.equal(showHint(safe), false);
assert.equal(showHint(suspicious), false);

const store = readFileSync(
  join(ROOT, 'src/scenes/risk-control/riskControlAmlQueryRecordStore.ts'),
  'utf8',
);
assert.match(store, /applyAmlManualReviewOutcome/, 'manual review must patch row risk');
assert.match(store, /amlRiskLabelKey: 'Danger'/, 'manual review danger patch');
assert.match(store, /amlRiskLabelKey: 'Safe'/, 'manual review safe patch');

const flow = readFileSync(
  join(ROOT, 'src/scenes/risk-control/useRiskControlAmlRecordDetailFlow.ts'),
  'utf8',
);
assert.match(flow, /applyAmlManualReviewOutcome/, 'verify must apply manual review patch');

const popover = readFileSync(
  join(ROOT, 'src/scenes/risk-control/RiskControlAmlRecordDetailManualReviewPopover.vue'),
  'utf8',
);
assert.match(popover, /submit: \[level/, 'popover must emit selected risk level');
assert.match(popover, /boundary-selector="\.eds-popup"/, 'popover boundary must match detail remark');
assert.match(popover, /<EgTooltip[\s\S]*:wrap-tooltip="false"/, 'popover must use EgTooltip wrap-tooltip=false (showcase)');
assert.match(popover, /<EgPopover[\s\S]*top-tool[\s\S]*top-tool-closable/, 'popover must use EgPopover top-tool');
assert.doesNotMatch(popover, /teleport-to/, 'popover must keep EgTooltip default teleport (showcase)');
assert.doesNotMatch(popover, /EgAnchoredPopover/, 'manual review must not use EgAnchoredPopover');
assert.match(popover, /:key="formMountKey"/, 'form must remount per open session');
assert.doesNotMatch(popover, /reset-key/, 'legacy reset-key must not be used');

const form = readFileSync(
  join(ROOT, 'src/scenes/risk-control/RiskControlAmlRecordDetailManualReviewForm.vue'),
  'utf8',
);
assert.match(form, /EgRemarkPopoverPanel/, 'manual review must use EgRemarkPopoverPanel');
assert.doesNotMatch(form, /EgComboPopupButton/, 'must not use combo popup button shell');

const manualCss = readFileSync(
  join(ROOT, 'src/scenes/risk-control/RiskControlAmlRecordDetailManualReviewDialog.module.css'),
  'utf8',
);
assert.doesNotMatch(manualCss, /:global\(\.eds-popover/, 'must not patch eds-popover globally');

const globalCss = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
assert.doesNotMatch(globalCss, /eds-popover\.desktopTokens.*glassMicroFloatHost/, 'popover must keep EDS glassMicroFloatHost');
assert.doesNotMatch(
  globalCss,
  /eds-popover\.desktopTokens[^{]*effect-popover-box[^}]*backdrop-filter:\s*none/,
  'popover must keep EDS effect-popover-box glass',
);
assert.doesNotMatch(globalCss, /eds-popover\.desktopTokens \[class\*='shell_'\]/, 'must not override popover shell');
const riskTracePanelCss = readFileSync(
  join(ROOT, 'src/scenes/risk-control/RiskControlAmlRecordDetailRiskTracePanel.module.css'),
  'utf8',
);
assert.doesNotMatch(
  riskTracePanelCss,
  /backdrop-filter:\s*none/,
  'risk trace paginer must not disable frosted-page-chrome',
);
assert.doesNotMatch(
  globalCss,
  /\.eds-detail[\s\S]*\.eds-paginer[\s\S]*\.eds-frosted-page-chrome[\s\S]*backdrop-filter:\s*none/,
  'global css must not flatten detail popup paginer frosted',
);

console.log('✓ verify-aml-manual-review passed');
