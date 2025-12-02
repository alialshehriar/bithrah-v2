import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL_NEW);
const db = drizzle(sql);

const result = await sql`SELECT username, "referralCode" FROM early_access_users LIMIT 1`;
console.log(JSON.stringify(result, null, 2));
