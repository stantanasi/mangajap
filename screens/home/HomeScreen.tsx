import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, Manga } from '../../models';

type Props = StaticScreenProps<{}>;

export default function HomeScreen({ route }: Props) {
  const navigation = useNavigation();
  const [animes, setAnimes] = useState<Anime[]>();
  const [mangas, setMangas] = useState<Manga[]>();

  useEffect(() => {
    Anime.find()
      .sort({
        createdAt: 'desc',
      })
      .then((animes) => setAnimes(animes));

    Manga.find()
      .sort({
        createdAt: 'desc',
      })
      .then((mangas) => setMangas(mangas));
  }, []);

  if (!animes || !mangas) {
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
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
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
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
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => <View style={{ width: 16 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});