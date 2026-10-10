import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Create a Neon PostgreSQL client with Drizzle ORM.
 * Uses DATABASE_URL from environment by default.
 */
export function createNeonClient(connectionString?: string) {
  const url = connectionString ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required. Set it in your environment or pass it explicitly.');
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export type NeonDB = ReturnType<typeof createNeonClient>;
