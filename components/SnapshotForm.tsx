import { saveSnapshot } from '@/app/actions';
import type { Account, AccountCategory } from '@/lib/types';

const CATEGORY_LABEL: Record<AccountCategory, string> = {
  checking: 'Checking Account',
  savings: 'Saving Account',
  brokerage: 'Brokerage Account',
  retirement: 'Retirement Accounts',
  credit_card: 'Credit Cards',
};

const ASSET_ORDER: AccountCategory[] = ['checking', 'savings', 'brokerage', 'retirement'];

export default function SnapshotForm({
  accounts,
  latestBalances,
}: {
  accounts: Account[];
  latestBalances: Map<number, string>;
}) {
  if (accounts.length === 0) {
    return <p className="empty">Add an account above before recording a snapshot.</p>;
  }

  const today = new Date().toISOString().slice(0, 10);
  const liabilities = accounts.filter((a) => a.category === 'credit_card');

  return (
    <form action={saveSnapshot} className="plan-section">
      <h2>Record a Snapshot</h2>
      <label style={{ fontSize: 13, color: 'var(--muted)' }}>
        Date{' '}
        <input type="date" name="snapshotDate" defaultValue={today} required style={{ marginLeft: 6 }} />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 12 }}>
        <div>
          <strong style={{ fontSize: 13, color: 'var(--burgundy)' }}>Assets</strong>
          {ASSET_ORDER.map((category) => {
            const inCategory = accounts.filter((a) => a.category === category);
            if (inCategory.length === 0) return null;
            return (
              <div key={category} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{CATEGORY_LABEL[category]}</div>
                {inCategory.map((account) => (
                  <BalanceRow key={account.id} account={account} defaultValue={latestBalances.get(account.id)} />
                ))}
              </div>
            );
          })}
        </div>

        {liabilities.length > 0 && (
          <div>
            <strong style={{ fontSize: 13, color: 'var(--burgundy)' }}>Liabilities</strong>
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Credit Cards</div>
              {liabilities.map((account) => (
                <BalanceRow key={account.id} account={account} defaultValue={latestBalances.get(account.id)} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="save-row" style={{ marginTop: 14 }}>
        <button type="submit">Save snapshot</button>
      </div>
    </form>
  );
}

function BalanceRow({ account, defaultValue }: { account: Account; defaultValue?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
      <label htmlFor={`balance_${account.id}`} style={{ fontSize: 13 }}>
        {account.name}
      </label>
      <input
        id={`balance_${account.id}`}
        type="number"
        step="0.01"
        name={`balance_${account.id}`}
        defaultValue={defaultValue}
        style={{
          width: 110,
          background: 'var(--ivory)',
          border: '1px solid var(--rule)',
          borderRadius: 6,
          padding: '6px 8px',
          fontSize: 13,
        }}
      />
    </div>
  );
}
