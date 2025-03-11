import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Manga } from '../../models';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function MangaScreen({ route }: Props) {
  const [manga, setManga] = useState<Manga>();

  useEffect(() => {
    Manga.findById(route.params.id)
      .then((manga) => setManga(manga));
  }, []);

  if (!manga) {
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>{manga.title}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
