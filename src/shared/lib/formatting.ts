export const formatPrice = (price: number, currencySuffix: string) =>
  `${price.toLocaleString()}${currencySuffix}`;

export type TimeLabels = {
  timeEnded: string;
  days: string;
  hours: string;
  minutes: string;
  seconds?: string;
  remaining?: string;
};

export function formatRemainingTime(endAt: string, t: TimeLabels): string {
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return t.timeEnded;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const suffix = t.remaining ? ` ${t.remaining}` : '';
  const tail = t.seconds ? ` ${s}${t.seconds}` : suffix;

  if (d > 0) return `${d}${t.days} ${h}${t.hours}${suffix}`;
  if (h > 0) return `${h}${t.hours} ${m}${t.minutes}${tail}`;
  return `${m}${t.minutes}${tail}`;
}
