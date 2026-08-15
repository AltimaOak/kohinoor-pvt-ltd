/**
 * Firebase Realtime Database-backed database layer.
 * Replaces the local fs-based db.json with a persistent RTDB node.
 *
 * Data is stored at the root path: /db
 *
 * This mirrors the existing flat db.json structure exactly,
 * so all existing action logic in actions.ts stays unchanged.
 */

import { getAdminRtdb } from "./firebase-admin";
import type { DatabaseSchema } from "@/app/actions";

const DB_REF = "db";

/**
 * Read the entire database from Firebase Realtime Database.
 * Returns an empty schema shell if the node doesn't exist yet.
 */
export async function getDbFromFirestore(): Promise<DatabaseSchema> {
  const rtdb = getAdminRtdb();
  const snapshot = await rtdb.ref(DB_REF).get();

  if (!snapshot.exists()) {
    // Return empty shell — first write will initialize it
    const empty: DatabaseSchema = {
      events: [],
      services: [],
      photos: [],
      contacts: {
        siteAddress: "",
        siteAddressMapLink: "",
        managers: [],
      },
      doctors: [],
      bookings: [],
      nursery: {
        description: "",
        location: "",
        timing: "",
        contact: "",
        plants: [],
        orders: [],
      },
      cafeteria: {
        description: "",
        location: "",
        timing: "",
        contact: "",
        menu: [],
        orders: [],
      },
      receipts: [],
      orders: [],
      receiptLogs: [],
    };
    return empty;
  }

  const data = snapshot.val() as DatabaseSchema;

  // RTDB stores arrays as objects with numeric keys — convert back to arrays
  return normalizeArrays(data) as DatabaseSchema;
}

/**
 * Write the entire database back to Firebase Realtime Database.
 * Uses set() to fully replace the /db node.
 */
export async function writeDbToFirestore(data: DatabaseSchema): Promise<void> {
  const rtdb = getAdminRtdb();
  // Strip undefined values (RTDB doesn't accept them)
  const clean = JSON.parse(JSON.stringify(data));
  await rtdb.ref(DB_REF).set(clean);
}

/**
 * Recursively convert RTDB object-with-numeric-keys back into proper arrays.
 * Firebase RTDB stores arrays as { "0": ..., "1": ... } objects.
 */
function normalizeArrays(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(normalizeArrays);
  if (typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    const keys = Object.keys(record);
    // If all keys are numeric strings, treat as array
    const isArray = keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
    if (isArray) {
      const arr: unknown[] = [];
      keys.sort((a, b) => Number(a) - Number(b)).forEach((k) => {
        arr.push(normalizeArrays(record[k]));
      });
      return arr;
    }
    // Otherwise treat as object
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      result[key] = normalizeArrays(record[key]);
    }
    return result;
  }
  return obj;
}
