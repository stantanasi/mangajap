import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, Manga } from '../../models';

type Props = StaticScreenProps<{}>;

export default function DiscoverScreen({ route }: Props) {
  const navigation = useNavigation();
  const [animes, setAnimes] = useState<Anime[]>();
  const [mangas, setMangas] = useState<Manga[]>();

  useEffect(() => {
    const prepare = async () => {
      setAnimes(undefined);
      setMangas(undefined);

      const [animes, mangas] = await Promise.all([
        Anime.find()
          .sort({
            createdAt: 'desc',
          }),
        Manga.find()
          .sort({
            createdAt: 'desc',
          }),
      ]);

      setAnimes(animes);
      setMangas(mangas);
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        onPress={() => navigation.navigate('Search', {})}
        style={styles.search}
      >
        Rechercher
      </Text>

      {!animes || !mangas ? (
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      ) : (
        <ScrollView>
          <FlatList
            horizontal
            data={animes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AnimeCard
                anime={item}
                onPress={() => navigation.navigate('Anime', { id: item.id })}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />

          <FlatList
            horizontal
            data={mangas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MangaCard
                manga={item}
                onPress={() => navigation.navigate('Manga', { id: item.id })}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    padding: 8,
  },
});