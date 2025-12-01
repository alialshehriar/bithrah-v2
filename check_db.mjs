import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { earlyAccessUsers } from './drizzle/schema.js';
import { count } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL_NEW);
const db = drizzle(sql);

const result = await db.select({ count: count() }).from(earlyAccessUsers);
console.log('Total early access users:', result[0].count);

const users = await db.select().from(earlyAccessUsers).limit(5);
console.log('\nFirst 5 users:');
users.forEach(u => console.log(`- ${u.email} (${u.fullName})`));
