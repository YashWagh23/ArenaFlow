/** Formats a number as a locale string (e.g. 85000 → "85,000") */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/** Formats a load/capacity pair as a percentage integer */
export function formatCapacityPct(load: number, capacity: number): number {
  if (capacity === 0) return 0;
  return Math.round((load / capacity) * 100);
}

/** Formats elapsed simulation minutes as a clock string (e.g. 75 → "20:15") */
export function formatSimClock(elapsedMinutes: number): string {
  const startHour = 19;
  const total = startHour * 60 + elapsedMinutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Formats a UTC Date as HH:MM:SS */
export function formatUtcClock(date: Date): string {
  return [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

/** Formats a local Date as HH:MM:SS */
export function formatLocalClock(date: Date): string {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

/** Formats a probability number as a percentage string (e.g. 94 → "94%") */
export function formatProbability(prob: number): string {
  return `${Math.round(prob)}%`;
}
