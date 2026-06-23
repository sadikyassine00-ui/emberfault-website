import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getDbLazy, getAuthLazy } from "../firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const auth = await getAuthLazy();
      const { onAuthStateChanged } = await import("firebase/auth");
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          const { doc, getDoc, setDoc } = await import("firebase/firestore");
          const db = await getDbLazy();
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            try {
              await setDoc(userRef, {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || "Unknown Operator",
                role: "user"
              });
            } catch (e) {
              console.error("Error creating user profile", e);
            }
          }
        }
        setLoading(false);
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const auth = await getAuthLazy();
    const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Auth Error", error);
    }
  };

  const logout = async () => {
    const auth = await getAuthLazy();
    const { signOut } = await import("firebase/auth");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out Error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
