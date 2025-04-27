import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { JsonApiBody } from '@stantanasi/jsonapi-client';
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
  const navigation = useNavigation();
  const { isAuthenticated } = useContext(AuthContext);
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
        .sort({ popularity: 'desc' })
        .raw(),
      Manga.find({ query: query })
        .include({
          'manga-entry': isAuthenticated,
        })
        .sort({ popularity: 'desc' })
        .raw(),
      People.find({ query: query })
        .raw(),
      query !== ''
        ? User.find({ query: query })
          .sort({ followersCount: 'desc' })
          .raw()
        : {
          result: [],
          body: {} as JsonApiBody,
        },
    ]);

    setActiveQuery(query);
    setAnimeTab({
      isLoading: false,
      list: animes.result,
      isLoadingMore: false,
      offset: 0,
      hasMore: !!animes.body.links?.next,
    });
    setMangaTab({
      isLoading: false,
      list: mangas.result,
      isLoadingMore: false,
      offset: 0,
      hasMore: !!mangas.body.links?.next,
    });
    setPeopleTab({
      isLoading: false,
      list: peoples.result,
      isLoadingMore: false,
      offset: 0,
      hasMore: !!peoples.body.links?.next,
    });
    setUserTab({
      isLoading: false,
      list: users.result,
      isLoadingMore: false,
      offset: 0,
      hasMore: !!users.body.links?.next,
    });
  };

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
              .offset(animeTab.offset + 10)
              .raw();

            setAnimeTab((prev) => ({
              ...prev,
              list: prev.list.concat(animes.result),
              isLoadingMore: false,
              offset: prev.offset + 10,
              hasMore: !!animes.body.links?.next,
            }));
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
              .offset(mangaTab.offset + 10)
              .raw();

            setMangaTab((prev) => ({
              ...prev,
              list: prev.list.concat(mangas.result),
              isLoadingMore: false,
              offset: prev.offset + 10,
              hasMore: !!mangas.body.links?.next,
            }));
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
              .offset(peopleTab.offset + 10)
              .raw();

            setPeopleTab((prev) => ({
              ...prev,
              list: prev.list.concat(peoples.result),
              isLoadingMore: false,
              offset: prev.offset + 10,
              hasMore: !!peoples.body.links?.next,
            }));
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
              .offset(userTab.offset + 10)
              .raw();

            setUserTab((prev) => ({
              ...prev,
              list: prev.list.concat(users.result),
              isLoadingMore: false,
              offset: prev.offset + 10,
              hasMore: !!users.body.links?.next,
            }));
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
  },
});