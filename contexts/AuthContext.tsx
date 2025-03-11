import { connect } from "@stantanasi/jsonapi-client";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { auth } from "../firebaseConfig";

interface IAuthContext {
  isReady: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    token: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<IAuthContext>({
  isReady: false,
  isAuthenticated: false,
  user: null,
  login: async () => { },
  logout: async () => { },
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<IAuthContext['user']>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const token = await user?.getIdToken();

      connect({
        baseURL: 'https://api-za7rwcomoa-uc.a.run.app',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      setUser(user ? {
        id: user.uid,
        token: token!,
      } : null);

      setIsReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isReady: isReady,
        isAuthenticated: !!user,
        user: user,

        login: async (email, password) => {
          await signInWithEmailAndPassword(auth, email, password);
        },

        logout: async () => {
          await signOut(auth);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};