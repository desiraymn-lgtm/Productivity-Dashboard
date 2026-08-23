import { deleteBusinessNote } from '@/app/actions';
import AddBusinessNoteForm from './AddBusinessNoteForm';
import type { BusinessNote } from '@/lib/types';

export default function BusinessNotesList({ notes }: { notes: BusinessNote[] }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Criteria &amp; Notes</h2>
        <span className="tally">{notes.length} kept</span>
      </div>
      <AddBusinessNoteForm />
      {notes.length === 0 && <p className="empty">Nothing here yet.</p>}
      <ul className="note-list">
        {notes.map((note) => {
          const deleteWithId = deleteBusinessNote.bind(null, note.id);
          return (
            <li key={note.id} className="note-row">
              <p>{note.content}</p>
              <div className="note-meta">
                <span>{new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <form action={deleteWithId}>
                  <button type="submit" className="row-delete" aria-label="Delete note">
                    ×
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
