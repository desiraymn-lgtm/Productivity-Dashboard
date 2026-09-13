import { sql } from '@/lib/db';
import VendingSectionEditor from '@/components/VendingSectionEditor';
import type { VendingSection } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function VendingPage() {
  const sections = (await sql`
    select * from vending_sections order by sort_order asc
  `) as VendingSection[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Vending Business</h1>
        <p>Your 30-Day Plan to launch a vending machine — practice for the bigger acquisition ahead.</p>
      </div>
      <div className="plan-timeline">
        {sections.map((section) => (
          <VendingSectionEditor key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
