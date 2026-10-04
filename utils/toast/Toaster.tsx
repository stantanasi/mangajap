import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { ToastProps } from './Toast';
import { store } from './toast-store';

export default function Toaster() {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const unsubscribe = store.subscribe((toast) => {
      setToasts((prev) => [...prev, toast].slice(-3));
    });

    return () => unsubscribe();
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, {
        bottom: insets.bottom + 16,
      },]}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          duration={4_000}
          {...toast}
          onDismiss={(id) => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            toast.onDismiss?.(id);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    elevation: 99999,
    gap: 8,
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
});