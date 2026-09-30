import type { PaymentEngineRecordRow } from '../paymentEngineRecordConfigs';
import { PAYMENT_RECORD_PAYMENT_CURRENCY_LABELS } from './paymentRecordFilterCatalog';

const NETWORK_LABEL_TO_PAYMENT_CURRENCY: Record<string, string> = {
  TRON: 'USDT-TRC20',
  'Ethereum Mainnet': 'USDT-ERC20',
  'BNB Smart Chain': 'USDT-BEP20',
  Polygon: 'USDT-Polygon',
  'Avalanche C': 'USDT-Avalanche-C',
  'Arbitrum One': 'USDT-Arbitrum One',
  Solana: 'USDT-Solana',
  Base: 'USDC-Base',
  Optimism: 'USDC-Optimism',
  Bitcoin: 'Bitcoin',
};

export function resolvePaymentRecordPaymentCurrencyLabel(
  row: PaymentEngineRecordRow,
): string {
  const symbol = String(row.receivedSymbol ?? row.orderSymbol ?? '').trim();
  const networkLabel = String(row.currencyNetwork ?? row.networkLabel ?? '').trim();

  if (networkLabel) {
    const mapped = NETWORK_LABEL_TO_PAYMENT_CURRENCY[networkLabel];
    if (mapped) return mapped;

    const composite = `${symbol}-${networkLabel}`;
    if ((PAYMENT_RECORD_PAYMENT_CURRENCY_LABELS as readonly string[]).includes(composite)) {
      return composite;
    }
    return composite;
  }

  if ((PAYMENT_RECORD_PAYMENT_CURRENCY_LABELS as readonly string[]).includes(symbol)) {
    return symbol;
  }

  return symbol;
}
