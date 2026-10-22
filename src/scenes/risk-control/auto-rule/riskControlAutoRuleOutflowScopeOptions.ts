export type OutflowScopeOption = { id: string; label: string };

export const OUTFLOW_WALLET_OPTIONS: OutflowScopeOption[] = Array.from({ length: 20 }, (_, index) => {
  const n = index + 1;
  if (n === 1) return { id: 'wallet-ops-a', label: 'Ops Wallet A' };
  if (n === 2) return { id: 'wallet-ops-b', label: 'Ops Wallet B' };
  if (n === 3) return { id: 'wallet-treasury', label: 'Treasury · Ethereum' };
  return { id: `wallet-mock-${n}`, label: `Mock Wallet ${n}` };
});

export const OUTFLOW_WAAS_PROJECT_OPTIONS: OutflowScopeOption[] = [
  { id: 'waas-doris', label: 'Doris Stodio' },
  { id: 'waas-merchant', label: 'Merchant Demo Project' },
];

export function outflowWalletLabelForId(id: string): string {
  return OUTFLOW_WALLET_OPTIONS.find((option) => option.id === id)?.label ?? id;
}

export function outflowWalletIdsFromScopeText(text: string): string[] {
  const parts = text
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) return [];
  return parts.map((part) => {
    const byLabel = OUTFLOW_WALLET_OPTIONS.find((option) => option.label === part);
    if (byLabel) return byLabel.id;
    const byId = OUTFLOW_WALLET_OPTIONS.find((option) => option.id === part);
    return byId?.id ?? part;
  });
}

export function joinManualOutflowWalletLabels(ids: string[]): string {
  return ids.map((id) => outflowWalletLabelForId(id)).join(', ');
}
