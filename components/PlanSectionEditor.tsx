'use client';

import { useState } from 'react';
import { updatePlanSection } from '@/app/actions';
import { RichText } from '@/lib/richtext';
import type { PlanSection } from '@/lib/types';

export default function PlanSectionEditor({ section, index }: { section: PlanSection; index?: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const saveWithKey = updatePlanSection.bind(null, section.section_key);

  return (
    <div className="plan-year-card">
      <div className="plan-year-head">
        <div className="plan-year-title-group">
          {index != null && <span className="plan-year-badge">{index}</span>}
          <div>
            <h2>{section.title}</h2>
            {section.subtitle && <span className="plan-year-subtitle">{section.subtitle}</span>}
          </div>
        </div>
        <button type="button" className="plan-edit-toggle" onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form
          action={async (formData: FormData) => {
            await saveWithKey(formData);
            setIsEditing(false);
          }}
        >
          <textarea
            name="content"
            defaultValue={section.content}
            rows={14}
            placeholder={
              section.section_key === 'vision'
                ? 'Write your overall 5-year vision here…'
                : `What do you want to accomplish in ${section.title.toLowerCase()}?`
            }
          />
          <div className="save-row">
            <button type="submit">Save</button>
          </div>
        </form>
      ) : section.content.trim() ? (
        <div className="richtext">
          <RichText content={section.content} />
        </div>
      ) : (
        <p className="empty">Nothing here yet — click Edit to add it.</p>
      )}
    </div>
  );
}
