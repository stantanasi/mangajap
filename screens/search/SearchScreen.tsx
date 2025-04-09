import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeSearchCard from '../../components/molecules/AnimeSearchCard';
import MangaSearchCard from '../../components/molecules/MangaSearchCard';
import UserSearchCard from '../../components/molecules/UserSearchCard';
import { Anime, Manga, User } from '../../models';

const AnimeTab = ({ isLoading, list, onLoadMore, hasMore, style }: {
  isLoading: boolean;
  list: Anime[];
  onLoadMore: () => void;
  hasMore: boolean;
  style?: ViewStyle;
}) => {
  const navigation = useNavigation();

  return (
    <View style={style}>
      {isLoading ? (
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AnimeSearchCard
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
              style={{
                marginHorizontal: 16,
              }}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#ccc',
                marginVertical: 8,
              }}
            />
          )}
          ListFooterComponent={() => (
            hasMore ? (
              <View style={{ marginVertical: 12 }}>
                <ActivityIndicator
                  animating
                  color="#000"
                />
              </View>
            ) : null
          )}
          onEndReached={() => onLoadMore()}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

const MangaTab = ({ isLoading, list, onLoadMore, hasMore, style }: {
  isLoading: boolean;
  list: Manga[];
  onLoadMore: () => void;
  hasMore: boolean;
  style?: ViewStyle;
}) => {
  const navigation = useNavigation();

  return (
    <View style={style}>
      {isLoading ? (
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MangaSearchCard
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
              style={{
                marginHorizontal: 16,
              }}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#ccc',
                marginVertical: 8,
              }}
            />
          )}
          ListFooterComponent={() => (
            hasMore ? (
              <View style={{ marginVertical: 12 }}>
                <ActivityIndicator
                  animating
                  color="#000"
                />
              </View>
            ) : null
          )}
          onEndReached={() => onLoadMore()}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

const UserTab = ({ isLoading, list, onLoadMore, hasMore, style }: {
  isLoading: boolean;
  list: User[];
  onLoadMore: () => void;
  hasMore: boolean;
  style?: ViewStyle;
}) => {
  const navigation = useNavigation();

  return (
    <View style={style}>
      {isLoading ? (
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserSearchCard
              user={item}
              onPress={() => navigation.navigate('Profile', { id: item.id })}
              style={{
                marginHorizontal: 16,
              }}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#ccc',
                marginVertical: 8,
              }}
            />
          )}
          ListFooterComponent={() => (
            hasMore ? (
              <View style={{ marginVertical: 12 }}>
                <ActivityIndicator
                  animating
                  color="#000"
                />
              </View>
            ) : null
          )}
          onEndReached={() => onLoadMore()}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};


type Props = StaticScreenProps<{}>;

export default function SearchScreen({ route }: Props) {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [animeTab, setAnimeTab] = useState<{
    isLoading: boolean;
    list: Anime[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ isLoading: true, list: [], isLoadingMore: false, offset: 0, hasMore: true });
  const [mangaTab, setMangaTab] = useState<{
    isLoading: boolean;
    list: Manga[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ isLoading: true, list: [], isLoadingMore: false, offset: 0, hasMore: true });
  const [userTab, setUserTab] = useState<{
    isLoading: boolean;
    list: User[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ isLoading: true, list: [], isLoadingMore: false, offset: 0, hasMore: true });

  const categories = [
    { label: 'Anime', value: 'anime' },
    { label: 'Manga', value: 'manga' },
    { label: 'Utilisateurs', value: 'users' },
  ] as const;
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]['value']>('anime');

  const search = async (query: string) => {
    setAnimeTab((prev) => ({ ...prev, isLoading: true }));
    setMangaTab((prev) => ({ ...prev, isLoading: true }));
    setUserTab((prev) => ({ ...prev, isLoading: true }));

    const [animes, mangas, users] = await Promise.all([
      Anime.find({ query: query })
        .sort({ popularity: 'desc' }),
      Manga.find({ query: query })
        .sort({ popularity: 'desc' }),
      query !== ''
        ? User.find({ query: query })
          .sort({ followersCount: 'desc' })
        : [],
    ]);

    setActiveQuery(query);
    setAnimeTab({
      isLoading: false,
      list: animes,
      isLoadingMore: false,
      offset: 0,
      hasMore: animes.length !== 0,
    });
    setMangaTab({
      isLoading: false,
      list: mangas,
      isLoadingMore: false,
      offset: 0,
      hasMore: mangas.length !== 0,
    });
    setUserTab({
      isLoading: false,
      list: users,
      isLoadingMore: false,
      offset: 0,
      hasMore: users.length !== 0,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      search(query)
        .catch((err) => console.error(err));
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          autoFocus
          value={query}
          onChangeText={(text) => {
            setQuery(text);

            setAnimeTab((prev) => ({ ...prev, isLoading: true }));
            setMangaTab((prev) => ({ ...prev, isLoading: true }));
            setUserTab((prev) => ({ ...prev, isLoading: true }));
          }}
          onSubmitEditing={() => {
            search(query)
              .catch((err) => console.error(err));
          }}
          placeholder="Rechercher"
          placeholderTextColor="#a1a1a1"
          style={styles.search}
        />

        <ScrollView
          horizontal
          contentContainerStyle={{
            gap: 10,
            paddingHorizontal: 16,
          }}
        >
          {categories.map((category) => {
            const isSelected = category.value === selectedCategory;
            return (
              <Text
                key={category.value}
                onPress={() => setSelectedCategory(category.value)}
                style={{
                  backgroundColor: !isSelected ? '#e5e5e5' : '#4281f5',
                  borderRadius: 360,
                  color: !isSelected ? '#000' : '#fff',
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                }}
              >
                {category.label}
              </Text>
            );
          })}
        </ScrollView>
      </View>

      <AnimeTab
        isLoading={animeTab.isLoading}
        list={animeTab.list}
        onLoadMore={() => {
          const loadMore = async () => {
            if (!animeTab.hasMore || animeTab.isLoadingMore) return

            setAnimeTab((prev) => ({ ...prev, isLoadingMore: true }));

            const animes = await Anime.find({ query: activeQuery })
              .sort({ popularity: 'desc' })
              .offset(animeTab.offset + 10);

            if (animes.length === 0) {
              setAnimeTab((prev) => ({ ...prev, isLoadingMore: false, hasMore: false }));
            } else {
              setAnimeTab((prev) => ({
                ...prev,
                list: prev.list.concat(animes),
                isLoadingMore: false,
                offset: prev.offset + 10,
                hasMore: true,
              }));
            }
          };

          loadMore()
            .catch((err) => console.error(err));
        }}
        hasMore={animeTab.hasMore}
        style={{
          display: selectedCategory === 'anime' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <MangaTab
        isLoading={mangaTab.isLoading}
        list={mangaTab.list}
        onLoadMore={() => {
          const loadMore = async () => {
            if (!mangaTab.hasMore || mangaTab.isLoadingMore) return

            setMangaTab((prev) => ({ ...prev, isLoadingMore: true }));

            const mangas = await Manga.find({ query: activeQuery })
              .sort({ popularity: 'desc' })
              .offset(mangaTab.offset + 10);

            if (mangas.length === 0) {
              setMangaTab((prev) => ({ ...prev, isLoadingMore: false, hasMore: false }));
            } else {
              setMangaTab((prev) => ({
                ...prev,
                list: prev.list.concat(mangas),
                isLoadingMore: false,
                offset: prev.offset + 10,
                hasMore: true,
              }));
            }
          };

          loadMore()
            .catch((err) => console.error(err));
        }}
        hasMore={mangaTab.hasMore}
        style={{
          display: selectedCategory === 'manga' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <UserTab
        isLoading={userTab.isLoading}
        list={userTab.list}
        onLoadMore={() => {
          const loadMore = async () => {
            if (!userTab.hasMore || userTab.isLoadingMore) return

            setUserTab((prev) => ({ ...prev, isLoadingMore: true }));

            const users = await User.find({ query: activeQuery })
              .sort({ followersCount: 'desc' })
              .offset(userTab.offset + 10);

            if (users.length === 0) {
              setUserTab((prev) => ({ ...prev, isLoadingMore: false, hasMore: false }));
            } else {
              setUserTab((prev) => ({
                ...prev,
                list: prev.list.concat(users),
                isLoadingMore: false,
                offset: prev.offset + 10,
                hasMore: true,
              }));
            }
          };

          loadMore()
            .catch((err) => console.error(err));
        }}
        hasMore={userTab.hasMore}
        style={{
          display: selectedCategory === 'users' ? 'flex' : 'none',
          flex: 1,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 10,
    paddingBottom: 10,
    paddingTop: 16,
  },
  search: {
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 16,
  },
});