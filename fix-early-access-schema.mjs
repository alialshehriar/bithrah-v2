// Fix early access tables schema to match Drizzle
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL_NEW;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL_NEW is not set');
  process.exit(1);
}

console.log('🔗 Connecting to Neon database...\n');

const sql = neon(DATABASE_URL);

async function fixSchema() {
  try {
    // Drop old tables if they exist
    console.log('🗑️  Dropping old tables...');
    await sql`DROP TABLE IF EXISTS early_access_referrals CASCADE`;
    await sql`DROP TABLE IF EXISTS "earlyAccessReferrals" CASCADE`;
    await sql`DROP TABLE IF EXISTS early_access_users CASCADE`;
    await sql`DROP TABLE IF EXISTS "earlyAccessUsers" CASCADE`;
    console.log('✅ Old tables dropped\n');

    // Create earlyAccessUsers table (camelCase)
    console.log('📝 Creating earlyAccessUsers table...');
    await sql`
      CREATE TABLE "earlyAccessUsers" (
        id SERIAL PRIMARY KEY,
        "fullName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        username VARCHAR(100) NOT NULL UNIQUE,
        source VARCHAR(100) NOT NULL,
        "referralCode" VARCHAR(50) NOT NULL UNIQUE,
        "referredBy" VARCHAR(50),
        "referralCount" INTEGER DEFAULT 0,
        "bonusYears" INTEGER DEFAULT 1,
        batch INTEGER DEFAULT 1,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ earlyAccessUsers table created\n');

    // Create indexes
    console.log('📝 Creating indexes for earlyAccessUsers...');
    await sql`CREATE INDEX "early_access_email_idx" ON "earlyAccessUsers"(email)`;
    await sql`CREATE INDEX "early_access_username_idx" ON "earlyAccessUsers"(username)`;
    await sql`CREATE INDEX "early_access_referral_code_idx" ON "earlyAccessUsers"("referralCode")`;
    await sql`CREATE INDEX "early_access_referred_by_idx" ON "earlyAccessUsers"("referredBy")`;
    console.log('✅ Indexes created\n');

    // Create earlyAccessReferrals table
    console.log('📝 Creating earlyAccessReferrals table...');
    await sql`
      CREATE TABLE "earlyAccessReferrals" (
        id SERIAL PRIMARY KEY,
        "referrerId" INTEGER NOT NULL REFERENCES "earlyAccessUsers"(id) ON DELETE CASCADE,
        "referredId" INTEGER NOT NULL REFERENCES "earlyAccessUsers"(id) ON DELETE CASCADE,
        "referralCode" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ earlyAccessReferrals table created\n');

    // Create indexes for referrals
    console.log('📝 Creating indexes for earlyAccessReferrals...');
    await sql`CREATE INDEX "early_access_referrals_referrer_id_idx" ON "earlyAccessReferrals"("referrerId")`;
    await sql`CREATE INDEX "early_access_referrals_referred_id_idx" ON "earlyAccessReferrals"("referredId")`;
    console.log('✅ Indexes created\n');

    // Verify tables
    console.log('📊 Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE 'early%' OR table_name LIKE '%Access%')
      ORDER BY table_name
    `;
    
    console.log('✅ Tables found:');
    tables.forEach(t => console.log(`   - ${t.table_name}`));
    
    console.log('\n🎉 Schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixSchema();
