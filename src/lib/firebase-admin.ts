import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getDatabase, Database } from "firebase-admin/database";

let app: App;
let rtdb: Database;

function getFirebaseAdmin(): { app: App; rtdb: Database } {
  if (!app) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

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
