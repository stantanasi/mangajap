import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, AnimeEntry, MangaEntry, User } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';

type Props = StaticScreenProps<{
  type: 'anime-library' | 'manga-library' | 'anime-favorites' | 'manga-favorites';
  userId: string;
}>;

export default function LibraryScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isLoading, library } = useLibrary(route.params);

  if (isLoading || !library) {
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
          {route.params.type === 'anime-library' ? 'Anime'
            : route.params.type === 'anime-favorites' ? 'Anime préférés'
              : route.params.type === 'manga-library' ? 'Manga'
                : route.params.type === 'manga-favorites' ? 'Manga préférés'
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


const useLibrary = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const library = useAppSelector((state) => {
    if (params.type === 'anime-library') {
      return User.redux.selectors.selectRelation(params.userId, 'anime-library', {
        include: {
          anime: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      })(state);
    } else if (params.type === 'anime-favorites') {
      return User.redux.selectors.selectRelation(params.userId, 'anime-favorites', {
        include: {
          anime: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      })(state);
    } else if (params.type === 'manga-library') {
      return User.redux.selectors.selectRelation(params.userId, 'manga-library', {
        include: {
          manga: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      })(state);
    } else if (params.type === 'manga-favorites') {
      return User.redux.selectors.selectRelation(params.userId, 'manga-favorites', {
        include: {
          manga: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      })(state);
    }

    return undefined;
  });

  useEffect(() => {
    const prepare = async () => {
      if (params.type === 'anime-library') {
        const animeLibrary = await User.findById(params.userId).get('anime-library')
          .include({ anime: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(AnimeEntry.redux.actions.setMany(animeLibrary));
        dispatch(User.redux.actions.relations['anime-library'].set(params.userId, animeLibrary));
      } else if (params.type === 'anime-favorites') {
        const animeFavorites = await User.findById(params.userId).get('anime-favorites')
          .include({ anime: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(AnimeEntry.redux.actions.setMany(animeFavorites));
        dispatch(User.redux.actions.relations['anime-favorites'].set(params.userId, animeFavorites));
      } else if (params.type === 'manga-library') {
        const mangaLibrary = await User.findById(params.userId).get('manga-library')
          .include({ manga: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(MangaEntry.redux.actions.setMany(mangaLibrary));
        dispatch(User.redux.actions.relations['manga-library'].set(params.userId, mangaLibrary));
      } else if (params.type === 'manga-favorites') {
        const mangaFavorites = await User.findById(params.userId).get('manga-favorites')
          .include({ manga: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(MangaEntry.redux.actions.setMany(mangaFavorites));
        dispatch(User.redux.actions.relations['manga-favorites'].set(params.userId, mangaFavorites));
      }
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, library };
};
