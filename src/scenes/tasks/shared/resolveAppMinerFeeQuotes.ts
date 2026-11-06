import {
  resolveEvmPaymentDemoQuote,
  resolveEvmPaymentDemoQuoteInsufficient,
  resolveTronMinerFeeQuote,
  type EvmMinerFeePaymentDemoQuote,
  type TronMinerFeeQuote,
} from '@eds/desktop-components';
import type { MinerFeeTranslate } from '@eds/desktop-components';
import { MINER_FEE_QA_SIGNING_ROW } from './minerFeeQaSigningRows';

/** @deprecated 使用 `MINER_FEE_QA_SIGNING_ROW.tronRecipientInactive` */
export const TRON_MINER_FEE_ABNORMAL_LIST_ROW_INDEX =
  MINER_FEE_QA_SIGNING_ROW.tronRecipientInactive;

/** @deprecated 使用 `MINER_FEE_QA_SIGNING_ROW.tronNormal` */
export const TRON_MINER_FEE_HEALTHY_LIST_ROW_INDEX = MINER_FEE_QA_SIGNING_ROW.tronNormal;

/** @deprecated 使用 `MINER_FEE_QA_SIGNING_ROW.evmGasBalanceInsufficient` */
export const EVM_SPONSORED_GAS_BALANCE_INSUFFICIENT_ROW_INDEX =
  MINER_FEE_QA_SIGNING_ROW.evmGasBalanceInsufficient;

function resolveAppTronMinerFeeHealthyQuote(): TronMinerFeeQuote {
  const demo = resolveTronMinerFeeQuote();
  return {
    ...demo,
    availableBandwidth: 3_200_000,
    availableEnergy: 1_500_000,
    activationExtraTrx: 0,
    teamBalanceInsufficient: false,
  };
}

export function resolveAppTronMinerFeeQuote(rowIndex: number): TronMinerFeeQuote {
  const healthy = resolveAppTronMinerFeeHealthyQuote();

  if (rowIndex === MINER_FEE_QA_SIGNING_ROW.tronRecipientInactive) {
    return {
      ...healthy,
      activationExtraTrx: 1,
      teamBalanceInsufficient: false,
    };
  }

  if (rowIndex === MINER_FEE_QA_SIGNING_ROW.tronTeamBalanceInsufficient) {
    return {
      ...healthy,
      activationExtraTrx: 0,
      teamBalanceInsufficient: true,
    };
  }

  return healthy;
}

export function resolveAppEvmPaymentDemoQuote(
  ui: MinerFeeTranslate,
  rowIndex: number,
  symbol: string,
): EvmMinerFeePaymentDemoQuote {
  if (rowIndex === MINER_FEE_QA_SIGNING_ROW.evmGasBalanceInsufficient) {
    return resolveEvmPaymentDemoQuoteInsufficient(ui, symbol);
  }
  return resolveEvmPaymentDemoQuote(ui, symbol);
}

/** EVM 是否展示支付方式步（矿工费代付）；与 EgGasFeePopover `evmSponsoredPaymentEnabled` 对齐 Showcase。 */
export function resolveAppEvmSponsoredPaymentEnabled(rowIndex: number): boolean {
  return rowIndex !== MINER_FEE_QA_SIGNING_ROW.evmSponsoredPaymentDisabled;
}
