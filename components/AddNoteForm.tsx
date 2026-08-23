'use client';

import { useRef } from 'react';
import { addNote } from '@/app/actions';

export default function AddNoteForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addNote(formData);
        formRef.current?.reset();
      }}
      className="add-form add-form-note"
    >
      <input name="content" placeholder="Jot something down…" aria-label="Note content" required />
      <button type="submit">Add</button>
    </form>
  );
}
