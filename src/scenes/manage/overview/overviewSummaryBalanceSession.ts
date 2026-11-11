import { computed, ref } from 'vue';
import { formatGroupedTrimmedAmount } from '@/utils/formatGroupedDisplay';

const INITIAL_TEAM_BALANCE_USD = 128_430.52;
const INITIAL_GAS_BALANCE_USD = 297_252.25;

const teamBalanceUsd = ref(INITIAL_TEAM_BALANCE_USD);
const gasBalanceUsd = ref(INITIAL_GAS_BALANCE_USD);

/** 概览法币（USD）以分为单位运算，避免 JS 浮点污染展示。 */
function roundUsdCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

function formatOverviewSummaryFiatUsd(amount: number): string {
  return `$${formatGroupedTrimmedAmount(roundUsdCents(amount).toFixed(2))}`;
}

export function overviewTeamAvailableUsd(): number {
  return roundUsdCents(teamBalanceUsd.value);
}

export function applyOverviewAccountTransferSettled(amountUsd: number) {
  const amount = roundUsdCents(amountUsd);
  if (amount <= 0) return;
  teamBalanceUsd.value = roundUsdCents(Math.max(0, teamBalanceUsd.value - amount));
  gasBalanceUsd.value = roundUsdCents(gasBalanceUsd.value + amount);
}

export function useOverviewSummaryBalanceDisplay() {
  const teamSummaryAmount = computed(() => formatOverviewSummaryFiatUsd(teamBalanceUsd.value));
  const gasSummaryAmount = computed(() => formatOverviewSummaryFiatUsd(gasBalanceUsd.value));
  return {
    teamSummaryAmount,
    gasSummaryAmount,
    applyOverviewAccountTransferSettled,
  };
}
