import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig, "EMBERFAULT");

// Firestore removed. Using Neon Postgres for database.

// Lazy auth: firebase/auth chunk only loaded when admin dashboard is accessed
let _auth: ReturnType<typeof import('firebase/auth').getAuth> | null = null;
export async function getAuthLazy() {
  if (!_auth) {
    const { getAuth } = await import('firebase/auth');
    _auth = getAuth(app);
  }
  return _auth;
}
