import { isTaskAmlRiskListStatusLabel } from '../list-field/tasksListFieldStatusRowData';
import type { BuildDetailApprovalProgressOptions } from './buildDetailApprovalProgressSteps';

/** 列表 Status 为 AML 演示态时：标题 Tag 仍用 AML，审批进度与待审批 workflow 一致。 */
export function resolveDetailProgressStepBuildOptions(input: {
  readOnly: boolean;
  listStatusLabel?: string;
  progressListStatusLabel?: string;
  thresholdSubtitle?: string;
}): BuildDetailApprovalProgressOptions {
  const amlListStatusProgress =
    Boolean(input.listStatusLabel && isTaskAmlRiskListStatusLabel(input.listStatusLabel));

  if (amlListStatusProgress) {
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
