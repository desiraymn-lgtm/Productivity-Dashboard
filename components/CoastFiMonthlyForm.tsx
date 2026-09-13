import { saveCoastFiMonth } from '@/app/actions';
import { currentDateKey } from '@/lib/dates';

const inputStyle: React.CSSProperties = {
  background: 'var(--ivory)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  padding: '6px 8px',
  fontSize: 13,
  width: '100%',
};

export default function CoastFiMonthlyForm() {
  const defaultMonth = currentDateKey().slice(0, 7);

  return (
    <form action={saveCoastFiMonth} className="plan-section">
      <h2>Log This Month&apos;s Contribution</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
          Month
          <input type="month" name="monthKey" defaultValue={defaultMonth} required style={inputStyle} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 18 }}>
          <input type="checkbox" name="atMatchCap" />
          401k at match cap?
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 18 }}>
          <input type="checkbox" name="rothContributionMade" />
          Roth contribution made?
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
          Roth $ this month
          <input type="number" step="0.01" name="rothContributionAmount" style={inputStyle} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
          Combined retirement balance ($)
          <input type="number" step="0.01" name="combinedBalance" style={inputStyle} />
        </label>
      </div>
      <div className="save-row" style={{ marginTop: 14 }}>
        <button type="submit">Save month</button>
      </div>
    </form>
  );
}
