import { saveKpiMonth } from '@/app/actions';
import { currentDateKey } from '@/lib/dates';

const FIELDS: { name: string; label: string; step?: string }[] = [
  { name: 'income', label: 'Take-Home Income ($)', step: '0.01' },
  { name: 'totalSaved', label: 'Total Saved This Month ($)', step: '0.01' },
  { name: 'acquisitionFundBalance', label: 'Business Acquisition Fund Balance ($)', step: '0.01' },
  { name: 'rothIraContribution', label: 'Roth IRA Contribution ($)', step: '0.01' },
  { name: 'creditUtilizationPct', label: 'Credit Utilization (%)', step: '0.1' },
  { name: 'businessListingsReviewed', label: 'Business Listings Reviewed', step: '1' },
  { name: 'tiktokPosts', label: 'TikTok Posts This Month', step: '1' },
  { name: 'netWorth', label: 'Net Worth ($)', step: '0.01' },
  { name: 'rentPaid', label: 'Rent Paid ($)', step: '0.01' },
  { name: 'gymTennisSessions', label: 'Gym/Tennis Sessions', step: '1' },
];

const inputStyle: React.CSSProperties = {
  background: 'var(--ivory)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  padding: '6px 8px',
  fontSize: 13,
  width: '100%',
};

export default function KpiLogForm() {
  const defaultMonth = currentDateKey().slice(0, 7);

  return (
    <form action={saveKpiMonth} className="plan-section">
      <h2>Log This Month</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
          Month
          <input type="month" name="monthKey" defaultValue={defaultMonth} required style={inputStyle} />
        </label>
        {FIELDS.map((field) => (
          <label
            key={field.name}
            style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--muted)' }}
          >
            {field.label}
            <input type="number" step={field.step} name={field.name} style={inputStyle} />
          </label>
        ))}
      </div>
      <div className="save-row" style={{ marginTop: 14 }}>
        <button type="submit">Save month</button>
      </div>
    </form>
  );
}
