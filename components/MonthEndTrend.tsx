type SnapshotRow = {
  snapshot_date: string;
  total_assets: number;
  total_liabilities: number;
};

/**
 * Rolls the (possibly biweekly) snapshot history up to one row per
 * calendar month — whichever snapshot in that month has the latest date —
 * so month-over-month net worth progress reads clearly even though the
 * underlying snapshots aren't always taken on the last day of the month.
 */
export default function MonthEndTrend({ rows }: { rows: SnapshotRow[] }) {
  if (rows.length === 0) {
    return null;
  }

  const byMonth = new Map<string, SnapshotRow>();
  for (const row of rows) {
    const monthKey = row.snapshot_date.slice(0, 7);
    const existing = byMonth.get(monthKey);
    if (!existing || row.snapshot_date > existing.snapshot_date) {
      byMonth.set(monthKey, row);
    }
  }

  const monthRows = Array.from(byMonth.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([monthKey, row]) => ({
      monthKey,
      snapshotDate: row.snapshot_date,
      netWorth: row.total_assets - row.total_liabilities,
    }));

  return (
    <>
      <h2 className="section-title">Month-End Net Worth</h2>
      <table className="budget-table" style={{ marginBottom: 28 }}>
        <thead>
          <tr>
            <th>Month</th>
            <th>As of</th>
            <th>Net Worth</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {monthRows.map((row, i) => {
            const prev = monthRows[i + 1];
            const change = prev ? row.netWorth - prev.netWorth : null;
            return (
              <tr key={row.monthKey}>
                <td>{formatMonth(row.monthKey)}</td>
                <td>{formatDate(row.snapshotDate)}</td>
                <td style={{ fontWeight: 600 }}>{money(row.netWorth)}</td>
                <td style={{ color: change == null ? 'var(--muted)' : change >= 0 ? 'var(--sage)' : 'var(--burgundy)' }}>
                  {change == null ? '—' : `${change >= 0 ? '+' : ''}${money(change)}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function money(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
