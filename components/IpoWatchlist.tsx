import { deleteIpoWatch, setIpoStatus } from '@/app/investing/actions';
import AddIpoForm from '@/components/AddIpoForm';
import type { IpoWatchItem } from '@/lib/investing';

export const IPO_STATUSES: { value: IpoWatchItem['status']; label: string }[] = [
  { value: 'rumored', label: 'Reported / rumored' },
  { value: 'filed', label: 'Filed (S-1)' },
  { value: 'priced', label: 'Priced' },
  { value: 'public', label: 'Now public' },
  { value: 'passed', label: 'Passed on it' },
];

export default function IpoWatchlist({ items }: { items: IpoWatchItem[] }) {
  return (
    <div className="inv-section">
      <h2>IPO watchlist</h2>
      <p className="inv-note">
        Companies you&apos;re tracking before they list. Run &ldquo;Find upcoming IPOs&rdquo; above for new names — the
        analyst also checks this list for updates.
      </p>
      <AddIpoForm statuses={IPO_STATUSES} />
      {items.length === 0 ? (
        <p className="empty" style={{ marginTop: 16 }}>Nothing on the watchlist yet.</p>
      ) : (
        <div className="inv-ipo-grid">
          {items.map((item) => (
            <div key={item.id} className={`inv-ipo-card is-${item.status}`}>
              <div className="card-head">
                <strong>{item.company}</strong>
                <form action={deleteIpoWatch.bind(null, item.id)}>
                  <button type="submit" className="row-delete" aria-label={`Remove ${item.company}`}>
                    ×
                  </button>
                </form>
              </div>
              <div className="inv-sub">
                {[item.sector, item.expected_timing && `Expected ${item.expected_timing}`, item.est_valuation]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
              {item.notes && <p className="book-notes">{item.notes}</p>}
              <form action={setIpoStatus.bind(null, item.id)} className="inv-inline-form">
                <select name="status" defaultValue={item.status} aria-label="Status">
                  {IPO_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button type="submit" className="row-delete" style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }}>
                  Update
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
