import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database, ref, get, set } from "firebase/database";
import { getStorage, FirebaseStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDzo-46PXtArxN--4Wsk0gUhE4g7Q_nhNo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "egreen-3759b.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://egreen-3759b-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "egreen-3759b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "egreen-3759b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "22575186913",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:22575186913:web:6e7606e75919dc475988a0",
};

/**
 * Checks whether Firebase configuration environment variables are provided.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    (firebaseConfig.databaseURL || firebaseConfig.projectId)
  );
}

/**
 * Checks whether Firebase Storage configuration is provided.
 */
export function isFirebaseStorageConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    (firebaseConfig.storageBucket || firebaseConfig.projectId)
  );
}

/**
 * Returns the initialized Firebase App instance or null if not configured.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  try {
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  } catch (err) {
    console.error("[FIREBASE APP INIT ERROR]:", err);
    return null;
  }
}

/**
 * Returns the Firebase Realtime Database instance.
 */
export function getFirebaseRealtimeDb(): Database | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getDatabase(app);
  } catch (err) {
    console.error("[FIREBASE REALTIME DB INIT ERROR]:", err);
    return null;
  }
}

/**
 * Returns the Firebase Storage instance.
 */
export function getFirebaseStorageInstance(): FirebaseStorage | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getStorage(app);
  } catch (err) {
    console.error("[FIREBASE STORAGE INIT ERROR]:", err);
    return null;
  }
}

/**
 * Reads database data from Firebase Realtime Database.
 * Uses both Firebase SDK and REST API fallback for maximum serverless compatibility.
 */
export async function readFromFirebaseDb<T>(dbPath: string = ""): Promise<T | null> {
  const cleanPath = dbPath.replace(/^\/+|\/+$/g, "");
  const databaseUrl = firebaseConfig.databaseURL || 
    (firebaseConfig.projectId ? `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com` : null);

  // Strategy 1: REST API (works flawlessly in all serverless environments & server actions)
  if (databaseUrl) {
    try {
      const url = `${databaseUrl}/${cleanPath ? `${cleanPath}.json` : ".json"}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        if (data !== null) {
          return data as T;
        }
      }
    } catch (restErr) {
      console.warn("[FIREBASE REST READ WARNING]:", restErr);
    }
  }

  // Strategy 2: Firebase JS SDK
  const db = getFirebaseRealtimeDb();
  if (db) {
    try {
      const dbRef = ref(db, cleanPath);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val() as T;
      }
    } catch (sdkErr) {
      console.error("[FIREBASE SDK READ ERROR]:", sdkErr);
    }
  }

  return null;
}

/**
 * Writes database data to Firebase Realtime Database.
 * Uses both Firebase REST API and SDK for maximum reliability.
 */
export async function writeToFirebaseDb<T>(dbPath: string = "", data: T): Promise<boolean> {
  const cleanPath = dbPath.replace(/^\/+|\/+$/g, "");
  const databaseUrl = firebaseConfig.databaseURL || 
    (firebaseConfig.projectId ? `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com` : null);

  // Strategy 1: REST API PUT (fast and direct on serverless)
  if (databaseUrl) {
    try {
      const url = `${databaseUrl}/${cleanPath ? `${cleanPath}.json` : ".json"}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return true;
      }
      console.warn(`[FIREBASE REST WRITE STATUS]: ${response.status} ${response.statusText}`);
    } catch (restErr) {
      console.warn("[FIREBASE REST WRITE WARNING]:", restErr);
    }
  }

  // Strategy 2: Firebase JS SDK
  const db = getFirebaseRealtimeDb();
  if (db) {
    try {
      const dbRef = ref(db, cleanPath);
      await set(dbRef, data);
      return true;
    } catch (sdkErr) {
      console.error("[FIREBASE SDK WRITE ERROR]:", sdkErr);
    }
  }

  return false;
}

/**
 * Uploads an image to Firebase Storage and returns the public download URL.
 */
export async function uploadToFirebaseStorage(
  fileBuffer: Uint8Array | ArrayBuffer | Blob,
  filename: string,
  contentType: string = "image/jpeg",
  folder: string = "general"
): Promise<{ success: boolean; url?: string; error?: string }> {
  const storage = getFirebaseStorageInstance();
  if (!storage) {
    return { success: false, error: "Firebase Storage is not configured." };
  }

  try {
    const timestamp = Date.now();
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileRef = storageRef(storage, `uploads/${folder}/${timestamp}_${sanitizedName}`);

    await uploadBytes(fileRef, fileBuffer, {
      contentType,
    });

    const downloadURL = await getDownloadURL(fileRef);
    return {
      success: true,
      url: downloadURL,
    };
  } catch (err) {
    const error = err as Error;
    console.error("[FIREBASE STORAGE UPLOAD ERROR]:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image to Firebase Storage",
    };
  }
}
