import { sql } from '@/lib/db';
import AddGoalForm from '@/components/AddGoalForm';
import GoalsList from '@/components/GoalsList';
import type { Goal } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
  const goals = (await sql`select * from goals order by created_at desc`) as Goal[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Goals</h1>
        <p>What you&apos;re working toward, and everything you&apos;ve already knocked out.</p>
      </div>
      <AddGoalForm />
      <GoalsList goals={goals} />
    </div>
  );
}
