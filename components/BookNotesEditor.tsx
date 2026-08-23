'use client';

import { useState } from 'react';
import { updateBookNotes } from '@/app/actions';

export default function BookNotesEditor({ bookId, notes }: { bookId: number; notes: string | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const saveWithId = updateBookNotes.bind(null, bookId);

  if (isEditing) {
    return (
      <form
        className="book-notes-form"
        action={async (formData: FormData) => {
          await saveWithId(formData);
          setIsEditing(false);
        }}
      >
        <textarea name="notes" defaultValue={notes ?? ''} placeholder="What you thought, key takeaways…" rows={3} />
        <div className="save-row">
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="book-notes-view">
      {notes && <p className="book-notes">{notes}</p>}
      <button type="button" className="book-notes-toggle" onClick={() => setIsEditing(true)}>
        {notes ? 'Edit notes' : 'Add notes'}
      </button>
    </div>
  );
}
