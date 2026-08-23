import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.'
  );
}

// Tagged-template SQL client. Every query below uses this, e.g.
//   await sql`select * from tasks where id = ${id}`
export const sql = neon(process.env.DATABASE_URL);
