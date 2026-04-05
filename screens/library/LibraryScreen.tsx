import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GridList from '../../components/atoms/GridList';
import RefreshControl from '../../components/atoms/RefreshControl';
import AnimeCard from '../../components/molecules/AnimeCard';
import Header from '../../components/molecules/Header';
import MangaCard from '../../components/molecules/MangaCard';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { Anime, AnimeEntry } from '../../models';
import { useLibrary } from './hooks/useLibrary';

type Props = StaticScreenProps<{
  type: 'anime-library' | 'manga-library' | 'anime-favorites' | 'manga-favorites';
  userId: string;
}>;

export default function LibraryScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isLoading, library } = useLibrary(route.params);

  if (!library) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={route.params.type === 'anime-library' ? 'Anime'
          : route.params.type === 'anime-favorites' ? 'Anime préférés'
            : route.params.type === 'manga-library' ? 'Manga'
              : route.params.type === 'manga-favorites' ? 'Manga préférés'
                : ''}
      />

      <GridList
        data={library.map((entry) => {
          if (entry instanceof AnimeEntry) {
            return entry.anime?.copy({
              'anime-entry': entry,
            });
          } else {
            return entry.manga?.copy({
              'manga-entry': entry,
            });
          }
        }).filter((media) => !!media)}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item instanceof Anime ? (
            <AnimeCard
              isLoading={isLoading}
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
              showCheckbox={false}
              style={{ width: null }}
            />
          ) : (
            <MangaCard
              isLoading={isLoading}
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
              showCheckbox={false}
              style={{ width: null }}
            />
          )
        )}
        ListHeaderComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={() => <View style={{ height: 16 }} />}
        gap={10}
        contentPadding={16}
      />

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
