// Test database connection using server/db.ts
import { getDb } from './server/db.js';
import { earlyAccessUsers } from './drizzle/schema.js';

async function testConnection() {
  console.log('🔗 Testing database connection...\n');
  
  try {
    const db = await getDb();
    
    if (!db) {
      console.error('❌ Database connection failed - db is null');
      return;
    }
    
    console.log('✅ Database connection successful\n');
    
    // Try to query users
    console.log('📊 Querying early_access_users...');
    const users = await db.select().from(earlyAccessUsers);
    
    console.log(`✅ Found ${users.length} users\n`);
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.fullName} (@${user.username})`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Referral Code: ${user.referralCode}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testConnection();
