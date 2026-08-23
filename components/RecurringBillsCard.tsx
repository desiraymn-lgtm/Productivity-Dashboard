'use client';

import { useRef } from 'react';
import { addRecurringBill, deleteRecurringBill } from '@/app/actions';
import type { RecurringBill } from '@/lib/types';

export default function RecurringBillsCard({ bills }: { bills: RecurringBill[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const total = bills.reduce((sum, b) => sum + Number(b.amount), 0);

  return (
    <section className="card">
      <div className="card-head">
        <h2>Recurring Monthly Payments</h2>
        <span className="tally">{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} / mo</span>
      </div>
      <form
        ref={formRef}
        action={async (formData: FormData) => {
          await addRecurringBill(formData);
          formRef.current?.reset();
        }}
        className="add-form"
      >
        <input name="name" placeholder="Bill name" aria-label="Bill name" required />
        <input type="number" step="0.01" name="amount" placeholder="Amount" aria-label="Amount" required />
        <input type="number" min="1" max="31" name="dueDay" placeholder="Due day" aria-label="Due day" style={{ width: 90 }} />
        <button type="submit">Add</button>
      </form>
      {bills.length === 0 && <p className="empty">No recurring bills yet.</p>}
      <ul className="task-list">
        {bills.map((bill) => {
          const deleteWithId = deleteRecurringBill.bind(null, bill.id);
          return (
            <li key={bill.id} className="task-row">
              <span />
              <div className="task-body">
                <span className="task-title">{bill.name}</span>
                <span className="task-meta">
                  {Number(bill.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  {bill.due_day ? ` · due the ${ordinal(bill.due_day)}` : ''}
                </span>
              </div>
              <form action={deleteWithId}>
                <button type="submit" className="row-delete" aria-label="Delete bill">
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

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
