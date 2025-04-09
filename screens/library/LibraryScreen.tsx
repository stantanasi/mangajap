import { StaticScreenProps } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = StaticScreenProps<{
  type: 'anime-library' | 'manga-library' | 'anime-favorites' | 'manga-favorites';
  userId: string;
}>;

export default function LibraryScreen({ route }: Props) {
  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
