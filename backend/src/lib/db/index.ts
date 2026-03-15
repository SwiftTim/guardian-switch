import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Enable connection caching for faster serverless responses
neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === 'production') {
    console.warn("⚠️ DATABASE_URL is not set. Database operations will fail at runtime.");
}

const sql = neon(databaseUrl || "postgres://dummy:dummy@localhost:5432/dummy");
export const db = drizzle(sql, { schema });
