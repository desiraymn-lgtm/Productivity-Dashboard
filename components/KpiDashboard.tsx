import type { KpiMonthlyLog } from '@/lib/types';

const ROTH_ANNUAL_MAX = 7500;

type StatusTone = 'good' | 'bad' | 'neutral';

export default function KpiDashboard({ rows }: { rows: KpiMonthlyLog[] }) {
  if (rows.length === 0) {
    return <p className="empty">No months logged yet — fill in the form below to get started.</p>;
  }

  const latest = rows[rows.length - 1];
  const latestYear = latest.month_key.slice(0, 4);

  const rothYtd = rows
    .filter((r) => r.month_key.slice(0, 4) === latestYear && r.month_key <= latest.month_key)
    .reduce((sum, r) => sum + (toNum(r.roth_ira_contribution) ?? 0), 0);

  const income = toNum(latest.income);
  const totalSaved = toNum(latest.total_saved);
  const savingsRate = income && income > 0 && totalSaved != null ? (totalSaved / income) * 100 : null;
  const rothPctOfMax = (rothYtd / ROTH_ANNUAL_MAX) * 100;
  const creditUtilization = toNum(latest.credit_utilization_pct);
  const listings = latest.business_listings_reviewed;
  const tiktokPosts = latest.tiktok_posts;
  const rent = toNum(latest.rent_paid);

  const kpiRows: { kpi: string; target: string; value: string; status: string; tone: StatusTone }[] = [
    { kpi: 'Income (latest month)', target: '$100K+ annualized by 2029–30', value: money(income), status: 'Tracked', tone: 'neutral' },
    {
      kpi: 'Savings Rate',
      target: '30%+',
      value: pct(savingsRate),
      status: savingsRate == null ? '—' : savingsRate >= 30 ? 'On track' : 'Below target',
      tone: savingsRate == null ? 'neutral' : savingsRate >= 30 ? 'good' : 'bad',
    },
    {
      kpi: 'Business Acquisition Fund',
      target: '$35–45K (2027) → $75–150K (2028)',
      value: money(toNum(latest.acquisition_fund_balance)),
      status: 'Tracked',
      tone: 'neutral',
    },
    {
      kpi: 'Roth IRA YTD',
      target: `$${ROTH_ANNUAL_MAX.toLocaleString()} (2026 max)`,
      value: money(rothYtd),
      status: rothYtd >= ROTH_ANNUAL_MAX ? 'Maxed' : 'In progress',
      tone: rothYtd >= ROTH_ANNUAL_MAX ? 'good' : 'neutral',
    },
    { kpi: 'Roth IRA % of Annual Max', target: '100% by Dec', value: pct(rothPctOfMax), status: 'Tracked', tone: 'neutral' },
    {
      kpi: 'Credit Utilization',
      target: 'Under 10%',
      value: pct(creditUtilization),
      status: creditUtilization == null ? '—' : creditUtilization < 10 ? 'On track' : 'Over target',
      tone: creditUtilization == null ? 'neutral' : creditUtilization < 10 ? 'good' : 'bad',
    },
    {
      kpi: 'Business Listings Reviewed',
      target: '5–10/month',
      value: listings == null ? '—' : String(listings),
      status: listings == null ? '—' : listings >= 5 ? 'On track' : 'Below target',
      tone: listings == null ? 'neutral' : listings >= 5 ? 'good' : 'bad',
    },
    {
      kpi: 'TikTok Posts',
      target: '8–12/month (2–3x/wk)',
      value: tiktokPosts == null ? '—' : String(tiktokPosts),
      status: tiktokPosts == null ? '—' : tiktokPosts >= 8 ? 'On track' : 'Below target',
      tone: tiktokPosts == null ? 'neutral' : tiktokPosts >= 8 ? 'good' : 'bad',
    },
    { kpi: 'Net Worth', target: 'Steady quarterly growth', value: money(toNum(latest.net_worth)), status: 'Tracked', tone: 'neutral' },
    {
      kpi: 'Rent',
      target: '~$1,500/mo ceiling',
      value: money(rent),
      status: rent == null ? '—' : rent <= 1500 ? 'On track' : 'Over budget',
      tone: rent == null ? 'neutral' : rent <= 1500 ? 'good' : 'bad',
    },
    {
      kpi: 'Gym/Tennis Sessions',
      target: 'Protect the routine',
      value: latest.gym_tennis_sessions == null ? '—' : String(latest.gym_tennis_sessions),
      status: 'Tracked',
      tone: 'neutral',
    },
  ];

  return (
    <>
      <h2 className="section-title">Dashboard — {formatMonthLabel(latest.month_key)}</h2>
      <div className="table-scroll">
        <table className="budget-table">
          <thead>
            <tr>
              <th>KPI</th>
              <th>Target</th>
              <th>Latest Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {kpiRows.map((row) => (
              <tr key={row.kpi}>
                <td>{row.kpi}</td>
                <td>{row.target}</td>
                <td style={{ fontWeight: 600 }}>{row.value}</td>
                <td style={{ color: row.tone === 'good' ? 'var(--sage)' : row.tone === 'bad' ? 'var(--burgundy)' : 'var(--muted)' }}>
                  {row.status}
                </td>
              </tr>
            ))}
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

function pct(v: number | null, digits = 1): string {
  return v == null ? '—' : `${v.toFixed(digits)}%`;
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
