import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function LoadingScreen({ style }: Props) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <ActivityIndicator
        animating
        color="#000"
        size="large"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
