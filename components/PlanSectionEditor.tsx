'use client';

import { updatePlanSection } from '@/app/actions';
import type { PlanSection } from '@/lib/types';

export default function PlanSectionEditor({ section }: { section: PlanSection }) {
  const saveWithKey = updatePlanSection.bind(null, section.section_key);

  return (
    <div className="plan-section">
      <h2>{section.title}</h2>
      <form action={saveWithKey}>
        <textarea
          name="content"
          defaultValue={section.content}
          placeholder={
            section.section_key === 'vision'
              ? 'Write your overall 5-year vision here…'
              : `What do you want to accomplish or become in ${section.title.toLowerCase()}?`
          }
        />
        <div className="save-row">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
