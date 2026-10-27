import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function fail(message) {
  console.error(`verify-batch-aml-danger-anchor: ${message}`);
  process.exit(1);
}

const hostSource = read('src/scenes/tasks/shared/TasksBatchAmlDangerConfirmHost.vue');
const anchorSource = read('src/scenes/tasks/shared/resolveBatchAmlDangerActionAnchor.ts');

if (!hostSource.includes('data-eds-trigger-metrics')) {
  fail('TasksBatchAmlDangerConfirmHost 须在定位触发器上标记 data-eds-trigger-metrics');
}

if (
  !read('src/scenes/tasks/shared/batchAmlDangerGateChrome.module.css').includes(':global(.app-preview[data-tasks-batch-aml-gate-open])')
  || !read('src/dev/shell-debug/shim/AnchoredPopover.vue').includes('showTriggerActive')
) {
  fail('AML gate 须 global preview 选择器 + AnchoredPopover showTriggerActive 点按态');
}

if (!hostSource.includes('registerPopoverTrigger(onClick)')) {
  fail('TasksBatchAmlDangerConfirmHost 须通过 trigger slot onClick 打开（EgConfirmPopover 无 expose open）');
}

if (!anchorSource.includes('queryActiveDataListBatchBar')) {
  fail('resolveBatchAmlDangerActionAnchor 须限定当前批选 DataList BatchBar');
}

if (!read('src/scenes/tasks/TasksDataListPage.vue').includes('syncBatchAmlDangerActionAnchorFromDom')) {
  fail('TasksDataListPage 须在 AML gate 前 syncBatchAmlDangerActionAnchorFromDom');
}

if (!read('src/scenes/tasks/shared/useTasksBatchAmlDangerGate.ts').includes('dangerConfirmHostVisible')) {
  fail('useTasksBatchAmlDangerGate 须在 AML 关闭后再 resolve 批处理 beforeOpen');
}

if (!read('src/scenes/tasks/shared/useTasksBatchAmlDangerGate.ts').includes('syncBatchAmlGateChromeWhileWaiting')) {
  fail('useTasksBatchAmlDangerGate 须在 gate 开启时同步 batch AML chrome');
}

if (
  !read('src/scenes/tasks/shared/batchAmlDangerGateTiming.ts').includes('waitForBatchAmlGateAfterPrepLoading')
  || !read('src/scenes/tasks/shared/batchAmlDangerGateTiming.ts').includes('BATCH_AML_GATE_LOADING_VISIBLE_MS')
) {
  fail('batchAmlDangerGateTiming 须在 prep 转圈结束后再开 AML');
}

if (!read('src/scenes/tasks/shared/TasksBatchAmlDangerConfirmHost.vue').includes('pendingOpenWhenTriggerReady')) {
  fail('TasksBatchAmlDangerConfirmHost 须在 trigger register 后再 open AML popover');
}

if (!read('src/scenes/tasks/shared/TasksBatchAmlDangerConfirmHost.vue').includes('closingAfterConfirm')) {
  fail('TasksBatchAmlDangerConfirmHost 须忽略 confirm 后的 dismiss，避免 gate 被取消');
}

if (!read('src/scenes/tasks/shared/batchAmlDangerGateChrome.module.css').includes('data-tasks-batch-aml-gate-open')) {
  fail('batchAmlDangerGateChrome 须在 AML 等待时隐藏 BatchBar beforeOpen loading');
}

const timingSource = read('src/scenes/tasks/shared/batchAmlDangerGateTiming.ts');
if (
  timingSource.includes('BATCH_AML_SIMULATED_PREP_CLASS')
  || timingSource.includes('batchAmlDangerSimulatedPrep')
) {
  fail('直点签名勿叠 simulated prep CSS（EgDataList eds-load 已承担转圈）');
}

if (!read('src/scenes/tasks/shared/batchAmlDangerGateChrome.ts').includes('setBatchAmlGateExceptAnchor')) {
  fail('batchAmlDangerGateChrome 须登记 closeAll except 锚点以保留批处理 Popover 会话');
}

if (
  !read('src/scenes/tasks/shared/batchAmlDangerGateChrome.ts').includes(
    'batchAmlGateAnchoredPrepSuspendRevision',
  )
  || !read('src/scenes/tasks/shared/batchAmlDangerGateChrome.ts').includes(
    'clearAllAnchoredPopoverPrepDeferredLoading',
  )
  || !read('src/dev/shell-debug/shim/AnchoredPopover.vue').includes(
    'registerAnchoredPopoverPrepDeferredLoadingClear',
  )
) {
  fail('AML gate 须 reactive 暂停并强制清除 AnchoredPopover prepDeferredLoading');
}

if (!read('src/dev/shell-debug/shim/anchoredTooltipManager.ts').includes('resolveBatchAmlGateExceptAnchor')) {
  fail('anchoredTooltipManager shim 须在 closeAll 时保留 batch AML gate 锚点');
}

if (!read('src/dev/shell-debug/shim/AnchoredPopover.vue').includes('await nextTick()')) {
  fail('AnchoredPopover shim 须在长时 onBeforeOpen 后 nextTick 再 openPanel');
}

if (
  !read('vite.config.ts').includes('shim/AnchoredPopover.vue')
  || !read('vite.config.ts').includes('aliasEdsAnchoredShims')
) {
  fail('vite.config 须 alias / resolveId 将 EDS AnchoredPopover 指向业务 shim');
}

console.log('verify-batch-aml-danger-anchor: ok');
