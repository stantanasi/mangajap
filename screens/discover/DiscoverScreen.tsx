import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import ExpandableFloatingActionButton from '../../components/molecules/ExpandableFloatingActionButton';
import MangaCard from '../../components/molecules/MangaCard';
import PeopleCard from '../../components/molecules/PeopleCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, Manga, People } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';

type Props = StaticScreenProps<undefined>;

export default function DiscoverScreen({ route }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { isLoading, peoples, animes, mangas } = useDiscover();

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

      {isLoading || !peoples || !animes || !mangas ? (
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
        <ExpandableFloatingActionButton
          icon="add"
          menuItems={[
            {
              icon: 'tv',
              label: 'Animé',
              onPress: () => navigation.navigate('AnimeCreate'),
            },
            {
              icon: 'menu-book',
              label: 'Manga',
              onPress: () => navigation.navigate('MangaCreate'),
            },
            {
              icon: 'person',
              label: 'Personnalité',
              onPress: () => navigation.navigate('PeopleCreate'),
            },
          ]}
        />
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


const useDiscover = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [peoplesIds, setPeoplesIds] = useState<string[]>([]);

  const peoples = useAppSelector(People.redux.selectors.selectByIds(peoplesIds));

  const animes = useAppSelector(Anime.redux.selectors.select({
    include: {
      'anime-entry': isAuthenticated,
    },
    sort: {
      createdAt: 'desc',
    },
    limit: 10,
  }));

  const mangas = useAppSelector(Manga.redux.selectors.select({
    include: {
      'manga-entry': isAuthenticated,
    },
    sort: {
      createdAt: 'desc',
    },
    limit: 10,
  }));

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

      dispatch(People.redux.actions.setMany(peoples));
      dispatch(Anime.redux.actions.setMany(animes));
      dispatch(Manga.redux.actions.setMany(mangas));

      setPeoplesIds(peoples.map((people) => people.id));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return { isLoading, peoples, animes, mangas };
};
