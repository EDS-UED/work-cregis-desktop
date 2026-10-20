import {
  TRANSACTION_RECORDS_DEMO_TOTAL,
  buildTransactionRecordRow,
} from './transactionRecordData';

export type TransactionRecordAddressSuggestion = {
  address: string;
  /** Empty when the address has no alias (UI shows Unnamed Address). */
  alias: string;
};

const MAX_ADDRESS_SUGGESTIONS = 8;

function considerAddress(
  byAddress: Map<string, TransactionRecordAddressSuggestion>,
  address: string,
  alias: string | undefined,
  query: string,
) {
  const trimmedAddress = address.trim();
  if (!trimmedAddress) return;

  const aliasTrimmed = alias?.trim() ?? '';
  const addressLower = trimmedAddress.toLowerCase();
  const aliasLower = aliasTrimmed.toLowerCase();
  // Short queries: prefix-match address (design: typing "3" → 3… addresses).
  // Longer queries: also allow substring / alias match.
  const addressHit =
    query.length <= 2
      ? addressLower.startsWith(query)
      : addressLower.includes(query);
  const aliasHit = aliasLower.includes(query);
  if (!addressHit && !aliasHit) {
    return;
  }

  const existing = byAddress.get(addressLower);
  if (!existing) {
    byAddress.set(addressLower, {
      address: trimmedAddress,
      alias: aliasTrimmed,
    });
    return;
  }

  if (!existing.alias && aliasTrimmed) {
    existing.alias = aliasTrimmed;
  }
}

/** Unique address suggestions for View by Address typeahead (partial address / alias). */
export function buildTransactionRecordAddressSuggestions(
  rawQuery: string,
  rowCount: number = TRANSACTION_RECORDS_DEMO_TOTAL,
): TransactionRecordAddressSuggestion[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const byAddress = new Map<string, TransactionRecordAddressSuggestion>();
  const limit = Math.max(0, rowCount);

  for (let index = 0; index < limit; index += 1) {
    const row = buildTransactionRecordRow(index);
    considerAddress(byAddress, row.fromAddress, row.fromAlias, query);
    considerAddress(byAddress, row.toAddress, row.toAlias, query);
  }

  return Array.from(byAddress.values())
    .sort((a, b) => {
      const aStarts = a.address.toLowerCase().startsWith(query) ? 0 : 1;
      const bStarts = b.address.toLowerCase().startsWith(query) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.address.localeCompare(b.address);
    })
    .slice(0, MAX_ADDRESS_SUGGESTIONS);
}
