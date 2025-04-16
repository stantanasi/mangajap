import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, AnimeEntry, MangaEntry, User } from '../../models';

type Props = StaticScreenProps<{
  type: 'anime-library' | 'manga-library' | 'anime-favorites' | 'manga-favorites';
  userId: string;
}>;

export default function LibraryScreen({ route }: Props) {
  const navigation = useNavigation();
  const [library, setLibrary] = useState<(AnimeEntry | MangaEntry)[]>();

  useEffect(() => {
    const prepare = async () => {
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
      } else if (route.params.type === 'manga-favorites') {
        const mangaFavorites = await User.findById(route.params.userId).get('manga-favorites')
          .include(['manga'])
          .sort({ updatedAt: 'desc' })
          .limit(500);

        setLibrary(mangaFavorites);
      } else {
        throw Error('Library type not supported');
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!library) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
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
      <FlatList
        data={library.map((entry) => {
          if (entry instanceof AnimeEntry) {
            return entry.anime!.copy({
              'anime-entry': entry,
            });
          } else {
            return entry.manga!.copy({
              'manga-entry': entry,
            });
          }
        })}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item instanceof Anime ? (
            <AnimeCard
              screen="library"
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
              style={{
                flex: 1 / 3,
              }}
            />
          ) : (
            <MangaCard
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
              style={{
                flex: 1 / 3,
              }}
            />
          )
        )}
        ListHeaderComponent={() => <View style={{ height: 16 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 16 }} />}
        numColumns={3}
        columnWrapperStyle={{ gap: 10, paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
