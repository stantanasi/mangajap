import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface IAuthContext {
  isReady: boolean;
  isAuthenticated: boolean;
  user: {} | null;
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
    async function prepare() {
    };

    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsReady(true));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isReady: isReady,
        isAuthenticated: !!user,
        user: user,

        login: async (email, password) => {
        },

        logout: async () => {
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};