import { deleteAccount } from '@/app/actions';
import AddAccountForm from './AddAccountForm';
import type { Account, AccountCategory } from '@/lib/types';

const CATEGORY_LABEL: Record<AccountCategory, string> = {
  checking: 'Checking',
  savings: 'Savings',
  brokerage: 'Brokerage',
  retirement: 'Retirement',
  credit_card: 'Credit Card',
};

export default function AccountsList({ accounts }: { accounts: Account[] }) {
  return (
    <section className="card" style={{ marginBottom: 24 }}>
      <div className="card-head">
        <h2>Accounts</h2>
        <span className="tally">{accounts.length} tracked</span>
      </div>
      <AddAccountForm />
      <ul className="task-list">
        {accounts.map((account) => {
          const deleteWithId = deleteAccount.bind(null, account.id);
          return (
            <li key={account.id} className="task-row">
              <span />
              <div className="task-body">
                <span className="task-title">{account.name}</span>
                <span className="task-meta">{CATEGORY_LABEL[account.category]}</span>
              </div>
              <form action={deleteWithId}>
                <button type="submit" className="row-delete" aria-label="Delete account">
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
