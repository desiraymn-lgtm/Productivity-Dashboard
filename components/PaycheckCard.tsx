'use client';

import { useRef } from 'react';
import { addPaycheck, deletePaycheck } from '@/app/actions';
import type { Paycheck } from '@/lib/types';

export default function PaycheckCard({ paychecks }: { paychecks: Paycheck[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const total = paychecks.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <section className="card">
      <div className="card-head">
        <h2>Paychecks</h2>
        <span className="tally">{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} total</span>
      </div>
      <form
        ref={formRef}
        action={async (formData: FormData) => {
          await addPaycheck(formData);
          formRef.current?.reset();
        }}
        className="add-form"
      >
        <input type="date" name="payDate" aria-label="Pay date" required />
        <input type="number" step="0.01" name="amount" placeholder="Amount" aria-label="Amount" required />
        <button type="submit">Add</button>
      </form>
      {paychecks.length === 0 && <p className="empty">No paychecks logged yet.</p>}
      <ul className="task-list">
        {paychecks.map((p) => {
          const deleteWithId = deletePaycheck.bind(null, p.id);
          return (
            <li key={p.id} className="task-row">
              <span />
              <div className="task-body">
                <span className="task-title">{formatDate(p.pay_date)}</span>
                <span className="task-meta">{Number(p.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
              <form action={deleteWithId}>
                <button type="submit" className="row-delete" aria-label="Delete paycheck">
                  ×
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
