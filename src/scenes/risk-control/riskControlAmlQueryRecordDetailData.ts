import type { TagCustomStyle } from '@eds/desktop-components';
import type {
  PaymentEngineRecordRow,
  RiskControlAmlEntityTag,
  RiskControlAmlRiskTraceObject,
  RiskControlAmlRiskTraceSection,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveCurrencyRowPreset } from '@/scenes/shared/egDataListMockData';
import type {
  RiskControlAmlCategoryShare,
  RiskControlAmlControlMeasureKey,
  RiskControlAmlCounterpartyRow,
  RiskControlAmlExposureDirection,
} from './riskControlAmlRecordDetailTypes';

export type RiskControlAmlQueryRecordDetail = {
  riskScore: string;
  riskScoreMax: number;
  riskScoreNumerator: string;
  riskLabelKey: string;
  riskCustomStyle: 'aml-danger' | 'aml-suspicious' | 'aml-safe';
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
  entityType: 'Suspicious',
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
    })),
  };
}

function resolveDemoBelongingEntity(rowIndex: number): string {
  if (rowIndex === 0) return 'HuiOne';
  const entities = ['Coinbase Pro.', 'Binance.com', 'Kraken Exchange', 'Gate.io'];
  return entities[rowIndex % entities.length] ?? entities[0]!;
}

function resolveDemoRuleName(rowIndex: number): string {
  const names = ['KYA Auto Rule', 'Treasury Guard', 'Deposit Monitor', 'Withdraw Scan'];
  return names[rowIndex % names.length] ?? names[0]!;
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
  if (row.amlRiskLabelKey === 'Danger') return true;
  const numeric = Number.parseFloat(riskScore);
  if (!Number.isFinite(numeric)) return false;
  return numeric >= AML_DEFAULT_RISK_THRESHOLD;
}

function buildRiskSummaryText(
  isFailed: boolean,
  isException: boolean,
  sourceCategories: string,
  destinationCategories: string,
  sourcePercent: string,
  destinationPercent: string,
  translate: (key: string) => string,
): string {
  if (isFailed || isException) {
    return translate('AML query exception no result summary');
  }
  const template = translate('AML query risk summary sentence');
  return template
    .replace('{sourceCategories}', sourceCategories)
    .replace('{destinationCategories}', destinationCategories)
    .replace('{sourcePercent}', sourcePercent)
    .replace('{destinationPercent}', destinationPercent);
}

function buildRiskClassificationText(
  ruleName: string,
  threshold: number,
  translate: (key: string) => string,
): string {
  const template = translate('AML query risk classification sentence');
  return template
    .replace('{ruleName}', ruleName)
    .replace('{threshold}', String(threshold));
}

type DemoExposureSegmentDef = {
  idSuffix: string;
  labelKey: string;
  percent: number;
  customStyle: TagCustomStyle;
};

const ROW_ZERO_SOURCE_EXPOSURE_DEFS: readonly DemoExposureSegmentDef[] = [
  { idSuffix: 'sanctions', labelKey: 'Sanctions', percent: 18, customStyle: 'vermilion' },
  { idSuffix: 'mixer', labelKey: 'Mixer', percent: 14, customStyle: 'orange' },
  { idSuffix: 'exchange', labelKey: 'Exchange', percent: 12, customStyle: 'amber' },
  { idSuffix: 'gambling', labelKey: 'Gambling', percent: 10, customStyle: 'lime' },
  { idSuffix: 'darknet', labelKey: 'Darknet Market', percent: 9, customStyle: 'teal' },
  { idSuffix: 'scam', labelKey: 'Scam', percent: 7, customStyle: 'cobalt' },
];

const ROW_ZERO_DESTINATION_EXPOSURE_DEFS: readonly DemoExposureSegmentDef[] = [
  { idSuffix: 'mixer', labelKey: 'Mixer', percent: 14, customStyle: 'orange' },
  { idSuffix: 'exchange', labelKey: 'Exchange', percent: 12, customStyle: 'amber' },
  { idSuffix: 'gambling', labelKey: 'Gambling', percent: 11, customStyle: 'lime' },
  { idSuffix: 'sanctions', labelKey: 'Sanctions', percent: 11, customStyle: 'vermilion' },
];

function buildRowZeroExposureSegments(
  direction: 'source' | 'destination',
): RiskControlAmlExposureDirection['segments'] {
  const defs = direction === 'source'
    ? ROW_ZERO_SOURCE_EXPOSURE_DEFS
    : ROW_ZERO_DESTINATION_EXPOSURE_DEFS;
  return defs.map((entry) => ({
    id: `${direction}-${entry.idSuffix}`,
    labelKey: entry.labelKey,
    percent: entry.percent,
    customStyle: entry.customStyle,
  }));
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
  if (rowIndex === 0) {
    const segments = buildRowZeroExposureSegments(direction);
    return {
      direction,
      highRiskPercent: sumSegmentPercents(segments),
      segments,
    };
  }

  const segments = [
    {
      id: `${direction}-mixer`,
      labelKey: 'Mixer',
      percent: Math.min(highRiskPercent, 45),
      customStyle: 'orange' as TagCustomStyle,
    },
    {
      id: `${direction}-exchange`,
      labelKey: 'Exchange',
      percent: Math.max(0, highRiskPercent - 45),
      customStyle: 'amber' as TagCustomStyle,
    },
  ].filter((entry) => entry.percent > 0);

  return {
    direction,
    highRiskPercent,
    segments,
  };
}

function buildDemoCategoryShares(
  direction: 'source' | 'destination',
  rowIndex: number,
): RiskControlAmlCategoryShare[] {
  if (rowIndex === 0) {
    return buildRowZeroCategoryShares(direction);
  }
  return [
    {
      id: `${direction}-mixer-share`,
      labelKey: 'Mixer',
      percent: 62.5,
      customStyle: 'orange',
    },
    {
      id: `${direction}-gambling-share`,
      labelKey: 'Gambling',
      percent: 37.5,
      customStyle: 'amber',
    },
  ];
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
  const rawScore = isFailed
    ? 'NA'
    : (row.amlRiskScore?.trim() || '6.8');
  const riskScoreNumerator = parseRiskNumerator(rawScore, isFailed);
  const isDanger = resolveIsDanger(row, rawScore, isFailed, isException);
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
      : isException
        ? 'AML Exception'
        : isDanger
          ? 'Danger'
          : (row.amlRiskLabelKey ?? 'Safe'),
    riskCustomStyle: isFailed
      ? 'aml-safe'
      : isException
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
    networkCryptoName: row.amlCurrencyCryptoName?.trim() || preset.cryptoName || 'bitcoin',
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
      sourceCategories,
      destinationCategories,
      sourcePercent,
      destinationPercent,
      translate,
    ),
    riskClassificationText: buildRiskClassificationText(
      ruleName,
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
  };
}

export function resolveDefaultAmlEntityTags(): RiskControlAmlEntityTag[] {
  return resolveDemoAmlEntityTags(0);
}
