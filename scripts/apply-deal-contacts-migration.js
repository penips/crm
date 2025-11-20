import postgres from "postgres";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = postgres(databaseUrl);

async function applyMigration() {
  try {
    console.log("Reading migration file...");
    const migrationSQL = readFileSync(
      join(__dirname, "../drizzle/0002_add_deal_contacts_junction.sql"),
      "utf-8"
    );

    console.log("Applying migration...");
    await sql.unsafe(migrationSQL);

    console.log("✅ Migration applied successfully!");
  } catch (error) {
    console.error("❌ Error applying migration:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigration();

