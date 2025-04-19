import { StaticScreenProps } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = StaticScreenProps<{
  id: string;
} | undefined>

export default function AnimeSaveScreen({ route }: Props) {
  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
