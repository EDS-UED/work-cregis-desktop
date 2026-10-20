import type { RiskControlAutoRuleCurrencyCondition } from '@/scenes/payment-engine/paymentEngineRecordConfigs';

export type RiskControlCurrencyCondition = RiskControlAutoRuleCurrencyCondition;

export const RISK_CONTROL_CURRENCY_CONDITION_SHOWCASE: RiskControlCurrencyCondition[] = [
  {
    symbol: 'USDC',
    cryptoName: 'eds-usdc-usdcoin',
    networkLabel: 'BNB Smart Chain',
    thresholdAmount: '1,000,000',
    thresholdSymbol: 'USDC',
  },
  {
    symbol: 'BTC',
    cryptoName: 'eds-btc-bitcoin',
    thresholdAmount: '10,000',
    thresholdSymbol: 'BTC',
  },
  {
    symbol: 'ETH',
    cryptoName: 'eds-eth-ethereum',
    networkLabel: 'Base',
    thresholdAmount: '800,000',
    thresholdSymbol: 'ETH',
  },
];

export const RISK_CONTROL_CURRENCY_CONDITION_HIDDEN: RiskControlCurrencyCondition[] = [
  {
    symbol: 'TON',
    cryptoName: 'eds-ton-toncoin',
    networkLabel: 'The Open Network',
    thresholdAmount: '500,000',
    thresholdSymbol: 'TON',
  },
  {
    symbol: 'SOL',
    cryptoName: 'eds-sol-solana',
    thresholdAmount: '20,000',
    thresholdSymbol: 'SOL',
  },
  {
    symbol: 'USDT',
    cryptoName: 'eds-usdt-tether usd',
    networkLabel: 'Ethereum Mainnet',
    thresholdAmount: '2,000,000',
    thresholdSymbol: 'USDT',
  },
  {
    symbol: 'BNB',
    cryptoName: 'eds-bnb-binance coin',
    thresholdAmount: '50,000',
    thresholdSymbol: 'BNB',
  },
  {
    symbol: 'AVAX',
    cryptoName: 'eds-avax-avalanche',
    networkLabel: 'Avalanche C-Chain',
    thresholdAmount: '120,000',
    thresholdSymbol: 'AVAX',
  },
];

export function mergeRiskControlCurrencyConditions(
  visible: RiskControlCurrencyCondition[],
): RiskControlCurrencyCondition[] {
  return [
    ...visible,
    ...RISK_CONTROL_CURRENCY_CONDITION_HIDDEN.map((entry) => ({ ...entry })),
  ];
}
