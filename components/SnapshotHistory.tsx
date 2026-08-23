import { deleteSnapshot } from '@/app/actions';

type SnapshotRow = {
  snapshot_date: string;
  total_assets: number;
  total_liabilities: number;
};

export default function SnapshotHistory({ rows }: { rows: SnapshotRow[] }) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <table className="budget-table" style={{ marginBottom: 28 }}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Total Assets</th>
          <th>Total Liabilities</th>
          <th>Net Worth</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const deleteWithDate = deleteSnapshot.bind(null, row.snapshot_date);
          const net = row.total_assets - row.total_liabilities;
          return (
            <tr key={row.snapshot_date}>
              <td>{formatDate(row.snapshot_date)}</td>
              <td>{money(row.total_assets)}</td>
              <td>{money(row.total_liabilities)}</td>
              <td style={{ fontWeight: 600 }}>{money(net)}</td>
              <td>
                <form action={deleteWithDate}>
                  <button type="submit" className="row-delete" aria-label="Delete snapshot">
                    ×
                  </button>
                </form>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function money(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
