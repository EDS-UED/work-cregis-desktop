import type { TagCustomStyle } from '@eds/desktop-components';

export type RiskControlAmlExposureSegment = {
  id: string;
  labelKey: string;
  percent: number;
  customStyle: TagCustomStyle;
};

export type RiskControlAmlExposureDirection = {
  direction: 'source' | 'destination';
  highRiskPercent: number;
  segments: RiskControlAmlExposureSegment[];
};

export type RiskControlAmlCategoryShare = {
  id: string;
  labelKey: string;
  percent: number;
  customStyle: TagCustomStyle;
};

export type RiskControlAmlCounterpartyRow = {
  id: string;
  direction: 'source' | 'destination';
  entity: string;
  exposureTypeKey: string;
  riskTagLabel: string;
  riskTagCustomStyle: TagCustomStyle;
  amountUsd: string;
  contributionPercent: string;
};

export type RiskControlAmlControlMeasureKey = 'none' | 'rejected' | 'alerted';

export type RiskControlAmlReviewLog = {
  riskLevelBeforeKey: string;
  riskLevelAfterKey: string;
  reviewerName: string;
  reviewerAvatarName: string;
  reviewedAt: string;
  remark: string;
};
