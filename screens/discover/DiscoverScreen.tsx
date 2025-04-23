import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingActionButton from '../../components/atoms/FloatingActionButton';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import PeopleCard from '../../components/molecules/PeopleCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, Manga, People } from '../../models';

type Props = StaticScreenProps<undefined>;

export default function DiscoverScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [peoples, setPeoples] = useState<People[]>();
  const [animes, setAnimes] = useState<Anime[]>();
  const [mangas, setMangas] = useState<Manga[]>();

  useEffect(() => {
    const prepare = async () => {
      const [peoples, animes, mangas] = await Promise.all([
        People.find()
          .sort({ random: 'asc' }),
        Anime.find()
          .include({
            'anime-entry': isAuthenticated,
          })
          .sort({
            createdAt: 'desc',
          }),
        Manga.find()
          .include({
            'manga-entry': isAuthenticated,
          })
          .sort({
            createdAt: 'desc',
          }),
      ]);

      setPeoples(peoples);
      setAnimes(animes);
      setMangas(mangas);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('Search')}
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
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator
            animating
            color="#000"
            size="large"
          />
        </View>
      ) : (
        <ScrollView>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 6,
              marginHorizontal: 16,
            }}
          >
            Personnalités
          </Text>

          <FlatList
            horizontal
            data={peoples}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PeopleCard
                people={item}
                onPress={() => navigation.navigate('People', { id: item.id })}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 6,
              marginHorizontal: 16,
              marginTop: 20,
            }}
          >
            Derniers animes ajoutés
          </Text>

          <FlatList
            horizontal
            data={animes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AnimeCard
                anime={item}
                onAnimeChange={(anime) => {
                  setAnimes((prev) => prev?.map((a) => a.id === anime.id ? anime : a));
                }}
                onPress={() => navigation.navigate('Anime', { id: item.id })}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 6,
              marginHorizontal: 16,
              marginTop: 20,
            }}
          >
            Derniers mangas ajoutés
          </Text>

          <FlatList
            horizontal
            data={mangas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MangaCard
                manga={item}
                onMangaChange={(manga) => {
                  setMangas((prev) => prev?.map((m) => m.id === manga.id ? manga : m));
                }}
                onPress={() => navigation.navigate('Manga', { id: item.id })}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />
        </ScrollView>
      )}

      {user && user.isAdmin ? (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        >
          <FloatingActionButton
            icon="add"
            label="Animé"
            onPress={() => navigation.navigate('AnimeCreate')}
            style={{ position: 'relative' }}
          />

          <FloatingActionButton
            icon="add"
            label="Manga"
            onPress={() => navigation.navigate('MangaCreate')}
            style={{ position: 'relative' }}
          />

          <FloatingActionButton
            icon="add"
            label="Personnalité"
            onPress={() => navigation.navigate('PeopleCreate')}
            style={{ position: 'relative' }}
          />
        </View>
      ) : null}
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