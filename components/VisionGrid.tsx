import { deleteVisionItem } from '@/app/actions';
import type { VisionItem } from '@/lib/types';

export default function VisionGrid({ items }: { items: VisionItem[] }) {
  if (items.length === 0) {
    return <p className="empty">Nothing on the board yet — add an image or a few words above.</p>;
  }

  return (
    <div className="vision-grid">
      {items.map((item) => {
        const deleteWithId = deleteVisionItem.bind(null, item.id);
        return (
          <div key={item.id} className="vision-card">
            {item.kind === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.content} alt="" />
            ) : (
              <p className="vision-card-text">{item.content}</p>
            )}
            <form action={deleteWithId}>
              <button type="submit" className="row-delete" aria-label="Remove from board">
                ×
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
