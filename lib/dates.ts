export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Postgres `date` column value. Neon's driver sometimes returns
 * these as a plain "YYYY-MM-DD" string and sometimes as a full ISO
 * timestamp ("YYYY-MM-DDT00:00:00.000Z") depending on the query — appending
 * "T00:00:00" to the latter produces an unparseable string ("Invalid
 * Date"), so only append it when the value doesn't already carry a time.
 */
export function formatDate(value: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }): string {
  const date = value.includes('T') ? new Date(value) : new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('en-US', options);
}
