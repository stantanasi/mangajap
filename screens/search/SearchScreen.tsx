import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../components/atoms/SearchBar';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, Manga, People, User } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import AnimeTab from './tabs/AnimeTab';
import MangaTab from './tabs/MangaTab';
import PeopleTab from './tabs/PeopleTab';
import UserTab from './tabs/UserTab';

type Props = StaticScreenProps<undefined>;

export default function SearchScreen({ route }: Props) {
  const navigation = useNavigation();
  const { animeTab, mangaTab, peopleTab, userTab } = useSearch();

  const categories = [
    { label: 'Anime', value: 'anime' },
    { label: 'Manga', value: 'manga' },
    { label: 'Personnalités', value: 'people' },
    { label: 'Utilisateurs', value: 'users' },
  ] as const;
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]['value']>('anime');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
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

          <SearchBar
            autoFocus
            onChangeText={() => {
              animeTab.onChangeQuery();
              mangaTab.onChangeQuery();
              peopleTab.onChangeQuery();
              userTab.onChangeQuery();
            }}
            onSearch={(query) => {
              Promise.all([
                animeTab.search(query),
                mangaTab.search(query),
                peopleTab.search(query),
                userTab.search(query),
              ])
                .catch((err) => console.error(err));
            }}
            delay={500}
            style={{
              flex: 1,
              marginRight: 16,
            }}
          />
        </View>

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
        onLoadMore={() => {
          animeTab.loadMore()
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
          mangaTab.loadMore()
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
          peopleTab.loadMore()
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
          userTab.loadMore()
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
  },
});


const useSearch = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useContext(AuthContext);
  const [animeTab, setAnimeTab] = useState<{
    activeQuery: string;
    isLoading: boolean;
    ids: string[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ activeQuery: '', isLoading: true, ids: [], isLoadingMore: false, offset: 0, hasMore: true });
  const [mangaTab, setMangaTab] = useState<{
    activeQuery: string;
    isLoading: boolean;
    ids: string[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ activeQuery: '', isLoading: true, ids: [], isLoadingMore: false, offset: 0, hasMore: true });
  const [peopleTab, setPeopleTab] = useState<{
    activeQuery: string;
    isLoading: boolean;
    ids: string[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ activeQuery: '', isLoading: true, ids: [], isLoadingMore: false, offset: 0, hasMore: true });
  const [userTab, setUserTab] = useState<{
    activeQuery: string;
    isLoading: boolean;
    ids: string[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ activeQuery: '', isLoading: true, ids: [], isLoadingMore: false, offset: 0, hasMore: true });

  const animes = useAppSelector(Anime.redux.selectors.selectByIds(animeTab.ids, {
    include: {
      'anime-entry': isAuthenticated,
    },
  }));

  const mangas = useAppSelector(Manga.redux.selectors.selectByIds(mangaTab.ids, {
    include: {
      'manga-entry': isAuthenticated,
    },
  }));

  const peoples = useAppSelector(People.redux.selectors.selectByIds(peopleTab.ids));

  const users = useAppSelector(User.redux.selectors.selectByIds(userTab.ids));

  return {
    animeTab: {
      ...animeTab,
      list: animes,
      onChangeQuery: () => setAnimeTab((prev) => ({ ...prev, isLoading: true })),
      search: async (query: string) => {
        setAnimeTab((prev) => ({ ...prev, isLoading: true }));

        const animes = await Anime.find({ query: query })
          .include({
            'anime-entry': isAuthenticated,
          })
          .sort({ popularity: 'desc' })
          .raw();

        dispatch(Anime.redux.actions.setMany(animes.result));

        setAnimeTab({
          activeQuery: query,
          isLoading: false,
          ids: animes.result.map((anime) => anime.id),
          isLoadingMore: false,
          offset: 0,
          hasMore: !!animes.body.links?.next,
        });
      },
      loadMore: async () => {
        if (!animeTab.hasMore || animeTab.isLoadingMore) return

        setAnimeTab((prev) => ({ ...prev, isLoadingMore: true }));

        const animes = await Anime.find({ query: animeTab.activeQuery })
          .include({
            'anime-entry': isAuthenticated,
          })
          .sort({ popularity: 'desc' })
          .offset(animeTab.offset + 10)
          .raw();

        dispatch(Anime.redux.actions.setMany(animes.result));

        setAnimeTab((prev) => ({
          ...prev,
          ids: prev.ids.concat(animes.result.map((anime) => anime.id)),
          isLoadingMore: false,
          offset: prev.offset + 10,
          hasMore: !!animes.body.links?.next,
        }));
      },
    },
    mangaTab: {
      ...mangaTab,
      list: mangas,
      onChangeQuery: () => setMangaTab((prev) => ({ ...prev, isLoading: true })),
      search: async (query: string) => {
        setMangaTab((prev) => ({ ...prev, isLoading: true }));

        const mangas = await Manga.find({ query: query })
          .include({
            'manga-entry': isAuthenticated,
          })
          .sort({ popularity: 'desc' })
          .raw();

        dispatch(Manga.redux.actions.setMany(mangas.result));

        setMangaTab({
          activeQuery: query,
          isLoading: false,
          ids: mangas.result.map((manga) => manga.id),
          isLoadingMore: false,
          offset: 0,
          hasMore: !!mangas.body.links?.next,
        });
      },
      loadMore: async () => {
        if (!mangaTab.hasMore || mangaTab.isLoadingMore) return

        setMangaTab((prev) => ({ ...prev, isLoadingMore: true }));

        const mangas = await Manga.find({ query: mangaTab.activeQuery })
          .include({
            'manga-entry': isAuthenticated,
          })
          .sort({ popularity: 'desc' })
          .offset(mangaTab.offset + 10)
          .raw();

        dispatch(Manga.redux.actions.setMany(mangas.result));

        setMangaTab((prev) => ({
          ...prev,
          ids: prev.ids.concat(mangas.result.map((manga) => manga.id)),
          isLoadingMore: false,
          offset: prev.offset + 10,
          hasMore: !!mangas.body.links?.next,
        }));
      },
    },
    peopleTab: {
      ...peopleTab,
      list: peoples,
      onChangeQuery: () => setPeopleTab((prev) => ({ ...prev, isLoading: true })),
      search: async (query: string) => {
        setPeopleTab((prev) => ({ ...prev, isLoading: true }));

        const peoples = await People.find({ query: query })
          .raw();

        dispatch(People.redux.actions.setMany(peoples.result));

        setPeopleTab({
          activeQuery: query,
          isLoading: false,
          ids: peoples.result.map((people) => people.id),
          isLoadingMore: false,
          offset: 0,
          hasMore: !!peoples.body.links?.next,
        });
      },
      loadMore: async () => {
        if (!peopleTab.hasMore || peopleTab.isLoadingMore) return

        setPeopleTab((prev) => ({ ...prev, isLoadingMore: true }));

        const peoples = await People.find({ query: peopleTab.activeQuery })
          .offset(peopleTab.offset + 10)
          .raw();

        dispatch(People.redux.actions.setMany(peoples.result));

        setPeopleTab((prev) => ({
          ...prev,
          ids: prev.ids.concat(peoples.result.map((people) => people.id)),
          isLoadingMore: false,
          offset: prev.offset + 10,
          hasMore: !!peoples.body.links?.next,
        }));
      },
    },
    userTab: {
      ...userTab,
      list: users,
      onChangeQuery: () => setUserTab((prev) => ({ ...prev, isLoading: true })),
      search: async (query: string) => {
        setUserTab((prev) => ({ ...prev, isLoading: true }));

        const users = query !== ''
          ? await User.find({ query: query })
            .sort({ followersCount: 'desc' })
            .raw()
          : {
            result: [],
            body: {},
          };

        dispatch(User.redux.actions.setMany(users.result));

        setUserTab({
          activeQuery: query,
          isLoading: false,
          ids: users.result.map((user) => user.id),
          isLoadingMore: false,
          offset: 0,
          hasMore: !!users.body.links?.next,
        });
      },
      loadMore: async () => {
        if (!userTab.hasMore || userTab.isLoadingMore) return

        setUserTab((prev) => ({ ...prev, isLoadingMore: true }));

        const users = await User.find({ query: userTab.activeQuery })
          .sort({ followersCount: 'desc' })
          .offset(userTab.offset + 10)
          .raw();

        dispatch(User.redux.actions.setMany(users.result));

        setUserTab((prev) => ({
          ...prev,
          ids: prev.ids.concat(users.result.map((user) => user.id)),
          isLoadingMore: false,
          offset: prev.offset + 10,
          hasMore: !!users.body.links?.next,
        }));
      },
    },
  };
};
