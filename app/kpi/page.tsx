import { sql } from '@/lib/db';
import KpiDashboard from '@/components/KpiDashboard';
import KpiLogForm from '@/components/KpiLogForm';
import KpiHistory from '@/components/KpiHistory';
import type { KpiMonthlyLog } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function KpiPage() {
  const rows = (await sql`
    select * from kpi_monthly_log order by month_key asc
  `) as KpiMonthlyLog[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>KPI Dashboard</h1>
        <p>Log your numbers each month — savings rate, Roth IRA pace, and status against every target are computed for you.</p>
      </div>
      <KpiDashboard rows={rows} />
      <KpiLogForm />
      <KpiHistory rows={rows} />
    </div>
  );
}
