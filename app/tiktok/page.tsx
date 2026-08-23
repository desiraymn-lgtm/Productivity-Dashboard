import { sql } from '@/lib/db';
import TiktokVisionCard from '@/components/TiktokVisionCard';
import AddTiktokForm from '@/components/AddTiktokForm';
import TiktokBoard from '@/components/TiktokBoard';
import type { TiktokIdea, TiktokVision } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function TiktokPage() {
  const [ideas, visionRows] = (await Promise.all([
    sql`select * from tiktok_ideas order by created_at asc`,
    sql`select * from tiktok_vision where id = 1`,
  ])) as [TiktokIdea[], TiktokVision[]];

  const vision = visionRows[0];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>TikTok Plan</h1>
        <p>Your vision for the account, plus an idea bank organized by pillar.</p>
      </div>
      {vision && <TiktokVisionCard content={vision.content} />}
      <AddTiktokForm />
      <TiktokBoard ideas={ideas} />
    </div>
  );
}
