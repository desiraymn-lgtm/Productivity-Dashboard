import type { Account, AccountCategory } from '@/lib/types';

const CATEGORY_LABEL: Record<AccountCategory, string> = {
  checking: 'Checking Account',
  savings: 'Saving Account',
  brokerage: 'Brokerage Account',
  retirement: 'Retirement Accounts',
  credit_card: 'Credit Cards',
};

const ASSET_ORDER: AccountCategory[] = ['checking', 'savings', 'brokerage', 'retirement'];

export default function SnapshotSummary({
  accounts,
  latestBalances,
  latestDate,
}: {
  accounts: Account[];
  latestBalances: Map<number, string>;
  latestDate: string | null;
}) {
  if (!latestDate) {
    return <p className="empty">No snapshot recorded yet — fill in the form above and save one.</p>;
  }

  const assets = accounts.filter((a) => a.category !== 'credit_card');
  const liabilities = accounts.filter((a) => a.category === 'credit_card');

  const totalAssets = assets.reduce((sum, a) => sum + Number(latestBalances.get(a.id) || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + Number(latestBalances.get(a.id) || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 28 }}>
      <div className="plan-section">
        <h2>Assets — as of {formatDate(latestDate)}</h2>
        {ASSET_ORDER.map((category) => {
          const inCategory = assets.filter((a) => a.category === category);
          if (inCategory.length === 0) return null;
          return (
            <div key={category} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{CATEGORY_LABEL[category]}</div>
              {inCategory.map((a) => (
                <Row key={a.id} label={a.name} value={latestBalances.get(a.id)} />
              ))}
            </div>
          );
        })}
        <Row label="Total" value={String(totalAssets)} bold />
      </div>

      <div className="plan-section">
        <h2>Liabilities</h2>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Credit Cards</div>
        {liabilities.map((a) => (
          <Row key={a.id} label={a.name} value={latestBalances.get(a.id)} />
        ))}
        <Row label="Total" value={String(totalLiabilities)} bold />
        <div
          style={{
            marginTop: 16,
            background: netWorth >= 0 ? 'var(--sage)' : 'var(--burgundy)',
            color: 'var(--ivory)',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 700,
          }}
        >
          <span>Net Worth</span>
          <span>{money(netWorth)}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value?: string; bold?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 13,
        padding: '3px 0',
        fontWeight: bold ? 700 : 400,
        borderTop: bold ? '1px solid var(--rule)' : 'none',
        marginTop: bold ? 4 : 0,
        paddingTop: bold ? 6 : 3,
      }}
    >
      <span>{label}</span>
      <span>{money(Number(value || 0))}</span>
    </div>
  );
}

function money(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
