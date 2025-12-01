import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL_NEW);

async function clearTestUsers() {
  try {
    console.log('🗑️  Deleting all test users...');
    
    // Delete all referrals first (foreign key constraint)
    const referralsResult = await sql`DELETE FROM "earlyAccessReferrals"`;
    console.log(`✅ Deleted ${referralsResult.length} referrals`);
    
    // Delete all users
    const usersResult = await sql`DELETE FROM "earlyAccessUsers"`;
    console.log(`✅ Deleted ${usersResult.length} users`);
    
    console.log('\n🎉 All test data cleared successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearTestUsers();
