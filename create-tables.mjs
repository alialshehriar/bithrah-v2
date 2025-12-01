// Create early access tables in Neon database
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL_NEW;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL_NEW is not set');
  process.exit(1);
}

console.log('🔗 Connecting to Neon database...');
console.log('Connection string:', DATABASE_URL.substring(0, 50) + '...\n');

const sql = neon(DATABASE_URL);

async function createTables() {
  try {
    console.log('📝 Creating early_access_users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS early_access_users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        username VARCHAR(100) NOT NULL UNIQUE,
        source VARCHAR(100) NOT NULL,
        referral_code VARCHAR(50) NOT NULL UNIQUE,
        referred_by INTEGER,
        referral_count INTEGER DEFAULT 0,
        bonus_years INTEGER DEFAULT 0,
        batch INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ early_access_users table created\n');

    console.log('📝 Creating indexes for early_access_users...');
    await sql`CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access_users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_early_access_username ON early_access_users(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_early_access_referral_code ON early_access_users(referral_code)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_early_access_referred_by ON early_access_users(referred_by)`;
    console.log('✅ Indexes created\n');

    console.log('📝 Creating early_access_referrals table...');
    await sql`
      CREATE TABLE IF NOT EXISTS early_access_referrals (
        id SERIAL PRIMARY KEY,
        referrer_id INTEGER NOT NULL,
        referred_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES early_access_users(id),
        FOREIGN KEY (referred_id) REFERENCES early_access_users(id)
      )
    `;
    console.log('✅ early_access_referrals table created\n');

    console.log('📝 Creating indexes for early_access_referrals...');
    await sql`CREATE INDEX IF NOT EXISTS idx_early_access_referrals_referrer ON early_access_referrals(referrer_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_early_access_referrals_referred ON early_access_referrals(referred_id)`;
    console.log('✅ Indexes created\n');

    console.log('📊 Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'early_access%'
      ORDER BY table_name
    `;
    
    console.log('✅ Tables found:');
    tables.forEach(t => console.log(`   - ${t.table_name}`));
    
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createTables();
