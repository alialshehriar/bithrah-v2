import pg from "pg";
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addColumns() {
  try {
    await client.connect();
    console.log("✅ Connected to Neon");
    
    // Add targetMarket column
    try {
      await client.query('ALTER TABLE "ideas" ADD COLUMN "targetMarket" text');
      console.log("✅ Added targetMarket column");
    } catch (e) {
      if (e.code === '42701') {
        console.log("⚠️  targetMarket column already exists");
      } else {
        throw e;
      }
    }
    
    // Add competitiveAdvantage column
    try {
      await client.query('ALTER TABLE "ideas" ADD COLUMN "competitiveAdvantage" text');
      console.log("✅ Added competitiveAdvantage column");
    } catch (e) {
      if (e.code === '42701') {
        console.log("⚠️  competitiveAdvantage column already exists");
      } else {
        throw e;
      }
    }
    
    console.log("\n✨ Schema updated successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

addColumns();
