import { sql } from '@/lib/db';
import AddVisionForm from '@/components/AddVisionForm';
import VisionGrid from '@/components/VisionGrid';
import type { VisionItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function VisionBoardPage() {
  const items = (await sql`select * from vision_items order by created_at desc`) as VisionItem[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Vision Board</h1>
        <p>Affirmations, prayers, goals, and images — mixed together, the way it should be.</p>
      </div>
      <AddVisionForm />
      <VisionGrid items={items} />
    </div>
  );
}
