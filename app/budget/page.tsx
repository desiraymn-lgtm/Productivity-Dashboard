import { sql } from '@/lib/db';
import AccountsList from '@/components/AccountsList';
import SnapshotForm from '@/components/SnapshotForm';
import SnapshotSummary from '@/components/SnapshotSummary';
import MonthEndTrend from '@/components/MonthEndTrend';
import SnapshotHistory from '@/components/SnapshotHistory';
import PaycheckCard from '@/components/PaycheckCard';
import RecurringBillsCard from '@/components/RecurringBillsCard';
import type { Account, Paycheck, RecurringBill } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function BudgetPage() {
  const [accounts, allBalances, historyRows, paychecks, bills] = (await Promise.all([
    sql`select * from accounts order by category, created_at asc`,
    sql`
      select account_id, snapshot_date::text as snapshot_date, balance::text as balance
      from account_balances
      order by snapshot_date desc
    `,
    sql`
      select
        ab.snapshot_date::text as snapshot_date,
        sum(case when a.category <> 'credit_card' then ab.balance else 0 end)::float as total_assets,
        sum(case when a.category = 'credit_card' then ab.balance else 0 end)::float as total_liabilities
      from account_balances ab
      join accounts a on a.id = ab.account_id
      group by ab.snapshot_date
      order by ab.snapshot_date desc
    `,
    sql`select * from paychecks order by pay_date desc`,
    sql`select * from recurring_bills order by due_day asc nulls last, created_at asc`,
  ])) as [
    Account[],
    { account_id: number; snapshot_date: string; balance: string }[],
    { snapshot_date: string; total_assets: number; total_liabilities: number }[],
    Paycheck[],
    RecurringBill[],
  ];

  const latestDate = allBalances.length > 0 ? allBalances[0].snapshot_date : null;
  const latestBalances = new Map<number, string>();
  for (const row of allBalances) {
    if (row.snapshot_date === latestDate && !latestBalances.has(row.account_id)) {
      latestBalances.set(row.account_id, row.balance);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Budget</h1>
        <p>Net worth snapshots, paychecks, and recurring bills — modeled on your own tracker.</p>
      </div>

      <SnapshotSummary accounts={accounts} latestBalances={latestBalances} latestDate={latestDate} />
      <MonthEndTrend rows={historyRows} />
      <SnapshotForm accounts={accounts} latestBalances={latestBalances} />
      <SnapshotHistory rows={historyRows} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
        <PaycheckCard paychecks={paychecks} />
        <RecurringBillsCard bills={bills} />
      </div>

      <AccountsList accounts={accounts} />
    </div>
  );
}
