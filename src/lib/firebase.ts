import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from "firebase/firestore";
import { FirebaseConfig } from "../types";

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

export function initFirebase(config: FirebaseConfig): { app: FirebaseApp; db: Firestore } {
  if (getApps().length === 0) {
    appInstance = initializeApp(config);
  } else {
    appInstance = getApp();
  }
  firestoreInstance = getFirestore(appInstance);
  return { app: appInstance, db: firestoreInstance };
}

export function getFirebaseDb(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;
  if (getApps().length > 0) {
    firestoreInstance = getFirestore(getApp());
    return firestoreInstance;
  }
  return null;
}

export async function saveContactMessageToFirestore(
  config: FirebaseConfig,
  data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }
) {
  const { db } = initFirebase(config);
  const messagesCol = collection(db, "contact_messages");
  const docRef = await addDoc(messagesCol, {
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    message: data.message,
    source: "SKEDZ-S.PORTAL",
    createdAt: serverTimestamp(),
    timestampISO: new Date().toISOString(),
  });
  return docRef.id;
}
