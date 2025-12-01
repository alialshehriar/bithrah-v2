// Check early access users in database
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL_NEW;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL_NEW is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function checkDatabase() {
  try {
    console.log('📊 Checking database...\n');

    // Get all users
    const users = await sql`SELECT * FROM early_access_users ORDER BY created_at DESC`;
    
    console.log(`✅ Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.full_name} (@${user.username})`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Referral Code: ${user.referral_code}`);
      console.log(`   Referred By: ${user.referred_by || 'None'}`);
      console.log(`   Referral Count: ${user.referral_count}`);
      console.log(`   Bonus Years: ${user.bonus_years}`);
      console.log(`   Batch: ${user.batch}`);
      console.log(`   Created: ${user.created_at}`);
      console.log('');
    });

    // Get referrals
    const referrals = await sql`SELECT * FROM early_access_referrals`;
    console.log(`📊 Found ${referrals.length} referrals\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

checkDatabase();
