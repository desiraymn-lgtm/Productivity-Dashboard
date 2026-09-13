import type { CoastFiAssumptions, CoastFiMonthlyEntry } from '@/lib/types';

export default function CoastFiProjectionTable({
  assumptions,
  monthlyRows,
}: {
  assumptions: CoastFiAssumptions;
  monthlyRows: CoastFiMonthlyEntry[];
}) {
  const r = Number(assumptions.annual_return_pct) / 100;
  const annualContribution = Number(assumptions.annual_contribution_target);
  const currentBalance = Number(assumptions.current_balance);

  const rows: { age: number; year: number; target: number; actual: number | null }[] = [];
  let target = currentBalance;
  for (let age = assumptions.current_age; age <= assumptions.target_age; age++) {
    if (age > assumptions.current_age) {
      target = target * (1 + r) + annualContribution;
    }
    const year = assumptions.base_year + (age - assumptions.current_age);
    rows.push({ age, year, target, actual: latestBalanceInYear(monthlyRows, year) });
  }

  return (
    <div className="table-scroll">
      <table className="budget-table">
        <thead>
          <tr>
            <th>Age</th>
            <th>Year</th>
            <th>Target Trajectory</th>
            <th>Actual Balance</th>
            <th>On Track?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.age}>
              <td>{row.age}</td>
              <td>{row.year}</td>
              <td>{money(row.target)}</td>
              <td>{row.actual == null ? '—' : money(row.actual)}</td>
              <td
                style={{
                  color: row.actual == null ? 'var(--muted)' : row.actual >= row.target ? 'var(--sage)' : 'var(--burgundy)',
                }}
              >
                {row.actual == null ? 'Enter actual' : row.actual >= row.target ? 'On track' : 'Behind'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function latestBalanceInYear(rows: CoastFiMonthlyEntry[], year: number): number | null {
  const inYear = rows.filter((r) => r.month_key.startsWith(String(year)) && r.combined_balance != null);
  if (inYear.length === 0) return null;
  const latest = [...inYear].sort((a, b) => (a.month_key > b.month_key ? -1 : 1))[0];
  return Number(latest.combined_balance);
}

function money(v: number): string {
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
