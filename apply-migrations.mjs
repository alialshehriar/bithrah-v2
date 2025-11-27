import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = 'postgresql://neondb_owner:npg_r6QY5HbMReFP@ep-sweet-lab-af2mj6h6-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';

async function applyMigrations() {
  try {
    console.log('🔄 Connecting to Neon database...');
    const sql = neon(DATABASE_URL);
    
    // Read migration file
    const migrationPath = join(__dirname, 'drizzle', '0000_nervous_whistler.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    console.log('📄 Migration file loaded:', migrationPath);
    console.log('📊 Migration size:', migrationSQL.length, 'characters');
    
    // Split by statement-breakpoint
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`\n🚀 Applying ${statements.length} statements...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 80).replace(/\n/g, ' ');
      
      try {
        // Use sql.query for raw SQL statements
        const result = await sql.query(statement, []);
        successCount++;
        console.log(`✅ [${i + 1}/${statements.length}] ${preview}...`);
      } catch (error) {
        errorCount++;
        console.error(`❌ [${i + 1}/${statements.length}] Failed: ${preview}...`);
        console.error(`   Error: ${error.message}`);
        
        // Continue even if there's an error (might be "already exists")
        if (!error.message.includes('already exists')) {
          // throw error; // Uncomment to stop on first error
        }
      }
    }
    
    console.log(`\n✨ Migration completed!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${statements.length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigrations();
