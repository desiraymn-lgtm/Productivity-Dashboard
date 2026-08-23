import { deleteNote } from '@/app/actions';
import AddNoteForm from './AddNoteForm';
import type { Note } from '@/lib/types';

export default function QuickNotes({ notes }: { notes: Note[] }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Notes</h2>
        <span className="tally">{notes.length} kept</span>
      </div>

      <AddNoteForm />

      {notes.length === 0 && <p className="empty">Jot down anything worth remembering.</p>}

      <ul className="note-list">
        {notes.map((note) => {
          const deleteWithId = deleteNote.bind(null, note.id);
          return (
            <li key={note.id} className="note-row">
              <p>{note.content}</p>
              <div className="note-meta">
                <span>{formatDate(note.created_at)}</span>
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
