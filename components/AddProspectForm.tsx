'use client';

import { useRef } from 'react';
import { addProspect } from '@/app/actions';

export default function AddProspectForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addProspect(formData);
        formRef.current?.reset();
      }}
      className="book-form"
    >
      <input name="businessName" placeholder="Business name" aria-label="Business name" required />
      <input name="industry" placeholder="Industry" aria-label="Industry" />
      <select name="stage" defaultValue="researching" aria-label="Stage">
        <option value="researching">Researching</option>
        <option value="contacted">Contacted</option>
        <option value="reviewing">Reviewing</option>
        <option value="passed">Passed</option>
      </select>
      <textarea name="notes" placeholder="Notes (asking price, why it's interesting, concerns…)" aria-label="Notes" />
      <button type="submit">Add prospect</button>
    </form>
  );
}
