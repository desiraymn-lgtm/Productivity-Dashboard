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
