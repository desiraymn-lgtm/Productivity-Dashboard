'use client';

import { useRef } from 'react';
import { addReward } from '@/app/actions';

export default function AddRewardForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addReward(formData);
        formRef.current?.reset();
      }}
      className="book-form"
    >
      <input name="title" placeholder="Reward (e.g. New bag, spa day, trip)" aria-label="Reward" required />
      <input type="number" step="0.01" name="cost" placeholder="Cost (optional)" aria-label="Cost" />
      <input name="goalNote" placeholder="For hitting… (which goal)" aria-label="Tied to goal" />
      <input name="imageUrl" placeholder="Image URL (optional)" aria-label="Image URL" />
      <textarea name="description" placeholder="Details (optional)" aria-label="Description" />
      <button type="submit">Add reward</button>
    </form>
  );
}
