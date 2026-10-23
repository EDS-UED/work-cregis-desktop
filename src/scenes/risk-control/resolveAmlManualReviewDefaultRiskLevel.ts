import type { RiskControlAmlQueryRecordDetail } from './riskControlAmlQueryRecordDetailData';

export type AmlManualReviewDetailRiskTier = 'danger' | 'safe' | 'suspicious';

export type ManualReviewDetailRisk = Pick<
  RiskControlAmlQueryRecordDetail,
  'riskCustomStyle' | 'riskLabelKey'
>;

/** 与详情顶卡「危险 / 安全 / 可疑」展示对齐，不依赖 tone 推断。 */
export function resolveAmlManualReviewDetailRiskTier(
  detail: ManualReviewDetailRisk,
): AmlManualReviewDetailRiskTier {
  if (detail.riskLabelKey === 'Safe' || detail.riskCustomStyle === 'aml-safe') {
    return 'safe';
  }
  if (detail.riskLabelKey === 'Danger' || detail.riskCustomStyle === 'aml-danger') {
    return 'danger';
  }
  return 'suspicious';
}

/** 人工复核默认勾选：危险→危险、安全→安全、可疑→不预选。 */
export function resolveAmlManualReviewDefaultRiskLevel(
  detail: ManualReviewDetailRisk,
): 'danger' | 'safe' | null {
  const tier = resolveAmlManualReviewDetailRiskTier(detail);
  if (tier === 'safe') return 'safe';
  if (tier === 'danger') return 'danger';
  return null;
}

/** 仅详情为危险且用户选「安全」时展示 WaaS 解禁提示。 */
export function resolveAmlManualReviewShowSafeWaasHintWhenSelectingSafe(
  detail: ManualReviewDetailRisk,
): boolean {
  return resolveAmlManualReviewDetailRiskTier(detail) === 'danger';
}
