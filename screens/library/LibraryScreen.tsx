import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, AnimeEntry, MangaEntry, User } from '../../models';

type Props = StaticScreenProps<{
  userId: string;
}>;

export default function LibraryScreen({ route }: Props) {
  const navigation = useNavigation();
  const state = navigation.getState()!;
  const routeName = state.routes.at(state.index)?.name as keyof ReactNavigation.RootParamList;
  const [library, setLibrary] = useState<(AnimeEntry | MangaEntry)[]>();

  const type = routeName === 'ProfileAnimeLibrary' ? 'anime-library'
    : routeName === 'ProfileAnimeFavorites' ? 'anime-favorites'
      : routeName === 'ProfileMangaLibrary' ? 'manga-library'
        : routeName === 'ProfileMangaFavorites' ? 'manga-favorites'
          : null;

  useEffect(() => {
    const prepare = async () => {
      if (type === 'anime-library') {
        const animeLibrary = await User.findById(route.params.userId).get('anime-library')
          .include({ anime: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        setLibrary(animeLibrary);
      } else if (type === 'anime-favorites') {
        const animeFavorites = await User.findById(route.params.userId).get('anime-favorites')
          .include({ anime: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        setLibrary(animeFavorites);
      } else if (type === 'manga-library') {
        const mangaLibrary = await User.findById(route.params.userId).get('manga-library')
          .include({ manga: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        setLibrary(mangaLibrary);
      } else if (type === 'manga-favorites') {
        const mangaFavorites = await User.findById(route.params.userId).get('manga-favorites')
          .include({ manga: true })
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
      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color="#000"
          size={24}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else if (typeof window !== 'undefined') {
              window.history.back();
            }
          }}
          style={{
            padding: 12,
          }}
        />

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: 'bold',
            padding: 12,
          }}
        >
          {type === 'anime-library' ? 'Animé'
            : type === 'anime-favorites' ? 'Animé favoris'
              : type === 'manga-library' ? 'Manga'
                : type === 'manga-favorites' ? 'Manga favoris'
                  : ''}
        </Text>
      </View>

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
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
              showCheckbox={false}
              style={{
                flex: 1 / 3,
              }}
            />
          ) : (
            <MangaCard
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
              showCheckbox={false}
              style={{
                flex: 1 / 3,
              }}
            />
          )
        )}
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
