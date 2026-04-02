import NetInfo from '@react-native-community/netinfo';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface IAppContext {
  isReady: boolean;
  isOffline: boolean;
}

export const AppContext = createContext<IAppContext>({
  isReady: false,
  isOffline: true,
});

export default function AppProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isReady: isReady,
        isOffline: isOffline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}


export const useApp = () => useContext(AppContext);
