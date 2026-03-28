import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type Props = {
  refreshing: boolean;
};

export default function RefreshControl({
  refreshing,
}: Props) {
  if (!refreshing) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.circle}>
        <ActivityIndicator
          animating
          color="#d40e0e"
          size="small"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    backgroundColor: '#fff',
    borderRadius: 360,
    elevation: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
});
