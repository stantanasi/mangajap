import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import PeopleCard from '../../components/molecules/PeopleCard';
import { Anime, Manga, People } from '../../models';

type Props = StaticScreenProps<{}>;

export default function DiscoverScreen({ route }: Props) {
  const navigation = useNavigation();
  const [peoples, setPeoples] = useState<People[]>();
  const [animes, setAnimes] = useState<Anime[]>();
  const [mangas, setMangas] = useState<Manga[]>();

  useEffect(() => {
    const prepare = async () => {
      setPeoples(undefined);
      setAnimes(undefined);
      setMangas(undefined);

      const [peoples, animes, mangas] = await Promise.all([
        People.find()
          .include(['staff.anime', 'staff.manga'])
          .sort({ random: 'asc' } as any),
        Anime.find()
          .sort({
            createdAt: 'desc',
          }),
        Manga.find()
          .sort({
            createdAt: 'desc',
          }),
      ]);

      setPeoples(peoples);
      setAnimes(animes);
      setMangas(mangas);
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('Search', {})}
        style={styles.search}
      >
        <MaterialIcons
          name="search"
          size={24}
          color="#666"
        />

        <Text
          style={{
            flex: 1,
            paddingHorizontal: 0,
            paddingVertical: 8,
          }}
        >
          Rechercher
        </Text>
      </Pressable>

      {!peoples || !animes || !mangas ? (
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      ) : (
        <ScrollView>
          <FlatList
            horizontal
            data={peoples}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PeopleCard
                people={item}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />

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
    backgroundColor: '#fff',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 10,
  },
});