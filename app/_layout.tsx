import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { Image, Platform, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppProvider, { useAppContext } from '../contexts/AppContext';
import AuthProvider, { useAuthContext } from '../contexts/AuthContext';
import store, { persistor } from '../redux/store';
import Toaster from '../utils/toast/Toaster';

function RootContent() {
  const { isReady: isAppReady, isOffline: isAppOffline } = useAppContext();
  const { isReady: isAuthReady } = useAuthContext();

  const onLayoutRootView = useCallback(() => {
    if (isAuthReady && isAppReady) {
      SplashScreen.hide();
    }
  }, [isAuthReady, isAppReady]);

  if (!isAuthReady || !isAppReady) {
    if (Platform.OS === 'web') {
      return (
        <Image
          source={require('../assets/splash.png')}
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
          }}
        />
      );
    } else {
      return null;
    }
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }} />

      {isAppOffline && (
        <View
          style={{
            backgroundColor: '#d40e0e',
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              padding: 3,
              textAlign: 'center',
            }}
          >
            Vous êtes en mode hors connexion
          </Text>
        </View>
      )}
      <Toaster />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProvider>
          <AuthProvider>
            <RootContent />
          </AuthProvider>
        </AppProvider>
      </PersistGate>
    </Provider>
  );
}