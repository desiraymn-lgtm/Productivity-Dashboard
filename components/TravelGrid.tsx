import { toggleTravelStatus, deleteTravelSpot } from '@/app/actions';
import type { TravelSpot } from '@/lib/types';

export default function TravelGrid({ spots }: { spots: TravelSpot[] }) {
  const been = spots.filter((s) => s.status === 'been');
  const want = spots.filter((s) => s.status === 'want');

  return (
    <>
      <div className="travel-stats">
        <div className="travel-stat">
          <span className="travel-stat-number">{been.length}</span>
          <span className="travel-stat-label">Places explored</span>
        </div>
        <div className="travel-stat">
          <span className="travel-stat-number">{want.length}</span>
          <span className="travel-stat-label">On the list</span>
        </div>
      </div>

      {spots.length === 0 ? (
        <p className="empty">No places yet — add your first destination above.</p>
      ) : (
        <div className="travel-grid">
          {spots.map((spot) => (
            <TravelCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </>
  );
}

function TravelCard({ spot }: { spot: TravelSpot }) {
  const toggleWithId = toggleTravelStatus.bind(null, spot.id, spot.status);
  const deleteWithId = deleteTravelSpot.bind(null, spot.id);
  const isBeen = spot.status === 'been';

  return (
    <div className={`travel-card${isBeen ? ' is-been' : ' is-want'}`}>
      <div className="travel-card-photo">
        {spot.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={spot.image_url} alt={spot.place} />
        ) : (
          <span className="travel-card-placeholder">{spot.place}</span>
        )}
        <span className="travel-card-badge">{isBeen ? 'Been there' : 'Want to go'}</span>
      </div>
      <div className="travel-card-body">
        <span className="travel-card-name">{spot.place}</span>
        {isBeen && spot.visited_date && <span className="travel-card-meta">Visited {formatDate(spot.visited_date)}</span>}
        {spot.notes && <p className="book-notes">{spot.notes}</p>}
        <div className="add-form" style={{ marginTop: 8 }}>
          <form action={toggleWithId}>
            <button type="submit" className="row-delete" style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }}>
              {isBeen ? 'Mark as want to go' : 'Mark as been there'}
            </button>
          </form>
          <form action={deleteWithId}>
            <button type="submit" className="row-delete" aria-label="Delete place">
              ×
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
