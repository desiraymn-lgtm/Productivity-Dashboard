import { sql } from '@/lib/db';
import AddTiktokForm from '@/components/AddTiktokForm';
import TiktokBoard from '@/components/TiktokBoard';
import type { TiktokIdea } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function TiktokPage() {
  const ideas = (await sql`select * from tiktok_ideas order by created_at asc`) as TiktokIdea[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>TikTok Plan</h1>
        <p>Idea bank organized by content pillar. Tap a status pill to move it forward.</p>
      </div>
      <AddTiktokForm />
      <TiktokBoard ideas={ideas} />
    </div>
  );
}
