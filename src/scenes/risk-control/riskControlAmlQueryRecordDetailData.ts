import type { TagCustomStyle } from '@eds/desktop-components';
import type {
  PaymentEngineRecordRow,
  RiskControlAmlEntityTag,
  RiskControlAmlRiskTraceObject,
  RiskControlAmlRiskTraceSection,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveCurrencyRowPreset } from '@/scenes/shared/egDataListMockData';
import { resolveRiskControlDemoPolicyName } from './riskControlDemoPolicyNames';
import { resolveAmlQueryNetworkCryptoName } from './riskControlAmlQueryOptions';
import type {
  RiskControlAmlCategoryShare,
  RiskControlAmlControlMeasureKey,
  RiskControlAmlCounterpartyRow,
  RiskControlAmlExposureDirection,
  RiskControlAmlReviewLog,
} from './riskControlAmlRecordDetailTypes';
export type RiskControlAmlQueryRecordDetail = {
  riskScore: string;
  riskScoreMax: number;
  riskScoreNumerator: string;
  riskLabelKey: string;
  riskCustomStyle: 'aml-danger' | 'aml-suspicious' | 'aml-safe' | 'aml-handled';
  riskThreshold: number;
  serviceProvider: string;
  belongingEntity: string;
  entityTags: RiskControlAmlEntityTag[];
  waasProject: string;
  ruleName: string;
  ruleNumber: string;
  targetValue: string;
  senderAddress: string;
  collaborationNumber: string;
  transactionAmount: string;
  transactionSymbol: string;
  networkLabel: string;
  networkCryptoName: string;
  requesterName: string;
  requesterAvatarName: string;
  requesterEmailMasked: string;
  queryObjectKey: string;
  triggerModeKey: string;
  queryTime: string;
  isQueryFailed: boolean;
  isQueryException: boolean;
  isOutflowAutoQuery: boolean;
  riskSummaryText: string;
  riskClassificationText: string;
  controlMeasureKey: RiskControlAmlControlMeasureKey;
  sourceExposure: RiskControlAmlExposureDirection;
  destinationExposure: RiskControlAmlExposureDirection;
  sourceCategoryShares: RiskControlAmlCategoryShare[];
  destinationCategoryShares: RiskControlAmlCategoryShare[];
  counterpartyRows: RiskControlAmlCounterpartyRow[];
  sourceTrace: RiskControlAmlRiskTraceSection;
  destinationTrace: RiskControlAmlRiskTraceSection;
  reviewLog: RiskControlAmlReviewLog;
  exceptionHandlingResolved: boolean;
};

/** 实体标签 mock · 每行仅 1 个 Tag；文案与 customStyle 按 rowIndex 确定性选取。 */
const AML_ENTITY_TAG_LABEL_POOL = [
  'Blacklist',
  'Sanctions',
  'Exchange',
  'Mixer',
  'Gambling',
  'Darknet Market',
  'Scam',
  'P2P',
  'Mining Pool',
  'OTC Desk',
  'High Risk',
  'Custody',
] as const;

const AML_ENTITY_TAG_STYLE_POOL = [
  'vermilion',
  'orange',
  'amber',
  'lime',
  'mint',
  'teal',
  'clear-sky',
  'cobalt',
  'aurora',
  'orchid',
  'rose',
  'peach',
] as const satisfies readonly TagCustomStyle[];

const AML_RISK_SCORE_MAX = 10;
const AML_DEFAULT_RISK_THRESHOLD = 2;

const AML_TRACE_OBJECT_DETAIL = {
  riskScore: '7.5',
  riskRating: 'HIGH_RISK',
  amountUsd: '0.0815367049150474',
  contributionPercent: '40.768352457523754',
} as const;

const AML_SOURCE_TRACE_OBJECTS: readonly Omit<RiskControlAmlRiskTraceObject, 'id'>[] = [
  { label: 'Unknown', ...AML_TRACE_OBJECT_DETAIL },
  {
    label: 'Addresses crawled by Scorechain OSINT Intelligence TKtx4wg',
    ...AML_TRACE_OBJECT_DETAIL,
  },
  { label: 'Sun.io', ...AML_TRACE_OBJECT_DETAIL },
  { label: 'Ignored small amounts', ...AML_TRACE_OBJECT_DETAIL },
  { label: 'Binance.com', ...AML_TRACE_OBJECT_DETAIL },
];

const AML_DESTINATION_TRACE_OBJECTS: readonly Omit<RiskControlAmlRiskTraceObject, 'id'>[] = [
  { label: 'Mbcbit (suspected DPRK)', ...AML_TRACE_OBJECT_DETAIL },
  { label: 'Bikcex (suspected DPRK)', ...AML_TRACE_OBJECT_DETAIL },
  { label: 'USDT Blacklisted Address - 7546845630', ...AML_TRACE_OBJECT_DETAIL },
  {
    label: 'Multiple Ponzi Schemes (bestincomezone, globalbestgo, bestbuythservice)',
    ...AML_TRACE_OBJECT_DETAIL,
  },
];

export function resolveDemoAmlEntityTags(rowIndex: number): RiskControlAmlEntityTag[] {
  const labelOffset = (rowIndex * 5) % AML_ENTITY_TAG_LABEL_POOL.length;
  const styleOffset = (rowIndex * 7) % AML_ENTITY_TAG_STYLE_POOL.length;

  return [{
    label: AML_ENTITY_TAG_LABEL_POOL[labelOffset]!,
    customStyle: AML_ENTITY_TAG_STYLE_POOL[styleOffset]!,
  }];
}

/** 交易对手风险 Tab 列表：按行序取 Tag；Binance 等交易所实体固定 Exchange。 */
export function resolveAmlRiskTraceEntityTag(
  entityLabel: string,
  objectIndex: number,
): RiskControlAmlEntityTag {
  const normalized = entityLabel.trim().toLowerCase();
  if (normalized.includes('binance')) {
    return { label: 'Exchange', customStyle: 'cobalt' };
  }
  const labelOffset = objectIndex % AML_ENTITY_TAG_LABEL_POOL.length;
  const styleOffset = objectIndex % AML_ENTITY_TAG_STYLE_POOL.length;
  return {
    label: AML_ENTITY_TAG_LABEL_POOL[labelOffset]!,
    customStyle: AML_ENTITY_TAG_STYLE_POOL[styleOffset]!,
  };
}

function resolveRowIndex(row: PaymentEngineRecordRow): number {
  const match = /^AML-(\d+)$/.exec(row.id.trim());
  if (!match) return 0;
  return Math.max(0, Number.parseInt(match[1] ?? '1', 10) - 1);
}

function buildTraceSection(
  direction: RiskControlAmlRiskTraceSection['direction'],
  score: string,
  objects: readonly Omit<RiskControlAmlRiskTraceObject, 'id'>[],
  rowIndex: number,
): RiskControlAmlRiskTraceSection {
  return {
    direction,
    score,
    objects: objects.map((entry, index) => ({
      id: `${direction}-${rowIndex}-${index}`,
      ...entry,
      entityType: index % 2 === 0 ? 'Direct' : 'Indirect',
    })),
  };
}

function resolveDemoBelongingEntity(rowIndex: number): string {
  if (rowIndex === 0) return 'HuiOne';
  const entities = ['Coinbase Pro.', 'Binance.com', 'Kraken Exchange', 'Gate.io'];
  return entities[rowIndex % entities.length] ?? entities[0]!;
}

function resolveDemoRuleName(rowIndex: number): string {
  return resolveRiskControlDemoPolicyName(rowIndex);
}

function resolveDemoWaasProject(rowIndex: number): string {
  const projects = ['Doris Stodio', 'Coinbase. Deposit_3', 'Gate. Withdraw', 'WaaS Project'];
  return projects[rowIndex % projects.length] ?? projects[0]!;
}

function resolveDemoRequesterEmailMasked(rowIndex: number): string {
  const emails = [
    't******z@gmail.com',
    'a******n@cregis.com',
    'c******e@example.com',
    'm******b@company.io',
  ];
  return emails[rowIndex % emails.length] ?? emails[0]!;
}

function parseRiskNumerator(score: string, isFailed: boolean): string {
  if (isFailed) return '--';
  const trimmed = score.trim();
  if (!trimmed || trimmed === 'NA') return '--';
  const numeric = Number.parseFloat(trimmed);
  if (Number.isFinite(numeric)) {
    return Number.isInteger(numeric) ? String(numeric) : trimmed;
  }
  return trimmed;
}

function resolveIsDanger(
  row: PaymentEngineRecordRow,
  riskScore: string,
  isFailed: boolean,
  isException: boolean,
): boolean {
  if (isFailed || isException) return false;
  if (row.amlRiskCustomStyle === 'aml-danger' || row.amlRiskLabelKey === 'Danger') {
    return true;
  }
  if (
    row.amlRiskCustomStyle === 'aml-suspicious'
    || row.amlRiskCustomStyle === 'aml-safe'
    || row.amlRiskCustomStyle === 'aml-handled'
    || row.amlRiskLabelKey === 'Suspicious'
    || row.amlRiskLabelKey === 'Safe'
  ) {
    return false;
  }
  const numeric = Number.parseFloat(riskScore);
  if (!Number.isFinite(numeric)) return false;
  return numeric >= AML_DEFAULT_RISK_THRESHOLD;
}

function buildRiskSummaryText(
  isFailed: boolean,
  isException: boolean,
  queryObjectKey: string,
  sourceCategories: string,
  destinationCategories: string,
  sourcePercent: string,
  destinationPercent: string,
  translate: (key: string) => string,
): string {
  if (isFailed || isException) {
    return translate('AML query exception no result summary');
  }
  if (queryObjectKey === 'Transaction Hash') {
    const riskCategories = [sourceCategories, destinationCategories]
      .filter(Boolean)
      .join('、');
    const totalPercent = sourcePercent;
    const template = translate('AML query transaction risk summary sentence');
    return template
      .replace('{riskCategories}', riskCategories)
      .replace('{totalPercent}', totalPercent);
  }
  const template = translate('AML query risk summary sentence');
  return template
    .replace('{sourceCategories}', sourceCategories)
    .replace('{sourcePercent}', sourcePercent)
    .replace('{destinationPercent}', destinationPercent);
}

function buildRiskClassificationText(
  threshold: number,
  translate: (key: string) => string,
): string {
  const template = translate('AML query risk classification sentence');
  return template.replace('{threshold}', String(threshold));
}

type DemoExposureSegmentDef = {
  idSuffix: string;
  labelKey: string;
  percent: number;
  customStyle: TagCustomStyle;
};

/** 首行 mock · 收款 8 段合计 76% / 出款 5 段合计 46%。 */
const ROW_ZERO_SOURCE_EXPOSURE_DEFS: readonly DemoExposureSegmentDef[] = [
  { idSuffix: 'sanctions', labelKey: 'Sanctions', percent: 15, customStyle: 'vermilion' },
  { idSuffix: 'mixer', labelKey: 'Mixer', percent: 12, customStyle: 'orange' },
  { idSuffix: 'exchange', labelKey: 'Exchange', percent: 10, customStyle: 'amber' },
  { idSuffix: 'gambling', labelKey: 'Gambling', percent: 8, customStyle: 'lime' },
  { idSuffix: 'darknet', labelKey: 'Darknet Market', percent: 14, customStyle: 'teal' },
  { idSuffix: 'scam', labelKey: 'Scam', percent: 7, customStyle: 'clear-sky' },
  { idSuffix: 'p2p', labelKey: 'P2P', percent: 6, customStyle: 'cobalt' },
  { idSuffix: 'blacklist', labelKey: 'Blacklist', percent: 4, customStyle: 'rose' },
];

const ROW_ZERO_DESTINATION_EXPOSURE_DEFS: readonly DemoExposureSegmentDef[] = [
  { idSuffix: 'mixer', labelKey: 'Mixer', percent: 11, customStyle: 'orange' },
  { idSuffix: 'exchange', labelKey: 'Exchange', percent: 10, customStyle: 'amber' },
  { idSuffix: 'gambling', labelKey: 'Gambling', percent: 9, customStyle: 'lime' },
  { idSuffix: 'sanctions', labelKey: 'Sanctions', percent: 9, customStyle: 'vermilion' },
  { idSuffix: 'darknet', labelKey: 'Darknet Market', percent: 7, customStyle: 'teal' },
];

function exposureDefsForDirection(
  direction: 'source' | 'destination',
): readonly DemoExposureSegmentDef[] {
  return direction === 'source'
    ? ROW_ZERO_SOURCE_EXPOSURE_DEFS
    : ROW_ZERO_DESTINATION_EXPOSURE_DEFS;
}

function buildExposureSegmentsFromDefs(
  direction: 'source' | 'destination',
  defs: readonly DemoExposureSegmentDef[],
  targetHighRiskPercent: number,
): RiskControlAmlExposureDirection['segments'] {
  const baselineTotal = sumSegmentPercents(defs);
  if (baselineTotal <= 0) return [];

  return defs.map((entry) => ({
    id: `${direction}-${entry.idSuffix}`,
    labelKey: entry.labelKey,
    percent: Number(((entry.percent / baselineTotal) * targetHighRiskPercent).toFixed(1)),
    customStyle: entry.customStyle,
  }));
}

function buildRowZeroExposureSegments(
  direction: 'source' | 'destination',
): RiskControlAmlExposureDirection['segments'] {
  return buildExposureSegmentsFromDefs(
    direction,
    exposureDefsForDirection(direction),
    sumSegmentPercents(exposureDefsForDirection(direction)),
  );
}

function buildRowZeroCategoryShares(
  direction: 'source' | 'destination',
): RiskControlAmlCategoryShare[] {
  const defs = direction === 'source'
    ? ROW_ZERO_SOURCE_EXPOSURE_DEFS
    : ROW_ZERO_DESTINATION_EXPOSURE_DEFS;
  return defs.map((entry) => ({
    id: `${direction}-${entry.idSuffix}-share`,
    labelKey: entry.labelKey,
    percent: entry.percent,
    customStyle: entry.customStyle,
  }));
}

function sumSegmentPercents(
  segments: readonly { percent: number }[],
): number {
  return segments.reduce((sum, entry) => sum + entry.percent, 0);
}

function buildDemoExposure(
  direction: 'source' | 'destination',
  rowIndex: number,
  highRiskPercent: number,
): RiskControlAmlExposureDirection {
  const defs = exposureDefsForDirection(direction);
  const segments = rowIndex === 0
    ? buildRowZeroExposureSegments(direction)
    : buildExposureSegmentsFromDefs(direction, defs, highRiskPercent);

  return {
    direction,
    highRiskPercent: rowIndex === 0 ? sumSegmentPercents(segments) : highRiskPercent,
    segments,
  };
}

function buildDemoCategoryShares(
  direction: 'source' | 'destination',
  rowIndex: number,
): RiskControlAmlCategoryShare[] {
  const defs = exposureDefsForDirection(direction);
  if (rowIndex === 0) {
    return buildRowZeroCategoryShares(direction);
  }
  const targetTotal = direction === 'source' ? 62.5 : 37.5;
  return buildExposureSegmentsFromDefs(direction, defs, targetTotal).map((entry) => ({
    id: `${entry.id}-share`,
    labelKey: entry.labelKey,
    percent: entry.percent,
    customStyle: entry.customStyle,
  }));
}

function buildDemoCounterpartyRows(rowIndex: number): RiskControlAmlCounterpartyRow[] {
  const baseAmount = rowIndex === 0 ? '128450.32' : '4021.18';
  return [
    {
      id: 'cp-source-1',
      direction: 'source',
      entity: rowIndex === 0 ? 'HuiOne Exchange' : 'Unknown Entity',
      exposureTypeKey: 'Direct',
      riskTagLabel: rowIndex === 0 ? 'Sanctions' : 'Mixer',
      riskTagCustomStyle: rowIndex === 0 ? 'vermilion' : 'orange',
      amountUsd: baseAmount,
      contributionPercent: rowIndex === 0 ? '100' : '62.5',
    },
    {
      id: 'cp-destination-1',
      direction: 'destination',
      entity: 'Nested Service',
      exposureTypeKey: 'Indirect',
      riskTagLabel: 'Gambling',
      riskTagCustomStyle: 'amber',
      amountUsd: '890.04',
      contributionPercent: '22.1',
    },
  ];
}

function buildDemoReviewLog(
  rowIndex: number,
  isFailed: boolean,
  isException: boolean,
  riskLabelKey: string,
  queryTimeDisplay: string,
): RiskControlAmlReviewLog {
  const reviewerNames = ['Mia Zhang', 'Alex Chen', 'Jordan Lee'];
  const reviewerName = reviewerNames[rowIndex % reviewerNames.length] ?? reviewerNames[0]!;
  const reviewedAt = resolveDemoReviewedAt(rowIndex, queryTimeDisplay);

  let riskLevelAfterKey = 'Safe';
  if (isFailed || riskLabelKey === 'NA') {
    riskLevelAfterKey = 'NA';
  } else if (riskLabelKey === 'AML Exception' || isException) {
    riskLevelAfterKey = 'Danger';
  } else if (riskLabelKey === 'Danger') {
    riskLevelAfterKey = 'Danger';
  } else if (riskLabelKey === 'Suspicious') {
    riskLevelAfterKey = 'Suspicious';
  }

  let riskLevelBeforeKey = 'Safe';
  if (riskLevelAfterKey === 'NA') {
    riskLevelBeforeKey = 'Suspicious';
  } else if (riskLevelAfterKey === 'Danger') {
    riskLevelBeforeKey = 'Suspicious';
  } else if (riskLevelAfterKey === 'Suspicious') {
    riskLevelBeforeKey = 'Safe';
  }

  const remark = isFailed
    ? '查询未返回有效风险评分，已记录复核结论并通知发起人重新发起查询。'
    : isException
      ? '第三方筛查超时，已依据历史敞口与人工规则上调风险等级。'
      : '已核对链上归因与敞口占比，确认维持当前风险等级及处置建议。';

  return {
    riskLevelBeforeKey,
    riskLevelAfterKey,
    reviewerName,
    reviewerAvatarName: reviewerName,
    reviewedAt,
    remark,
  };
}

function resolveDemoReviewedAt(rowIndex: number, queryTimeDisplay: string): string {
  const trimmed = queryTimeDisplay.trim();
  const match = /^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})/.exec(trimmed);
  if (match) {
    const [, datePart, hourPart, minutePart] = match;
    const hour = Number.parseInt(hourPart ?? '0', 10);
    const minute = Number.parseInt(minutePart ?? '0', 10);
    const reviewMinute = (minute + 18 + rowIndex) % 60;
    const reviewHour = hour + Math.floor((minute + 18 + rowIndex) / 60);
    return `${datePart} ${String(reviewHour).padStart(2, '0')}:${String(reviewMinute).padStart(2, '0')}:30`;
  }
  return `2024-08-${String(12 + (rowIndex % 10)).padStart(2, '0')} 16:45:30`;
}

function resolveControlMeasureKey(
  row: PaymentEngineRecordRow,
  isDanger: boolean,
): RiskControlAmlControlMeasureKey {
  if (!isDanger) return 'none';
  if (row.amlOutflowAutoQuery && rowIndexIsEven(row)) return 'rejected';
  return 'alerted';
}

function rowIndexIsEven(row: PaymentEngineRecordRow): boolean {
  return resolveRowIndex(row) % 2 === 0;
}

export function resolveRiskControlAmlQueryRecordDetail(
  row: PaymentEngineRecordRow,
  translate: (key: string) => string = (key) => key,
): RiskControlAmlQueryRecordDetail {
  const rowIndex = resolveRowIndex(row);
  const preset = resolveCurrencyRowPreset(rowIndex);
  const isFailed = Boolean(row.amlQueryFailed);
  const isException = Boolean(row.amlQueryException);
  const exceptionHandlingResolved = Boolean(row.amlExceptionHandlingResolved);
  const isUnresolvedException = isException && !exceptionHandlingResolved;
  const rawScore = isFailed
    ? 'NA'
    : (row.amlRiskScore?.trim() || '6.8');
  const riskScoreNumerator = parseRiskNumerator(rawScore, isFailed);
  const isDanger = resolveIsDanger(row, rawScore, isFailed, isUnresolvedException);
  const targetValue = row.amlTargetValue?.trim() || row.id;
  const requesterName = row.amlRequesterName?.trim() || row.id;
  const ruleName = row.amlTriggeredRuleName?.trim() || resolveDemoRuleName(rowIndex);
  const rowZeroSourceTotal = sumSegmentPercents(ROW_ZERO_SOURCE_EXPOSURE_DEFS);
  const rowZeroDestinationTotal = sumSegmentPercents(ROW_ZERO_DESTINATION_EXPOSURE_DEFS);
  const sourceCategories = rowIndex === 0
    ? ROW_ZERO_SOURCE_EXPOSURE_DEFS.map((entry) => translate(entry.labelKey)).join('、')
    : `${translate('Mixer')}、${translate('Gambling')}`;
  const destinationCategories = rowIndex === 0
    ? ROW_ZERO_DESTINATION_EXPOSURE_DEFS.map((entry) => translate(entry.labelKey)).join('、')
    : translate('Gambling');
  const sourcePercent = rowIndex === 0 ? `${rowZeroSourceTotal}%` : '62.5%';
  const destinationPercent = rowIndex === 0 ? `${rowZeroDestinationTotal}%` : '37.5%';
  const highRiskSource = rowIndex === 0 ? rowZeroSourceTotal : 62.5;
  const highRiskDestination = rowIndex === 0 ? rowZeroDestinationTotal : 37.5;

  return {
    riskScore: rawScore,
    riskScoreMax: AML_RISK_SCORE_MAX,
    riskScoreNumerator,
    riskLabelKey: isFailed
      ? 'NA'
      : isUnresolvedException
        ? 'AML Exception'
        : isDanger
          ? 'Danger'
          : (row.amlRiskLabelKey ?? 'Safe'),
    riskCustomStyle: isFailed
      ? 'aml-safe'
      : isUnresolvedException
        ? 'aml-suspicious'
        : isDanger
          ? 'aml-danger'
          : (row.amlRiskCustomStyle ?? 'aml-safe'),
    riskThreshold: AML_DEFAULT_RISK_THRESHOLD,
    serviceProvider: row.amlServiceProvider?.trim() || 'Elliptic',
    belongingEntity: isFailed || isException
      ? '--'
      : (row.amlBelongingEntity?.trim() || resolveDemoBelongingEntity(rowIndex)),
    entityTags: isFailed || isException
      ? []
      : (row.amlEntityTags?.length
        ? [...row.amlEntityTags]
        : resolveDemoAmlEntityTags(rowIndex)),
    waasProject: row.amlWaasProject?.trim() || resolveDemoWaasProject(rowIndex),
    ruleName,
    ruleNumber: row.amlTriggeredRuleNumber?.trim() || `AML143768224306790${rowIndex}`,
    targetValue,
    senderAddress: row.amlSenderAddress?.trim()
      || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    collaborationNumber: row.amlCollaborationNumber?.trim()
      || `COL-${String(rowIndex + 1).padStart(8, '0')}`,
    transactionAmount: row.orderAmount?.trim() || '125000.50',
    transactionSymbol: row.orderSymbol?.trim() || preset.symbol || 'USDT',
    networkLabel: row.amlNetworkLabel?.trim() || preset.networkLabel || 'Bitcoin',
    networkCryptoName: resolveAmlQueryNetworkCryptoName(
      row.amlNetworkLabel?.trim() || preset.networkLabel || 'Bitcoin',
    ),
    requesterName,
    requesterAvatarName: row.amlRequesterAvatarName?.trim() || requesterName,
    requesterEmailMasked:
      row.amlRequesterEmailMasked?.trim() || resolveDemoRequesterEmailMasked(rowIndex),
    queryObjectKey: row.amlQueryObjectKey ?? (rowIndex % 2 === 0 ? 'Address' : 'Transaction Hash'),
    triggerModeKey: row.amlTriggerModeKey ?? 'Automatic',
    queryTime: row.amlQueryTimeDisplay?.trim() || row.createdAt,
    isQueryFailed: isFailed,
    isQueryException: isException,
    isOutflowAutoQuery: Boolean(row.amlOutflowAutoQuery),
    riskSummaryText: buildRiskSummaryText(
      isFailed,
      isException,
      row.amlQueryObjectKey ?? (rowIndex % 2 === 0 ? 'Address' : 'Transaction Hash'),
      sourceCategories,
      destinationCategories,
      sourcePercent,
      destinationPercent,
      translate,
    ),
    riskClassificationText: buildRiskClassificationText(
      AML_DEFAULT_RISK_THRESHOLD,
      translate,
    ),
    controlMeasureKey: resolveControlMeasureKey(row, isDanger),
    sourceExposure: buildDemoExposure('source', rowIndex, highRiskSource),
    destinationExposure: buildDemoExposure('destination', rowIndex, highRiskDestination),
    sourceCategoryShares: buildDemoCategoryShares('source', rowIndex),
    destinationCategoryShares: buildDemoCategoryShares('destination', rowIndex),
    counterpartyRows: isFailed || isException ? [] : buildDemoCounterpartyRows(rowIndex),
    sourceTrace: buildTraceSection('source', rawScore, AML_SOURCE_TRACE_OBJECTS, rowIndex),
    destinationTrace: buildTraceSection(
      'destination',
      rawScore,
      AML_DESTINATION_TRACE_OBJECTS,
      rowIndex,
    ),
    exceptionHandlingResolved,
    reviewLog: buildDemoReviewLog(
      rowIndex,
      isFailed,
      isException,
      isFailed
        ? 'NA'
        : isUnresolvedException
          ? 'AML Exception'
          : isDanger
            ? 'Danger'
            : (row.amlRiskLabelKey ?? 'Safe'),
      row.amlQueryTimeDisplay?.trim() || row.createdAt,
    ),
  };
}

export function resolveDefaultAmlEntityTags(): RiskControlAmlEntityTag[] {
  return resolveDemoAmlEntityTags(0);
}
