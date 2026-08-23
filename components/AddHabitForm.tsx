'use client';

import { useRef } from 'react';
import { addHabit } from '@/app/actions';

export default function AddHabitForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addHabit(formData);
        formRef.current?.reset();
      }}
      className="add-form"
    >
      <input name="name" placeholder="Add a habit to track…" aria-label="Habit name" required />
      <button type="submit">Add</button>
    </form>
  );
}
