import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Run this with:');
  console.error('  DATABASE_URL="postgres://..." node scripts/init-db.mjs');
  process.exit(1);
}

const sql = neon(databaseUrl);
const schema = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8');

const statements = schema
  .split(';')
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql(statement);
  console.log('Ran:', statement.split('\n')[0].slice(0, 60) + '...');
}

console.log(`Done. Applied ${statements.length} statements to the database.`);
