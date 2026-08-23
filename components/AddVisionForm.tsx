'use client';

import { useRef, useState } from 'react';
import { addVisionItem } from '@/app/actions';

export default function AddVisionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState('text');

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addVisionItem(formData);
        formRef.current?.reset();
        setKind('text');
      }}
      className="vision-form"
    >
      <select name="kind" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Type">
        <option value="text">Affirmation / prayer / goal</option>
        <option value="image">Image URL</option>
      </select>
      <input
        name="content"
        placeholder={kind === 'image' ? 'Paste an image URL…' : 'Write an affirmation, prayer, or goal…'}
        aria-label="Content"
        required
      />
      <button type="submit">Add to board</button>
    </form>
  );
}
