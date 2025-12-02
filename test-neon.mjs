import { neon } from "@neondatabase/serverless";

const dbUrl = "postgresql://neondb_owner:npg_DYNM8KOc0GSx@ep-cold-cherry-a48pbm2f-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

const sql = neon(dbUrl);

try {
  const result = await sql`SELECT COUNT(*) as count FROM early_access_users`;
  console.log("✅ Connected to Neon successfully!");
  console.log("Total early_access_users:", result[0].count);
} catch (error) {
  console.error("❌ Failed to connect:", error.message);
}
