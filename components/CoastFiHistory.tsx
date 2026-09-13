import { deleteCoastFiMonth } from '@/app/actions';
import type { CoastFiMonthlyEntry } from '@/lib/types';

export default function CoastFiHistory({ rows }: { rows: CoastFiMonthlyEntry[] }) {
  if (rows.length === 0) {
    return null;
  }

  const sorted = [...rows].sort((a, b) => (a.month_key < b.month_key ? 1 : -1));

  return (
    <div className="table-scroll">
      <table className="budget-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>401k at Cap?</th>
            <th>Roth Made?</th>
            <th>Roth $</th>
            <th>Combined Balance</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const deleteWithKey = deleteCoastFiMonth.bind(null, row.month_key);
            return (
              <tr key={row.month_key}>
                <td>{formatMonthLabel(row.month_key)}</td>
                <td>{row.at_match_cap ? 'Yes' : 'No'}</td>
                <td>{row.roth_contribution_made ? 'Yes' : 'No'}</td>
                <td>{money(toNum(row.roth_contribution_amount))}</td>
                <td>{money(toNum(row.combined_balance))}</td>
                <td>
                  <form action={deleteWithKey}>
                    <button type="submit" className="row-delete" aria-label="Delete month">
                      ×
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function toNum(v: string | number | null): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function money(v: number | null): string {
  return v == null ? '—' : v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
