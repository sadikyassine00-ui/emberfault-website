import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig, "EMBERFAULT");

// Lazy firestore: firebase/firestore chunk only loaded when database is accessed
let _db: ReturnType<typeof import('firebase/firestore').getFirestore> | null = null;
export async function getDbLazy() {
  if (!_db) {
    const { getFirestore } = await import('firebase/firestore');
    _db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
  return _db;
}

// Lazy auth: firebase/auth chunk only loaded when admin dashboard is accessed
let _auth: ReturnType<typeof import('firebase/auth').getAuth> | null = null;
export async function getAuthLazy() {
  if (!_auth) {
    const { getAuth } = await import('firebase/auth');
    _auth = getAuth(app);
  }
  return _auth;
}
