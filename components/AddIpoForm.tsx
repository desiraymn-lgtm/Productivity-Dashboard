'use client';

import { useRef } from 'react';
import { addIpoWatch } from '@/app/investing/actions';

export default function AddIpoForm({ statuses }: { statuses: { value: string; label: string }[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addIpoWatch(formData);
        formRef.current?.reset();
      }}
      className="book-form inv-add-form"
    >
      <input name="company" placeholder="Company" aria-label="Company" required />
      <input name="sector" placeholder="Sector" aria-label="Sector" />
      <input name="expectedTiming" placeholder="Expected timing (e.g. Q1 2027)" aria-label="Expected timing" />
      <input name="estValuation" placeholder="Last valuation (e.g. $40B)" aria-label="Valuation" />
      <select name="status" defaultValue="rumored" aria-label="Status">
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <textarea name="notes" placeholder="Why it's interesting, how you'd get access…" aria-label="Notes" />
      <button type="submit">Add to watchlist</button>
    </form>
  );
}
