import { sql } from '@/lib/db';
import GymSectionEditor from '@/components/GymSectionEditor';
import type { GymSection } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function GymPage() {
  const sections = (await sql`
    select * from gym_sections order by sort_order asc
  `) as GymSection[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Gym</h1>
        <p>Your 4-Week Strength &amp; Tone-Up Plan — edit any day in place as your routine evolves.</p>
      </div>
      <div className="plan-timeline">
        {sections.map((section) => (
          <GymSectionEditor key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
