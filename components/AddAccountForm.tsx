'use client';

import { useRef } from 'react';
import { addAccount } from '@/app/actions';

export default function AddAccountForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addAccount(formData);
        formRef.current?.reset();
      }}
      className="add-form"
    >
      <input name="name" placeholder="Account name (e.g. Chase)" aria-label="Account name" required />
      <select name="category" defaultValue="checking" aria-label="Account category">
        <option value="checking">Checking</option>
        <option value="savings">Savings</option>
        <option value="brokerage">Brokerage</option>
        <option value="retirement">Retirement</option>
        <option value="credit_card">Credit Card (liability)</option>
      </select>
      <button type="submit">Add account</button>
    </form>
  );
}
