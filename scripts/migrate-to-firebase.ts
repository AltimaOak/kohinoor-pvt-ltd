/**
 * One-time migration script: uploads local db.json to Firebase Realtime Database.
 *
 * Run with:
 *   npx tsx scripts/migrate-to-firebase.ts
 *
 * Requirements:
 *   - .env.local must have FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_DATABASE_URL
 *   - src/data/db.json must exist
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

async function migrate() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey || !process.env.FIREBASE_DATABASE_URL) {
    console.error("❌ Missing required environment variables.");
    console.error("   Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_DATABASE_URL are set in .env.local");
    process.exit(1);
  }

  // Initialize Firebase Admin
  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  const db = getDatabase(app);

  // Read local db.json
  const dbPath = path.join(process.cwd(), "src", "data", "db.json");
  if (!fs.existsSync(dbPath)) {
    console.error(`❌ db.json not found at: ${dbPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dbPath, "utf-8");
  const data = JSON.parse(rawData);

  console.log("📦 Uploading db.json to Firebase Realtime Database...");
  console.log(`   Project: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`   Database URL: ${process.env.FIREBASE_DATABASE_URL}`);

  // Write to /db node
  await db.ref("db").set(data);

  console.log("✅ Migration complete! Data is now in Firebase RTDB at /db");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
