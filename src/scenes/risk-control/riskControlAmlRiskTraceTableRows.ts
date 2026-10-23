import type { TagCustomStyle } from '@eds/desktop-components';
import type { RiskControlAmlRiskTraceSection } from '@/scenes/payment-engine/paymentEngineRecordConfigs';
import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import { resolveAmlRiskTraceEntityTag } from './riskControlAmlQueryRecordDetailData';

export type AmlRiskTraceTableRow = {
  id: string;
  entityLabel: string;
  entityTagLabel: string;
  entityTagCustomStyle: TagCustomStyle;
  exposureTypeLabel: string;
  amountUsd: string;
  contribution: string;
};

function resolveExposureTypeLabel(value: string | undefined, ui: (key: string) => string): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '--';
  const translated = ui(trimmed);
  return translated === trimmed && /^[A-Z0-9_]+$/.test(trimmed) ? trimmed : translated;
}

function formatTraceValue(value: string | undefined): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '--';
  return formatGroupedDecimalAmount(trimmed);
}

function formatTraceContributionPercent(value: string | undefined): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '--';
  const num = Number.parseFloat(trimmed.replace(/,/g, ''));
  if (!Number.isFinite(num)) return '--';
  return `${formatGroupedDecimalAmount(num.toFixed(2))}%`;
}

export function buildAmlRiskTraceTableRows(
  sourceTrace: RiskControlAmlRiskTraceSection,
  destinationTrace: RiskControlAmlRiskTraceSection,
  ui: (key: string) => string,
): AmlRiskTraceTableRow[] {
  const sections = [sourceTrace, destinationTrace];
  const rows: AmlRiskTraceTableRow[] = [];
  let objectIndex = 0;

  for (const section of sections) {
    for (const objectEntry of section.objects) {
      const entityTag = resolveAmlRiskTraceEntityTag(objectEntry.label, objectIndex);
      rows.push({
        id: objectEntry.id,
        entityLabel: objectEntry.label,
        entityTagLabel: entityTag.label,
        entityTagCustomStyle: entityTag.customStyle,
        exposureTypeLabel: resolveExposureTypeLabel(objectEntry.entityType, ui),
        amountUsd: formatTraceValue(objectEntry.amountUsd),
        contribution: formatTraceContributionPercent(objectEntry.contributionPercent),
      });
      objectIndex += 1;
    }
  }

  return rows;
}
