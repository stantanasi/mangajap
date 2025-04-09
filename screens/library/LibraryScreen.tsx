import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimeEntry, MangaEntry, User } from '../../models';

type Props = StaticScreenProps<{
  type: 'anime-library' | 'manga-library' | 'anime-favorites' | 'manga-favorites';
  userId: string;
}>;

export default function LibraryScreen({ route }: Props) {
  const [library, setLibrary] = useState<(AnimeEntry | MangaEntry)[]>();

  useEffect(() => {
    const prepare = async () => {
      setLibrary(undefined);

      if (route.params.type === 'anime-library') {
        const animeLibrary = await User.findById(route.params.userId).get('anime-library')
          .include(['anime'])
          .sort({ updatedAt: 'desc' })
          .limit(500);

        setLibrary(animeLibrary);
      } else if (route.params.type === 'anime-favorites') {
        const animeFavorites = await User.findById(route.params.userId).get('anime-favorites')
          .include(['anime'])
          .sort({ updatedAt: 'desc' })
          .limit(500);

        setLibrary(animeFavorites);
      } else if (route.params.type === 'manga-library') {
        const mangaLibrary = await User.findById(route.params.userId).get('manga-library')
          .include(['manga'])
          .sort({ updatedAt: 'desc' })
          .limit(500);

        setLibrary(mangaLibrary);
      } else {
        const mangaFavorites = await User.findById(route.params.userId).get('manga-favorites')
          .include(['manga'])
          .sort({ updatedAt: 'desc' })
          .limit(500);

        setLibrary(mangaFavorites);
      }
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
