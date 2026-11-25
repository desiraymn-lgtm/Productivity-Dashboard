import {
  ACCOUNT_LABELS,
  ROTH_IRA_ANNUAL_LIMIT,
  formatMoney,
  formatPct,
  type InvestAccount,
  type PricedHolding,
} from '@/lib/investing';

export default function InvestingSummary({
  priced,
  total,
  monthlyRoth,
}: {
  priced: PricedHolding[];
  total: number;
  monthlyRoth: number;
}) {
  const accounts = Object.keys(ACCOUNT_LABELS) as InvestAccount[];
  const byAccount = (a: InvestAccount) => priced.filter((h) => h.account === a).reduce((s, h) => s + h.value, 0);

  // Today's move, weighted by position value, for holdings with a live quote.
  const withChange = priced.filter((h) => h.changePct !== null && h.value > 0);
  const dayChange = withChange.reduce((s, h) => s + h.value - h.value / (1 + (h.changePct as number) / 100), 0);

  const costed = priced.filter((h) => h.gain !== null);
  const totalGain = costed.reduce((s, h) => s + (h.gain as number), 0);
  const totalCost = costed.reduce((s, h) => s + Number(h.cost_basis), 0);

  const rothPace = monthlyRoth * 12;

  return (
    <>
      <div className="travel-stats inv-stats">
        <Stat label="Total invested" value={formatMoney(total)} />
        {accounts.map((a) => (
          <Stat key={a} label={ACCOUNT_LABELS[a]} value={formatMoney(byAccount(a))} />
        ))}
        <Stat
          label="Today"
          value={`${dayChange >= 0 ? '+' : '−'}${formatMoney(Math.abs(dayChange))}`}
          tone={dayChange >= 0 ? 'up' : 'down'}
        />
        <Stat
          label="All-time gain"
          value={totalCost > 0 ? formatPct((totalGain / totalCost) * 100) : '—'}
          tone={totalGain >= 0 ? 'up' : 'down'}
        />
      </div>
      <p className="inv-note">
        Roth IRA pace: {formatMoney(monthlyRoth)}/mo → {formatMoney(rothPace)} of the{' '}
        {formatMoney(ROTH_IRA_ANNUAL_LIMIT)} annual limit
        {rothPace >= ROTH_IRA_ANNUAL_LIMIT
          ? ' — on track to max it out.'
          : ` — ${formatMoney(Math.ceil((ROTH_IRA_ANNUAL_LIMIT - rothPace) / 12))}/mo more would max it out.`}
      </p>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'up' | 'down' }) {
  return (
    <div className="travel-stat">
      <span className={`travel-stat-number${tone ? ` inv-${tone}` : ''}`}>{value}</span>
      <span className="travel-stat-label">{label}</span>
    </div>
  );
}
