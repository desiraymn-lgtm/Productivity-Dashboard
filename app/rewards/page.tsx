import { sql } from '@/lib/db';
import AddRewardForm from '@/components/AddRewardForm';
import RewardsGrid from '@/components/RewardsGrid';
import type { Reward } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function RewardsPage() {
  const rewards = (await sql`select * from rewards order by created_at desc`) as Reward[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Rewards</h1>
        <p>Gifts, promotions, and things you deserve for hitting your goals.</p>
      </div>
      <AddRewardForm />
      <RewardsGrid rewards={rewards} />
    </div>
  );
}
