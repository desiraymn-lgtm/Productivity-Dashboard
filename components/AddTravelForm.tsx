'use client';

import { useRef } from 'react';
import { addTravelSpot } from '@/app/actions';

export default function AddTravelForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addTravelSpot(formData);
        formRef.current?.reset();
      }}
      className="book-form"
    >
      <input name="place" placeholder="Place (e.g. Kyoto, Japan)" aria-label="Place" required />
      <select name="status" defaultValue="want" aria-label="Status">
        <option value="want">Want to go</option>
        <option value="been">Been there</option>
      </select>
      <input name="imageUrl" placeholder="Photo URL (optional)" aria-label="Photo URL" />
      <textarea name="notes" placeholder="Notes — why you want to go, favorite memory…" aria-label="Notes" />
      <button type="submit">Add place</button>
    </form>
  );
}
