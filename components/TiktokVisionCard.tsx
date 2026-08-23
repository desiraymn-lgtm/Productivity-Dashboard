'use client';

import { useState } from 'react';
import { updateTiktokVision } from '@/app/actions';
import { RichText } from '@/lib/richtext';

export default function TiktokVisionCard({ content }: { content: string }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="plan-year-card" style={{ marginBottom: 28 }}>
      <div className="plan-year-head">
        <div className="plan-year-title-group">
          <div>
            <h2>Vision &amp; Strategy</h2>
          </div>
        </div>
        <button type="button" className="plan-edit-toggle" onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form
          action={async (formData: FormData) => {
            await updateTiktokVision(formData);
            setIsEditing(false);
          }}
        >
          <textarea name="content" defaultValue={content} rows={16} />
          <div className="save-row">
            <button type="submit">Save</button>
          </div>
        </form>
      ) : content.trim() ? (
        <div className="richtext">
          <RichText content={content} />
        </div>
      ) : (
        <p className="empty">Nothing here yet — click Edit to add your TikTok vision.</p>
      )}
    </div>
  );
}
