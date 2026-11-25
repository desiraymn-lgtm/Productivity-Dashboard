import { deleteHolding, updateHolding } from '@/app/investing/actions';
import AddHoldingForm from '@/components/AddHoldingForm';
import {
  ACCOUNT_LABELS,
  ASSET_CLASS_LABELS,
  formatMoney,
  formatPct,
  type InvestAccount,
  type PricedHolding,
} from '@/lib/investing';

export default function HoldingsTable({ priced }: { priced: PricedHolding[] }) {
  const accounts = Object.keys(ACCOUNT_LABELS) as InvestAccount[];

  return (
    <div className="inv-section">
      <h2>Holdings</h2>
      <p className="inv-note">
        Prices refresh from Yahoo Finance every few minutes. For anything it can&apos;t price (a 401k fund, a CD),
        set a manual price. For cash, use symbol CASH and enter the dollar amount as the quantity.
      </p>
      <AddHoldingForm />

      {priced.length === 0 ? (
        <p className="empty" style={{ marginTop: 16 }}>No holdings yet — add what you own in each account above.</p>
      ) : (
        accounts
          .filter((a) => priced.some((h) => h.account === a))
          .map((a) => {
            const rows = priced.filter((h) => h.account === a);
            const subtotal = rows.reduce((s, h) => s + h.value, 0);
            return (
              <div key={a} className="inv-account">
                <div className="card-head">
                  <h3 className="richtext-heading" style={{ margin: 0 }}>{ACCOUNT_LABELS[a]}</h3>
                  <span className="tally">{formatMoney(subtotal)}</span>
                </div>
                <div className="inv-table-wrap">
                  <table className="richtext-table inv-table">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Class</th>
                        <th>Price</th>
                        <th>Today</th>
                        <th>Value</th>
                        <th>Gain</th>
                        <th>Qty · cost basis · manual price</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((h) => (
                        <HoldingRow key={h.id} h={h} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}

function HoldingRow({ h }: { h: PricedHolding }) {
  const update = updateHolding.bind(null, h.id);
  const remove = deleteHolding.bind(null, h.id);

  return (
    <tr>
      <td>
        <strong>{h.symbol}</strong>
        {h.name && <div className="inv-sub">{h.name}</div>}
      </td>
      <td>{ASSET_CLASS_LABELS[h.asset_class]}</td>
      <td>
        {h.price !== null ? formatMoney(h.price, { cents: true }) : '—'}
        {h.priceSource === 'manual' && h.symbol !== 'CASH' && <div className="inv-sub">manual</div>}
      </td>
      <td className={h.changePct === null ? '' : h.changePct >= 0 ? 'inv-up' : 'inv-down'}>
        {h.changePct !== null ? formatPct(h.changePct, 2) : '—'}
      </td>
      <td>{formatMoney(h.value)}</td>
      <td className={h.gain === null ? '' : h.gain >= 0 ? 'inv-up' : 'inv-down'}>
        {h.gain !== null ? `${h.gain >= 0 ? '+' : '−'}${formatMoney(Math.abs(h.gain))}` : '—'}
      </td>
      <td>
        <form action={update} className="inv-inline-form">
          <input name="quantity" defaultValue={Number(h.quantity)} aria-label="Quantity" inputMode="decimal" />
          <input
            name="costBasis"
            defaultValue={h.cost_basis ?? ''}
            placeholder="cost"
            aria-label="Total cost basis"
            inputMode="decimal"
          />
          <input
            name="manualPrice"
            defaultValue={h.manual_price ?? ''}
            placeholder="price"
            aria-label="Manual price"
            inputMode="decimal"
          />
          <button type="submit" className="row-delete" style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }}>
            Save
          </button>
        </form>
      </td>
      <td>
        <form action={remove}>
          <button type="submit" className="row-delete" aria-label={`Delete ${h.symbol}`}>
            ×
          </button>
        </form>
      </td>
    </tr>
  );
}
