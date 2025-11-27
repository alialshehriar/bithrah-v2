import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_r6QY5HbMReFP@ep-sweet-lab-af2mj6h6-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';

async function dropAllTables() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    console.log('🔄 Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Drop all tables in public schema
    console.log('\n🗑️  Dropping all tables...');
    await client.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          RAISE NOTICE 'Dropped table: %', r.tablename;
        END LOOP;
      END $$;
    `);
    
    // Drop all types (enums)
    console.log('\n🗑️  Dropping all types...');
    await client.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e') LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
          RAISE NOTICE 'Dropped type: %', r.typname;
        END LOOP;
      END $$;
    `);
    
    console.log('\n✨ All tables and types dropped successfully!');
    
  } catch (error) {
    console.error('❌ Drop failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

dropAllTables();
