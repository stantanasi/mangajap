import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Anime } from '../../models';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const [anime, setAnime] = useState<Anime>();

  useEffect(() => {
    Anime.findById(route.params.id)
      .then((anime) => setAnime(anime));
  }, []);

  if (!anime) {
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
      <Text>{anime.title}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
