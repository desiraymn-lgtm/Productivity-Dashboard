import { sql } from '@/lib/db';
import PlanSectionEditor from '@/components/PlanSectionEditor';
import type { PlanSection } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function FiveYearPlanPage() {
  const sections = (await sql`
    select * from plan_sections order by sort_order asc
  `) as PlanSection[];

  const vision = sections.find((s) => s.section_key === 'vision');
  const years = sections.filter((s) => s.section_key !== 'vision');

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>5-Year Plan</h1>
        <p>Your vision, broken down year by year. Edit any section and save it in place.</p>
      </div>
      {vision && <PlanSectionEditor section={vision} />}
      <div className="plan-timeline">
        {years.map((section, i) => (
          <PlanSectionEditor key={section.id} section={section} index={i + 1} />
        ))}
      </div>
    </div>
  );
}
