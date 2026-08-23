import { updateBookStatus, deleteBook } from '@/app/actions';
import type { Book, BookStatus } from '@/lib/types';

const STATUS_LABEL: Record<BookStatus, string> = {
  want: 'Want to read',
  reading: 'Reading',
  finished: 'Finished',
};

export default function BookGrid({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return <p className="empty">No books yet. Add your first one above.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const deleteWithId = deleteBook.bind(null, book.id);

  return (
    <div className="book-card">
      <div className="book-cover">
        {book.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.cover_url} alt={`${book.title} cover`} />
        ) : (
          <span className="book-cover-placeholder">{book.title}</span>
        )}
      </div>
      <div className="book-info">
        <span className="status-pill book-status">{STATUS_LABEL[book.status]}</span>
        <span className="book-title">{book.title}</span>
        {book.author && <span className="book-author">{book.author}</span>}
        {(book.start_date || book.end_date) && (
          <span className="book-dates">
            {book.start_date ? formatDate(book.start_date) : '—'} to {book.end_date ? formatDate(book.end_date) : '—'}
          </span>
        )}
        {book.notes && <p className="book-notes">{book.notes}</p>}

        <div className="add-form" style={{ marginTop: 8 }}>
          {(['want', 'reading', 'finished'] as BookStatus[]).map((status) => {
            const setStatus = updateBookStatus.bind(null, book.id, status);
            const isCurrent = book.status === status;
            return (
              <form key={status} action={setStatus}>
                <button
                  type="submit"
                  className="row-delete"
                  style={{
                    width: 'auto',
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: isCurrent ? 700 : 400,
                    color: isCurrent ? 'var(--burgundy)' : 'var(--muted)',
                  }}
                  disabled={isCurrent}
                >
                  {STATUS_LABEL[status]}
                </button>
              </form>
            );
          })}
          <form action={deleteWithId}>
            <button type="submit" className="row-delete" aria-label="Delete book">
              ×
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}
