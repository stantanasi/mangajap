import { StaticScreenProps } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../components/atoms/SearchBar';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, Manga, People, User } from '../../models';
import AnimeTab from './tabs/AnimeTab';
import MangaTab from './tabs/MangaTab';
import PeopleTab from './tabs/PeopleTab';
import UserTab from './tabs/UserTab';

type Props = StaticScreenProps<undefined>;

export default function SearchScreen({ route }: Props) {
  const { isAuthenticated } = useContext(AuthContext);
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
  const [peopleTab, setPeopleTab] = useState<{
    isLoading: boolean;
    list: People[];
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
    { label: 'Personnalités', value: 'people' },
    { label: 'Utilisateurs', value: 'users' },
  ] as const;
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]['value']>('anime');

  const search = async (query: string) => {
    setAnimeTab((prev) => ({ ...prev, isLoading: true }));
    setMangaTab((prev) => ({ ...prev, isLoading: true }));
    setPeopleTab((prev) => ({ ...prev, isLoading: true }));
    setUserTab((prev) => ({ ...prev, isLoading: true }));

    const [animes, mangas, peoples, users] = await Promise.all([
      Anime.find({ query: query })
        .include({
          'anime-entry': isAuthenticated,
        })
        .sort({ popularity: 'desc' }),
      Manga.find({ query: query })
        .include({
          'manga-entry': isAuthenticated,
        })
        .sort({ popularity: 'desc' }),
      People.find({ query: query }),
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
    setPeopleTab({
      isLoading: false,
      list: peoples,
      isLoadingMore: false,
      offset: 0,
      hasMore: peoples.length !== 0,
    });
    setUserTab({
      isLoading: false,
      list: users,
      isLoadingMore: false,
      offset: 0,
      hasMore: users.length !== 0,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          autoFocus
          onChangeText={() => {
            setAnimeTab((prev) => ({ ...prev, isLoading: true }));
            setMangaTab((prev) => ({ ...prev, isLoading: true }));
            setPeopleTab((prev) => ({ ...prev, isLoading: true }));
            setUserTab((prev) => ({ ...prev, isLoading: true }));
          }}
          onSearch={(query) => {
            search(query)
              .catch((err) => console.error(err));
          }}
          delay={500}
          style={{
            marginHorizontal: 16,
          }}
        />

        <ScrollView
          horizontal
          keyboardShouldPersistTaps="always"
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
        onItemChange={(item) => {
          setAnimeTab((prev) => ({
            ...prev,
            list: prev.list.map((it) => it.id === item.id ? item : it),
          }));
        }}
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
        onItemChange={(item) => {
          setMangaTab((prev) => ({
            ...prev,
            list: prev.list.map((it) => it.id === item.id ? item : it),
          }));
        }}
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

      <PeopleTab
        isLoading={peopleTab.isLoading}
        list={peopleTab.list}
        onLoadMore={() => {
          const loadMore = async () => {
            if (!peopleTab.hasMore || peopleTab.isLoadingMore) return

            setPeopleTab((prev) => ({ ...prev, isLoadingMore: true }));

            const peoples = await People.find({ query: activeQuery })
              .offset(peopleTab.offset + 10);

            if (peoples.length === 0) {
              setPeopleTab((prev) => ({ ...prev, isLoadingMore: false, hasMore: false }));
            } else {
              setPeopleTab((prev) => ({
                ...prev,
                list: prev.list.concat(peoples),
                isLoadingMore: false,
                offset: prev.offset + 10,
                hasMore: true,
              }));
            }
          };

          loadMore()
            .catch((err) => console.error(err));
        }}
        hasMore={peopleTab.hasMore}
        style={{
          display: selectedCategory === 'people' ? 'flex' : 'none',
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
});