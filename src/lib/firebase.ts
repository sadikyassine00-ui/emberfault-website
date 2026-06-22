import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig, "EMBERFAULT");
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL

// Lazy auth: firebase/auth chunk only loaded when admin dashboard is accessed
let _auth: ReturnType<typeof import('firebase/auth').getAuth> | null = null;
export async function getAuthLazy() {
  if (!_auth) {
    const { getAuth } = await import('firebase/auth');
    _auth = getAuth(app);
  }
  return _auth;
}
