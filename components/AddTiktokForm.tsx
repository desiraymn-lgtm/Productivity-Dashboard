'use client';

import { useRef } from 'react';
import { addTiktokIdea } from '@/app/actions';

const PILLARS = ['Life Journey Series', 'Side Plot Saturdays', 'Style/Lifestyle'];

export default function AddTiktokForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addTiktokIdea(formData);
        formRef.current?.reset();
      }}
      className="add-form"
    >
      <select name="pillar" defaultValue={PILLARS[0]} aria-label="Content pillar">
        {PILLARS.map((pillar) => (
          <option key={pillar} value={pillar}>
            {pillar}
          </option>
        ))}
      </select>
      <input name="idea" placeholder="Video idea…" aria-label="Idea" required />
      <button type="submit">Add idea</button>
    </form>
  );
}
