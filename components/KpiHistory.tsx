import { deleteKpiMonth } from '@/app/actions';
import type { KpiMonthlyLog } from '@/lib/types';

export default function KpiHistory({ rows }: { rows: KpiMonthlyLog[] }) {
  if (rows.length === 0) {
    return null;
  }

  const sorted = [...rows].sort((a, b) => (a.month_key < b.month_key ? 1 : -1));

  return (
    <>
      <h2 className="section-title">Monthly Log History</h2>
      <div className="table-scroll">
        <table className="budget-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Saved</th>
              <th>Fund Balance</th>
              <th>Roth Contrib.</th>
              <th>Credit Util.</th>
              <th>Listings</th>
              <th>TikTok Posts</th>
              <th>Net Worth</th>
              <th>Rent</th>
              <th>Gym/Tennis</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const deleteWithKey = deleteKpiMonth.bind(null, row.month_key);
              return (
                <tr key={row.month_key}>
                  <td>{formatMonthLabel(row.month_key)}</td>
                  <td>{money(toNum(row.income))}</td>
                  <td>{money(toNum(row.total_saved))}</td>
                  <td>{money(toNum(row.acquisition_fund_balance))}</td>
                  <td>{money(toNum(row.roth_ira_contribution))}</td>
                  <td>{row.credit_utilization_pct == null ? '—' : `${row.credit_utilization_pct}%`}</td>
                  <td>{row.business_listings_reviewed ?? '—'}</td>
                  <td>{row.tiktok_posts ?? '—'}</td>
                  <td>{money(toNum(row.net_worth))}</td>
                  <td>{money(toNum(row.rent_paid))}</td>
                  <td>{row.gym_tennis_sessions ?? '—'}</td>
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
    </>
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
