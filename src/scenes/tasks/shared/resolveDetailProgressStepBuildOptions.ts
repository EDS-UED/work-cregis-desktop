import type { BuildDetailApprovalProgressOptions } from './buildDetailApprovalProgressSteps';

/** 已办 AML 演示行（index 5/6）：审批进度与待审批 workflow 一致；AML 文案在详情接收方 Tag。 */
export function resolveDetailProgressStepBuildOptions(input: {
  readOnly: boolean;
  listStatusLabel?: string;
  progressListStatusLabel?: string;
  thresholdSubtitle?: string;
  amlRiskDemoRow?: boolean;
}): BuildDetailApprovalProgressOptions {
  if (input.amlRiskDemoRow) {
    return {
      thresholdSubtitle: input.thresholdSubtitle,
      viewMode: 'workflow',
      applyFirstApprovalNodePendingDemo: true,
    };
  }

  return {
    thresholdSubtitle: input.thresholdSubtitle,
    viewMode: input.readOnly ? 'record' : 'workflow',
    listStatusLabel: input.readOnly
      ? (input.progressListStatusLabel ?? input.listStatusLabel)
      : undefined,
    applyFirstApprovalNodePendingDemo: !input.readOnly,
  };
}
