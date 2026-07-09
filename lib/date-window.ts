// Single source of truth for date boundaries, fixed to Asia/Jakarta (UTC+7, no
// DST). Consumed by both getDashboardSummary() (the "today"/"this week" tiles)
// and the order-number day prefix, so the dashboard and order numbers agree on
// where a day begins. Pure and unit-testable.

const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;

/** UTC instant of the most recent Jakarta midnight at or before `now`. */
export function jakartaDayStart(now: Date = new Date()): Date {
  const shifted = new Date(now.getTime() + JAKARTA_OFFSET_MS);
  shifted.setUTCHours(0, 0, 0, 0);
  return new Date(shifted.getTime() - JAKARTA_OFFSET_MS);
}

/** UTC instant of Monday 00:00 Jakarta for the week containing `now`. */
export function jakartaWeekStart(now: Date = new Date()): Date {
  const shifted = new Date(now.getTime() + JAKARTA_OFFSET_MS);
  const daysSinceMonday = (shifted.getUTCDay() + 6) % 7; // Sun=0 → 6, Mon=1 → 0
  shifted.setUTCHours(0, 0, 0, 0);
  shifted.setUTCDate(shifted.getUTCDate() - daysSinceMonday);
  return new Date(shifted.getTime() - JAKARTA_OFFSET_MS);
}

/** Order-number day prefix in Jakarta time, e.g. "KS-20260709-". */
export function jakartaOrderPrefix(now: Date = new Date()): string {
  const shifted = new Date(now.getTime() + JAKARTA_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const d = String(shifted.getUTCDate()).padStart(2, "0");
  return `KS-${y}${m}${d}-`;
}
