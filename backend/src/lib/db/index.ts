import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ DATABASE_URL is not defined. Database operations will fail at runtime.');
}

const sql = neon(databaseUrl || '');
export const db = drizzle(sql, { schema });
