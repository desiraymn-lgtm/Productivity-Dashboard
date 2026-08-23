'use client';

import { useRef } from 'react';
import { addBook } from '@/app/actions';

export default function AddBookForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addBook(formData);
        formRef.current?.reset();
      }}
      className="book-form"
    >
      <input name="title" placeholder="Title" aria-label="Book title" required />
      <input name="author" placeholder="Author" aria-label="Author" />
      <input name="coverUrl" placeholder="Cover image URL (optional)" aria-label="Cover image URL" />
      <select name="status" defaultValue="want" aria-label="Status">
        <option value="want">Want to read</option>
        <option value="reading">Reading</option>
        <option value="finished">Finished</option>
      </select>
      <input type="date" name="startDate" aria-label="Start date" />
      <input type="date" name="endDate" aria-label="End date" />
      <textarea name="notes" placeholder="Notes (optional)" aria-label="Notes" />
      <button type="submit">Add book</button>
    </form>
  );
}
