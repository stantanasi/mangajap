import { StaticScreenProps } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../components/atoms/SearchBar';
import Header from '../../components/molecules/Header';
import { useSearch } from './hooks/useSearch';
import AnimeTab from './tabs/AnimeTab';
import MangaTab from './tabs/MangaTab';
import PeopleTab from './tabs/PeopleTab';
import UserTab from './tabs/UserTab';

type Props = StaticScreenProps<undefined>;

export default function SearchScreen({ route }: Props) {
  const { animeTab, mangaTab, peopleTab, userTab } = useSearch(route.params);

  const categories = [
    { label: 'Anime', value: 'anime' },
    { label: 'Manga', value: 'manga' },
    { label: 'Personnalités', value: 'people' },
    { label: 'Utilisateurs', value: 'users' },
  ] as const;
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]['value']>('anime');

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={(
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
          />
        )}
      >
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            gap: 10,
            paddingHorizontal: 16,
          }}
          style={{ marginBottom: 12 }}
        >
          {categories.map((category) => {
            const isSelected = category.value === selectedCategory;
            return (
              <Text
                key={category.value}
                onPress={() => setSelectedCategory(category.value)}
                style={{
                  backgroundColor: !isSelected ? '#e5e5e5' : '#d40e0e',
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
      </Header>

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
});
