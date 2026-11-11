import { ref, type Ref } from 'vue';
import { closeAllAnchoredTooltips } from '@eds/desktop-components';
import { showAppEndFeedbackAfterOverlay } from '@/composables/appEndFeedback';
import { formatGroupedTrimmedAmount } from '@/utils/formatGroupedDisplay';
import { resolveVerifiedTxHashForRow } from '@/scenes/shared/egDataListMockData';
import { prependFeeRecordSessionRows, patchFeeRecordSessionRow } from '../fee-records/feeRecordSessionStore';
import type { FeeRecordRow } from '../fee-records/feeRecordTypes';
import {
  OVERVIEW_ACCOUNT_TRANSFER_MAX_USD,
  OVERVIEW_ACCOUNT_TRANSFER_MIN_USD,
  OVERVIEW_ACCOUNT_TRANSFER_TEAM_AVAILABLE_USD,
  shouldMockOverviewAccountTransferFail,
  type OverviewAccountTransferTargetKey,
  type OverviewAccountTransferTargetOption,
  convertOverviewTransferUsdToNative,
  resolveOverviewTransferTargetListAmountMeta,
} from './overviewAccountTransferSkidData';

const MOCK_TRADE_PASSWORD = '111111';
const MOCK_CHAIN_SETTLE_MS = 2500;

let sessionId = 0;

function nextFeeRecordId(): string {
  sessionId += 1;
  return `fee-session-transfer-${sessionId}`;
}

function mockAccountTransferTxHash(seed: number): string {
  return resolveVerifiedTxHashForRow(seed, 'evm');
}

function formatTransferTime(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export type AccountTransferValidation =
  | { ok: true; amountUsd: number }
  | { ok: false; messageKey: string };

export function parseOverviewTransferAmountUsd(raw: string): number | null {
  const normalized = raw.replace(/[$,\s]/g, '').trim();
  if (!normalized) return null;
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

export function validateOverviewAccountTransferAmount(raw: string): AccountTransferValidation {
  const amountUsd = parseOverviewTransferAmountUsd(raw);
  if (amountUsd == null || amountUsd <= 0) {
    return { ok: false, messageKey: 'Overview Account Transfer Amount Range' };
  }
  if (amountUsd > OVERVIEW_ACCOUNT_TRANSFER_TEAM_AVAILABLE_USD) {
    return { ok: false, messageKey: 'Overview Account Transfer Insufficient Balance' };
  }
  if (amountUsd < OVERVIEW_ACCOUNT_TRANSFER_MIN_USD || amountUsd > OVERVIEW_ACCOUNT_TRANSFER_MAX_USD) {
    return { ok: false, messageKey: 'Overview Account Transfer Amount Range' };
  }
  return { ok: true, amountUsd };
}

export function formatOverviewTransferEstimatedArrival(
  amountUsd: number,
  targetKey: OverviewAccountTransferTargetKey,
): string {
  const nativeAmount = convertOverviewTransferUsdToNative(amountUsd, targetKey);
  return formatGroupedTrimmedAmount(nativeAmount);
}

type PendingTransfer = {
  amountUsd: number;
  target: OverviewAccountTransferTargetOption;
  outRowId: string;
};

export function useManageOverviewAccountTransferFlow(options: {
  verifyOpen: Ref<boolean>;
  verifyPurpose: Ref<'gas-proxy' | 'account-transfer' | null>;
  closeSkid: () => void;
  transactionPasswordSet: Ref<boolean>;
  setTransactionPasswordDialogOpen: Ref<boolean>;
}) {
  const pendingTransfer = ref<PendingTransfer | null>(null);

  function requestConfirm(
    amountRaw: string,
    target: OverviewAccountTransferTargetOption,
  ): boolean {
    const validation = validateOverviewAccountTransferAmount(amountRaw);
    if (!validation.ok) return false;

    if (!options.transactionPasswordSet.value) {
      closeAllAnchoredTooltips();
      options.setTransactionPasswordDialogOpen.value = true;
      return false;
    }

    pendingTransfer.value = {
      amountUsd: validation.amountUsd,
      target,
      outRowId: nextFeeRecordId(),
    };
    closeAllAnchoredTooltips();
    options.verifyPurpose.value = 'account-transfer';
    options.verifyOpen.value = true;
    return true;
  }

  function submitTradePassword(code: string): boolean {
    return code.trim() === MOCK_TRADE_PASSWORD;
  }

  function completeVerify(accepted: boolean) {
    options.verifyPurpose.value = null;
    const pending = pendingTransfer.value;
    pendingTransfer.value = null;
    if (!accepted || !pending) return;

    const mockFail = shouldMockOverviewAccountTransferFail(pending.amountUsd);
    const amountUsdText = formatGroupedTrimmedAmount(pending.amountUsd);
    const nativeAmount = convertOverviewTransferUsdToNative(
      pending.amountUsd,
      pending.target.key,
    );
    const amountNativeText = formatGroupedTrimmedAmount(nativeAmount);
    const inListAmountMeta = resolveOverviewTransferTargetListAmountMeta(pending.target.key);
    const time = formatTransferTime();
    const outRow: FeeRecordRow = {
      id: pending.outRowId,
      operationTypeKey: 'Account Transfer Out',
      recordStatusKey: 'Processing',
      operatorName: 'Alex Chen',
      transactionTime: time,
      txHash: '',
      amount: amountUsdText,
      accountKey: 'Team Account',
    };
    prependFeeRecordSessionRows([outRow]);
    options.closeSkid();
    if (!mockFail) {
      showAppEndFeedbackAfterOverlay();
    }

    const inRowId = nextFeeRecordId();
    const settledTxHash = mockAccountTransferTxHash(sessionId);
    window.setTimeout(() => {
      if (mockFail) {
        patchFeeRecordSessionRow(pending.outRowId, { recordStatusKey: 'Failed' });
        return;
      }
      patchFeeRecordSessionRow(pending.outRowId, {
        recordStatusKey: 'Completed',
        txHash: settledTxHash,
      });
      const inRow: FeeRecordRow = {
        id: inRowId,
        operationTypeKey: 'Account Transfer In',
        recordStatusKey: 'Completed',
        operatorName: 'Treasury',
        transactionTime: formatTransferTime(),
        txHash: settledTxHash,
        amount: amountNativeText,
        accountKey: 'Gas Account',
        accountDisplayKey: pending.target.titleKey,
        listAmountCryptoSymbol: inListAmountMeta.listAmountCryptoSymbol,
        listAmountCryptoName: inListAmountMeta.listAmountCryptoName,
      };
      prependFeeRecordSessionRows([inRow]);
    }, MOCK_CHAIN_SETTLE_MS);
  }

  return {
    requestConfirm,
    submitTradePassword,
    completeVerify,
  };
}
