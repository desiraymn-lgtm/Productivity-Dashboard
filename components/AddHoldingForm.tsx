'use client';

import { useRef } from 'react';
import { addHolding } from '@/app/investing/actions';
import { ACCOUNT_LABELS, ASSET_CLASS_LABELS } from '@/lib/investing';

export default function AddHoldingForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addHolding(formData);
        formRef.current?.reset();
      }}
      className="book-form inv-add-form"
    >
      <select name="account" defaultValue="brokerage" aria-label="Account">
        {Object.entries(ACCOUNT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="symbol" placeholder="Symbol (VTI, BTC, CASH)" aria-label="Symbol" required />
      <input name="name" placeholder="Name (optional)" aria-label="Name" />
      <select name="assetClass" defaultValue="us_stock" aria-label="Asset class">
        {Object.entries(ASSET_CLASS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="quantity" placeholder="Shares / coins" aria-label="Quantity" inputMode="decimal" required />
      <input name="costBasis" placeholder="Total cost basis $ (optional)" aria-label="Cost basis" inputMode="decimal" />
      <input name="manualPrice" placeholder="Manual price (optional)" aria-label="Manual price" inputMode="decimal" />
      <button type="submit">Add holding</button>
    </form>
  );
}
