import { getProcessedCrypto, type CryptoName } from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';

function isRegisteredCryptoName(name: string | undefined | null): name is CryptoName {
  const trimmed = String(name ?? '').trim();
  if (!trimmed) return false;
  return Boolean(getProcessedCrypto(trimmed));
}

/** 列表 / EgFilter 共用：仅返回 EDS 已注册、可渲染的 CryptoName。 */
export function resolveDataListCryptoName(
  symbol: string,
  explicitCryptoName?: string | null,
): CryptoName {
  const normalizedSymbol = symbol.trim();
  const candidates = [
    explicitCryptoName,
    resolveCryptoNameFromSymbol(normalizedSymbol),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (isRegisteredCryptoName(candidate)) {
      return candidate;
    }
  }

  return 'eds-usdt-tether usd';
}
