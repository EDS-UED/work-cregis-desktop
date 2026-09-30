import type {
  PaymentEngineRecordRow,
  RiskControlAmlEntityTag,
  RiskControlAmlRiskTraceObject,
  RiskControlAmlRiskTraceSection,
} from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { resolveCurrencyRowPreset } from '@/scenes/shared/egDataListMockData';

export type RiskControlAmlQueryRecordDetail = {
  riskScore: string;
  riskLabelKey: string;
  riskCustomStyle: 'aml-danger' | 'aml-suspicious' | 'aml-safe';
  serviceProvider: string;
  belongingEntity: string;
  entityTags: RiskControlAmlEntityTag[];
  waasProject: string;
  ruleName: string;
  ruleNumber: string;
  targetValue: string;
  networkLabel: string;
  networkCryptoName: string;
  requesterName: string;
  requesterAvatarName: string;
  requesterEmailMasked: string;
  queryObjectKey: string;
  triggerModeKey: string;
  queryTime: string;
  sourceTrace: RiskControlAmlRiskTraceSection;
  destinationTrace: RiskControlAmlRiskTraceSection;
};

const AML_ENTITY_TAG_SHOWCASE: readonly RiskControlAmlEntityTag[] = [
  { label: 'I am Tag.', colorfulStyle: 'lilac' },
  { label: 'I am Tag.', colorfulStyle: 'ice-blue' },
  { label: 'I am Tag.', colorfulStyle: 'apricot' },
];

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
  const entities = ['Coinbase Pro.', 'Binance.com', 'Kraken Exchange', 'Gate.io'];
  return entities[rowIndex % entities.length] ?? entities[0]!;
}

function resolveDemoRuleName(rowIndex: number): string {
  const names = ['Test_FAT', 'Treasury Guard', 'Deposit Monitor', 'Withdraw Scan'];
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

export function resolveRiskControlAmlQueryRecordDetail(
  row: PaymentEngineRecordRow,
): RiskControlAmlQueryRecordDetail {
  const rowIndex = resolveRowIndex(row);
  const preset = resolveCurrencyRowPreset(rowIndex);
  const riskScore = row.amlRiskScore?.trim() || '6.8';
  const targetValue = row.amlTargetValue?.trim() || row.id;
  const requesterName = row.amlRequesterName?.trim() || row.id;

  return {
    riskScore,
    riskLabelKey: row.amlRiskLabelKey ?? 'Safe',
    riskCustomStyle: row.amlRiskCustomStyle ?? 'aml-safe',
    serviceProvider: row.amlServiceProvider?.trim() || 'Regtank',
    belongingEntity: row.amlBelongingEntity?.trim() || resolveDemoBelongingEntity(rowIndex),
    entityTags: row.amlEntityTags?.length
      ? [...row.amlEntityTags]
      : [...AML_ENTITY_TAG_SHOWCASE],
    waasProject: row.amlWaasProject?.trim() || resolveDemoWaasProject(rowIndex),
    ruleName: row.amlTriggeredRuleName?.trim() || resolveDemoRuleName(rowIndex),
    ruleNumber: row.amlTriggeredRuleNumber?.trim() || `AML143768224306790${rowIndex}`,
    targetValue,
    networkLabel: row.amlNetworkLabel?.trim() || preset.networkLabel || 'Bitcoin',
    networkCryptoName: row.amlCurrencyCryptoName?.trim() || preset.cryptoName || 'bitcoin',
    requesterName,
    requesterAvatarName: row.amlRequesterAvatarName?.trim() || requesterName,
    requesterEmailMasked:
      row.amlRequesterEmailMasked?.trim() || resolveDemoRequesterEmailMasked(rowIndex),
    queryObjectKey: row.amlQueryObjectKey ?? (rowIndex % 2 === 0 ? 'Address' : 'Transaction Hash'),
    triggerModeKey: row.amlTriggerModeKey ?? 'Automatic',
    queryTime: row.createdAt,
    sourceTrace: buildTraceSection('source', riskScore, AML_SOURCE_TRACE_OBJECTS, rowIndex),
    destinationTrace: buildTraceSection(
      'destination',
      riskScore,
      AML_DESTINATION_TRACE_OBJECTS,
      rowIndex,
    ),
  };
}

export function resolveDefaultAmlEntityTags(): RiskControlAmlEntityTag[] {
  return AML_ENTITY_TAG_SHOWCASE.map((tag) => ({ ...tag }));
}
