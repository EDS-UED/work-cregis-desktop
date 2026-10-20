import type { EgFilterFieldMemberOption } from '@eds/desktop-components';
import { compareDataListFilterCurrencyLabels } from '@/scenes/shared/dataListFilterOptionUtils';
import { buildManageWebhookRecordRows } from '@/scenes/manage/webhook/webhookRecordData';

function slugWebhookCreatorMemberId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `member-${slug || 'unknown'}`;
}

export function resolveWebhookConfigCreatorMemberId(creatorName: string | undefined): string {
  const displayName = String(creatorName ?? '').trim();
  if (!displayName) return '';
  return slugWebhookCreatorMemberId(displayName);
}

export function resolveWebhookConfigCreatorAvatarColorSeed(
  creatorName: string | undefined,
): string {
  return resolveWebhookConfigCreatorMemberId(creatorName);
}

export function buildWebhookConfigCreatorFilterOptions(
  rowCount: number,
): EgFilterFieldMemberOption[] {
  const safeRowCount = Math.max(0, rowCount);
  const rows = buildManageWebhookRecordRows('Webhook Config', safeRowCount);
  const seen = new Set<string>();
  const options: EgFilterFieldMemberOption[] = [];

  for (const row of rows) {
    const displayName = String(row.logOperatorName ?? '').trim();
    if (!displayName) continue;

    const id = slugWebhookCreatorMemberId(displayName);
    if (seen.has(id)) continue;
    seen.add(id);
    options.push({ id, label: displayName, name: displayName });
  }

  return options.sort((a, b) => compareDataListFilterCurrencyLabels(a.label, b.label));
}
