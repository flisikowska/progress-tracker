import pg from 'pg';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

// Fixed advisory lock key - prevents parallel instances from migrating at the same time
const MIGRATION_LOCK_KEY = 728341;

export async function runMigrations(dbConfig) {
  const client = new Client(dbConfig);
  await client.connect();
  try {
    await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_KEY]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.migration_history (
        name text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const files = (await readdir(migrationsDir))
      .filter(f => f.endsWith('.sql'))
      .sort();

    const historyRows = await client.query('SELECT name FROM public.migration_history');
    const applied = new Set(historyRows.rows.map(r => r.name));

    // Baseline: empty history but the schema already exists - migrations were
    // applied manually in the past, so just record them as applied.
    if (applied.size === 0) {
      const schemaExists = (await client.query(`SELECT to_regclass('public.user') AS t`)).rows[0].t;
      if (schemaExists) {
        for (const file of files) {
          await client.query('INSERT INTO public.migration_history (name) VALUES ($1)', [file]);
        }
        console.log(`Existing schema with empty migration history - baselined ${files.length} migrations without running them`);
        return;
      }
    }

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping migration ${file} - already applied`);
        continue;
      }
      const sql = await readFile(path.join(migrationsDir, file), 'utf8');
      console.log(`Applying migration ${file}`);
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO public.migration_history (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed: ${error.message}`, { cause: error });
      }
    }
  } finally {
    // client.end() also releases the advisory lock (it lives as long as the session)
    await client.end();
  }
}
