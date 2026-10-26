import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const edsRoot = path.resolve(root, '../eds-desktop');
const workflowPath = path.join(root, '.github/workflows/deploy-pages.yml');

function fail(message) {
  console.error(`verify-pages-eds-pin: ${message}`);
  process.exit(1);
}

const workflow = fs.readFileSync(workflowPath, 'utf8');
const refMatch = workflow.match(/repository: EDS-UED\/eds-desktop[\s\S]*?ref:\s*([0-9a-f]{40})/);
if (!refMatch) {
  fail('deploy-pages.yml 未找到 eds-desktop ref pin');
}

const pinSha = refMatch[1];
const detailPath = 'packages/components/src/organisms/detail/Detail.vue';
const show = spawnSync('git', ['show', `${pinSha}:${detailPath}`], {
  cwd: edsRoot,
  encoding: 'utf8',
});

if (show.status !== 0) {
  fail(`无法在 ../eds-desktop 读取 pin ${pinSha} 的 Detail.vue（请 fetch 或更新 pin）`);
}

if (!show.stdout.includes("name=\"headline-main\"")) {
  fail(
    `Pages eds pin ${pinSha} 缺少 EgDetail headline-main slot（AML 查询详情 Headline 会空白）`,
  );
}

const iconPath = 'packages/components/src/atoms/icons/eds-black-list-fill.svg';
const iconShow = spawnSync('git', ['show', `${pinSha}:${iconPath}`], {
  cwd: edsRoot,
  encoding: 'utf8',
});

const queryPanel = fs.readFileSync(
  path.join(root, 'src/scenes/risk-control/RiskControlAmlRecordDetailQueryResultPanel.vue'),
  'utf8',
);

if (queryPanel.includes('eds-black-list-fill') && iconShow.status !== 0) {
  fail(
    `Pages eds pin ${pinSha} 无 eds-black-list-fill；处置建议须用 eds-black-list 或提升 pin`,
  );
}

const presetsPath = 'packages/components/src/organisms/detail/applyItemPresets.ts';
const presetsShow = spawnSync('git', ['show', `${pinSha}:${presetsPath}`], {
  cwd: edsRoot,
  encoding: 'utf8',
});

if (presetsShow.status === 0 && presetsShow.stdout.includes("titleIcon: 'eds-hierarchy'")) {
  const hierarchyIconPath = 'packages/components/src/atoms/icons/eds-hierarchy.svg';
  const hierarchyShow = spawnSync('git', ['show', `${pinSha}:${hierarchyIconPath}`], {
    cwd: edsRoot,
    encoding: 'utf8',
  });
  if (hierarchyShow.status !== 0) {
    fail(
      `Pages eds pin ${pinSha} 的 brand-number 使用 eds-hierarchy，但 pin 中无该 SVG`,
    );
  }
}

console.log(`verify-pages-eds-pin: ok (${pinSha.slice(0, 7)} has headline-main)`);
