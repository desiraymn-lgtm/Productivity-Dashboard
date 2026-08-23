import { sql } from '@/lib/db';
import AddBookForm from '@/components/AddBookForm';
import BookGrid from '@/components/BookGrid';
import type { Book } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function BooksPage() {
  const books = (await sql`
    select * from books
    order by
      case status when 'reading' then 0 when 'want' then 1 else 2 end,
      created_at desc
  `) as Book[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Books</h1>
        <p>Track what you're reading, what's next, and what you finished.</p>
      </div>
      <AddBookForm />
      <BookGrid books={books} />
    </div>
  );
}
