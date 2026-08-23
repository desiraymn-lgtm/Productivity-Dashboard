import { sql } from '@/lib/db';
import PlanSectionEditor from '@/components/PlanSectionEditor';
import type { PlanSection } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function FiveYearPlanPage() {
  const sections = (await sql`
    select * from plan_sections order by sort_order asc
  `) as PlanSection[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>5-Year Plan</h1>
        <p>Your vision, broken down year by year. Edit any section and save it in place.</p>
      </div>
      {sections.map((section) => (
        <PlanSectionEditor key={section.id} section={section} />
      ))}
    </div>
  );
}
