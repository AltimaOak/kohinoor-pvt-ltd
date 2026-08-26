import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getDatabase, Database } from "firebase-admin/database";

let app: App;
let rtdb: Database;

/**
 * Normalizes the FIREBASE_PRIVATE_KEY env variable into a valid PEM key string.
 *
 * Vercel can store env vars in different ways depending on how the key was pasted:
 * - Multi-line (actual newlines) — Vercel wraps in quotes on output, Node reads as real \n
 * - Single-line with literal \n  — needs .replace(/\\n/g, '\n')
 * - Single-line with \\n (double escaped) — needs double replace
 *
 * This function handles all cases.
 */
function normalizePrivateKey(raw: string): string {
  // Strip wrapping quotes if any
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }

  // If the key already contains real newlines, return as-is
  if (key.includes("\n")) {
    return key;
  }

  // Replace literal \n sequences (single or double escaped)
  return key.replace(/\\n/g, "\n");
}

function getFirebaseAdmin(): { app: App; rtdb: Database } {
  if (!app) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      const rawKey = process.env.FIREBASE_PRIVATE_KEY;
      const privateKey = rawKey ? normalizePrivateKey(rawKey) : undefined;

      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        throw new Error(
          "Missing Firebase Admin SDK environment variables. " +
          "Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set."
        );
      }

      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }
  }

  if (!rtdb) {
    rtdb = getDatabase(app);
  }

  return { app, rtdb };
}

/**
 * Returns an initialized Firebase Realtime Database instance (server-side only).
 * Uses a singleton pattern so only one Admin SDK instance is created per process.
 */
export function getAdminRtdb(): Database {
  return getFirebaseAdmin().rtdb;
}
