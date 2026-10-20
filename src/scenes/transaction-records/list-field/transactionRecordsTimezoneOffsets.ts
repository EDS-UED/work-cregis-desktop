/** Report Transaction Time header — UTC offset menu labels (UTC±HH:MM). */
export const TRANSACTION_RECORDS_TIMEZONE_OFFSETS = [
  'UTC+14:00',
  'UTC+13:00',
  'UTC+12:45',
  'UTC+12:00',
  'UTC+11:00',
  'UTC+10:30',
  'UTC+10:00',
  'UTC+09:30',
  'UTC+09:00',
  'UTC+08:45',
  'UTC+08:00',
  'UTC+07:00',
  'UTC+06:30',
  'UTC+06:00',
  'UTC+05:45',
  'UTC+05:30',
  'UTC+05:00',
  'UTC+04:30',
  'UTC+04:00',
  'UTC+03:30',
  'UTC+03:00',
  'UTC+02:00',
  'UTC+01:00',
  'UTC+00:00',
  'UTC-01:00',
  'UTC-02:00',
  'UTC-03:00',
  'UTC-03:30',
  'UTC-04:00',
  'UTC-05:00',
  'UTC-06:00',
  'UTC-07:00',
  'UTC-08:00',
  'UTC-09:00',
  'UTC-09:30',
  'UTC-10:00',
  'UTC-11:00',
  'UTC-12:00',
] as const;

export type TransactionRecordsTimezoneOffset =
  (typeof TRANSACTION_RECORDS_TIMEZONE_OFFSETS)[number];

export const TRANSACTION_RECORDS_DEFAULT_TIMEZONE: TransactionRecordsTimezoneOffset =
  'UTC+08:00';

/** Demo timestamps are authored as wall-clock values in this baseline offset. */
export const TRANSACTION_RECORDS_TIMEZONE_BASELINE: TransactionRecordsTimezoneOffset =
  TRANSACTION_RECORDS_DEFAULT_TIMEZONE;

export function parseUtcOffsetMinutes(label: string): number {
  const match = /^UTC([+-])(\d{2}):(\d{2})$/.exec(label.trim());
  if (!match) return 8 * 60;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

/** Shift a `YYYY-MM-DD HH:MM:SS` wall-clock string between UTC offsets. */
export function shiftTimestampForTimezone(
  datetime: string,
  fromTz: string,
  toTz: string,
): string {
  if (fromTz === toTz) return datetime;
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(datetime.trim());
  if (!match) return datetime;

  const deltaMin = parseUtcOffsetMinutes(toTz) - parseUtcOffsetMinutes(fromTz);
  const asUtcMs = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6]),
  );
  const shifted = new Date(asUtcMs + deltaMin * 60_000);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(shifted.getUTCDate()).padStart(2, '0');
  const hour = String(shifted.getUTCHours()).padStart(2, '0');
  const minute = String(shifted.getUTCMinutes()).padStart(2, '0');
  const second = String(shifted.getUTCSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
