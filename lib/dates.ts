// The app is only used from Central time; server rendering (Vercel) runs in
// UTC, so "today" must be computed against this zone rather than the
// runtime's own clock or it rolls over hours before the user's evening does.
export const APP_TIMEZONE = 'America/Chicago';

export function currentDateKey(timeZone: string = APP_TIMEZONE): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date()
  );
}

/**
 * A Date object whose local-timezone accessors (getFullYear, getDate,
 * setDate, toLocaleDateString, etc.) reflect today's calendar date in
 * `timeZone`, regardless of the runtime's own timezone. Only safe for
 * calendar-day arithmetic and formatting — the underlying instant is
 * arbitrary midnight, not a real moment in time.
 */
export function currentLocalDate(timeZone: string = APP_TIMEZONE): Date {
  const [year, month, day] = currentDateKey(timeZone).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Postgres `date` column value. Neon's driver is inconsistent
 * about how it hands these back — sometimes a plain "YYYY-MM-DD" string,
 * sometimes a full ISO timestamp string, sometimes an actual JS Date —
 * depending on the query and the specific column. Appending "T00:00:00" to
 * an already-full timestamp string produces an unparseable date, and
 * calling .includes on a Date object throws outright, so every shape needs
 * to be normalized before formatting.
 */
export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
): string {
  const date = value instanceof Date ? value : new Date(value.includes('T') ? value : `${value}T00:00:00`);
  return date.toLocaleDateString('en-US', options);
}
