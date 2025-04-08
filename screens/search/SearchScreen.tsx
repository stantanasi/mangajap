import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeSearchCard from '../../components/molecules/AnimeSearchCard';
import MangaSearchCard from '../../components/molecules/MangaSearchCard';
import { Anime, Manga } from '../../models';

type Props = StaticScreenProps<{}>;

export default function SearchScreen({ route }: Props) {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [animes, setAnimes] = useState<Anime[]>();
  const [mangas, setMangas] = useState<Manga[]>();

  const search = async (query: string) => {
    setAnimes(undefined);
    setMangas(undefined);

    const [animes, mangas] = await Promise.all([
      Anime.find({
        query: query,
      }),
      Manga.find({
        query: query,
      }),
    ]);

    setAnimes(animes);
    setMangas(mangas);
  };

  return (
    <SafeAreaView style={styles.container}>
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

      {!animes || !mangas ? (
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      ) : (
        <FlatList
          data={[...animes, ...mangas]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            item instanceof Anime ? (
              <AnimeSearchCard
                anime={item}
                onPress={() => navigation.navigate('Anime', { id: item.id })}
              />
            ) : (
              <MangaSearchCard
                manga={item}
                onPress={() => navigation.navigate('Manga', { id: item.id })}
              />
            )
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  search: {
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    padding: 8,
  },
});