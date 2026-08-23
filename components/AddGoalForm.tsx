'use client';

import { useRef } from 'react';
import { addGoal } from '@/app/actions';

export default function AddGoalForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addGoal(formData);
        formRef.current?.reset();
      }}
      className="book-form"
    >
      <input name="title" placeholder="Goal (e.g. Max out Roth IRA)" aria-label="Goal" required />
      <textarea name="notes" placeholder="Notes (optional)" aria-label="Notes" />
      <button type="submit">Add goal</button>
    </form>
  );
}
