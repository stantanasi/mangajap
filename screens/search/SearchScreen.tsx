import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeSearchCard from '../../components/molecules/AnimeSearchCard';
import MangaSearchCard from '../../components/molecules/MangaSearchCard';
import UserSearchCard from '../../components/molecules/UserSearchCard';
import { Anime, Manga, User } from '../../models';

type Props = StaticScreenProps<{}>;

export default function SearchScreen({ route }: Props) {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [animes, setAnimes] = useState<Anime[]>();
  const [mangas, setMangas] = useState<Manga[]>();
  const [users, setUsers] = useState<User[]>();

  const categories = [
    { label: 'Anime', value: 'anime' },
    { label: 'Manga', value: 'manga' },
    { label: 'Utilisateurs', value: 'users' },
  ] as const;
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]['value']>('anime');

  const search = async (query: string) => {
    setAnimes(undefined);
    setMangas(undefined);
    setUsers(undefined);

    const [animes, mangas, users] = await Promise.all([
      Anime.find({
        query: query,
      }),
      Manga.find({
        query: query,
      }),
      User.find({
        query: query,
      }),
    ]);

    setAnimes(animes);
    setMangas(mangas);
    setUsers(users);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          autoFocus
          value={query}
          onChangeText={(text) => setQuery(text)}
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

      {!animes || !mangas || !users ? (
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      ) : (
        <>
          <FlatList
            data={animes}
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
            style={{
              display: selectedCategory === 'anime' ? 'flex' : 'none',
            }}
          />

          <FlatList
            data={mangas}
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
            style={{
              display: selectedCategory === 'manga' ? 'flex' : 'none',
            }}
          />

          <FlatList
            data={users}
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
            style={{
              display: selectedCategory === 'users' ? 'flex' : 'none',
            }}
          />
        </>
      )}
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