import type { IconName } from '@eds/desktop-components';

export type AmlRiskRatingTone = 'danger' | 'warning' | 'success';

export type AmlRiskRatingVisual = {
  iconName: IconName;
  tone: AmlRiskRatingTone;
};

const AML_RISK_RATING_VISUAL_BY_STYLE: Record<
  'aml-danger' | 'aml-suspicious' | 'aml-safe',
  AmlRiskRatingVisual
> = {
  'aml-danger': { iconName: 'eds-aml-warning-fill' as IconName, tone: 'danger' },
  'aml-suspicious': { iconName: 'eds-warning-fill' as IconName, tone: 'warning' },
  'aml-safe': { iconName: 'eds-aml-safety' as IconName, tone: 'success' },
};

export function resolveAmlRiskRatingVisual(
  customStyle: string | undefined,
): AmlRiskRatingVisual {
  const key = customStyle?.trim();
  if (key === 'aml-danger' || key === 'aml-suspicious' || key === 'aml-safe') {
    return AML_RISK_RATING_VISUAL_BY_STYLE[key];
  }
  return AML_RISK_RATING_VISUAL_BY_STYLE['aml-safe'];
}
