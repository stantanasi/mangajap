import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, Manga } from '../../models';

type Props = StaticScreenProps<{}>;

export default function SearchScreen({ route }: Props) {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<(Anime | Manga)[]>([]);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        autoFocus
        value={query}
        onChangeText={(text) => setQuery(text)}
        onSubmitEditing={async () => {
          const animes = await Anime.find({
            query: query,
          });
          const mangas = await Manga.find({
            query: query,
          });

          setData([...animes, ...mangas]);
        }}
        placeholder="Rechercher"
        placeholderTextColor="#a1a1a1"
        style={styles.search}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item.type == Anime.type ? (
            <AnimeCard
              anime={item as Anime}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
            />
          ) : (
            <MangaCard
              manga={item as Manga}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
            />
          )
        )}
      />
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