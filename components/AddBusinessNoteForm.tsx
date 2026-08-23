'use client';

import { useRef } from 'react';
import { addBusinessNote } from '@/app/actions';

export default function AddBusinessNoteForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addBusinessNote(formData);
        formRef.current?.reset();
      }}
      className="add-form"
    >
      <input name="content" placeholder="Acquisition criteria, red flags, reminders…" aria-label="Note" required />
      <button type="submit">Add</button>
    </form>
  );
}
