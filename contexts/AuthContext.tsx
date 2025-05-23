import { connect } from '@stantanasi/jsonapi-client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { User } from '../models';
import { useAppDispatch } from '../redux/store';

interface IAuthContext {
  isReady: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    isAdmin: boolean;
  } | null;
  register: (pseudo: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<IAuthContext>({
  isReady: false,
  isAuthenticated: false,
  user: null,
  register: async () => { },
  login: async () => { },
  logout: async () => { },
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<IAuthContext['user']>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const tokenResult = await currentUser?.getIdTokenResult();

      connect({
        baseURL: 'https://api-za7rwcomoa-uc.a.run.app',
        headers: {
          ...(tokenResult ? { Authorization: `Bearer ${tokenResult.token}` } : {}),
        },
        params: {
          language: 'fr-FR',
        },
      });

      setUser(currentUser && tokenResult ? {
        id: currentUser.uid,
        isAdmin: tokenResult.claims['isAdmin'] as boolean,
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

        register: async (pseudo, email, password) => {
          const user = new User({
            pseudo: pseudo,
            email: email,
            password: password,
          });
          await user.save();

          await signInWithEmailAndPassword(auth, email, password);

          dispatch(User.redux.actions.saveOne(user));
        },

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