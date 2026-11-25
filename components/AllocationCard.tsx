import { ASSET_CLASS_LABELS, formatMoney, type AllocationRow } from '@/lib/investing';

export default function AllocationCard({
  rows,
  total,
  monthly,
}: {
  rows: AllocationRow[];
  total: number;
  monthly: number;
}) {
  return (
    <div className="inv-section">
      <h2>Allocation vs. target</h2>
      <p className="inv-note">
        Bars show where you are; the tick marks your target. The last column splits next month&apos;s{' '}
        {formatMoney(monthly)} toward whatever is most underweight, so you rebalance by buying instead of selling
        (no taxable gains in your brokerage).
      </p>
      {total === 0 ? (
        <p className="empty">Add holdings to see your allocation.</p>
      ) : (
        <div className="inv-table-wrap">
          <table className="richtext-table inv-table">
            <thead>
              <tr>
                <th>Asset class</th>
                <th style={{ width: '35%' }}>Current vs. target</th>
                <th>Value</th>
                <th>Gap to target</th>
                <th>Next month</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.assetClass}>
                  <td>{ASSET_CLASS_LABELS[r.assetClass]}</td>
                  <td>
                    <div className="inv-bar" aria-label={`${r.currentPct.toFixed(1)}% now, target ${r.targetPct}%`}>
                      <div className="inv-bar-fill" style={{ width: `${Math.min(100, r.currentPct)}%` }} />
                      <div className="inv-bar-target" style={{ left: `${Math.min(100, r.targetPct)}%` }} />
                    </div>
                    <div className="inv-sub">
                      {r.currentPct.toFixed(1)}% now · {r.targetPct}% target
                    </div>
                  </td>
                  <td>{formatMoney(r.value)}</td>
                  <td className={Math.abs(r.gapDollars) < total * 0.02 ? '' : r.gapDollars > 0 ? 'inv-up' : 'inv-down'}>
                    {r.gapDollars >= 0 ? '+' : '−'}
                    {formatMoney(Math.abs(r.gapDollars))}
                  </td>
                  <td>{r.nextContribution >= 1 ? formatMoney(r.nextContribution) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
